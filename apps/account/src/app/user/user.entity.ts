import { IUser } from '@libs/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  BanPeriod,
  BanReason,
  getDateByBanPeriod,
} from '@apps/account/src/app/user/constants/user-ban.constants';

export class UserEntity implements IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  passwordHash?: string;
  currentAddress?: string;
  addresses?: string[];
  banReason?: string;
  banPeriod?: Date;
  isAgreeToProcessingOfPersonalData?: boolean;
  dateOfAgreeToProcessingOfPersonalData?: Date;
  isSubscribedToNewsletter?: boolean;
  dateOfLastAuthorization?: Date;
  countOfSendSMS?: number;
  dateOfLastSMSSend?: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.middleName = user.middleName;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.passwordHash = user.passwordHash;
    this.currentAddress = user.currentAddress;
    this.addresses = user.addresses;
    this.banReason = user.banReason;
    this.banPeriod = user.banPeriod;
    this.isAgreeToProcessingOfPersonalData = user.isAgreeToProcessingOfPersonalData;
    this.dateOfAgreeToProcessingOfPersonalData = user.dateOfAgreeToProcessingOfPersonalData;
    this.isSubscribedToNewsletter = user.isSubscribedToNewsletter;
    this.dateOfLastAuthorization = user.dateOfLastAuthorization;
    this.countOfSendSMS = user.countOfSendSMS;
    this.dateOfLastSMSSend = user.dateOfLastSMSSend;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  public ban(reason: BanReason, period: BanPeriod) {
    this.banReason = reason;
    this.banPeriod = getDateByBanPeriod(period);
    return this;
  }

  public sendSms() {
    this.countOfSendSMS++;
    this.dateOfLastSMSSend = new Date();
    return this;
  }

  public login() {
    this.dateOfLastAuthorization = new Date();
    return this;
  }
}
