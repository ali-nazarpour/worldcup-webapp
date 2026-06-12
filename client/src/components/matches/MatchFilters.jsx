import { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toEnglishDigits } from '@/lib/persianDigits';

const FILTERS = [
  { value: 'all', label: 'همه مسابقات' },
  { value: 'today', label: 'امروز' },
  { value: 'this-week', label: 'این هفته' },
  { value: 'this-month', label: 'این ماه' },
  { value: 'upcoming', label: 'پیش رو' },
  { value: 'finished', label: 'انجام شده' },
];

export function MatchFilters({ filter, onFilterChange, date, onDateChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <div className="space-y-4">
      <div className="sticky top-16 z-30 glass-card p-3 overflow-x-auto">
        <Tabs value={filter} onValueChange={(v) => { onFilterChange(v); if (v !== 'date') onDateChange(null); }}>
          <div className="flex w-full justify-end">
            <TabsList dir="rtl" className="inline-flex flex-wrap h-auto gap-1 bg-transparent p-0">
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value} className="text-xs sm:text-sm">
                  {f.label}
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="date"
                className="text-xs sm:text-sm"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarIcon className="h-4 w-4 ml-1" />
                تاریخ مشخص
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {(filter === 'date' || showDatePicker) && (
        <div className="flex justify-end">
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            value={date || undefined}
            onChange={(d) => {
              if (d) {
                const key = toEnglishDigits(d.format('YYYY-MM-DD'));
                onDateChange(key);
                onFilterChange('date');
              }
            }}
            inputClass="glass-card px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-foreground w-48 text-center"
            placeholder="انتخاب تاریخ شمسی"
          />
        </div>
      )}
    </div>
  );
}

export default MatchFilters;
