import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertTriangle, Archive, Calendar, CheckCircle2, Clock, MessageSquare, Pencil, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Ticket } from '@/types/service-management';
import { PRIORITY_LABELS, getSlaLabel, getSlaState, formatHoursRemaining } from './serviceUtils';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  onOpen: (ticket: Ticket, focus?: 'details' | 'comments' | 'schedule' | 'assignee') => void;
  onResolve: (ticket: Ticket) => void;
  onArchive: (ticket: Ticket) => void;
}

export const TicketCard = ({ ticket, onOpen, onResolve, onArchive }: TicketCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: {
      type: 'ticket',
      status: ticket.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const slaState = getSlaState(ticket);

  const priorityTone = useMemo(() => {
    if (ticket.priority === 'urgente') return 'bg-danger/10 text-danger border-danger/30';
    if (ticket.priority === 'alta') return 'bg-warning/10 text-warning border-warning/30';
    if (ticket.priority === 'media') return 'bg-info/10 text-info border-info/30';
    return 'bg-muted text-muted-foreground border-border';
  }, [ticket.priority]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md cursor-pointer focus-within:ring-2 focus-within:ring-ring',
        isDragging && 'opacity-60'
      )}
      onClick={() => onOpen(ticket)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted-foreground">{ticket.code}</span>
        <Badge className={cn('border px-2 py-1 text-xs font-semibold', priorityTone)}>{PRIORITY_LABELS[ticket.priority]}</Badge>
      </div>

      <h3 className="mt-2 text-sm font-semibold text-foreground">{ticket.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{ticket.category}</p>

      {ticket.clientName ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <UserPlus className="h-3.5 w-3.5" />
          <span>{ticket.clientName}</span>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            'flex items-center gap-1 border text-[11px]',
            slaState === 'ok' && 'border-success/30 bg-success/10 text-success',
            slaState === 'warning' && 'border-warning/30 bg-warning/10 text-warning',
            slaState === 'overdue' && 'border-danger/30 bg-danger/10 text-danger'
          )}
        >
          <Clock className="h-3 w-3" />
          {getSlaLabel(ticket)} · {formatHoursRemaining(ticket)}
          {slaState !== 'ok' ? <AlertTriangle className="h-3 w-3" /> : null}
        </Badge>
        <Badge variant="secondary" className="text-[11px]">
          <Calendar className="mr-1 h-3 w-3" />
          {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
        </Badge>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ticket.hasTask ? (
          <Badge variant="secondary" className="text-[11px]">
            Task vinculada
          </Badge>
        ) : null}
        {ticket.hasSchedule ? (
          <Badge variant="secondary" className="text-[11px]">
            Agenda vinculada
          </Badge>
        ) : null}
      </div>

      {ticket.tags && ticket.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {ticket.tags.map(tag => (
            <span key={tag} className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={ticket.assigneeName ?? 'Sem responsável'} />
            <AvatarFallback>{ticket.assigneeName?.slice(0, 2).toUpperCase() ?? 'NA'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium text-foreground">{ticket.assigneeName ?? 'Sem responsável'}</p>
            <p className="text-[11px] text-muted-foreground">Atualizado {new Date(ticket.updatedAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={event => {
              event.stopPropagation();
              onOpen(ticket, 'comments');
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={event => {
              event.stopPropagation();
              onOpen(ticket, 'assignee');
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={event => {
              event.stopPropagation();
              onOpen(ticket, 'schedule');
            }}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={event => {
              event.stopPropagation();
              onResolve(ticket);
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={event => {
              event.stopPropagation();
              onArchive(ticket);
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
