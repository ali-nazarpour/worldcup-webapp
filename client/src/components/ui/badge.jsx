import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-pitch-500/20 text-pitch-300',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-red-500/20 text-red-300',
        outline: 'text-foreground border-white/20',
        live: 'border-transparent bg-red-500/30 text-red-300 animate-pulse',
        finished: 'border-transparent bg-blue-500/20 text-blue-300',
        correct: 'border-transparent bg-amber-500/30 text-amber-300',
        upcoming: 'border-transparent bg-pitch-500/20 text-pitch-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
