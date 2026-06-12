import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check } from 'lucide-react';
import { adminApi } from '@/services/adminApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { toPersianDigits } from '@/lib/persianDigits';

export function AdminTournaments() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', year: 2030, competitionCode: 'WC', season: 2030, apiProvider: 'football-data' });
  const queryClient = useQueryClient();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ['admin', 'tournaments'],
    queryFn: async () => {
      const { data } = await adminApi.getTournaments();
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.createTournament(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments'] });
      setOpen(false);
      toast({ title: 'تورنمنت ایجاد شد', variant: 'success' });
    },
    onError: (e) => toast({ title: 'خطا', description: e.message, variant: 'destructive' }),
  });

  const activateMutation = useMutation({
    mutationFn: (id) => adminApi.setActiveTournament(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tournaments'] });
      toast({ title: 'تورنمنت فعال شد', variant: 'success' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تورنمنت‌ها</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          تورنمنت جدید
        </Button>
      </div>

      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div className="grid gap-4">
          {(tournaments || []).map((t) => (
            <Card key={t._id} className="glass-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    {t.isActive && <Badge variant="upcoming">فعال</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    سال {toPersianDigits(t.year)} | کد: {t.competitionCode} | فصل: {toPersianDigits(t.season)}
                  </p>
                </div>
                {!t.isActive && (
                  <Button size="sm" variant="outline" onClick={() => activateMutation.mutate(t._id)}>
                    <Check className="h-4 w-4 ml-1" />
                    فعال‌سازی
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ایجاد تورنمنت جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>نام</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="FIFA World Cup 2030" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>سال</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} />
              </div>
              <div>
                <Label>فصل</Label>
                <Input type="number" value={form.season} onChange={(e) => setForm({ ...form, season: +e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>کد مسابقات</Label>
                <Input value={form.competitionCode} onChange={(e) => setForm({ ...form, competitionCode: e.target.value })} />
              </div>
              <div>
                <Label>ارائه‌دهنده API</Label>
                <Input value={form.apiProvider} onChange={(e) => setForm({ ...form, apiProvider: e.target.value })} />
              </div>
            </div>
            <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending}>
              ایجاد تورنمنت
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminTournaments;
