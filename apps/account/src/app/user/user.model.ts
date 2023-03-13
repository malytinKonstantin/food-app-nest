import { Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { IUser } from '@libs/interfaces';
import { TokenModel } from '@apps/account/src/app/token/token.model';
import { ConfirmMessageModel } from '@apps/account/src/app/confirm-message/confirm-message.model';

type UserCreationAttr = Pick<IUser, 'phoneNumber'>;

@Table({
  timestamps: true,
  deletedAt: 'destroyTime',
  tableName: 'users',
})
export class UserModel extends Model<IUser, UserCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    field: 'id',
  })
  id: number;

  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  middleName: string;

  @Column({ type: DataType.STRING, unique: true }) // allowNull: false
  email: string;

  @Column({ type: DataType.STRING, unique: true })
  phoneNumber: string;

  @Column({ type: DataType.STRING }) // allowNull: false
  passwordHash: string;

  @Column({ type: DataType.STRING })
  currentAddress: string;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  addresses: string[];

  @Column({ type: DataType.STRING })
  banReason: string;

  @Column({ type: DataType.DATE })
  banPeriod?: Date;

  @Column({ type: DataType.BOOLEAN })
  isAgreeToProcessingOfPersonalData: boolean;

  @Column({ type: DataType.DATE })
  dateOfAgreeToProcessingOfPersonalData: Date;

  @Column({ type: DataType.BOOLEAN })
  isSubscribedToNewsletter: boolean;

  @Column({ type: DataType.DATE })
  dateOfLastAuthorization: Date;

  @Column({ type: DataType.INTEGER })
  countOfSendSMS: number;

  @Column({ type: DataType.DATE })
  dateOfLastSMSSend: Date;

  @HasMany(() => ConfirmMessageModel)
  confirmMessages: ConfirmMessageModel;

  @HasOne(() => TokenModel)
  token: TokenModel;
}
