import bcrypt from 'bcryptjs';
import Tournament from '../models/Tournament.js';
import Match from '../models/Match.js';
import Prediction from '../models/Prediction.js';
import AdminUser from '../models/AdminUser.js';
import { getDashboardStats } from '../services/dashboard.service.js';
import { syncActiveTournament, getIsSyncing } from '../services/footballSync.service.js';
import { exportCorrectPredictions } from '../services/csvExport.service.js';
import { recalculatePredictionsForMatch } from '../services/prediction.service.js';
import { jalaliKeyToUtcRange } from '../utils/jalali.js';
import { toEnglishDigits } from '../utils/persianDigits.js';

export async function getDashboard(req, res) {
  const stats = await getDashboardStats();
  res.json({ success: true, data: { ...stats, isSyncing: getIsSyncing() } });
}

export async function triggerSync(req, res) {
  if (getIsSyncing()) {
    return res.status(409).json({ success: false, message: 'همگام‌سازی در حال اجراست.' });
  }
  const result = await syncActiveTournament();
  res.json({ success: true, message: 'همگام‌سازی با موفقیت انجام شد.', data: result });
}

export async function getAdminMatches(req, res) {
  const { status, tournamentId, date } = req.query;
  const query = {};
  if (status) query.status = status;
  if (tournamentId) query.tournamentId = tournamentId;
  if (date) {
    const range = jalaliKeyToUtcRange(toEnglishDigits(date));
    if (range) query.utcDate = { $gte: range.start, $lte: range.end };
  }

  const matches = await Match.find(query)
    .populate('homeTeam awayTeam tournamentId')
    .sort({ utcDate: -1 });

  res.json({ success: true, data: matches });
}

export async function updateMatch(req, res) {
  const { homeScore, awayScore, status } = req.body;
  const match = await Match.findById(req.params.id);
  if (!match) {
    return res.status(404).json({ success: false, message: 'مسابقه یافت نشد.' });
  }

  if (homeScore !== undefined) match.homeScore = homeScore;
  if (awayScore !== undefined) match.awayScore = awayScore;
  if (status) match.status = status;
  match.manualOverride = true;
  await match.save();

  if (match.status === 'FINISHED' && match.homeScore !== null && match.awayScore !== null) {
    await recalculatePredictionsForMatch(match._id, match.homeScore, match.awayScore);
  }

  const updated = await Match.findById(match._id).populate('homeTeam awayTeam tournamentId');
  res.json({ success: true, message: 'مسابقه به‌روزرسانی شد.', data: updated });
}

export async function getAdminPredictions(req, res) {
  const { status, matchId, phoneNumber } = req.query;
  const query = {};
  if (status) query.status = status.toUpperCase();
  if (matchId) query.matchId = matchId;
  if (phoneNumber) query.phoneNumber = phoneNumber.replace(/\s+/g, '');

  const predictions = await Prediction.find(query)
    .populate({
      path: 'matchId',
      populate: [{ path: 'homeTeam' }, { path: 'awayTeam' }],
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: predictions });
}

export async function getCorrectPredictions(req, res) {
  const { matchId } = req.query;
  const query = { status: 'CORRECT' };
  if (matchId) query.matchId = matchId;

  const predictions = await Prediction.find(query)
    .populate({
      path: 'matchId',
      populate: [{ path: 'homeTeam' }, { path: 'awayTeam' }],
    })
    .sort({ checkedAt: -1 });

  res.json({ success: true, data: predictions });
}

export async function exportCorrectPredictionsCsv(req, res) {
  const csv = await exportCorrectPredictions(req.query.matchId);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=correct-predictions.csv');
  res.send('\uFEFF' + csv);
}

export async function getTournaments(req, res) {
  const tournaments = await Tournament.find().sort({ year: -1 });
  res.json({ success: true, data: tournaments });
}

export async function createTournament(req, res) {
  const tournament = await Tournament.create(req.body);
  res.status(201).json({ success: true, message: 'تورنمنت ایجاد شد.', data: tournament });
}

export async function updateTournament(req, res) {
  const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tournament) {
    return res.status(404).json({ success: false, message: 'تورنمنت یافت نشد.' });
  }
  res.json({ success: true, message: 'تورنمنت به‌روزرسانی شد.', data: tournament });
}

export async function setActiveTournament(req, res) {
  await Tournament.updateMany({}, { isActive: false });
  const tournament = await Tournament.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true }
  );
  if (!tournament) {
    return res.status(404).json({ success: false, message: 'تورنمنت یافت نشد.' });
  }
  res.json({ success: true, message: 'تورنمنت فعال شد.', data: tournament });
}

export async function getAdminUsers(req, res) {
  const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json({ success: true, data: users });
}

export async function createAdminUser(req, res) {
  const { fullName, username, password, role } = req.body;
  if (!fullName || !username || !password) {
    return res.status(400).json({ success: false, message: 'تمام فیلدها الزامی است.' });
  }

  const existing = await AdminUser.findOne({ username: username.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ success: false, message: 'این نام کاربری قبلاً ثبت شده است.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await AdminUser.create({
    fullName,
    username: username.toLowerCase().trim(),
    passwordHash,
    role: role || 'ADMIN',
  });

  const safe = admin.toObject();
  delete safe.passwordHash;
  res.status(201).json({ success: true, message: 'مدیر جدید ایجاد شد.', data: safe });
}

export async function updateAdminUser(req, res) {
  const { fullName, role, isActive, password } = req.body;
  const admin = await AdminUser.findById(req.params.id);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'مدیر یافت نشد.' });
  }

  if (fullName) admin.fullName = fullName;
  if (role) admin.role = role;
  if (typeof isActive === 'boolean') admin.isActive = isActive;
  if (password) admin.passwordHash = await bcrypt.hash(password, 12);

  await admin.save();
  const safe = admin.toObject();
  delete safe.passwordHash;
  res.json({ success: true, message: 'مدیر به‌روزرسانی شد.', data: safe });
}

export default {
  getDashboard,
  triggerSync,
  getAdminMatches,
  updateMatch,
  getAdminPredictions,
  getCorrectPredictions,
  exportCorrectPredictionsCsv,
  getTournaments,
  createTournament,
  updateTournament,
  setActiveTournament,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
};
