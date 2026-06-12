import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import jalaliday from 'jalaliday';
import { toPersianDigits } from './persianDigits';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(jalaliday);

const TZ = 'Asia/Tehran';

export function formatJalaliDate(date) {
  if (!date) return '';
  return toPersianDigits(dayjs(date).tz(TZ).calendar('jalali').locale('fa').format('dddd D MMMM YYYY'));
}

export function formatJalaliTime(date) {
  if (!date) return '';
  return toPersianDigits(dayjs(date).tz(TZ).format('HH:mm'));
}

export function formatJalaliDateTime(date) {
  if (!date) return '';
  return `${formatJalaliDate(date)} - ساعت ${formatJalaliTime(date)}`;
}

export function toJalaliKey(date) {
  return dayjs(date).tz(TZ).calendar('jalali').format('YYYY-MM-DD');
}

export const MATCH_STATUS_LABELS = {
  SCHEDULED: 'برنامه‌ریزی شده',
  TIMED: 'زمان‌بندی شده',
  IN_PLAY: 'در حال برگزاری',
  PAUSED: 'متوقف شده',
  FINISHED: 'پایان یافته',
  POSTPONED: 'به تعویق افتاده',
  CANCELLED: 'لغو شده',
};

export const PREDICTION_STATUS_LABELS = {
  PENDING: 'در انتظار برگزاری مسابقه',
  CORRECT: 'پیش‌بینی صحیح',
  INCORRECT: 'پیش‌بینی نادرست',
};

export function canPredict(match) {
  if (!match) return false;
  const closed = ['IN_PLAY', 'PAUSED', 'FINISHED', 'CANCELLED'];
  if (closed.includes(match.status)) return false;
  return new Date() < new Date(match.utcDate);
}
