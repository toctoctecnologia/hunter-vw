import React from 'react';
import { format, isToday } from 'date-fns';
import type { Event } from '@/types/event';
import { HoursRail } from './HoursRail';
import {
  MIN_PX_PER_MIN,
  MAX_PX_PER_MIN,
  GAP_X,
  GAP_Y,
  MIN_EVENT_HEIGHT
} from './constants';
import { minutesFromMidnight } from '@/utils/time';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface PositionedEvent {
  event: Event;
  style: React.CSSProperties;
}

function layoutDay(
  events: Event[],
  pxPerMin: number,
  gapX: number,
  gapY: number
): PositionedEvent[] {
  const sorted = [...events].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );

  const active: { event: Event; lane: number; lanes: number }[] = [];
  const positioned: {
    event: Event;
    lane: number;
    lanes: number;
    consecutive: boolean;
  }[] = [];
  const lastEndByLane = new Map<number, number>();

  for (const event of sorted) {
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].event.end <= event.start) {
        active.splice(i, 1);
      }
    }

    const usedLanes = new Set(active.map(e => e.lane));
    let lane = 0;
    while (usedLanes.has(lane)) lane++;

    const isConsecutive =
      lastEndByLane.get(lane) === event.start.getTime();

    const item = { event, lane, lanes: 1, consecutive: isConsecutive };
    active.push(item);

    const laneCount = Math.max(...active.map(e => e.lane)) + 1;
    active.forEach(e => (e.lanes = laneCount));

    positioned.push(item);
    lastEndByLane.set(lane, event.end.getTime());
  }

  const laneBottom = new Map<number, number>();

  const dayH = pxPerMin * 60 * 24;

  return positioned.map(item => {
    const startMin = minutesFromMidnight(item.event.start);
    const endMin = minutesFromMidnight(item.event.end);
    const duration = endMin - startMin;

    const baseTop = Math.round(startMin * pxPerMin);
    let top = Math.max(0, baseTop - gapY);
    let height = Math.round(duration * pxPerMin);
    if (height < MIN_EVENT_HEIGHT) height = MIN_EVENT_HEIGHT;

    const lastBottom = laneBottom.get(item.lane) ?? 0;
    if (top < lastBottom + gapY) {
      top = lastBottom + gapY;
    }
    top = Math.min(top, dayH - gapY);
    height = Math.min(height, dayH - top - gapY);

    laneBottom.set(item.lane, top + height);

    const width = 100 / item.lanes;
    const left = width * item.lane;

    return {
      event: item.event,
      style: {
        top,
        height,
        left: `calc(${left}% + ${gapX}px)`,
        width: `calc(${width}% - ${gapX * 2}px)`
      } as React.CSSProperties
    };
  });
}

interface DayGridProps {
  dateISO: string;
  events: Event[];
  onHourClick?: (hour: number) => void;
  onEventClick?: (event: Event) => void;
  showHourLabels?: boolean;
  pxPerMin: number;
  highlightedEventId?: string;
}

export function DayGrid({
  dateISO,
  events,
  onHourClick,
  onEventClick,
  showHourLabels = true,
  pxPerMin,
  highlightedEventId
}: DayGridProps) {
  const date = new Date(dateISO);
  const clamped = Math.min(Math.max(pxPerMin, MIN_PX_PER_MIN), MAX_PX_PER_MIN);
  const hourHeight = Math.max(60 * clamped, 40);
  const laidOut = layoutDay(events, clamped, GAP_X, GAP_Y);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        '--hour-h': `${hourHeight}px`,
        '--event-gap-x': `${GAP_X}px`,
        '--event-gap-y': `${GAP_Y}px`,
        '--event-min-height': `${MIN_EVENT_HEIGHT}px`,
        height: `calc(var(--hour-h) * 24)`
      } as React.CSSProperties}
    >
      <div className={showHourLabels ? 'grid grid-cols-[4rem_1fr] h-full' : 'h-full'}>
        {showHourLabels && <HoursRail />}
        <div className="relative h-full">
          <div
            className="grid h-full"
            style={{ gridTemplateRows: 'repeat(24, var(--hour-h))' }}
          >
            {HOURS.map(hour => (
              <button
                key={hour}
                onClick={() => onHourClick && onHourClick(hour)}
                className="w-full border-b border-gray-50 hover:bg-gray-50 transition-colors"
              />
            ))}
          </div>

          {isToday(date) && (
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
              className={`event-block ${highlightedEventId === event.id ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
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
                {event.location && <p className="text-xs text-foreground/80 line-clamp-1">{event.location}</p>}
                {(event.leadName || (event as any).lead?.name) && (
                  <p className="text-[11px] text-gray-600 line-clamp-2">
                    {event.leadName || (event as any).lead?.name}
                    {event.leadSummary && ` · ${event.leadSummary}`}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DayGrid;
