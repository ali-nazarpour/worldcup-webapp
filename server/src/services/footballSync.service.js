import footballDataProvider from '../providers/football/footballDataProvider.js';
import Tournament from '../models/Tournament.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import { recalculatePredictionsForMatch } from './prediction.service.js';
import { normalizeTeam } from '../providers/football/normalizeFootballData.js';

let lastSyncAt = null;
let isSyncing = false;

export function getLastSyncAt() {
  return lastSyncAt;
}

export function getIsSyncing() {
  return isSyncing;
}

async function upsertTeam(teamData) {
  const normalized = teamData.externalId ? teamData : normalizeTeam(teamData);
  return Team.findOneAndUpdate(
    { externalId: normalized.externalId },
    { $set: normalized },
    { upsert: true, new: true }
  );
}

export async function syncTournament(tournament) {
  if (!footballDataProvider.isConfigured()) {
    const error = new Error('کلید API فوتبال تنظیم نشده است. لطفاً FOOTBALL_API_KEY را در فایل env تنظیم کنید.');
    error.statusCode = 503;
    throw error;
  }

  const matches = await footballDataProvider.getCompetitionMatches(tournament.competitionCode, {
    season: tournament.season,
  });

  let teamsUpserted = 0;
  let matchesUpserted = 0;

  for (const matchData of matches) {
    let homeTeam = await Team.findOne({ externalId: matchData.homeExternalId });
    if (!homeTeam) {
      homeTeam = await upsertTeam({
        externalId: matchData.homeExternalId,
        name: matchData.homeTeamName,
        shortName: matchData.homeTeamName,
        logoUrl: matchData.homeTeamCrest,
      });
      teamsUpserted++;
    }

    let awayTeam = await Team.findOne({ externalId: matchData.awayExternalId });
    if (!awayTeam) {
      awayTeam = await upsertTeam({
        externalId: matchData.awayExternalId,
        name: matchData.awayTeamName,
        shortName: matchData.awayTeamName,
        logoUrl: matchData.awayTeamCrest,
      });
      teamsUpserted++;
    }

    const existing = await Match.findOne({
      externalId: matchData.externalId,
      tournamentId: tournament._id,
    });

    const updateData = {
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      status: matchData.status,
      utcDate: matchData.utcDate,
      jalaliDate: matchData.jalaliDate,
      jalaliTime: matchData.jalaliTime,
      stage: matchData.stage,
      group: matchData.group,
      venue: matchData.venue,
      city: matchData.city,
      matchday: matchData.matchday,
      winner: matchData.winner,
      lastSyncedAt: new Date(),
      rawApiPayload: matchData.rawApiPayload,
    };

    if (!existing?.manualOverride) {
      updateData.homeScore = matchData.homeScore;
      updateData.awayScore = matchData.awayScore;
    }

    const match = await Match.findOneAndUpdate(
      { externalId: matchData.externalId, tournamentId: tournament._id },
      { $set: updateData, $setOnInsert: { tournamentId: tournament._id, externalId: matchData.externalId } },
      { upsert: true, new: true }
    );

    matchesUpserted++;

    if (matchData.status === 'FINISHED' && !existing?.manualOverride) {
      await recalculatePredictionsForMatch(match._id, matchData.homeScore, matchData.awayScore);
    }
  }

  return { teamsUpserted, matchesUpserted, totalMatches: matches.length };
}

export async function syncActiveTournament() {
  if (isSyncing) {
    return { alreadyRunning: true };
  }

  isSyncing = true;
  try {
    const tournament = await Tournament.findOne({ isActive: true });
    if (!tournament) {
      const error = new Error('هیچ تورنمنتی فعال نیست.');
      error.statusCode = 404;
      throw error;
    }

    const result = await syncTournament(tournament);
    lastSyncAt = new Date();
    return { ...result, lastSyncAt, tournament: tournament.name };
  } finally {
    isSyncing = false;
  }
}

export async function hasActiveMatchDay() {
  const tournament = await Tournament.findOne({ isActive: true });
  if (!tournament) return false;

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const count = await Match.countDocuments({
    tournamentId: tournament._id,
    utcDate: { $gte: start, $lte: end },
    status: { $in: ['IN_PLAY', 'PAUSED', 'TIMED', 'SCHEDULED'] },
  });

  return count > 0;
}

export default { syncActiveTournament, syncTournament, getLastSyncAt, getIsSyncing, hasActiveMatchDay };
