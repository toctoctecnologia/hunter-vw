import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { HunterSitesStat } from '../data/demo';

interface StatCardProps {
  stat: HunterSitesStat;
}

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
} as const;

const trendColor: Record<NonNullable<HunterSitesStat['trend']>, string> = {
  up: 'text-[var(--hs-success)]',
  down: 'text-[var(--hs-danger)]',
  neutral: 'text-[var(--hs-text-muted)]',
};

export function StatCard({ stat }: StatCardProps) {
  const Icon = stat.trend ? trendIcon[stat.trend] : Minus;
  const iconClass = stat.trend ? trendColor[stat.trend] : trendColor.neutral;

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--hs-border-subtle)] bg-[var(--hs-card)] p-6 shadow-[var(--hs-shadow-sm)]">
      <span className="text-sm font-medium text-[var(--hs-text-muted)]">{stat.label}</span>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-3xl font-semibold text-[var(--hs-text-primary)]">{stat.value}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[var(--hs-accent-soft)] ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {stat.helper && <span className="mt-3 text-sm text-[var(--hs-text-muted)]">{stat.helper}</span>}
    </div>
  );
}
