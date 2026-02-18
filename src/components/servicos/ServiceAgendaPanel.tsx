import { useEffect, useState } from 'react';
import { CalendarClock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CalendarEvent, Ticket } from '@/types/service-management';
import { listCalendarEvents, listTickets } from '@/services/serviceTickets';
import { toast } from '@/hooks/use-toast';

export const ServiceAgendaPanel = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, ticketData] = await Promise.all([listCalendarEvents(), listTickets()]);
      setEvents(eventsData);
      setTickets(ticketData);
    } catch (err) {
      toast({
        title: 'Erro ao carregar agenda de serviços',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Agenda de serviços</h2>
          <p className="text-sm text-muted-foreground">Eventos derivados de tickets com agendamento.</p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-3">
          {loading ? (
            <div className="h-24 animate-pulse rounded-xl border border-border bg-muted" />
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento agendado.</p>
          ) : (
            events.map(event => {
              const ticket = tickets.find(item => item.id === event.ticketId);
              return (
                <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-[hsl(var(--accent))]" />
                      <p className="text-sm font-semibold">{event.title}</p>
                      {ticket ? <Badge variant="secondary">{ticket.code}</Badge> : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startAt).toLocaleString('pt-BR')} · {new Date(event.endAt).toLocaleString('pt-BR')}
                    </p>
                    {event.location ? (
                      <p className="text-xs text-muted-foreground">Local: {event.location}</p>
                    ) : null}
                  </div>
                  <Badge variant="outline">{ticket?.assigneeName ?? 'Sem responsável'}</Badge>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};
