import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SurfaceCardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ title, description, actions, children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface2))] p-6 shadow-[var(--shadow-sm)]',
        className
      )}
    >
      {(title || description || actions) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold text-[hsl(var(--text))]">{title}</h2>}
            {description && <p className="mt-1 text-sm text-[hsl(var(--textMuted))]">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
