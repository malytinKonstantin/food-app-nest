import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import {
  AccountLoginPhoneRequest,
  AccountLoginPhoneRetryConfirmMessage,
  AccountLoginPhoneVerifyConfirmMessage,
  AccountLogout,
  AccountRefresh,
} from '@libs/contracts';
import { ApiOperation, ApiTags, ApiBody, ApiResponse, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';

class AccountLoginPhoneVerifyConfirmMessage_Response {
  @ApiProperty()
  accessToken: string;
}

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly rmqService: RMQService) {}

  private readonly refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000; // 30d

  @ApiResponse({
    status: HttpStatus.OK,
    type: class AccountLoginPhoneRequest_Response extends AccountLoginPhoneRequest.Response {},
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Пользователь заблокирован',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Повторная отправка кода подтверждения будет доступна через N секунд',
  })
  @ApiBody({ type: class AccountLoginPhoneRequest_Request extends AccountLoginPhoneRequest.Request {} })
  @ApiOperation({ summary: 'Логин по номеру телефона' })
  @Post('login')
  async login(@Body() dto: AccountLoginPhoneRequest.Request) {
    try {
      return await this.rmqService.send<AccountLoginPhoneRequest.Request, AccountLoginPhoneRequest.Response>(
        AccountLoginPhoneRequest.topic,
        dto
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: AccountLoginPhoneVerifyConfirmMessage_Response,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Не валидный код <br /> Код подтверждения устарел',
  })
  @ApiBody({
    type: class AccountLoginPhoneVerifyConfirmMessage_Request extends AccountLoginPhoneVerifyConfirmMessage.Request {},
  })
  @ApiOperation({ summary: 'Отправка кода подтверждения логина' })
  @Post('verify-code')
  async verifyConfirmCode(
    @Body() dto: AccountLoginPhoneVerifyConfirmMessage.Request,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const tokens = await this.rmqService.send<
        AccountLoginPhoneVerifyConfirmMessage.Request,
        AccountLoginPhoneVerifyConfirmMessage.Response
      >(AccountLoginPhoneVerifyConfirmMessage.topic, dto);
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: this.refreshTokenMaxAge, // 30d
      });
      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: class AccountLoginPhoneRetryConfirmMessage_Response extends AccountLoginPhoneRetryConfirmMessage.Response {},
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Повторная отправка кода подтверждения будет доступна через N секунд',
  })
  @ApiBody({
    type: class AccountLoginPhoneRetryConfirmMessage_Request extends AccountLoginPhoneRetryConfirmMessage.Request {},
  })
  @ApiOperation({ summary: 'Выслать повторно новый код подстверждения телефона' })
  @Post('retry-code')
  async retryCode(@Body() dto: AccountLoginPhoneRetryConfirmMessage.Request) {
    try {
      return await this.rmqService.send<
        AccountLoginPhoneRetryConfirmMessage.Request,
        AccountLoginPhoneRetryConfirmMessage.Response
      >(AccountLoginPhoneRetryConfirmMessage.topic, dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выйти из приложения / разлогиниться' })
  @ApiBody({
    type: class AccountLogout_Request extends AccountLogout.Request {},
  })
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Body() dto: AccountLogout.Request,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const { refreshToken } = request.cookies;
      await this.rmqService.send<AccountLogout.Request, AccountLogout.Response>(AccountLogout.topic, {
        ...dto,
        refreshToken,
      });
      response.clearCookie('refreshToken');
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Перевыск accessToken' })
  @Get('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        throw new UnauthorizedException('Пользователь не авторизован');
      }
      const tokens = await this.rmqService.send<AccountRefresh.Request, AccountRefresh.Response>(
        AccountRefresh.topic,
        {
          refreshToken,
        }
      );
      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: this.refreshTokenMaxAge, // 30d
      });
      return {
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Тестовый REST поинт' })
  @Get('users')
  async getUsers() {
    return [{ id: 1 }, { id: 2 }];
  }
}
