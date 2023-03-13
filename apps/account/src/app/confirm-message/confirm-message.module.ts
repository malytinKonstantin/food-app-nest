import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfirmMessageModel } from './confirm-message.model';
import { UserModel } from '../user/user.model';

@Module({
  imports: [SequelizeModule.forFeature([ConfirmMessageModel, UserModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ConfirmMessageModule {}
