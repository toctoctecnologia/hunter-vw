import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, Download, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TicketCard } from './TicketCard';
import type { Status, Ticket } from '@/types/service-management';
import { cn } from '@/lib/utils';

export type SortOption = 'recent' | 'oldest' | 'priority' | 'sla';

interface TicketColumnProps {
  status: {
    id: Status;
    label: string;
    description: string;
  };
  tickets: Ticket[];
  count: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onToggleCollapse: () => void;
  onExportCSV: () => void;
  isCollapsed: boolean;
  loading: boolean;
  onOpenTicket: (ticket: Ticket, focus?: 'details' | 'comments' | 'schedule' | 'assignee') => void;
  onResolveTicket: (ticket: Ticket) => void;
  onArchiveTicket: (ticket: Ticket) => void;
}

const sortLabel: Record<SortOption, string> = {
  recent: 'Mais recente',
  oldest: 'Mais antigo',
  priority: 'Maior prioridade',
  sla: 'Vencendo SLA primeiro'
};

export const TicketColumn = ({
  status,
  tickets,
  count,
  sortBy,
  onSortChange,
  onToggleCollapse,
  onExportCSV,
  isCollapsed,
  loading,
  onOpenTicket,
  onResolveTicket,
  onArchiveTicket
}: TicketColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status.id}`,
    data: { type: 'column', status: status.id }
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-w-[240px] max-w-[280px] snap-start rounded-2xl border border-border bg-muted/20 p-3 shadow-sm transition',
        isOver && 'border-[hsl(var(--accent))] bg-[hsl(var(--accentSoft))]/20'
      )}
      id={`column-${status.id}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{status.label}</h3>
          <p className="text-xs text-muted-foreground">{status.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ordenar</DropdownMenuLabel>
              {Object.entries(sortLabel).map(([value, label]) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => onSortChange(value as SortOption)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onToggleCollapse}>
                {isCollapsed ? 'Expandir coluna' : 'Colapsar coluna'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isCollapsed ? (
        <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-border bg-card p-4 text-xs text-muted-foreground">
          <ChevronDown className="mr-2 h-4 w-4" />
          Coluna colapsada
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />
            ))
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-4 text-center text-xs text-muted-foreground">
              Nenhum ticket nesta coluna.
            </div>
          ) : (
            <SortableContext items={tickets.map(ticket => ticket.id)} strategy={verticalListSortingStrategy}>
              {tickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpen={onOpenTicket}
                  onResolve={onResolveTicket}
                  onArchive={onArchiveTicket}
                />
              ))}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
};
