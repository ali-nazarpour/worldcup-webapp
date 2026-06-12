import { MapPin, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatchStatusBadge } from './MatchStatusBadge';
import { formatJalaliDate, formatJalaliTime, canPredict } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

function TeamDisplay({ team, score, isWinner }) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 ${isWinner ? 'opacity-100' : ''}`}>
      <div className="relative">
        {team?.logoUrl ? (
          <img src={team.logoUrl} alt={team.name} className="h-14 w-14 object-contain drop-shadow-lg" />
        ) : (
          <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
            {team?.tla || '?'}
          </div>
        )}
        {isWinner && (
          <Trophy className="absolute -top-2 -left-2 h-5 w-5 text-amber-400" />
        )}
      </div>
      <span className="text-sm font-semibold text-center leading-tight">{team?.name || 'نامشخص'}</span>
      {score !== null && score !== undefined && (
        <span className="text-3xl font-black text-pitch-400">{toPersianDigits(score)}</span>
      )}
    </div>
  );
}

export function MatchCard({ match, onPredict }) {
  const showScore = ['FINISHED', 'IN_PLAY', 'PAUSED'].includes(match.status);
  const allowPredict = canPredict(match);
  const isLive = ['IN_PLAY', 'PAUSED'].includes(match.status);

  return (
    <Card className="glass-card-hover overflow-hidden group">
      <div className="h-1 bg-gradient-to-l from-pitch-500 via-pitch-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <MatchStatusBadge status={match.status} />
          {isLive && <span className="text-xs text-red-400 font-bold animate-pulse">● زنده</span>}
          {match.stage && (
            <span className="text-xs text-muted-foreground">{match.stage}{match.group ? ` - گروه ${match.group}` : ''}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <TeamDisplay
            team={match.homeTeam}
            score={showScore ? match.homeScore : null}
            isWinner={match.winner === 'HOME_TEAM'}
          />
          <div className="flex flex-col items-center gap-1 px-2">
            {showScore ? (
              <span className="text-muted-foreground text-sm">در مقابل</span>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">VS</span>
            )}
          </div>
          <TeamDisplay
            team={match.awayTeam}
            score={showScore ? match.awayScore : null}
            isWinner={match.winner === 'AWAY_TEAM'}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="text-sm text-muted-foreground">
            <p>{formatJalaliDate(match.utcDate)}</p>
            <p>ساعت {formatJalaliTime(match.utcDate)}</p>
            {match.venue && (
              <p className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {match.venue}
              </p>
            )}
          </div>
          {allowPredict && (
            <Button size="sm" onClick={() => onPredict(match)} className="shrink-0">
              پیش‌بینی نتیجه
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MatchCard;
