import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModel } from '@apps/account/src/app/token/token.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getJWTConfig } from '@libs/configs';

@Module({
  imports: [SequelizeModule.forFeature([TokenModel]), JwtModule.registerAsync(getJWTConfig())],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
