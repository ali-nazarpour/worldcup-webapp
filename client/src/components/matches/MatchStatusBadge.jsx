import { Badge } from '@/components/ui/badge';
import { MATCH_STATUS_LABELS } from '@/lib/jalali';

export function MatchStatusBadge({ status }) {
  const variantMap = {
    IN_PLAY: 'live',
    PAUSED: 'live',
    FINISHED: 'finished',
    SCHEDULED: 'upcoming',
    TIMED: 'upcoming',
    POSTPONED: 'destructive',
    CANCELLED: 'destructive',
  };

  return (
    <Badge variant={variantMap[status] || 'default'}>
      {MATCH_STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default MatchStatusBadge;
