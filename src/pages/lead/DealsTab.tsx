import { useCallback, useEffect, useMemo, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarDays,
  CircleDollarSign,
  Copy,
  Download,
  Eye,
  Filter,
  FileDown,
  LayoutPanelLeft,
  LayoutList,
  MoreHorizontal,
  PiggyBank,
  Search,
  Trash2,
  Users,
} from 'lucide-react';

import {
  type LeadDeal,
  type DealParticipantProfile,
  type LeadDealDraft,
  exportDeals,
  dealsMocks,
  listDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from '@/api/deals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PropertyCardMini } from '@/components/imoveis/PropertyCardMini';
import { DealDrawer } from '@/components/deals/DealDrawer';
import { DealModal } from '@/components/deals/DealModal';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DealsTabProps {
  leadId: string;
  leadName?: string;
  onDealWon?: (deal: LeadDeal) => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const eventAccent: Record<LeadDeal['timeline'][number]['kind'], string> = {
  interaction: 'bg-blue-100 text-blue-700 border-blue-200',
  document: 'bg-purple-100 text-purple-700 border-purple-200',
  milestone: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const kindBadge: Record<LeadDeal['kind'], { label: string; className: string }> = {
  proposal_sale: {
    label: 'Proposta de venda',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  proposal_rent: {
    label: 'Proposta de locação',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  sale: {
    label: 'Venda',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  won: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

const defaultStatusBadge = {
  label: 'Status indefinido',
  className: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusBadge: Record<LeadDeal['status'], { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  negotiating: {
    label: 'Em negociação',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sent: {
    label: 'Proposta enviada',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Proposta aprovada',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Proposta recusada',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  won: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  lost: {
    label: 'Negócio perdido',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

const getCommissionValue = (deal: LeadDeal) => {
  if (typeof deal.commissionBase === 'number') {
    return deal.commissionBase;
  }

  if (typeof deal.commissionPercentage === 'number') {
    return Number(((deal.amount * deal.commissionPercentage) / 100).toFixed(2));
  }

  return undefined;
};

const getParticipantSummary = (participants: LeadDeal['participants']) => {
  if (!participants.length) return 'Nenhum participante registrado.';

  if (participants.length === 1) return participants[0].name;

  if (participants.length === 2) {
    return `${participants[0].name} e ${participants[1].name}`;
  }

  return `${participants[0].name}, ${participants[1].name} e +${participants.length - 2}`;
};

const formatInstallments = (installments?: LeadDeal['installments']) => {
  if (!installments) return null;

  const { count, amount, frequency } = installments;
  const frequencyLabel: Record<typeof frequency, string> = {
    monthly: 'mensais',
    quarterly: 'trimestrais',
    annual: 'anuais',
  };

  const amountFormatted = formatCurrency(amount);
  return `${count}x de ${amountFormatted} — parcelas ${frequencyLabel[frequency]}`;
};

export default function DealsTab({ leadId, leadName, onDealWon }: DealsTabProps) {
  const [deals, setDeals] = useState<LeadDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDeal, setEditingDeal] = useState<LeadDeal | null>(null);
  const [viewingDeal, setViewingDeal] = useState<LeadDeal | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'kanban' | 'list'>('cards');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<LeadDeal['status'][]>([]);
  const [kindFilters, setKindFilters] = useState<LeadDeal['kind'][]>([]);
  const [valueRange, setValueRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [duplicatingDealId, setDuplicatingDealId] = useState<string | null>(null);
  const members = dealsMocks.participants as DealParticipantProfile[];

  const loadDeals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDeals(leadId);
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt ?? b.updatedAt).getTime() -
          new Date(a.createdAt ?? a.updatedAt).getTime(),
      );
      setDeals(sorted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar negócios');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void loadDeals();
  }, [loadDeals]);

  const openCreateForm = () => {
    setEditorMode('create');
    setEditingDeal(null);
    setIsEditorOpen(true);
  };

  const openEditForm = (deal: LeadDeal) => {
    setEditorMode('edit');
    setEditingDeal(deal);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingDeal(null);
  };

  const handleSubmit = async (draft: LeadDealDraft) => {
    setIsSubmitting(true);
    try {
      if (editorMode === 'create') {
        const payload: LeadDealDraft = {
          ...draft,
          leadId,
          kind: draft.kind ?? 'won',
          status: draft.status ?? 'won',
          title: draft.title || leadName || `Negócio ${leadId}`,
        };
        const newDeal = await createDeal(leadId, payload);
        toast({
          title: 'Negócio registrado',
          description: 'Negócio adicionado à lista com sucesso.',
        });
        if (newDeal.status === 'won') {
          onDealWon?.(newDeal);
        }
      } else if (editingDeal) {
        const payload: LeadDealDraft = {
          ...draft,
          id: editingDeal.id,
          leadId: editingDeal.leadId,
          kind: draft.kind ?? editingDeal.kind,
          status: draft.status ?? editingDeal.status,
          title: draft.title || editingDeal.title,
          timeline: draft.timeline ?? editingDeal.timeline,
        };
        await updateDeal(leadId, editingDeal.id, payload);
        toast({
          title: 'Negócio atualizado',
          description: 'As informações do negócio foram atualizadas.',
        });
      }

      await loadDeals();
      closeEditor();
    } catch (err) {
      toast({
        title: 'Não foi possível salvar',
        description: err instanceof Error ? err.message : 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deal?: LeadDeal) => {
    const dealToDelete = deal ?? editingDeal ?? viewingDeal;
    if (!dealToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDeal(leadId, dealToDelete.id);
      toast({ title: 'Negócio removido', description: 'O negócio foi excluído da lista.' });
      if (viewingDeal?.id === dealToDelete.id) {
        setViewingDeal(null);
      }
      if (editingDeal?.id === dealToDelete.id) {
        closeEditor();
      }
      await loadDeals();
    } catch (err) {
      toast({
        title: 'Não foi possível excluir',
        description: err instanceof Error ? err.message : 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (deal: LeadDeal) => {
    setDuplicatingDealId(deal.id);
    try {
      const payload: LeadDealDraft = {
        leadId,
        kind: deal.kind,
        status: 'draft',
        title: `${deal.title} (cópia)`,
        amount: deal.amount,
        commissionPercentage: deal.commissionPercentage,
        commissionBase: deal.commissionBase,
        paymentMethod: deal.paymentMethod,
        proposalSentAt: deal.proposalSentAt,
        proposalValidUntil: deal.proposalValidUntil,
        property: deal.property,
        buyerName: deal.buyerName,
        sellerName: deal.sellerName,
        notes: deal.notes,
        askingPrice: deal.askingPrice,
        downPayment: deal.downPayment,
        installments: deal.installments,
        terms: deal.terms,
        approved: deal.approved,
        approvedAt: deal.approvedAt,
        participants: deal.participants.map(({ amount, ...participant }) => participant),
        timeline: deal.timeline,
        documents: deal.documents,
      };
      await createDeal(leadId, payload);
      toast({
        title: 'Negócio duplicado',
        description: `A cópia de "${deal.title}" foi criada como rascunho.`,
      });
      await loadDeals();
    } catch (err) {
      toast({
        title: 'Não foi possível duplicar',
        description: err instanceof Error ? err.message : 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setDuplicatingDealId(null);
    }
  };

  const handleExport = (deal?: LeadDeal) => {
    const dealsToExport = deal ? [deal] : dealsMocks.deals;

    if (!dealsToExport.length) {
      toast({
        title: 'Nenhum negócio para exportar',
        description: 'Cadastre um negócio antes de tentar exportar os dados.',
      });
      return;
    }

    exportDeals(dealsToExport, {
      filename: deal ? `negocio-${deal.id}` : 'negocios',
    });

    toast({
      title: 'Exportação iniciada',
      description: deal
        ? `Estamos gerando arquivos CSV e JSON para o negócio "${deal.title}".`
        : `A lista completa de ${dealsToExport.length} negócios será baixada nos formatos CSV e JSON.`,
    });
  };

  const handleExportDeal = (deal: LeadDeal) => {
    handleExport(deal);
  };

  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

  const filteredDeals = useMemo(() => {
    const min = valueRange.min ? Number(valueRange.min) : null;
    const max = valueRange.max ? Number(valueRange.max) : null;

    return deals.filter(deal => {
      if (normalizedSearch) {
        const haystack = `${deal.title} ${deal.notes ?? ''} ${deal.property?.title ?? ''}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      if (statusFilters.length > 0 && !statusFilters.includes(deal.status)) return false;
      if (kindFilters.length > 0 && !kindFilters.includes(deal.kind)) return false;
      if (min != null && !Number.isNaN(min) && deal.amount < min) return false;
      if (max != null && !Number.isNaN(max) && deal.amount > max) return false;
      return true;
    });
  }, [deals, kindFilters, normalizedSearch, statusFilters, valueRange.max, valueRange.min]);

  const wonDeals = useMemo(() => filteredDeals.filter(deal => deal.status === 'won'), [filteredDeals]);
  const totalVolume = useMemo(
    () => wonDeals.reduce((sum, deal) => sum + deal.amount, 0),
    [wonDeals],
  );
  const totalCommission = useMemo(
    () => wonDeals.reduce((sum, deal) => sum + (getCommissionValue(deal) ?? 0), 0),
    [wonDeals],
  );
  const activeDealsCount = useMemo(
    () =>
      filteredDeals.filter(deal =>
        ['draft', 'sent', 'negotiating', 'approved'].includes(deal.status),
      ).length,
    [filteredDeals],
  );

  const activeFiltersCount =
    statusFilters.length + kindFilters.length + (valueRange.min ? 1 : 0) + (valueRange.max ? 1 : 0);

  const statusOrder: LeadDeal['status'][] = [
    'draft',
    'sent',
    'negotiating',
    'approved',
    'rejected',
    'won',
    'lost',
  ];

  const toggleStatus = (status: LeadDeal['status']) => {
    setStatusFilters(prev =>
      prev.includes(status) ? prev.filter(item => item !== status) : [...prev, status],
    );
  };

  const toggleKind = (kind: LeadDeal['kind']) => {
    setKindFilters(prev =>
      prev.includes(kind) ? prev.filter(item => item !== kind) : [...prev, kind],
    );
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setKindFilters([]);
    setValueRange({ min: '', max: '' });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">Negócios</h2>
          <p className="text-sm text-muted-foreground">Histórico de negociações e propostas deste lead.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder="Buscar por título, notas ou imóvel"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
              <Button
                type="button"
                size="sm"
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <LayoutPanelLeft className="h-4 w-4" />
                Kanban
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <LayoutList className="h-4 w-4" />
                Lista
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setFiltersOpen(true)}>
              <Filter className="mr-2 h-4 w-4" /> Filtros {activeFiltersCount ? `(${activeFiltersCount})` : ''}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => handleExport()}>
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button type="button" onClick={openCreateForm}>
              Registrar negócio
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Valor total fechado</span>
            <CircleDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{formatCurrency(totalVolume)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Somente negócios ganhos entram neste cálculo.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Comissão prevista</span>
            <PiggyBank className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{formatCurrency(totalCommission)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Baseado apenas nos negócios ganhos deste lead.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Negociações em andamento</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-gray-900">{activeDealsCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclui propostas enviadas, aprovadas e negociações abertas.
          </p>
        </div>
      </section>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map(key => (
            <div key={key} className="rounded-2xl border border-gray-200 bg-white p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-4 h-40 w-full" />
              <Skeleton className="mt-4 h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Não foi possível carregar os negócios: {error}
        </div>
      )}

      {!loading && !filteredDeals.length && !error && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-base font-medium text-gray-900">
            {deals.length === 0 ? 'Nenhum negócio cadastrado ainda' : 'Nenhum negócio encontrado com os filtros aplicados'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {deals.length === 0
              ? 'Registre o primeiro negócio deste lead para acompanhar propostas, negociações e fechamentos.'
              : 'Ajuste os filtros ou limpe a busca para ver outros resultados.'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {deals.length === 0 ? (
              <Button onClick={openCreateForm}>Registrar negócio</Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                clearFilters();
              }}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {!!filteredDeals.length && viewMode === 'cards' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDeals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onView={setViewingDeal}
              onDuplicate={handleDuplicate}
              onExport={handleExportDeal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {!!filteredDeals.length && viewMode === 'kanban' && (
        <DealKanban
          deals={filteredDeals}
          statusOrder={statusOrder}
          onView={setViewingDeal}
          onDuplicate={handleDuplicate}
          onExport={handleExportDeal}
          onDelete={handleDelete}
        />
      )}

      {!!filteredDeals.length && viewMode === 'list' && (
        <DealTable
          deals={filteredDeals}
          onView={setViewingDeal}
          onDuplicate={handleDuplicate}
          onExport={handleExportDeal}
          onDelete={handleDelete}
          duplicatingId={duplicatingDealId}
        />
      )}

      <DealModal
        open={isEditorOpen}
        mode={editorMode}
        leadId={leadId}
        deal={editorMode === 'edit' ? editingDeal ?? undefined : undefined}
        members={members}
        isSubmitting={isSubmitting}
        isDeleting={isDeleting}
        onClose={closeEditor}
        onSubmit={handleSubmit}
        onDelete={
          editorMode === 'edit' && editingDeal
            ? () => handleDelete(editingDeal)
            : undefined
        }
      />

      <DealDrawer
        deal={viewingDeal}
        open={Boolean(viewingDeal)}
        onClose={() => setViewingDeal(null)}
        onEdit={deal => {
          setViewingDeal(null);
          openEditForm(deal);
        }}
        onDelete={deal => void handleDelete(deal)}
        isDeleting={isDeleting}
      />

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Filtros de negócios</DialogTitle>
            <DialogDescription>
              Combine status, tipo e intervalo de valores para filtrar as negociações deste lead.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold text-foreground">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {statusOrder.map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-2 rounded-lg border border-transparent p-2 hover:border-orange-200 hover:bg-orange-50/60"
                  >
                    <Checkbox
                      checked={statusFilters.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    <span className="text-sm">{statusBadge[status]?.label ?? status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-border p-4">
              <p className="text-sm font-semibold text-foreground">Tipo</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(kindBadge).map(([kindKey, badge]) => (
                  <label
                    key={kindKey}
                    className="flex items-center gap-2 rounded-lg border border-transparent p-2 hover:border-orange-200 hover:bg-orange-50/60"
                  >
                    <Checkbox
                      checked={kindFilters.includes(kindKey as LeadDeal['kind'])}
                      onCheckedChange={() => toggleKind(kindKey as LeadDeal['kind'])}
                    />
                    <span className="text-sm">{badge.label}</span>
                  </label>
                ))}
              </div>
              <Separator />
              <div className="grid gap-3">
                <Label className="text-sm font-medium text-foreground">Intervalo de valor</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Mínimo"
                    value={valueRange.min}
                    onChange={event => setValueRange(prev => ({ ...prev, min: event.target.value }))}
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Máximo"
                    value={valueRange.max}
                    onChange={event => setValueRange(prev => ({ ...prev, max: event.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={clearFilters}>
              Limpar filtros
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>Aplicar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DealCardProps {
  deal: LeadDeal;
  onView: (deal: LeadDeal) => void;
  onDuplicate: (deal: LeadDeal) => void;
  onExport: (deal: LeadDeal) => void;
  onDelete: (deal: LeadDeal) => void | Promise<void>;
}

function DealCard({ deal, onView, onDuplicate, onExport, onDelete }: DealCardProps) {
  const commissionValue = getCommissionValue(deal);
  const kind = kindBadge[deal.kind];
  const status = statusBadge[deal.status] ?? {
    ...defaultStatusBadge,
    label: deal.status,
  };
  const titlePrefix =
    deal.kind === 'proposal_sale' || deal.kind === 'proposal_rent'
      ? 'Proposta de'
      : 'Negócio fechado —';
  const headerTitle = `${titlePrefix} ${formatCurrency(deal.amount)}`;
  const updatedDistance = formatDistanceToNow(new Date(deal.updatedAt), {
    locale: ptBR,
    addSuffix: true,
  });
  const installmentsSummary = formatInstallments(deal.installments);
  const showFinancialDetails =
    typeof deal.askingPrice === 'number' ||
    typeof deal.downPayment === 'number' ||
    Boolean(installmentsSummary) ||
    Boolean(deal.terms);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={kind.className}>
              {kind.label}
            </Badge>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{headerTitle}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Ações do negócio">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(deal)}>
              <Eye className="mr-2 h-4 w-4" /> Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(deal)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(deal)}>
              <FileDown className="mr-2 h-4 w-4" /> Exportar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(deal)}>
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 space-y-3">
        {deal.property ? (
          <PropertyCardMini
            id={deal.property.id}
            code={deal.property.code}
            title={deal.property.title}
            type={deal.property.type}
            city={deal.property.city}
            price={deal.property.price}
            area={deal.property.area}
            beds={deal.property.beds}
            baths={deal.property.baths}
            parking={deal.property.parking}
            coverUrl={deal.property.coverUrl}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-muted-foreground">
            Nenhum imóvel vinculado a este registro.
          </div>
        )}

        {showFinancialDetails && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {typeof deal.askingPrice === 'number' && (
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-medium text-muted-foreground">Valor pedido</dt>
                <dd className="mt-1 font-semibold text-gray-900">{formatCurrency(deal.askingPrice)}</dd>
              </div>
            )}
            {typeof deal.downPayment === 'number' && (
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-medium text-muted-foreground">Entrada</dt>
                <dd className="mt-1 font-semibold text-gray-900">{formatCurrency(deal.downPayment)}</dd>
              </div>
            )}
            {installmentsSummary && (
              <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">Parcelamento</dt>
                <dd className="mt-1 text-sm text-gray-900">{installmentsSummary}</dd>
              </div>
            )}
            {deal.terms && (
              <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground">Condições adicionais</dt>
                <dd className="mt-1 text-sm text-gray-900">{deal.terms}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CircleDollarSign className="h-3 w-3" /> Valor
          </dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">{formatCurrency(deal.amount)}</dd>
        </div>
        {commissionValue != null && (
          <div className="rounded-xl bg-emerald-50 p-3">
            <dt className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <PiggyBank className="h-3 w-3" /> Comissão
            </dt>
            <dd className="mt-1 text-base font-semibold text-emerald-700">
              {formatCurrency(commissionValue)}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 text-sm">
        <span className="font-medium text-gray-900">Participantes:</span>{' '}
        <span className="text-muted-foreground">{getParticipantSummary(deal.participants)}</span>
      </div>

      {deal.notes && (
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{deal.notes}</p>
    )}

      {deal.timeline.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {deal.timeline.map(event => (
            <span
              key={event.id}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-medium',
                eventAccent[event.kind],
              )}
            >
              <span>{format(new Date(event.date), "d MMM", { locale: ptBR })}</span>
              <span className="text-[0.7rem] uppercase tracking-wide text-current/80">{event.title}</span>
            </span>
          ))}
        </div>
      )}

      <p className="mt-auto pt-4 text-xs text-muted-foreground">Atualizado {updatedDistance}</p>
    </article>
  );
}

interface DealKanbanProps {
  deals: LeadDeal[];
  statusOrder: LeadDeal['status'][];
  onView: (deal: LeadDeal) => void;
  onDuplicate: (deal: LeadDeal) => void;
  onExport: (deal: LeadDeal) => void;
  onDelete: (deal: LeadDeal) => void | Promise<void>;
}

function DealKanban({
  deals,
  statusOrder,
  onView,
  onDuplicate,
  onExport,
  onDelete,
}: DealKanbanProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {statusOrder.map(status => {
        const items = deals.filter(deal => deal.status === status);
        const statusInfo = statusBadge[status] ?? defaultStatusBadge;
        return (
          <div key={status} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusInfo.className}>
                  {statusInfo.label}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">{items.length}</span>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Kanban</span>
            </div>
            <div className="space-y-3">
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-gray-50 p-3 text-center text-xs text-muted-foreground">
                  Nada por aqui ainda
                </div>
              )}
              {items.map(item => (
                <DealCard
                  key={item.id}
                  deal={item}
                  onView={onView}
                  onDuplicate={onDuplicate}
                  onExport={onExport}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface DealTableProps {
  deals: LeadDeal[];
  onView: (deal: LeadDeal) => void;
  onDuplicate: (deal: LeadDeal) => void;
  onExport: (deal: LeadDeal) => void;
  onDelete: (deal: LeadDeal) => void | Promise<void>;
  duplicatingId: string | null;
}

function DealTable({ deals, onView, onDuplicate, onExport, onDelete, duplicatingId }: DealTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] items-center border-b border-border bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Título</span>
        <span>Tipo</span>
        <span>Status</span>
        <span>Valor</span>
        <span className="text-right">Ações</span>
      </div>
      <div className="divide-y divide-border">
        {deals.map(deal => (
          <div key={deal.id} className="grid grid-cols-[2fr,1fr,1fr,1fr,auto] items-center px-4 py-3 text-sm">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onView(deal)}
                className="text-left font-semibold text-foreground hover:text-orange-600"
              >
                {deal.title}
              </button>
              <p className="text-xs text-muted-foreground">
                {deal.property?.title ?? 'Sem imóvel vinculado'}
              </p>
            </div>
            <Badge variant="outline" className={kindBadge[deal.kind].className}>
              {kindBadge[deal.kind].label}
            </Badge>
            <Badge variant="outline" className={statusBadge[deal.status]?.className ?? defaultStatusBadge.className}>
              {statusBadge[deal.status]?.label ?? deal.status}
            </Badge>
            <span className="font-semibold text-foreground">{formatCurrency(deal.amount)}</span>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => onView(deal)} aria-label="Visualizar">
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDuplicate(deal)}
                aria-label="Duplicar"
                disabled={duplicatingId === deal.id}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onExport(deal)} aria-label="Exportar">
                <FileDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(deal)}
                aria-label="Excluir"
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
