import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trophy, Medal, Search, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTrackPrediction } from '@/hooks/usePrediction';
import { toast } from '@/components/ui/use-toast';
import { PREDICTION_STATUS_LABELS, formatJalaliDateTime } from '@/lib/jalali';
import { toPersianDigits } from '@/lib/persianDigits';

export function PredictionTracking() {
  const [result, setResult] = useState(null);
  const { mutateAsync, isPending } = useTrackPrediction();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await mutateAsync(data);
      setResult(res.data.data);
    } catch (error) {
      toast({ title: 'خطا', description: error.message, variant: 'destructive' });
      setResult(null);
    }
  };

  const match = result?.matchId;
  const isCorrect = result?.status === 'CORRECT';
  const isIncorrect = result?.status === 'INCORRECT';
  const isPendingMatch = result?.status === 'PENDING';

  return (
    <section id="tracking" className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">پیگیری پیش‌بینی</h2>
          <p className="text-muted-foreground">با شماره تماس و کد پیگیری، وضعیت پیش‌بینی خود را بررسی کنید.</p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="trackPhone">شماره تماس</Label>
                <Input id="trackPhone" placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" className="text-left" {...register('phoneNumber', { required: true })} />
              </div>
              <div>
                <Label htmlFor="trackCode">کد پیگیری</Label>
                <Input id="trackCode" placeholder="ABC12345" dir="ltr" className="text-left uppercase" {...register('trackingCode', { required: true })} />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                <Search className="h-4 w-4 ml-2" />
                {isPending ? 'در حال جستجو...' : 'پیگیری پیش‌بینی'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && match && (
          <Card className={`mt-6 overflow-hidden ${isCorrect ? 'border-amber-500/50 animate-confetti' : ''}`}>
            {isCorrect && <div className="h-1 bg-gradient-to-l from-amber-400 via-yellow-300 to-amber-500" />}
            <CardHeader className="text-center">
              {isCorrect && <Medal className="h-12 w-12 text-amber-400 mx-auto mb-2 animate-pulse-glow" />}
              {isIncorrect && <XCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />}
              {isPendingMatch && <Trophy className="h-12 w-12 text-pitch-400 mx-auto mb-2" />}
              <CardTitle>{PREDICTION_STATUS_LABELS[result.status]}</CardTitle>
              <Badge variant={isCorrect ? 'correct' : isIncorrect ? 'destructive' : 'upcoming'}>
                {PREDICTION_STATUS_LABELS[result.status]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg font-semibold">
                {match.homeTeam?.name} در مقابل {match.awayTeam?.name}
              </p>
              <p className="text-sm text-muted-foreground">{formatJalaliDateTime(match.utcDate)}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">پیش‌بینی شما</p>
                  <p className="text-2xl font-black text-pitch-400">
                    {toPersianDigits(result.predictedHomeScore)} - {toPersianDigits(result.predictedAwayScore)}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">نتیجه واقعی</p>
                  <p className="text-2xl font-black">
                    {result.actualHomeScore !== undefined && result.actualHomeScore !== null
                      ? `${toPersianDigits(result.actualHomeScore)} - ${toPersianDigits(result.actualAwayScore)}`
                      : '—'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {result.firstName} {result.lastName} | کد: {result.trackingCode}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

export default PredictionTracking;
