import { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from '@apps/account/src/app/user/user.model';
import { ConfirmMessageModel } from '@apps/account/src/app/confirm-message/confirm-message.model';
import { TokenModel } from '@apps/account/src/app/token/token.model';

// TODO: отладить конфиг
export const getAsyncSequelizeConfig = (): SequelizeModuleAsyncOptions => {
  return {
    useFactory: async (configService: ConfigService) => ({
      dialect: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: Number(configService.get('POSTGRES_PORT')),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      models: [UserModel, ConfirmMessageModel, TokenModel],
      autoLoadModels: true,
      synchronize: true,
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

export const getSequelizeConfig = (): SequelizeModuleOptions => {
  return {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    models: [UserModel, ConfirmMessageModel, TokenModel],
    autoLoadModels: true,
    synchronize: true,
  };
};
