import { toJalaliDate, toJalaliTime } from '../../utils/jalali.js';

export function normalizeTeam(apiTeam) {
  return {
    externalId: apiTeam.id,
    name: apiTeam.name,
    shortName: apiTeam.shortName || apiTeam.name,
    tla: apiTeam.tla || '',
    logoUrl: apiTeam.crest || null,
    country: apiTeam.area?.name || null,
  };
}

export function normalizeMatch(apiMatch) {
  const homeScore = apiMatch.score?.fullTime?.home ?? null;
  const awayScore = apiMatch.score?.fullTime?.away ?? null;
  const utcDate = new Date(apiMatch.utcDate);

  return {
    externalId: apiMatch.id,
    homeExternalId: apiMatch.homeTeam?.id,
    awayExternalId: apiMatch.awayTeam?.id,
    homeTeamName: apiMatch.homeTeam?.name,
    awayTeamName: apiMatch.awayTeam?.name,
    homeTeamCrest: apiMatch.homeTeam?.crest,
    awayTeamCrest: apiMatch.awayTeam?.crest,
    homeScore,
    awayScore,
    status: apiMatch.status || 'SCHEDULED',
    utcDate,
    jalaliDate: toJalaliDate(utcDate),
    jalaliTime: toJalaliTime(utcDate),
    stage: apiMatch.stage || null,
    group: apiMatch.group || null,
    venue: apiMatch.venue || null,
    city: null,
    matchday: apiMatch.matchday || null,
    winner: apiMatch.score?.winner || null,
    rawApiPayload: apiMatch,
  };
}

export default { normalizeTeam, normalizeMatch };
