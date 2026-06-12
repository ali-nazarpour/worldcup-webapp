import { Link } from 'react-router-dom';
import { Trophy, Instagram, Twitter, Send } from 'lucide-react';
import { useActiveTournament } from '@/hooks/useMatches';
import { toPersianDigits } from '@/lib/persianDigits';

export function Footer() {
  const { data: tournament } = useActiveTournament();

  return (
    <footer className="border-t border-white/5 bg-navy-950/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Trophy className="h-6 w-6 text-pitch-400" />
              جام جهانی
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              مرکز نتایج و پیش‌بینی جام جهانی فوتبال. مشاهده مسابقات، ثبت پیش‌بینی و پیگیری نتایج.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#matches" className="hover:text-pitch-400 transition-colors">مسابقات</a></li>
              <li><a href="#results" className="hover:text-pitch-400 transition-colors">نتایج</a></li>
              <li><a href="#tracking" className="hover:text-pitch-400 transition-colors">پیگیری پیش‌بینی</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">تورنمنت</h4>
            <p className="text-sm text-muted-foreground">
              {tournament ? `${tournament.name} - ${toPersianDigits(tournament.year)}` : 'تورنمنت فعالی یافت نشد'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">شبکه‌های اجتماعی</h4>
            <div className="flex gap-3">
              {[Instagram, Twitter, Send].map((Icon, i) => (
                <div key={i} className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-pitch-400 hover:bg-white/10 transition-all cursor-pointer">
                  <Icon className="h-4 w-4" />
                </div>
              ))}
            </div>
            <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-pitch-400 mt-4 inline-block">
              ورود مدیران
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {toPersianDigits(new Date().getFullYear())} جام جهانی — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
