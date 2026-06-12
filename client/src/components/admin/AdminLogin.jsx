import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Trophy, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const { login, loginLoading, loginError, isAuthenticated } = useAdminAuth();
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data);
    } catch (e) {
      setError(e.message || 'خطا در ورود');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pitch-pattern">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-pitch-500/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-7 w-7 text-pitch-400" />
          </div>
          <CardTitle className="text-2xl">ورود مدیران</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username">نام کاربری</Label>
              <Input id="username" dir="ltr" className="text-left" {...register('username', { required: true })} />
            </div>
            <div>
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" type="password" dir="ltr" className="text-left" {...register('password', { required: true })} />
            </div>
            {(error || loginError) && (
              <p className="text-sm text-red-400 text-center">{error || loginError?.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              <Lock className="h-4 w-4 ml-2" />
              {loginLoading ? 'در حال ورود...' : 'ورود'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminLogin;
