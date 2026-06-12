import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { MatchFilters } from '@/components/matches/MatchFilters';
import { MatchCard } from '@/components/matches/MatchCard';
import { PredictionDialog } from '@/components/predictions/PredictionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useMatches } from '@/hooks/useMatches';

export function MatchDashboard() {
  const [filter, setFilter] = useState('all');
  const [date, setDate] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const needsDate = filter === 'date' && !date;
  const { data, isLoading, isError } = useMatches(
    needsDate ? null : filter === 'date' ? 'date' : filter,
    date
  );
  const matches = data?.data || [];

  const handlePredict = (match) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  return (
    <section id="matches" className="py-20">
      <div className="container mx-auto px-4">
        <div id="predict" className="text-center mb-10 scroll-mt-20">
          <div className="inline-flex items-center gap-2 text-pitch-400 mb-3">
            <CalendarDays className="h-5 w-5" />
            <span className="text-sm font-medium">جدول مسابقات</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">مسابقات جام جهانی</h2>
          <p className="text-muted-foreground">مسابقات را فیلتر کنید و نتیجه را پیش‌بینی کنید.</p>
        </div>

        <MatchFilters
          filter={filter}
          onFilterChange={setFilter}
          date={date}
          onDateChange={setDate}
        />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-16 glass-card mt-8">
            <p className="text-muted-foreground">خطا در بارگذاری مسابقات. لطفاً دوباره تلاش کنید.</p>
          </div>
        )}

        {needsDate && (
          <div className="text-center py-16 glass-card mt-8">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">تاریخ را انتخاب کنید</p>
            <p className="text-sm text-muted-foreground">از تقویم شمسی بالا یک تاریخ مشخص انتخاب کنید.</p>
          </div>
        )}

        {!needsDate && !isLoading && !isError && matches.length === 0 && (
          <div className="text-center py-16 glass-card mt-8">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">مسابقه‌ای یافت نشد</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {filter === 'all'
                ? 'هنوز مسابقه‌ای در پایگاه داده نیست. مدیر باید کلید API فوتبال را تنظیم و همگام‌سازی را از پنل ادمین اجرا کند.'
                : 'برای این فیلتر مسابقه‌ای وجود ندارد. فیلتر «همه مسابقات» را امتحان کنید.'}
            </p>
          </div>
        )}

        {!isLoading && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {matches.map((match) => (
              <MatchCard key={match._id} match={match} onPredict={handlePredict} />
            ))}
          </div>
        )}

        <PredictionDialog
          match={selectedMatch}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>
  );
}

export default MatchDashboard;
