import { useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Filter, Plus, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Ticket, TicketFilters, Status } from '@/types/service-management';
import { ORIGIN_LABELS, PRIORITY_LABELS, PRIORITY_ORDER, STATUS_CONFIG } from './serviceUtils';
import { getSlaDeadline } from '@/services/serviceTickets';
import { cn } from '@/lib/utils';
import { TicketColumn, type SortOption } from './TicketColumn';

interface TicketBoardProps {
  tickets: Ticket[];
  filteredTickets: Ticket[];
  loading: boolean;
  error?: string | null;
  filters: TicketFilters;
  onFiltersChange: (filters: TicketFilters) => void;
  onOpenTicket: (ticket: Ticket, focus?: 'details' | 'comments' | 'schedule' | 'assignee') => void;
  onCreateTicket: () => void;
  onMoveTicket: (ticketId: string, status: Status) => void;
  onResolveTicket: (ticket: Ticket) => void;
  onArchiveTicket: (ticket: Ticket) => void;
  onRetry: () => void;
}

export const TicketBoard = ({
  tickets,
  filteredTickets,
  loading,
  error,
  filters,
  onFiltersChange,
  onOpenTicket,
  onCreateTicket,
  onMoveTicket,
  onResolveTicket,
  onArchiveTicket,
  onRetry
}: TicketBoardProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [collapsedColumns, setCollapsedColumns] = useState<Set<Status>>(new Set());
  const [columnSort, setColumnSort] = useState<Record<Status, SortOption>>({
    pendente: 'recent',
    orcamento: 'recent',
    em_andamento: 'recent',
    resolvido: 'recent',
    arquivado: 'recent'
  });

  const statusCounts = useMemo(() => {
    return STATUS_CONFIG.reduce<Record<Status, number>>((acc, status) => {
      acc[status.id] = filteredTickets.filter(ticket => ticket.status === status.id).length;
      return acc;
    }, {
      pendente: 0,
      orcamento: 0,
      em_andamento: 0,
      resolvido: 0,
      arquivado: 0
    });
  }, [filteredTickets]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const activeTicket = tickets.find(ticket => ticket.id === activeId);
    if (!activeTicket) return;

    let newStatus: Status | undefined;

    if (typeof over.id === 'string' && over.id.startsWith('column-')) {
      newStatus = over.id.replace('column-', '') as Status;
    } else {
      const overTicket = tickets.find(ticket => ticket.id === over.id);
      newStatus = overTicket?.status;
    }

    if (newStatus && newStatus !== activeTicket.status) {
      onMoveTicket(activeTicket.id, newStatus);
    }
  };

  const handleExportCSV = (status: Status) => {
    const columnTickets = filteredTickets.filter(ticket => ticket.status === status);
    const headers = ['Código', 'Título', 'Cliente', 'Categoria', 'Prioridade', 'Responsável', 'Criado em'];
    const rows = columnTickets.map(ticket => [
      ticket.code,
      ticket.title,
      ticket.clientName ?? '',
      ticket.category,
      PRIORITY_LABELS[ticket.priority],
      ticket.assigneeName ?? '',
      new Date(ticket.createdAt).toLocaleDateString('pt-BR')
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tickets-${status}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterOptions = useMemo(() => {
    const responsible = Array.from(new Set(tickets.map(ticket => ticket.assigneeName).filter(Boolean))) as string[];
    const categories = Array.from(new Set(tickets.map(ticket => ticket.category).filter(Boolean)));

    return { responsible, categories };
  }, [tickets]);

  const renderFilters = (compact?: boolean) => (
    <div className={cn('flex flex-wrap items-center gap-3', compact && 'flex-col items-stretch')}>
      <div className={cn('relative flex-1 min-w-[200px]', compact && 'w-full')}>
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, código, cliente ou tag"
          className="pl-9"
          value={filters.search}
          onChange={event => onFiltersChange({ ...filters, search: event.target.value })}
        />
      </div>
      <div className={cn('flex items-center gap-2', compact && 'flex-col items-stretch')}>
        <Input
          type="date"
          className={cn('min-w-[160px]', compact && 'w-full')}
          value={filters.periodFrom ?? ''}
          onChange={event => onFiltersChange({ ...filters, periodFrom: event.target.value })}
        />
        <Input
          type="date"
          className={cn('min-w-[160px]', compact && 'w-full')}
          value={filters.periodTo ?? ''}
          onChange={event => onFiltersChange({ ...filters, periodTo: event.target.value })}
        />
      </div>
      <Select
        value={filters.responsible ?? 'todos'}
        onValueChange={value => onFiltersChange({ ...filters, responsible: value === 'todos' ? undefined : value })}
      >
        <SelectTrigger className={cn('min-w-[160px]', compact && 'w-full')}>
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Responsável</SelectItem>
          {filterOptions.responsible.map(name => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.priority ?? 'todas'}
        onValueChange={value => onFiltersChange({ ...filters, priority: value === 'todas' ? 'todas' : (value as Ticket['priority']) })}
      >
        <SelectTrigger className={cn('min-w-[150px]', compact && 'w-full')}>
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Prioridade</SelectItem>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.category ?? 'todas'}
        onValueChange={value => onFiltersChange({ ...filters, category: value === 'todas' ? undefined : value })}
      >
        <SelectTrigger className={cn('min-w-[150px]', compact && 'w-full')}>
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Categoria</SelectItem>
          {filterOptions.categories.map(category => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.origin ?? 'todas'}
        onValueChange={value => onFiltersChange({ ...filters, origin: value === 'todas' ? 'todas' : (value as Ticket['origin']) })}
      >
        <SelectTrigger className={cn('min-w-[150px]', compact && 'w-full')}>
        <SelectValue placeholder="Origem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Origem</SelectItem>
          {Object.entries(ORIGIN_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Cliente"
        className={cn('min-w-[160px]', compact && 'w-full')}
        value={filters.client ?? ''}
        onChange={event => onFiltersChange({ ...filters, client: event.target.value })}
      />
      <Select
        value={filters.status ?? 'todas'}
        onValueChange={value => onFiltersChange({ ...filters, status: value === 'todas' ? 'todas' : (value as Status) })}
      >
        <SelectTrigger className={cn('min-w-[150px]', compact && 'w-full')}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Status</SelectItem>
          {STATUS_CONFIG.map(status => (
            <SelectItem key={status.id} value={status.id}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onFiltersChange({
            search: '',
            periodFrom: undefined,
            periodTo: undefined,
            responsible: undefined,
            priority: 'todas',
            category: undefined,
            origin: 'todas',
            client: undefined,
            status: 'todas'
          })
        }
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Limpar filtros
      </Button>
    </div>
  );

  const sortedTicketsByStatus = (status: Status) => {
    const columnTickets = filteredTickets.filter(ticket => ticket.status === status);
    const sortBy = columnSort[status];

    return [...columnTickets].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      }
      if (sortBy === 'sla') {
        return getSlaDeadline(a).getTime() - getSlaDeadline(b).getTime();
      }
      return 0;
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
              <p className="text-xs text-muted-foreground">Refine a visão do quadro e indicadores.</p>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{renderFilters(true)}</div>
                </SheetContent>
              </Sheet>
              <Button
                type="button"
                onClick={onCreateTicket}
                className="bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo ticket
              </Button>
            </div>
          </div>
          <div className="hidden md:flex">{renderFilters()}</div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-dashed border-danger/40 bg-danger/5 p-6 text-center">
          <p className="text-sm text-danger">{error}</p>
          <Button variant="outline" className="mt-3" onClick={onRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-[repeat(5,minmax(220px,1fr))] md:gap-4 md:overflow-visible lg:grid-cols-[repeat(5,minmax(240px,1fr))]">
          {STATUS_CONFIG.map(status => {
            const isCollapsed = collapsedColumns.has(status.id);
            const sortedTickets = sortedTicketsByStatus(status.id);

            return (
              <TicketColumn
                key={status.id}
                status={status}
                tickets={sortedTickets}
                count={statusCounts[status.id]}
                sortBy={columnSort[status.id]}
                onSortChange={value => setColumnSort(prev => ({ ...prev, [status.id]: value }))}
                onToggleCollapse={() =>
                  setCollapsedColumns(prev => {
                    const next = new Set(prev);
                    if (next.has(status.id)) {
                      next.delete(status.id);
                    } else {
                      next.add(status.id);
                    }
                    return next;
                  })
                }
                onExportCSV={() => handleExportCSV(status.id)}
                isCollapsed={isCollapsed}
                loading={loading}
                onOpenTicket={onOpenTicket}
                onResolveTicket={onResolveTicket}
                onArchiveTicket={onArchiveTicket}
              />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};
