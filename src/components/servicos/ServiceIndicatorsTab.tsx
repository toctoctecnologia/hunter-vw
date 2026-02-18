import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import type { Ticket } from '@/types/service-management';
import { STATUS_CONFIG, getSlaState } from './serviceUtils';
import { differenceInHours, format } from 'date-fns';

interface ServiceIndicatorsTabProps {
  tickets: Ticket[];
}

export const ServiceIndicatorsTab = ({ tickets }: ServiceIndicatorsTabProps) => {
  const statusCounts = useMemo(() => {
    return STATUS_CONFIG.map(status => ({
      status: status.label,
      total: tickets.filter(ticket => ticket.status === status.id).length
    }));
  }, [tickets]);

  const slaStats = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        const state = getSlaState(ticket);
        acc[state] += 1;
        return acc;
      },
      { ok: 0, warning: 0, overdue: 0 }
    );
  }, [tickets]);

  const linkedStats = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        if (ticket.hasTask) acc.tasks += 1;
        if (ticket.hasSchedule) acc.calendar += 1;
        return acc;
      },
      { tasks: 0, calendar: 0 }
    );
  }, [tickets]);

  const avgResolutionHours = useMemo(() => {
    const resolved = tickets.filter(ticket => ticket.status === 'resolvido');
    if (resolved.length === 0) return 0;
    const total = resolved.reduce((acc, ticket) => acc + differenceInHours(new Date(ticket.updatedAt), new Date(ticket.createdAt)), 0);
    return Math.round(total / resolved.length);
  }, [tickets]);

  const byResponsible = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach(ticket => {
      const key = ticket.assigneeName ?? 'Sem responsável';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, total]) => ({ name, total }));
  }, [tickets]);

  const overdueByResponsible = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach(ticket => {
      if (getSlaState(ticket) !== 'overdue') return;
      const key = ticket.assigneeName ?? 'Sem responsável';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, total]) => ({ name, total }));
  }, [tickets]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach(ticket => {
      const key = ticket.category || 'Sem categoria';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, total]) => ({ name, total }));
  }, [tickets]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach(ticket => {
      const key = format(new Date(ticket.createdAt), 'MMM');
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
  }, [tickets]);

  const overdueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    tickets.forEach(ticket => {
      if (getSlaState(ticket) !== 'overdue') return;
      const key = format(new Date(ticket.createdAt), 'MMM');
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total de tickets</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{tickets.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">SLA dentro</p>
          <p className="mt-2 text-2xl font-semibold text-success">{slaStats.ok}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">SLA vencendo</p>
          <p className="mt-2 text-2xl font-semibold text-warning">{slaStats.warning}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">SLA vencido</p>
          <p className="mt-2 text-2xl font-semibold text-danger">{slaStats.overdue}</p>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Tickets com tarefa vinculada</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{linkedStats.tasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Tickets com evento na agenda</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{linkedStats.calendar}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Tempo médio de resolução</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{avgResolutionHours}h</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Total por status</h3>
              <p className="text-xs text-muted-foreground">Distribuição atual dos tickets.</p>
            </div>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground">SLA vencido por responsável</h3>
          <p className="text-xs text-muted-foreground">Atrasos distribuídos pelo time.</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overdueByResponsible} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--danger))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground">Tickets por responsável</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byResponsible} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--info))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground">Tickets por categoria</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground">Evolução mensal</h3>
          <p className="text-xs text-muted-foreground">Tickets criados por mês.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground">Evolução de SLA vencidos</h3>
          <p className="text-xs text-muted-foreground">Histórico mensal de tickets atrasados.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overdueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="hsl(var(--danger))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
