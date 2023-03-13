import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { SMSRuModule } from 'node-sms-ru/nestjs';
import { getRMQConfig, getJWTConfig, getSequelizeConfig, getSmsRuConfig } from '@libs/configs';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        'envs/.api.env',
        'envs/.db.env',
        'envs/services/.account.env',
        'envs/services/.sms-ru.env',
      ],
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    SequelizeModule.forRoot(getSequelizeConfig()),
    SMSRuModule.forRootAsync(getSmsRuConfig()),
    PassportModule,
    AuthModule,
    UserModule,
    TokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
