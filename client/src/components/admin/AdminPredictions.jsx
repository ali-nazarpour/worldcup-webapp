import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatJalaliDateTime } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

export function AdminPredictions() {
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['admin', 'predictions', status, phone],
    queryFn: async () => {
      const params = {};
      if (status && status !== 'all') params.status = status;
      if (phone) params.phoneNumber = phone;
      const { data } = await adminApi.getPredictions(params);
      return data.data;
    },
  });

  const statusVariant = { PENDING: 'upcoming', CORRECT: 'correct', INCORRECT: 'destructive' };
  const statusLabel = { PENDING: 'در انتظار', CORRECT: 'صحیح', INCORRECT: 'نادرست' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">پیش‌بینی‌ها</h1>
      <div className="flex gap-4 flex-wrap">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue placeholder="وضعیت" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="pending">در انتظار</SelectItem>
            <SelectItem value="correct">صحیح</SelectItem>
            <SelectItem value="incorrect">نادرست</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="شماره تماس" className="w-48" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>تماس</TableHead>
              <TableHead>مسابقه</TableHead>
              <TableHead>پیش‌بینی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>کد پیگیری</TableHead>
              <TableHead>تاریخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(predictions || []).map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell dir="ltr">{p.phoneNumber}</TableCell>
                <TableCell className="text-sm">{p.matchId?.homeTeam?.name} vs {p.matchId?.awayTeam?.name}</TableCell>
                <TableCell className="font-bold">{toPersianDigits(p.predictedHomeScore)} - {toPersianDigits(p.predictedAwayScore)}</TableCell>
                <TableCell><Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge></TableCell>
                <TableCell dir="ltr" className="font-mono text-xs">{p.trackingCode}</TableCell>
                <TableCell className="text-sm">{formatJalaliDateTime(p.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AdminPredictions;
