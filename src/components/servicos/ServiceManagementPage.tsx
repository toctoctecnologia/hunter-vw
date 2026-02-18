import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CreateTicketInput, Ticket, TicketFilters, UpdateTicketInput, User } from '@/types/service-management';
import {
  listTickets,
  createTicket,
  moveTicketStatus,
  updateTicket,
  addTicketComment,
  uploadTicketAttachment,
  resolveTicket,
  archiveTicket,
  reopenTicket
} from '@/services/serviceTickets';
import { TicketBoard } from './TicketBoard';
import { ServiceIndicatorsTab } from './ServiceIndicatorsTab';
import { TicketDrawer } from './TicketDrawer';
import { TicketCreateModal } from './TicketCreateModal';
import { SyncAuditPanel } from './SyncAuditPanel';
import { STATUS_CONFIG, getSlaState } from './serviceUtils';
import { toast } from '@/hooks/use-toast';

const initialFilters: TicketFilters = {
  search: '',
  periodFrom: undefined,
  periodTo: undefined,
  responsible: undefined,
  priority: 'todas',
  category: undefined,
  origin: 'todas',
  client: undefined,
  status: 'todas'
};

interface ServiceManagementPageProps {
  users: User[];
}

export const ServiceManagementPage = ({ users }: ServiceManagementPageProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>(initialFilters);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [drawerFocus, setDrawerFocus] = useState<'details' | 'comments' | 'schedule' | 'assignee'>('details');

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!activeTicket) return;
    const updated = tickets.find(ticket => ticket.id === activeTicket.id);
    if (updated) {
      setActiveTicket(updated);
    }
  }, [tickets, activeTicket]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = filters.search
        ? [ticket.title, ticket.code, ticket.clientName, ticket.tags?.join(' ')]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        : true;

      const createdAt = new Date(ticket.createdAt);
      const matchesPeriodFrom = filters.periodFrom ? createdAt >= new Date(filters.periodFrom) : true;
      const matchesPeriodTo = filters.periodTo ? createdAt <= new Date(filters.periodTo) : true;

      const matchesResponsible = filters.responsible ? ticket.assigneeName === filters.responsible : true;

      const matchesPriority = filters.priority && filters.priority !== 'todas'
        ? ticket.priority === filters.priority
        : true;

      const matchesCategory = filters.category ? ticket.category === filters.category : true;

      const matchesOrigin = filters.origin && filters.origin !== 'todas'
        ? ticket.origin === filters.origin
        : true;

      const matchesClient = filters.client
        ? ticket.clientName?.toLowerCase().includes(filters.client.toLowerCase())
        : true;

      const matchesStatus = filters.status && filters.status !== 'todas'
        ? ticket.status === filters.status
        : true;

      return (
        matchesSearch &&
        matchesPeriodFrom &&
        matchesPeriodTo &&
        matchesResponsible &&
        matchesPriority &&
        matchesCategory &&
        matchesOrigin &&
        matchesClient &&
        matchesStatus
      );
    });
  }, [tickets, filters]);

  const slaAlerts = useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        const state = getSlaState(ticket);
        if (state === 'warning') acc.warning += 1;
        if (state === 'overdue') acc.overdue += 1;
        return acc;
      },
      { warning: 0, overdue: 0 }
    );
  }, [tickets]);

  const handleCreateTicket = async (payload: CreateTicketInput, files: File[]) => {
    try {
      const ticket = await createTicket(payload);
      setTickets(prev => [ticket, ...prev]);
      if (files.length) {
        await uploadTicketAttachment(ticket.id, files);
      }
      toast({
        title: 'Ticket criado com sucesso',
        description: `O ticket ${ticket.code} foi adicionado à coluna Pendente.`
      });
      setCreateOpen(false);
    } catch (err) {
      toast({
        title: 'Erro ao criar ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleMoveTicket = async (ticketId: string, status: Ticket['status']) => {
    try {
      const updated = await moveTicketStatus(ticketId, status);
      setTickets(prev => prev.map(ticket => (ticket.id === ticketId ? updated : ticket)));
      toast({
        title: 'Status atualizado',
        description: `Ticket movido para ${STATUS_CONFIG.find(item => item.id === status)?.label}.`
      });
    } catch (err) {
      toast({
        title: 'Erro ao mover ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateTicket = async (ticketId: string, payload: UpdateTicketInput) => {
    try {
      const updated = await updateTicket(ticketId, payload);
      setTickets(prev => prev.map(ticket => (ticket.id === ticketId ? updated : ticket)));
      toast({
        title: 'Ticket atualizado',
        description: 'As alterações foram salvas.'
      });
    } catch (err) {
      toast({
        title: 'Erro ao atualizar ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleAddComment = async (ticketId: string, message: string) => {
    const author = users[0];
    try {
      const updated = await addTicketComment(ticketId, { author, message, internal: true });
      setTickets(prev => prev.map(ticket => (ticket.id === ticketId ? updated : ticket)));
      toast({
        title: 'Comentário adicionado',
        description: 'Atualização registrada no histórico.'
      });
    } catch (err) {
      toast({
        title: 'Erro ao comentar',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleUploadAttachment = async (ticketId: string, files: File[]) => {
    try {
      await uploadTicketAttachment(ticketId, files);
      await loadTickets();
      toast({
        title: 'Anexos enviados',
        description: `${files.length} arquivo(s) anexados ao ticket.`
      });
    } catch (err) {
      toast({
        title: 'Erro ao enviar anexos',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleResolveTicket = async (ticket: Ticket) => {
    try {
      const updated = await resolveTicket(ticket.id);
      setTickets(prev => prev.map(item => (item.id === ticket.id ? updated : item)));
      toast({
        title: 'Ticket resolvido',
        description: `O ticket ${ticket.code} foi concluído.`
      });
    } catch (err) {
      toast({
        title: 'Erro ao resolver ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleArchiveTicket = async (ticket: Ticket) => {
    try {
      const updated = await archiveTicket(ticket.id);
      setTickets(prev => prev.map(item => (item.id === ticket.id ? updated : item)));
      toast({
        title: 'Ticket arquivado',
        description: `O ticket ${ticket.code} foi arquivado.`
      });
    } catch (err) {
      toast({
        title: 'Erro ao arquivar ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleReopenTicket = async (ticket: Ticket) => {
    try {
      const updated = await reopenTicket(ticket.id);
      setTickets(prev => prev.map(item => (item.id === ticket.id ? updated : item)));
      toast({
        title: 'Ticket reaberto',
        description: `O ticket ${ticket.code} voltou para Pendente.`
      });
    } catch (err) {
      toast({
        title: 'Erro ao reabrir ticket',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--bgPage))]">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--accent))]/15 via-[hsl(var(--accent))]/10 to-transparent text-[hsl(var(--accent))] font-semibold ring-1 ring-[hsl(var(--accent))]/20">
                H
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Hunter</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Home</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground">Gerenciamento de serviços</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher compact />
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
                <Bell className="h-5 w-5" />
                {(slaAlerts.warning + slaAlerts.overdue) > 0 ? (
                  <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 text-[10px] text-white">
                    {slaAlerts.warning + slaAlerts.overdue}
                  </span>
                ) : null}
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarImage src={users[0]?.avatarUrl} alt={users[0]?.name} />
                <AvatarFallback>{users[0]?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Gerenciamento de serviços</h1>
            <p className="text-sm text-muted-foreground">
              Controle de tickets, demandas e solicitações com visão unificada e foco em produtividade.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
          <Tabs defaultValue="quadro" className="w-full">
            <TabsList className="mb-6 w-full justify-start gap-1 rounded-2xl bg-muted/60 p-1">
              <TabsTrigger
                value="quadro"
                className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Gerenciamento de serviços
              </TabsTrigger>
              <TabsTrigger
                value="indicadores"
                className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Indicadores
              </TabsTrigger>
              <TabsTrigger
                value="integracoes"
                className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Integrações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quadro">
              <TicketBoard
                tickets={tickets}
                filteredTickets={filteredTickets}
                loading={loading}
                error={error}
                filters={filters}
                onFiltersChange={setFilters}
                onOpenTicket={(ticket, focus = 'details') => {
                  setActiveTicket(ticket);
                  setDrawerFocus(focus);
                  setDetailsOpen(true);
                }}
                onCreateTicket={() => setCreateOpen(true)}
                onMoveTicket={handleMoveTicket}
                onResolveTicket={handleResolveTicket}
                onArchiveTicket={handleArchiveTicket}
                onRetry={loadTickets}
              />
            </TabsContent>
            <TabsContent value="indicadores">
              <ServiceIndicatorsTab tickets={filteredTickets} />
            </TabsContent>
            <TabsContent value="integracoes">
              <SyncAuditPanel tickets={filteredTickets} onReprocess={loadTickets} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TicketDrawer
        ticket={activeTicket}
        open={detailsOpen}
        focus={drawerFocus}
        users={users}
        onOpenChange={setDetailsOpen}
        onSave={handleUpdateTicket}
        onMoveStatus={handleMoveTicket}
        onAddComment={handleAddComment}
        onUploadAttachment={handleUploadAttachment}
        onResolve={handleResolveTicket}
        onArchive={handleArchiveTicket}
        onReopen={handleReopenTicket}
      />

      <TicketCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        users={users}
        onCreate={handleCreateTicket}
      />
    </div>
  );
};
