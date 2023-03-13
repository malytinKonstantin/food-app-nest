import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../user/user.model';
import { UserEntity } from '../user/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfirmMessageModel } from '@apps/account/src/app/confirm-message/confirm-message.model';
import { ConfirmMessageEntity } from '@apps/account/src/app/confirm-message/confirm-message.entity';
import { ConfirmAction, ConfirmStatus } from '@libs/interfaces';
import { SmsRuService } from '@apps/account/src/app/auth/services/sms-ru.service';
import { differenceInSeconds, differenceInDays } from 'date-fns';
import { Op } from 'sequelize';
import { getTimeLimitByRetry } from './utils';
import { BanPeriod, BanReason } from '@apps/account/src/app/user/constants/user-ban.constants';
import { TokenService } from '@apps/account/src/app/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel)
    private readonly userRepository: typeof UserModel,
    @InjectModel(ConfirmMessageModel)
    private readonly confirmMessageRepository: typeof ConfirmMessageModel,
    private readonly jwtService: JwtService,
    private readonly smsRuService: SmsRuService,
    private readonly tokenService: TokenService
  ) {}

  private async findLastConfirmMessage({
    phoneNumber = null,
    id = null,
  }: {
    phoneNumber?: string;
    id?: number;
  }): Promise<ConfirmMessageModel | null> {
    const confirmMessage = await this.confirmMessageRepository.findOne({
      where: {
        [Op.or]: [{ phoneNumber }, { id }],
        [Op.and]: [{ status: ConfirmStatus.Pending }],
      },
      order: [['createdAt', 'DESC']],
    });
    return confirmMessage;
  }

  private async checkBanUser(phoneNumber: string) {
    const oldUser = await this.userRepository.findOne({ where: { phoneNumber } });
    if (oldUser && oldUser.banReason) {
      const diff = differenceInDays(oldUser.banPeriod, new Date());
      if (diff > 0) {
        throw new HttpException('Пользователь заблокирован', HttpStatus.FORBIDDEN);
      }
    }
  }

  // возвращает true если таймлимит не превышен и false если превышен
  // смс с кодом нельзя отправлять чаще чем раз в 2 минуты
  private async checkTimeLimitOfSendLoginConfirmMessage({
    phoneNumber,
    id,
  }: {
    phoneNumber?: string;
    id?: number;
  }) {
    const confirmMessage = await this.findLastConfirmMessage({ phoneNumber, id });
    const TIME_LIMIT_SEC = getTimeLimitByRetry(confirmMessage?.retryCount ?? 0);
    const MAX_RETRY_COUNT = 5;

    if (confirmMessage?.retryCount === MAX_RETRY_COUNT) {
      const user = await this.userRepository.findOne({ where: { id: confirmMessage.userId } });
      const userEntity = new UserEntity(user).ban(BanReason.MessageLimitExceeded, BanPeriod.Month_6);
      await user.update(userEntity);
    }

    if (confirmMessage) {
      const diff = differenceInSeconds(new Date(), new Date(confirmMessage.updatedAt));
      const isValid = diff > TIME_LIMIT_SEC;
      if (!isValid) {
        throw new HttpException(
          `Повторная отправка кода подтверждения будет доступна через ${TIME_LIMIT_SEC - diff} секунд`,
          HttpStatus.BAD_REQUEST
        );
      }
    }
  }

  /** @deprecated  */
  async register(dto: RegisterUserDto) {
    const { email, password } = dto;
    const oldUser = await this.userRepository.findOne({ where: { email } });
    if (oldUser) {
      throw new Error('Такой пользователь уже зарегистрирован');
    }
    const newUserEntity = await new UserEntity({
      email,
    }).setPassword(password);
    const newUser = await this.userRepository.create(newUserEntity);
    return { email: newUser.email };
  }

  /** @deprecated  */
  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Неверный логин или пароль');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      throw new Error('Неверный логин или пароль');
    }
    return { id: user.id };
  }

  // генерирует код подтверждения при логине
  async loginRequest(phoneNumber: string) {
    await this.checkBanUser(phoneNumber);
    await this.checkTimeLimitOfSendLoginConfirmMessage({ phoneNumber });
    const confirmMessageEntity = new ConfirmMessageEntity({ phoneNumber });
    const oldUser = await this.userRepository.findOne({ where: { phoneNumber } });
    if (oldUser) {
      confirmMessageEntity.setUserId(oldUser.id).setAction(ConfirmAction.Login);
    } else {
      confirmMessageEntity.setUserId(null).setAction(ConfirmAction.Register);
    }
    confirmMessageEntity.generateCode().setStatus(ConfirmStatus.Pending);
    const confirmMessage = await this.confirmMessageRepository.create(confirmMessageEntity);
    const response = await this.smsRuService.sendSms({
      recipient: phoneNumber,
      message: confirmMessage.code + '',
    });
    if (response.status === '200' && oldUser) {
      const userEntity = new UserEntity(oldUser);
      userEntity.sendSms();
      await oldUser.update(userEntity);
    }
    return { confirmId: confirmMessage.id };
  }

  // проверка смс кода по номеру телефона
  async loginCheckCode(confirmId: number, code: number) {
    const confirmMessage = await this.confirmMessageRepository.findOne({ where: { id: confirmId } });
    const confirmMessageEntity = new ConfirmMessageEntity(confirmMessage);
    if (confirmMessage.status !== ConfirmStatus.Pending) {
      throw new HttpException('Код подтверждения устарел', HttpStatus.BAD_REQUEST);
    }
    if (code === confirmMessage.code) {
      confirmMessageEntity.setStatus(ConfirmStatus.Confirmed);
      await confirmMessage.update(confirmMessageEntity);
      if (confirmMessage.userId) {
        // логин пользователя
        const user = await this.userRepository.findOne({
          where: { phoneNumber: confirmMessage.phoneNumber },
        });
        const tokens = this.tokenService.generateTokens({ id: confirmMessage.userId });
        await this.tokenService.saveToken(confirmMessage.userId, tokens.refreshToken);
        const userEntity = new UserEntity(user).login();
        await user.update(userEntity);
        return tokens;
      } else {
        // регистрация нового пользователя
        const userEntity = new UserEntity({
          phoneNumber: confirmMessage.phoneNumber,
          countOfSendSMS: confirmMessage.retryCount,
        })
          .sendSms()
          .login();
        const newUser = await this.userRepository.create(userEntity);
        const tokens = this.tokenService.generateTokens({ id: newUser.id });
        await this.tokenService.saveToken(confirmMessage.userId, tokens.refreshToken);
        return tokens;
      }
    } else {
      confirmMessageEntity.setStatus(ConfirmStatus.Failed);
      await confirmMessage.update(confirmMessageEntity);
      throw new HttpException('Не валидный код', HttpStatus.BAD_REQUEST);
    }
  }

  async loginRetryCode(confirmId: number) {
    await this.checkTimeLimitOfSendLoginConfirmMessage({ id: confirmId });
    const confirmMessage = await this.confirmMessageRepository.findOne({ where: { id: confirmId } });
    const confirmMessageEntity = new ConfirmMessageEntity(confirmMessage);
    confirmMessageEntity.retry();
    const updatedConfirmMessage = await confirmMessage.update(confirmMessageEntity);
    await this.smsRuService.sendSms({
      recipient: confirmMessageEntity.phoneNumber,
      message: confirmMessageEntity.code + '',
    });
    return { confirmId: updatedConfirmMessage.id };
  }

  async refresh(refreshToken: string) {
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    if (!tokenFromDb || !userData) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    const user = await this.userRepository.findOne({ where: { id: userData.id } });
    const tokens = this.tokenService.generateTokens({ id: user.id });
    await this.tokenService.saveToken(user.id, tokens.refreshToken);
    return { ...tokens, user };
  }

  async logout(refreshToken: string) {
    const isRemoved = await this.tokenService.removeToken(refreshToken);
    return { done: isRemoved };
  }
}
