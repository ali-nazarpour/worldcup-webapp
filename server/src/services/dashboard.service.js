import Match from '../models/Match.js';
import Prediction from '../models/Prediction.js';
import Tournament from '../models/Tournament.js';
import { getLastSyncAt } from './footballSync.service.js';
import { hasFootballApiKey } from '../config/env.js';

export async function getDashboardStats() {
  const activeTournament = await Tournament.findOne({ isActive: true });

  const matchFilter = activeTournament ? { tournamentId: activeTournament._id } : {};

  const [totalMatches, finishedMatches, upcomingMatches, totalPredictions, correctPredictions] =
    await Promise.all([
      Match.countDocuments(matchFilter),
      Match.countDocuments({ ...matchFilter, status: 'FINISHED' }),
      Match.countDocuments({
        ...matchFilter,
        status: { $in: ['SCHEDULED', 'TIMED'] },
        utcDate: { $gte: new Date() },
      }),
      Prediction.countDocuments(),
      Prediction.countDocuments({ status: 'CORRECT' }),
    ]);

  return {
    totalMatches,
    finishedMatches,
    upcomingMatches,
    totalPredictions,
    correctPredictions,
    activeTournament: activeTournament
      ? { id: activeTournament._id, name: activeTournament.name, year: activeTournament.year }
      : null,
    lastSyncAt: getLastSyncAt(),
    footballApiConfigured: hasFootballApiKey(),
  };
}

export default { getDashboardStats };
