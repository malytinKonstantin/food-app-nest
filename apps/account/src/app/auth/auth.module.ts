import { getJWTConfig, getSmsRuConfig } from '@libs/configs';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCommandsController } from './controllers/auth.commands';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '@apps/account/src/app/user/user.model';
import { SmsRuService } from './services/sms-ru.service';
import { ConfirmMessageModel } from '@apps/account/src/app/confirm-message/confirm-message.model';
import { TokenService } from '@apps/account/src/app/token/token.service';
import { TokenModel } from '../token/token.model';
import { SMSRuModule } from 'node-sms-ru/nestjs';
import { SMSRu } from 'node-sms-ru';

@Module({
  imports: [
    SMSRuModule.forRootAsync(getSmsRuConfig()),
    SequelizeModule.forFeature([UserModel, ConfirmMessageModel, TokenModel]),
    JwtModule.registerAsync(getJWTConfig()),
  ],
  controllers: [AuthCommandsController],
  providers: [AuthService, SmsRuService, SMSRu, TokenService],
})
export class AuthModule {}
