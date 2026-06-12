import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  message: { success: false, message: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'تعداد تلاش‌های ورود بیش از حد مجاز است.' },
});

export const predictionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'تعداد پیش‌بینی‌های ثبت‌شده بیش از حد مجاز است.' },
});

export default { generalLimiter, loginLimiter, predictionLimiter };
