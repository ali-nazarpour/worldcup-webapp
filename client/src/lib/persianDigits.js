const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function toEnglishDigits(value) {
  return String(value).replace(/[۰-۹]/g, (d) => PERSIAN_DIGITS.indexOf(d));
}
