import Tournament from '../models/Tournament.js';
import Match from '../models/Match.js';
import { createPrediction, trackPrediction } from '../services/prediction.service.js';
import {
  getTodayRange,
  getThisWeekRange,
  getThisMonthRange,
  jalaliKeyToUtcRange,
} from '../utils/jalali.js';
import { toEnglishDigits } from '../utils/persianDigits.js';

const UPCOMING_STATUSES = ['SCHEDULED', 'TIMED'];
const FINISHED_STATUS = 'FINISHED';
const LIVE_STATUSES = ['IN_PLAY', 'PAUSED'];

async function getActiveTournament() {
  return Tournament.findOne({ isActive: true });
}

function buildMatchFilter(tournamentId, filter, date) {
  const query = { tournamentId };

  switch (filter) {
    case 'today': {
      const { start, end } = getTodayRange();
      query.utcDate = { $gte: start, $lte: end };
      break;
    }
    case 'this-week': {
      const { start, end } = getThisWeekRange();
      query.utcDate = { $gte: start, $lte: end };
      break;
    }
    case 'this-month': {
      const { start, end } = getThisMonthRange();
      query.utcDate = { $gte: start, $lte: end };
      break;
    }
    case 'upcoming':
      query.status = { $in: UPCOMING_STATUSES };
      query.utcDate = { $gte: new Date() };
      break;
    case 'finished':
      query.status = FINISHED_STATUS;
      break;
    case 'live':
      query.status = { $in: LIVE_STATUSES };
      break;
    default:
      break;
  }

  if (date) {
    const englishDate = toEnglishDigits(date);
    const range = jalaliKeyToUtcRange(englishDate);
    if (range) {
      query.utcDate = { $gte: range.start, $lte: range.end };
    }
  }

  return query;
}

export async function getActiveTournamentPublic(req, res) {
  const tournament = await getActiveTournament();
  if (!tournament) {
    return res.json({ success: true, data: null, message: 'تورنمنت فعالی یافت نشد.' });
  }
  res.json({ success: true, data: tournament });
}

export async function getMatches(req, res) {
  const tournament = await getActiveTournament();
  if (!tournament) {
    return res.json({ success: true, data: [], message: 'تورنمنت فعالی یافت نشد.' });
  }

  const { filter, date } = req.query;
  const query = buildMatchFilter(tournament._id, filter, date);

  const matches = await Match.find(query)
    .populate('homeTeam awayTeam')
    .sort({ utcDate: filter === 'finished' ? -1 : 1 });

  res.json({ success: true, data: matches, tournament });
}

export async function getMatchById(req, res) {
  const match = await Match.findById(req.params.id).populate('homeTeam awayTeam tournamentId');
  if (!match) {
    return res.status(404).json({ success: false, message: 'مسابقه یافت نشد.' });
  }
  res.json({ success: true, data: match });
}

export async function submitPrediction(req, res) {
  const result = await createPrediction(req.body);
  res.status(201).json({
    success: true,
    message: 'پیش‌بینی شما با موفقیت ثبت شد.',
    data: {
      trackingCode: result.prediction.trackingCode,
      prediction: result.prediction,
      match: result.match,
    },
  });
}

export async function trackPredictionPublic(req, res) {
  const { phoneNumber, trackingCode } = req.body;
  const prediction = await trackPrediction(phoneNumber, trackingCode);
  res.json({ success: true, data: prediction });
}

export default {
  getActiveTournamentPublic,
  getMatches,
  getMatchById,
  submitPrediction,
  trackPredictionPublic,
};
