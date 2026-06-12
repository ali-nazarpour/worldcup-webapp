import { Trophy } from 'lucide-react';
import { MatchCard } from '@/components/matches/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMatches } from '@/hooks/useMatches';

export function ResultsSection() {
  const { data, isLoading } = useMatches('finished');
  const matches = (data?.data || []).slice(0, 9);

  return (
    <section id="results" className="py-20 bg-white/[0.02]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-pitch-400 mb-3">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">نتایج نهایی</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">نتایج مسابقات</h2>
          <p className="text-muted-foreground">مسابقات پایان‌یافته با نتایج نهایی</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {!isLoading && matches.length === 0 && (
          <div className="text-center py-16 glass-card">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">هنوز مسابقه‌ای پایان نیافته است</p>
          </div>
        )}

        {matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match._id} match={match} onPredict={() => {}} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ResultsSection;
