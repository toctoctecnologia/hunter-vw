import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'primary';
}

const variantClasses: Record<NonNullable<PillProps['variant']>, string> = {
  default: 'bg-surface3 text-textSecondary',
  success: 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]',
  danger: 'bg-[hsl(var(--danger))] text-[hsl(var(--danger-foreground))]',
  warning: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
  primary: 'bg-[hsl(var(--primary))] text-white',
};

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex h-[var(--h-badge)] items-center rounded-[var(--radius-full)] px-[10px] text-[12px] font-medium',
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Pill.displayName = 'Pill';

export default Pill;
