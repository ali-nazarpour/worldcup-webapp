import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

export function AdminUsers() {
  const { isSuperAdmin } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', username: '', password: '', role: 'ADMIN' });
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await adminApi.getUsers();
      return data.data;
    },
    enabled: isSuperAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setOpen(false);
      toast({ title: 'مدیر ایجاد شد', variant: 'success' });
    },
    onError: (e) => toast({ title: 'خطا', description: e.message, variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.updateUser(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-pitch-400" />
          <h1 className="text-2xl font-bold">مدیریت مدیران</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          مدیر جدید
        </Button>
      </div>

      {isLoading ? <p>در حال بارگذاری...</p> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>نام کاربری</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users || []).map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.fullName}</TableCell>
                <TableCell dir="ltr">{u.username}</TableCell>
                <TableCell><Badge>{u.role === 'SUPER_ADMIN' ? 'مدیر اصلی' : 'مدیر'}</Badge></TableCell>
                <TableCell><Badge variant={u.isActive ? 'upcoming' : 'destructive'}>{u.isActive ? 'فعال' : 'غیرفعال'}</Badge></TableCell>
                <TableCell>
                  {u.role !== 'SUPER_ADMIN' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleMutation.mutate({ id: u._id, isActive: !u.isActive })}
                    >
                      {u.isActive ? 'غیرفعال' : 'فعال'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>ایجاد مدیر جدید</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>نام کامل</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div><Label>نام کاربری</Label><Input dir="ltr" className="text-left" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></div>
            <div><Label>رمز عبور</Label><Input type="password" dir="ltr" className="text-left" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div>
              <Label>نقش</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">مدیر</SelectItem>
                  <SelectItem value="SUPER_ADMIN">مدیر اصلی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => createMutation.mutate(form)}>ایجاد</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminUsers;
