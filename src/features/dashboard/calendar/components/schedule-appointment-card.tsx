'use client';

import { Clock, MoreVertical, Trash2, Edit2 } from 'lucide-react';

import { cn, timeToString } from '@/shared/lib/utils';

import { CalendarAppointment } from '@/features/dashboard/calendar/types';

import { Button } from '@/shared/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface ScheduleAppointmentCardProps {
  event: CalendarAppointment;
  onEdit: (event: CalendarAppointment) => void;
  onDelete: (eventId: string) => void;
}

export function ScheduleAppointmentCard({ event, onEdit, onDelete }: ScheduleAppointmentCardProps) {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        'group relative rounded-lg border-l-4 p-3 shadow-sm transition-all hover:shadow-md',
        'bg-card text-card-foreground',
      )}
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{event.title}</h3>
          {event.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>}
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>
              {timeToString(event.startingTime)} - {timeToString(event.endingTime)}
            </span>
          </div>
        </div>

        {hasFeature(user?.userInfo.profile.permissions, '1306') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="size-4" />
                <span className="sr-only">Opções</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit2 className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(event.uuid)} className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
