export enum ConfirmStatus {
  Pending = 'Pending',
  Failed = 'Failed',
  Confirmed = 'Confirmed',
}

export enum ConfirmAction {
  Login = 'Login',
  Register = 'Register',
}

export interface IConfirmMessage {
  id?: number;

  // телефон
  phoneNumber: string;

  // статус подтвеждения
  status?: ConfirmStatus;

  // операция или действие
  action?: ConfirmAction;

  // количество повторно отправленных сообщений
  retryCount?: number;

  // код подтверждения операции
  code?: number;

  // дата и время последнего отправления
  retryTimestamp?: Date | null;

  // id пользователя, если он авторизован
  userId?: number | null;
}
