import { useState } from 'react';
import { Menu, X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_ITEMS = [
  { href: '#matches', label: 'مسابقات' },
  { href: '#predict', label: 'پیش‌بینی' },
  { href: '#results', label: 'نتایج' },
  { href: '#tracking', label: 'پیگیری پیش‌بینی' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-navy-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-9 w-9 rounded-xl bg-pitch-500/20 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-pitch-400" />
          </div>
          <span className="hidden sm:inline">جام جهانی</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm text-muted-foreground hover:text-pitch-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button size="sm" className="hidden sm:flex" onClick={() => scrollTo('#matches')}>
            مشاهده مسابقات امروز
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className="text-right text-lg py-2 hover:text-pitch-400 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Button onClick={() => scrollTo('#matches')} className="mt-4">
                  مشاهده مسابقات امروز
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
