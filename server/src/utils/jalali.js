import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import jalaliday from 'jalaliday';
import env from '../config/env.js';
import { toPersianDigits } from './persianDigits.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(jalaliday);

const TZ = env.football.timezone;

export function toJalaliDate(date, format = 'dddd D MMMM YYYY') {
  return toPersianDigits(dayjs(date).tz(TZ).calendar('jalali').locale('fa').format(format));
}

export function toJalaliTime(date) {
  return toPersianDigits(dayjs(date).tz(TZ).format('HH:mm'));
}

export function toJalaliDateKey(date) {
  return dayjs(date).tz(TZ).calendar('jalali').format('YYYY-MM-DD');
}

export function parseJalaliDateKey(jalaliKey) {
  const english = jalaliKey.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const parsed = dayjs(english, { jalali: true }).calendar('jalali');
  if (!parsed.isValid()) return null;
  return parsed;
}

export function getTodayRange() {
  const start = dayjs().tz(TZ).startOf('day');
  const end = dayjs().tz(TZ).endOf('day');
  return { start: start.toDate(), end: end.toDate() };
}

export function getThisWeekRange() {
  const start = dayjs().tz(TZ).startOf('week');
  const end = dayjs().tz(TZ).endOf('week');
  return { start: start.toDate(), end: end.toDate() };
}

export function getThisMonthRange() {
  const start = dayjs().tz(TZ).startOf('month');
  const end = dayjs().tz(TZ).endOf('month');
  return { start: start.toDate(), end: end.toDate() };
}

export function jalaliKeyToUtcRange(jalaliKey) {
  const english = jalaliKey.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const start = dayjs(english, { jalali: true }).calendar('jalali').startOf('day').tz(TZ);
  const end = dayjs(english, { jalali: true }).calendar('jalali').endOf('day').tz(TZ);
  if (!start.isValid()) return null;
  return { start: start.toDate(), end: end.toDate() };
}

export { dayjs, TZ };
