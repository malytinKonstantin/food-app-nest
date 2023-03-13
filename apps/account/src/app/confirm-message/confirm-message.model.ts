import { Column, DataType, BelongsTo, Model, Table, ForeignKey } from 'sequelize-typescript';
import { IConfirmMessage, ConfirmStatus, ConfirmAction } from '@libs/interfaces';
import { UserModel } from '@apps/account/src/app/user/user.model';
import { TokenModel } from '@apps/account/src/app/token/token.model';

const confirmStatusValues = Object.keys(ConfirmStatus);
const confirmActions = Object.keys(ConfirmAction);

@Table({
  timestamps: true,
  deletedAt: 'destroyTime',
  tableName: 'confirm-message',
})
export class ConfirmMessageModel extends Model<IConfirmMessage> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'id',
  })
  id: number;

  @Column({ type: DataType.STRING })
  phoneNumber: string;

  @Column({ type: DataType.ENUM(...confirmStatusValues), defaultValue: ConfirmStatus.Pending })
  status: ConfirmStatus;

  @Column({ type: DataType.ENUM(...confirmActions) })
  action: ConfirmAction;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  retryCount?: number;

  @Column({ type: DataType.INTEGER })
  code: number;

  @Column({ type: DataType.DATE, defaultValue: null })
  retryTimestamp?: Date;

  @Column({ type: DataType.INTEGER, defaultValue: null })
  @ForeignKey(() => UserModel)
  userId?: number | null;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
