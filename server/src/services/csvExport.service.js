import Prediction from '../models/Prediction.js';
import { toJalaliDate } from '../utils/jalali.js';

function escapeCsv(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportCorrectPredictions(matchId) {
  const filter = { status: 'CORRECT' };
  if (matchId) filter.matchId = matchId;

  const predictions = await Prediction.find(filter)
    .populate({
      path: 'matchId',
      populate: [{ path: 'homeTeam' }, { path: 'awayTeam' }],
    })
    .sort({ checkedAt: -1 });

  const headers = [
    'firstName',
    'lastName',
    'phoneNumber',
    'match',
    'predictedScore',
    'actualScore',
    'trackingCode',
    'createdAt',
    'checkedAt',
  ];

  const rows = predictions.map((p) => {
    const match = p.matchId;
    const matchLabel = match
      ? `${match.homeTeam?.name || ''} vs ${match.awayTeam?.name || ''}`
      : '';
    return [
      p.firstName,
      p.lastName,
      p.phoneNumber,
      matchLabel,
      `${p.predictedHomeScore}-${p.predictedAwayScore}`,
      `${p.actualHomeScore ?? ''}-${p.actualAwayScore ?? ''}`,
      p.trackingCode,
      toJalaliDate(p.createdAt),
      p.checkedAt ? toJalaliDate(p.checkedAt) : '',
    ];
  });

  const csv = [headers.join(','), ...rows.map((row) => row.map(escapeCsv).join(','))].join('\n');
  return csv;
}

export default { exportCorrectPredictions };
