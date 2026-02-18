import { Badge } from '@/components/ui/badge';
import type { Availability } from '@/features/properties/types';
import { cn } from '@/lib/utils';

type AvailabilityConfig = {
  text: string;
  className: string;
  dotClassName: string;
};

const availabilityConfig: Record<Availability, AvailabilityConfig> = {
  'Disponível': {
    text: 'Disponível',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    dotClassName: 'bg-emerald-500',
  },
  'Disponível no site': {
    text: 'Disponível no site',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    dotClassName: 'bg-emerald-500',
  },
  'Disponível interno': {
    text: 'Disponível interno',
    className: 'bg-amber-50 text-amber-700 border-amber-200/70',
    dotClassName: 'bg-amber-500',
  },
  'Vago/Disponível': {
    text: 'Vago/Disponível',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    dotClassName: 'bg-emerald-500',
  },
  'Indisponível': {
    text: 'Indisponível',
    className: 'bg-rose-50 text-rose-700 border-rose-200/70',
    dotClassName: 'bg-rose-500',
  },
  Vendido: {
    text: 'Vendido',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
    dotClassName: 'bg-indigo-500',
  },
  Reservado: {
    text: 'Reservado',
    className: 'bg-slate-50 text-slate-700 border-slate-200/70',
    dotClassName: 'bg-slate-400',
  },
};

export interface AvailabilityBadgeProps {
  value?: Availability | string;
  className?: string;
}

export function AvailabilityBadge({ value, className }: AvailabilityBadgeProps) {
  const config: AvailabilityConfig =
    (value ? availabilityConfig[value as Availability] : undefined) ?? {
      text: value ?? 'Status desconhecido',
      className: 'bg-slate-50 text-slate-700 border-slate-200/70',
      dotClassName: 'bg-slate-400',
    };

  return (
    <Badge
      className={cn(
        'flex items-center gap-2 border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm',
        config.className,
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', config.dotClassName)} />
      <span>{config.text}</span>
    </Badge>
  );
}

export default AvailabilityBadge;
