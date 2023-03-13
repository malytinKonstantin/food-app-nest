import { add, maxTime } from 'date-fns';

export enum BanReason {
  MessageLimitExceeded = 'MessageLimitExceeded',
}

export enum BanPeriod {
  Month_6 = 'Month_6',
  Permanent = 'Permanent',
}

export const banReason = {
  [BanReason.MessageLimitExceeded]: 'Превышен лимит переотправки сообщений',
};

export const getDateByBanPeriod = (banPeriod: BanPeriod): Date => {
  switch (banPeriod) {
    case BanPeriod.Month_6:
      return add(new Date(), { months: 6 });

    case BanPeriod.Permanent:
      return new Date(maxTime);
  }
};
