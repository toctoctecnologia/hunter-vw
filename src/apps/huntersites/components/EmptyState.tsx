import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, illustration, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--hs-border-subtle)] bg-[var(--hs-surface)] px-8 py-16 text-center',
        className,
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--hs-accent-soft)] text-[var(--hs-accent)]">
        {illustration ?? '✨'}
      </div>
      <h3 className="text-xl font-semibold text-[var(--hs-text-primary)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--hs-text-muted)]">{description}</p>
      {actionLabel && (
        <Button
          onClick={onAction}
          className="mt-6 bg-[var(--hs-accent)] text-[var(--hs-text-inverse)] hover:bg-[var(--hs-accent)]/90"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
