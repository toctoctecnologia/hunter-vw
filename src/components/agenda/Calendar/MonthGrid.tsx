import React from 'react';
import { addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/event';
import { cn } from '@/lib/utils';

interface MonthGridProps {
  referenceDate: Date;
  events: Event[];
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  highlightedEventId?: string;
}

export function MonthGrid({
  referenceDate,
  events,
  selectedDate,
  onDateChange,
  onEventClick,
  highlightedEventId
}: MonthGridProps) {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);
  const start = startOfWeek(monthStart, { weekStartsOn: 1 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: Date[] = [];

  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  const dayEvents = (day: Date) =>
    events.filter(event => isSameDay(event.start, day));

  return (
    <div className="rounded-2xl border border-border bg-surface2">
      <div className="grid grid-cols-7 gap-px border-b border-border bg-border text-xs uppercase text-muted-foreground">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(label => (
          <div key={label} className="bg-surface2 px-3 py-2 text-center font-semibold">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const eventsForDay = dayEvents(day);
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-[120px] bg-surface2 px-2 py-2 text-sm',
                !isCurrentMonth && 'text-muted-foreground/60',
                isSelected && 'ring-2 ring-orange-500 ring-inset'
              )}
            >
              <button
                type="button"
                onClick={() => onDateChange && onDateChange(day)}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                  isToday(day) ? 'bg-orange-500 text-white' : 'hover:bg-surface'
                )}
              >
                {format(day, 'd', { locale: ptBR })}
              </button>
              <div className="mt-2 space-y-1">
                {eventsForDay.slice(0, 3).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick && onEventClick(event)}
                    className={cn(
                      'flex w-full flex-col rounded-lg bg-surface px-2 py-1 text-left text-[11px] text-foreground shadow-sm transition hover:bg-orange-50',
                      highlightedEventId === event.id && 'ring-1 ring-orange-500'
                    )}
                  >
                    <span className="font-semibold">
                      {format(event.start, 'HH:mm')} · {event.title}
                    </span>
                    {event.sourceType === 'BillingRule' && (
                      <span className="text-[10px] text-orange-600">Cobrança automática</span>
                    )}
                  </button>
                ))}
                {eventsForDay.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{eventsForDay.length - 3} eventos
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthGrid;
