import { KeyboardEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KpiCardClickableProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  tone?: string;
  iconBg?: string;
  onClick?: () => void;
  className?: string;
}

export const KpiCardClickable = ({
  title,
  value,
  description,
  icon: Icon,
  tone = 'text-[var(--ui-text)]',
  iconBg = 'bg-[var(--ui-stroke)]/40',
  onClick,
  className,
}: KpiCardClickableProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ui-text-subtle)]">{title}</p>
            <p className="text-2xl font-bold text-[var(--ui-text)] mt-1">{value}</p>
            {description && (
              <p className="text-xs text-[var(--ui-text-subtle)] mt-1">{description}</p>
            )}
          </div>
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', iconBg)}>
            <Icon className={cn('w-6 h-6', tone)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCardClickable;
