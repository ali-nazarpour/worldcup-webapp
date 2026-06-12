import Prediction from '../models/Prediction.js';
import Match from '../models/Match.js';
import generateTrackingCode from '../utils/trackingCode.js';

const LIVE_STATUSES = ['IN_PLAY', 'PAUSED', 'FINISHED'];
const CLOSED_STATUSES = [...LIVE_STATUSES, 'CANCELLED'];

export function normalizePhone(phone) {
  return phone.replace(/\s+/g, '').replace(/^\+98/, '0').replace(/^98/, '0');
}

export function validatePhone(phone) {
  const normalized = normalizePhone(phone);
  return /^09\d{9}$/.test(normalized) || /^0\d{10}$/.test(normalized);
}

export async function createPrediction(data) {
  const { matchId, firstName, lastName, phoneNumber, predictedHomeScore, predictedAwayScore } = data;

  if (!firstName?.trim()) {
    const error = new Error('نام الزامی است.');
    error.statusCode = 400;
    throw error;
  }
  if (!lastName?.trim()) {
    const error = new Error('نام خانوادگی الزامی است.');
    error.statusCode = 400;
    throw error;
  }
  if (!validatePhone(phoneNumber)) {
    const error = new Error('شماره تماس معتبر وارد کنید.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(predictedHomeScore) || predictedHomeScore < 0) {
    const error = new Error('تعداد گل باید عدد صحیح و مثبت یا صفر باشد.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(predictedAwayScore) || predictedAwayScore < 0) {
    const error = new Error('تعداد گل باید عدد صحیح و مثبت یا صفر باشد.');
    error.statusCode = 400;
    throw error;
  }

  const match = await Match.findById(matchId).populate('homeTeam awayTeam');
  if (!match) {
    const error = new Error('مسابقه یافت نشد.');
    error.statusCode = 404;
    throw error;
  }

  if (CLOSED_STATUSES.includes(match.status) || new Date() >= new Date(match.utcDate)) {
    const error = new Error('مهلت ثبت پیش‌بینی این مسابقه تمام شده است.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedPhone = normalizePhone(phoneNumber);
  const existing = await Prediction.findOne({ matchId, phoneNumber: normalizedPhone });
  if (existing) {
    const error = new Error('شما قبلاً برای این مسابقه پیش‌بینی ثبت کرده‌اید.');
    error.statusCode = 409;
    throw error;
  }

  let trackingCode;
  let attempts = 0;
  do {
    trackingCode = generateTrackingCode();
    attempts++;
  } while ((await Prediction.findOne({ trackingCode })) && attempts < 10);

  const prediction = await Prediction.create({
    matchId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: normalizedPhone,
    predictedHomeScore,
    predictedAwayScore,
    trackingCode,
    status: 'PENDING',
  });

  return { prediction, match };
}

export async function trackPrediction(phoneNumber, trackingCode) {
  if (!validatePhone(phoneNumber)) {
    const error = new Error('شماره تماس معتبر وارد کنید.');
    error.statusCode = 400;
    throw error;
  }
  if (!trackingCode?.trim()) {
    const error = new Error('کد پیگیری الزامی است.');
    error.statusCode = 400;
    throw error;
  }

  const prediction = await Prediction.findOne({
    phoneNumber: normalizePhone(phoneNumber),
    trackingCode: trackingCode.trim().toUpperCase(),
  }).populate({
    path: 'matchId',
    populate: [{ path: 'homeTeam' }, { path: 'awayTeam' }],
  });

  if (!prediction) {
    const error = new Error('پیش‌بینی با این اطلاعات یافت نشد.');
    error.statusCode = 404;
    throw error;
  }

  return prediction;
}

export async function recalculatePredictionsForMatch(matchId, homeScore, awayScore) {
  const predictions = await Prediction.find({ matchId, status: 'PENDING' });

  for (const prediction of predictions) {
    const isCorrect =
      prediction.predictedHomeScore === homeScore && prediction.predictedAwayScore === awayScore;

    prediction.actualHomeScore = homeScore;
    prediction.actualAwayScore = awayScore;
    prediction.isCorrect = isCorrect;
    prediction.status = isCorrect ? 'CORRECT' : 'INCORRECT';
    prediction.checkedAt = new Date();
    await prediction.save();
  }

  return predictions.length;
}

export default {
  createPrediction,
  trackPrediction,
  recalculatePredictionsForMatch,
  validatePhone,
  normalizePhone,
};
