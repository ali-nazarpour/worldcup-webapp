import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, AlertTriangle, Calendar, Target, Trophy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/services/adminApi';
import { toast } from '@/components/ui/use-toast';
import { formatJalaliDateTime } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card className="glass-card-hover">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-black">{toPersianDigits(value ?? 0)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await adminApi.getDashboard();
      return data.data;
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => adminApi.sync(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      toast({ title: 'همگام‌سازی موفق', description: res.data.message, variant: 'success' });
    },
    onError: (error) => {
      toast({ title: 'خطا در همگام‌سازی', description: error.message, variant: 'destructive' });
    },
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">داشبورد</h1>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending || stats?.isSyncing}
        >
          <RefreshCw className={`h-4 w-4 ml-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          همگام‌سازی با football-data.org
        </Button>
      </div>

      {!stats?.footballApiConfigured && (
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <p className="text-sm">کلید API فوتبال تنظیم نشده است. لطفاً FOOTBALL_API_KEY را در فایل env تنظیم کنید.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="کل مسابقات" value={stats?.totalMatches} icon={Calendar} color="bg-blue-500/20 text-blue-400" />
        <StatCard title="مسابقات انجام شده" value={stats?.finishedMatches} icon={CheckCircle} color="bg-pitch-500/20 text-pitch-400" />
        <StatCard title="مسابقات پیش رو" value={stats?.upcomingMatches} icon={Calendar} color="bg-purple-500/20 text-purple-400" />
        <StatCard title="کل پیش‌بینی‌ها" value={stats?.totalPredictions} icon={Target} color="bg-amber-500/20 text-amber-400" />
        <StatCard title="پیش‌بینی‌های صحیح" value={stats?.correctPredictions} icon={Trophy} color="bg-yellow-500/20 text-yellow-400" />
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">تورنمنت فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold">{stats?.activeTournament?.name || '—'}</p>
            <p className="text-xs text-muted-foreground mt-2">
              آخرین همگام‌سازی: {stats?.lastSyncAt ? formatJalaliDateTime(stats.lastSyncAt) : '—'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
