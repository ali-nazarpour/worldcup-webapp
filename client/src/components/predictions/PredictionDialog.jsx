import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubmitPrediction } from '@/hooks/usePrediction';
import { toast } from '@/components/ui/use-toast';
import { toPersianDigits } from '@/lib/persianDigits';

const schema = z.object({
  firstName: z.string().min(1, 'نام الزامی است.'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است.'),
  phoneNumber: z.string().min(11, 'شماره تماس معتبر وارد کنید.'),
  predictedHomeScore: z.coerce.number().int().min(0, 'تعداد گل باید عدد صحیح و مثبت یا صفر باشد.'),
  predictedAwayScore: z.coerce.number().int().min(0, 'تعداد گل باید عدد صحیح و مثبت یا صفر باشد.'),
});

export function PredictionDialog({ match, open, onOpenChange }) {
  const [success, setSuccess] = useState(null);
  const { mutateAsync, isPending } = useSubmitPrediction();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { predictedHomeScore: 0, predictedAwayScore: 0 },
  });

  const onSubmit = async (data) => {
    try {
      const result = await mutateAsync({ ...data, matchId: match._id });
      setSuccess(result.data.data);
      toast({ title: 'پیش‌بینی ثبت شد', description: 'کد پیگیری خود را ذخیره کنید.', variant: 'success' });
    } catch (error) {
      toast({ title: 'خطا', description: error.message, variant: 'destructive' });
    }
  };

  const handleClose = (v) => {
    if (!v) { setSuccess(null); reset(); }
    onOpenChange(v);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(success.trackingCode);
    toast({ title: 'کپی شد', description: 'کد پیگیری در کلیپ‌بورد ذخیره شد.' });
  };

  if (!match) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-16 w-16 text-pitch-400 mx-auto" />
            <DialogTitle>پیش‌بینی با موفقیت ثبت شد!</DialogTitle>
            <DialogDescription>
              کد پیگیری خود را حتماً ذخیره کنید. بدون این کد امکان پیگیری وجود ندارد.
            </DialogDescription>
            <div className="glass-card p-4 space-y-2">
              <p className="text-sm text-muted-foreground">کد پیگیری</p>
              <p className="text-3xl font-black tracking-widest text-pitch-400">{success.trackingCode}</p>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="h-4 w-4 ml-2" />
                کپی کد پیگیری
              </Button>
            </div>
            <p className="text-sm">
              پیش‌بینی شما: {match.homeTeam?.name} {toPersianDigits(success.prediction.predictedHomeScore)} - {toPersianDigits(success.prediction.predictedAwayScore)} {match.awayTeam?.name}
            </p>
            <Button onClick={() => handleClose(false)} className="w-full">بستن</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>پیش‌بینی نتیجه مسابقه</DialogTitle>
              <DialogDescription>
                {match.homeTeam?.name} در مقابل {match.awayTeam?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">نام</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="phoneNumber">شماره تماس</Label>
                <Input id="phoneNumber" placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" className="text-left" {...register('phoneNumber')} />
                {errors.phoneNumber && <p className="text-xs text-red-400 mt-1">{errors.phoneNumber.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>گل {match.homeTeam?.name}</Label>
                  <Input type="number" min="0" dir="ltr" className="text-center text-lg font-bold" {...register('predictedHomeScore')} />
                  {errors.predictedHomeScore && <p className="text-xs text-red-400 mt-1">{errors.predictedHomeScore.message}</p>}
                </div>
                <div>
                  <Label>گل {match.awayTeam?.name}</Label>
                  <Input type="number" min="0" dir="ltr" className="text-center text-lg font-bold" {...register('predictedAwayScore')} />
                  {errors.predictedAwayScore && <p className="text-xs text-red-400 mt-1">{errors.predictedAwayScore.message}</p>}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'در حال ثبت...' : 'ثبت پیش‌بینی'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PredictionDialog;
