import { differenceInMonths } from 'date-fns';
import { BanPeriod, getDateByBanPeriod } from './user-ban.constants';

test('Вычисление даты бан периода + 6 месяцев', () => {
  const now = new Date();
  const dateAfter6Month = getDateByBanPeriod(BanPeriod.Month_6);
  const diffInMonth = differenceInMonths(dateAfter6Month, now);
  expect(diffInMonth).toBe(6);
});

test('Сравнение максимальной даты при постоянном бане', () => {
  const now = new Date();
  const dateOfPermanentBan = getDateByBanPeriod(BanPeriod.Permanent); // 3284856
  const diffInMonth = differenceInMonths(dateOfPermanentBan, now);
  expect(diffInMonth > 12 * 100).toBe(true);
});
