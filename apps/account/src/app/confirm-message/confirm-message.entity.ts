import { ConfirmAction, ConfirmStatus, IConfirmMessage } from '@libs/interfaces';
import { randomInteger } from './utils';

export class ConfirmMessageEntity implements IConfirmMessage {
  id?: number;
  phoneNumber: string;
  status?: ConfirmStatus;
  action?: ConfirmAction;
  code?: number;
  retryCount?: number;
  retryTimestamp?: Date | null;
  userId?: number | null;

  constructor(confirmMessage: IConfirmMessage) {
    this.id = confirmMessage.id;
    this.phoneNumber = confirmMessage.phoneNumber;
    this.status = confirmMessage.status;
    this.action = confirmMessage.action;
    this.code = confirmMessage.code;
    this.retryCount = confirmMessage.retryCount;
    this.retryTimestamp = confirmMessage.retryTimestamp;
    this.userId = confirmMessage.userId;
  }

  generateCode() {
    const code = randomInteger(10000, 99999);
    this.code = code;
    return this;
  }

  setUserId(userId: number) {
    this.userId = userId;
    return this;
  }

  setAction(action: ConfirmAction) {
    this.action = action;
    return this;
  }

  setStatus(status: ConfirmStatus) {
    this.status = status;
    return this;
  }

  retry() {
    this.generateCode();
    this.retryCount++;
    this.retryTimestamp = new Date();
    return this;
  }
}
