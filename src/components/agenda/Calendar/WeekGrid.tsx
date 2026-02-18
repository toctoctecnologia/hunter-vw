import React from 'react';
import { addDays, format, isToday, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/event';
import { HoursRail } from './HoursRail';
import { GAP_X, GAP_Y, MIN_EVENT_HEIGHT, MIN_PX_PER_MIN, MAX_PX_PER_MIN } from './constants';
import { minutesFromMidnight } from '@/utils/time';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface PositionedEvent {
  event: Event;
  style: React.CSSProperties;
}

function layoutDay(events: Event[], pxPerMin: number, gapX: number, gapY: number): PositionedEvent[] {
  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
  const active: { event: Event; lane: number; lanes: number }[] = [];
  const positioned: { event: Event; lane: number; lanes: number }[] = [];

  for (const event of sorted) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].event.end <= event.start) {
        active.splice(i, 1);
      }
    }

    const usedLanes = new Set(active.map(e => e.lane));
    let lane = 0;
    while (usedLanes.has(lane)) lane++;

    const item = { event, lane, lanes: 1 };
    active.push(item);
    const laneCount = Math.max(...active.map(e => e.lane)) + 1;
    active.forEach(e => (e.lanes = laneCount));
    positioned.push(item);
  }

  const dayH = pxPerMin * 60 * 24;
  return positioned.map(item => {
    const startMin = minutesFromMidnight(item.event.start);
    const endMin = minutesFromMidnight(item.event.end);
    const duration = endMin - startMin;

    const top = Math.max(0, Math.round(startMin * pxPerMin) - gapY);
    const height = Math.max(Math.round(duration * pxPerMin), MIN_EVENT_HEIGHT);
    const width = 100 / item.lanes;
    const left = width * item.lane;

    return {
      event: item.event,
      style: {
        top,
        height: Math.min(height, dayH - top - gapY),
        left: `calc(${left}% + ${gapX}px)`,
        width: `calc(${width}% - ${gapX * 2}px)`
      }
    };
  });
}

interface WeekGridProps {
  referenceDate: Date;
  events: Event[];
  onEventClick?: (event: Event) => void;
  showHourLabels?: boolean;
  pxPerMin: number;
  highlightedEventId?: string;
}

export function WeekGrid({
  referenceDate,
  events,
  onEventClick,
  showHourLabels = true,
  pxPerMin,
  highlightedEventId
}: WeekGridProps) {
  const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const clamped = Math.min(Math.max(pxPerMin, MIN_PX_PER_MIN), MAX_PX_PER_MIN);
  const hourHeight = Math.max(60 * clamped, 40);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[4rem_repeat(7,1fr)] gap-2 text-xs uppercase text-muted-foreground">
        <div />
        {days.map(day => (
          <div key={day.toISOString()} className="flex flex-col items-center gap-1">
            <span>{format(day, 'EEE', { locale: ptBR })}</span>
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                isToday(day)
                  ? 'bg-orange-500 text-white'
                  : 'bg-surface text-foreground'
              )}
            >
              {format(day, 'd')}
            </span>
          </div>
        ))}
      </div>

      <div
        className="relative rounded-2xl border border-border bg-surface2"
        style={{
          '--hour-h': `${hourHeight}px`,
          '--event-gap-x': `${GAP_X}px`,
          '--event-gap-y': `${GAP_Y}px`,
          '--event-min-height': `${MIN_EVENT_HEIGHT}px`,
          height: `calc(var(--hour-h) * 24)`
        } as React.CSSProperties}
      >
        <div className={showHourLabels ? 'grid grid-cols-[4rem_repeat(7,1fr)] h-full' : 'grid grid-cols-7 h-full'}>
          {showHourLabels && <HoursRail />}
          {days.map(day => {
            const dayEvents = events.filter(event =>
              format(event.start, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
            );
            const laidOut = layoutDay(dayEvents, clamped, GAP_X, GAP_Y);
            return (
              <div key={day.toISOString()} className="relative border-l border-border/60">
                <div
                  className="grid h-full"
                  style={{ gridTemplateRows: 'repeat(24, var(--hour-h))' }}
                >
                  {HOURS.map(hour => (
                    <div key={hour} className="border-b border-gray-50" />
                  ))}
                </div>
                {isToday(day) && (
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-[hsl(var(--accent))] z-10"
                    style={{
                      top: `${(minutesFromMidnight(new Date()) / 1440) * 100}%`
                    }}
                  >
                    <div className="w-3 h-3 bg-[hsl(var(--accent))] rounded-full -mt-1.5 -ml-1.5" />
                  </div>
                )}
                {laidOut.map(({ event, style }) => (
                  <button
                    key={event.id}
                    className={cn(
                      'event-block',
                      highlightedEventId === event.id && 'ring-2 ring-orange-500 ring-offset-2'
                    )}
                    style={style}
                    onClick={() => onEventClick && onEventClick(event)}
                  >
                    <div className="flex h-full flex-col gap-1 overflow-hidden">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-foreground/80">
                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                      </p>
                      {event.sourceType === 'BillingRule' && (
                        <span className="mt-1 inline-flex w-fit rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                          Cobrança automática
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeekGrid;
