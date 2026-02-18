'use client';

import { isSameDay, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';

import { CalendarAppointment } from '@/features/dashboard/calendar/types';

import { ScheduleAppointmentCard } from '@/features/dashboard/calendar/components/schedule-appointment-card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface AgendaViewProps {
  selectedDate: Date;
  events: CalendarAppointment[];
  onCreateEvent: (hour: number) => void;
  onEditEvent: (event: CalendarAppointment) => void;
  onDeleteEvent: (eventId: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function ScheduleView({ selectedDate, events, onCreateEvent, onEditEvent, onDeleteEvent }: AgendaViewProps) {
  const { user } = useAuth();
  const dayEvents = events.filter((event) => isSameDay(parseISO(event.appointmentDate), selectedDate));

  const getEventsForHour = (hour: number) => {
    return dayEvents.filter((event) => {
      let eventHour: number;
      if (typeof event.startingTime === 'string') {
        eventHour = parseInt(event.startingTime.split(':')[0], 10);
      } else {
        eventHour = event.startingTime.hour;
      }

      return eventHour === hour;
    });
  };

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="divide-y">
          {HOURS.map((hour) => {
            const hourEvents = getEventsForHour(hour);

            return (
              <div key={hour} className="flex min-h-20 hover:bg-muted/50 transition-colors">
                <div className="w-20 shrink-0 border-r p-3 text-center">
                  <span className="text-sm font-medium text-muted-foreground">{String(hour).padStart(2, '0')}:00</span>
                </div>

                <div className="flex-1 p-3">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hourEvents.map((event) => (
                        <ScheduleAppointmentCard key={event.uuid} event={event} onEdit={onEditEvent} onDelete={onDeleteEvent} />
                      ))}
                    </div>
                  ) : (
                    <>
                      {hasFeature(user?.userInfo.profile.permissions, '1305') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground hover:text-foreground opacity-0 hover:opacity-100 transition-opacity"
                          onClick={() => onCreateEvent(hour)}
                        >
                          <Plus className="mr-2 size-4" />
                          Adicionar compromisso
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
