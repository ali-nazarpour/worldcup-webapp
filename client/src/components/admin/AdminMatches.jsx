import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MatchStatusBadge } from '@/components/matches/MatchStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatJalaliDateTime } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

export function AdminMatches() {
  const [status, setStatus] = useState('all');

  const { data: matches, isLoading } = useQuery({
    queryKey: ['admin', 'matches', status],
    queryFn: async () => {
      const params = status && status !== 'all' ? { status } : {};
      const { data } = await adminApi.getMatches(params);
      return data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مسابقات</h1>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فیلتر وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="SCHEDULED">برنامه‌ریزی شده</SelectItem>
            <SelectItem value="FINISHED">پایان یافته</SelectItem>
            <SelectItem value="IN_PLAY">در حال برگزاری</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تیم‌ها</TableHead>
              <TableHead>نتیجه</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead>شناسه API</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(matches || []).map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.homeTeam?.name} vs {m.awayTeam?.name}</TableCell>
                <TableCell className="font-bold">
                  {m.homeScore !== null ? `${toPersianDigits(m.homeScore)} - ${toPersianDigits(m.awayScore)}` : '—'}
                </TableCell>
                <TableCell><MatchStatusBadge status={m.status} /></TableCell>
                <TableCell className="text-sm">{formatJalaliDateTime(m.utcDate)}</TableCell>
                <TableCell className="text-xs text-muted-foreground" dir="ltr">{m.externalId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default AdminMatches;
