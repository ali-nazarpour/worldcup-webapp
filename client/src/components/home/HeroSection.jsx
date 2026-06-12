import { Trophy, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useActiveTournament } from '@/hooks/useMatches';
import { toPersianDigits } from '@/lib/persianDigits';

export function HeroSection() {
  const { data: tournament } = useActiveTournament();

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pitch-pattern">
      <div className="absolute inset-0 stadium-glow" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-pitch-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-pitch-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          {tournament && (
            <Badge variant="upcoming" className="text-sm px-4 py-1.5">
              <Trophy className="h-4 w-4 ml-2" />
              {tournament.name.replace('FIFA ', '')} {toPersianDigits(tournament.year)}
            </Badge>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-l from-white via-pitch-200 to-pitch-400 bg-clip-text text-transparent">
            مرکز نتایج و پیش‌بینی جام جهانی
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            مسابقات جام جهانی را دنبال کنید، نتایج را ببینید و بدون نیاز به ثبت‌نام، نتیجه مسابقات را پیش‌بینی کنید.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => scrollTo('#matches')}>
              <Calendar className="h-5 w-5 ml-2" />
              مشاهده مسابقات
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo('#matches')}>
              <Target className="h-5 w-5 ml-2" />
              ثبت پیش‌بینی
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-8">
            {[
              { label: 'مسابقات', value: '۱۰۴+' },
              { label: 'تیم‌ها', value: '۴۸' },
              { label: 'کشورها', value: '۳۲+' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-black text-pitch-400">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
