import { IToken } from '@libs/interfaces';
import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { UserModel } from '@apps/account/src/app/user/user.model';

@Table({
  timestamps: true,
  deletedAt: 'destroyTime',
  tableName: 'tokens',
})
export class TokenModel extends Model<IToken> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'id',
  })
  id: number;

  @Column
  @ForeignKey(() => UserModel)
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Column({ type: DataType.STRING })
  refreshToken: string;
}
