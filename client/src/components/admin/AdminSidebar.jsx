import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Trophy,
  Users,
  Medal,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'داشبورد', end: true },
  { to: '/admin/matches', icon: Calendar, label: 'مسابقات' },
  { to: '/admin/predictions', icon: Target, label: 'پیش‌بینی‌ها' },
  { to: '/admin/predictions/correct', icon: Medal, label: 'پیش‌بینی‌های صحیح' },
  { to: '/admin/tournaments', icon: Trophy, label: 'تورنمنت‌ها' },
  { to: '/admin/users', icon: Users, label: 'مدیران', superOnly: true },
];

export function AdminSidebar() {
  const location = useLocation();
  const { admin, logout, isSuperAdmin } = useAdminAuth();

  return (
    <aside className="w-64 min-h-screen border-l border-white/5 bg-navy-950/80 backdrop-blur-xl p-4 flex flex-col">
      <div className="mb-8 p-3">
        <h2 className="font-bold text-lg">پنل مدیریت</h2>
        <p className="text-xs text-muted-foreground mt-1">{admin?.fullName}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.filter((item) => !item.superOnly || isSuperAdmin).map((item) => {
          const active = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active ? 'bg-pitch-500/20 text-pitch-300' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button variant="ghost" className="justify-start text-muted-foreground" onClick={() => logout()}>
        <LogOut className="h-4 w-4 ml-2" />
        خروج
      </Button>
    </aside>
  );
}

export default AdminSidebar;
