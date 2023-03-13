import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getRMQConfig, getJWTConfig, getSequelizeConfig } from '@libs/configs';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from '@apps/api/src/app/middlewares/auth.middleware';
import { TokenModule } from '@apps/account/src/app/token/token.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['envs/.api.env', 'envs/services/.api.env', 'envs/.db.env'],
      isGlobal: true,
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    SequelizeModule.forRoot(getSequelizeConfig()),
    PassportModule,
    TokenModule,
  ],
  controllers: [AuthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/api/auth/login', '/api/auth/verify-code', '/api/auth/retry-code', '/api/auth/refresh')
      .forRoutes('*');
  }
}
