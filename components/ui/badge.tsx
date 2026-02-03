import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Priority variants
        high_priority: 'border-transparent bg-red-500 text-white',
        pursue: 'border-transparent bg-amber-500 text-white',
        opportunistic: 'border-transparent bg-blue-500 text-white',
        monitor: 'border-transparent bg-gray-500 text-white',
        passed: 'border-transparent bg-gray-800 text-white',
        // Route variants
        route_1: 'border-transparent bg-purple-500 text-white',
        route_2: 'border-transparent bg-cyan-500 text-white',
        route_3: 'border-transparent bg-pink-500 text-white',
        route_4: 'border-transparent bg-emerald-500 text-white',
        route_5: 'border-transparent bg-orange-500 text-white',
        // Status variants
        rolling: 'border-transparent bg-green-500 text-white',
        fixed: 'border-transparent bg-blue-600 text-white',
        invitation: 'border-transparent bg-purple-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
