export interface IUser {
  id?: number;

  // имя
  firstName?: string;

  // фамилия
  lastName?: string;

  // отчество
  middleName?: string;

  // почта
  email?: string;

  // телефон
  phoneNumber?: string;

  // хешированный пароль
  passwordHash?: string;

  // текущий адрес доставки
  currentAddress?: string;

  // список адресов
  addresses?: string[];

  // причина блокировки
  banReason?: string;

  // период блокировки
  banPeriod?: Date;

  // согласен на обработку персональных данных
  isAgreeToProcessingOfPersonalData?: boolean;

  // дата подписания согласия на обработку персональных данных
  dateOfAgreeToProcessingOfPersonalData?: Date;

  // подписан на рассылку уведомлений и новостей
  isSubscribedToNewsletter?: boolean;

  // дата последней авторизации
  dateOfLastAuthorization?: Date;

  // количество  отправленных смс
  countOfSendSMS?: number;

  // дата последней отправки смс
  dateOfLastSMSSend?: Date;
}
