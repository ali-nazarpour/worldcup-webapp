import { useQuery } from '@tanstack/react-query';
import { Download, Medal } from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatJalaliDateTime } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

export function AdminCorrectPredictions() {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['admin', 'predictions', 'correct'],
    queryFn: async () => {
      const { data } = await adminApi.getCorrectPredictions();
      return data.data;
    },
  });

  const handleExport = async () => {
    const { data } = await adminApi.exportCorrectPredictions();
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'correct-predictions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Medal className="h-7 w-7 text-amber-400" />
          <h1 className="text-2xl font-bold">پیش‌بینی‌های صحیح</h1>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 ml-2" />
          خروجی CSV
        </Button>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>تماس</TableHead>
              <TableHead>مسابقه</TableHead>
              <TableHead>پیش‌بینی</TableHead>
              <TableHead>نتیجه واقعی</TableHead>
              <TableHead>کد پیگیری</TableHead>
              <TableHead>تاریخ بررسی</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(predictions || []).map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell dir="ltr">{p.phoneNumber}</TableCell>
                <TableCell>{p.matchId?.homeTeam?.name} vs {p.matchId?.awayTeam?.name}</TableCell>
                <TableCell className="font-bold text-amber-400">{toPersianDigits(p.predictedHomeScore)} - {toPersianDigits(p.predictedAwayScore)}</TableCell>
                <TableCell>{toPersianDigits(p.actualHomeScore)} - {toPersianDigits(p.actualAwayScore)}</TableCell>
                <TableCell dir="ltr" className="font-mono text-xs">{p.trackingCode}</TableCell>
                <TableCell className="text-sm">{p.checkedAt ? formatJalaliDateTime(p.checkedAt) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AdminCorrectPredictions;
