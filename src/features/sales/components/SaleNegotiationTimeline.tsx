'use client';
import type { SaleNegotiationEvent } from '../types';

interface Props {
  events: SaleNegotiationEvent[];
}

export default function SaleNegotiationTimeline({ events }: Props) {
  if (!events?.length) return null;
  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Linha do tempo da negociação</h3>
      <ol className="space-y-4 border-l pl-4">
        {events.map((event, idx) => (
          <li key={idx} className="relative">
            <span className="absolute -left-2 top-1 w-3 h-3 rounded-full bg-primary" />
            <div className="text-sm text-muted-foreground">
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </div>
            {event.actor && (
              <div className="text-sm font-medium">{event.actor}</div>
            )}
            <div>{event.description}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
