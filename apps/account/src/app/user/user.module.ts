import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
