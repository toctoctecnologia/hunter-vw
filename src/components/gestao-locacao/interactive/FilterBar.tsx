import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const FilterBar = ({ title, actions, children, className }: FilterBarProps) => (
  <div
    className={cn(
      'rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-card)] shadow-[var(--shadow-sm)] px-5 py-4',
      className
    )}
  >
    {(title || actions) && (
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {title && <h2 className="text-sm font-semibold text-[var(--ui-text)]">{title}</h2>}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="flex flex-wrap gap-4">{children}</div>
  </div>
);

export default FilterBar;
