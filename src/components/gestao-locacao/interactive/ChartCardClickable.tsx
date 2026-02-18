import { KeyboardEvent, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartCardClickableProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export const ChartCardClickable = ({
  title,
  icon,
  onClick,
  className,
  children,
}: ChartCardClickableProps) => {
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
};

export default ChartCardClickable;
