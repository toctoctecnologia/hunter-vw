import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useRedistribuicaoDestination,
  useRedistribuicaoExecution,
  useRedistribuicaoFilters,
  useRedistribuicaoImport,
  useRedistribuicaoLeads,
  useRedistribuicaoPreview,
  useRedistribuicaoSelection,
} from '@/hooks/distribuicao/useRedistribuicao';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { getCurrentUser, hasPermission } from '@/data/accessControl';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Loader2, Target, Upload, Users2 } from 'lucide-react';
import {
  REDISTRIBUICAO_CAMPANHAS,
  REDISTRIBUICAO_CANAIS,
  REDISTRIBUICAO_CORRETORES,
  REDISTRIBUICAO_FASES,
  REDISTRIBUICAO_FILAS,
  REDISTRIBUICAO_FUNIS,
  REDISTRIBUICAO_SLA,
  REDISTRIBUICAO_STATUS,
} from '@/data/redistribuicaoFilters';
import type { DestinationConfig } from '@/types/redistribution';
import { Default403State } from '@/components/ui/Default403State';

const defaultBatchForm = { name: '', quantity: 20, source: 'Upload CSV', reason: 'Sem contato' };

const defaultExtendedFilters = {
  brokerId: 'todos',
  pipelineId: 'todos',
  stageId: 'todas',
  targetQueueId: 'todas',
  sourceChannel: 'todos',
  campaignId: 'todas',
  slaBucket: 'todos',
};

const filaOptions = [
  { id: 'fila-geral', name: 'Fila Geral' },
  { id: 'fila-premium', name: 'Fila Premium' },
  { id: 'fila-digital', name: 'Fila Digital' },
];

const usuarioOptions = [
  { id: 'user-ana', name: 'Ana Lima' },
  { id: 'user-carlos', name: 'Carlos Silva' },
  { id: 'user-equipe', name: 'Equipe Especialista' },
];

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  size?: 'md' | 'lg';
}

function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = 'md',
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();
  const body = <div className="max-h-[65vh] overflow-y-auto px-6 pb-6 space-y-4">{children}</div>;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85dvh] p-0">
          <DrawerHeader className="px-6 pt-6 text-left">
            <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          {body}
          {footer && <DrawerFooter className="border-t bg-muted/30">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full p-0 ${size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-xl'}`}>
        <DialogHeader className="px-6 pt-6 text-left">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {body}
        {footer && <DialogFooter className="border-t bg-muted/40 px-6 py-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function RedistribuicaoTab() {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchForm, setBatchForm] = useState(defaultBatchForm);
  const [extendedFilters, setExtendedFilters] = useState(defaultExtendedFilters);

  const { filters, pagination, setFilters, resetFilters, setSearch, setPage } = useRedistribuicaoFilters();
  const { leads, metadata, loading, error, loadLeads } = useRedistribuicaoLeads();
  const {
    selectAllMatching,
    deselectedIds,
    isLeadSelected,
    toggleRow,
    toggleCurrentPage,
    enableSelectAllMatching,
    clearSelection,
    selectedCount,
    hasSelection,
    total,
  } = useRedistribuicaoSelection();
  const { destination, setDestination } = useRedistribuicaoDestination();
  const { previewData, previewLoading, previewRedistribution } = useRedistribuicaoPreview();
  const { executeRedistribution, executing, lastJob, lastAudit } = useRedistribuicaoExecution();
  const { importBatch, batchLoading } = useRedistribuicaoImport();

  const [tempDestination, setTempDestination] = useState<DestinationConfig>(destination);

  const currentUser = getCurrentUser();
  const canManage = hasPermission(currentUser, 'distribution.manage') || hasPermission(currentUser, 'leads.redistribute');

  useEffect(() => {
    if (!canManage) return;
    loadLeads().catch(err => {
      console.error('Erro ao carregar leads arquivados:', err);
      toast.error('Erro ao carregar leads arquivados');
    });
  }, [canManage, loadLeads, filters, pagination.page, pagination.perPage]);

  useEffect(() => {
    if (!isDestinationOpen) return;
    setTempDestination(destination);
  }, [destination, isDestinationOpen]);

  const availableStages = useMemo(() => {
    if (extendedFilters.pipelineId === 'todos') return [];
    return REDISTRIBUICAO_FASES[extendedFilters.pipelineId] ?? [];
  }, [extendedFilters.pipelineId]);

  const filteredCampaigns = useMemo(() => {
    if (extendedFilters.sourceChannel === 'todos') return REDISTRIBUICAO_CAMPANHAS;
    return REDISTRIBUICAO_CAMPANHAS.filter(campaign => campaign.channel === extendedFilters.sourceChannel);
  }, [extendedFilters.sourceChannel]);

  useEffect(() => {
    if (extendedFilters.pipelineId === 'todos' && extendedFilters.stageId !== 'todas') {
      setExtendedFilters(prev => ({ ...prev, stageId: 'todas' }));
    }
  }, [extendedFilters.pipelineId, extendedFilters.stageId]);

  useEffect(() => {
    if (extendedFilters.campaignId === 'todas') return;
    const campaignExists = filteredCampaigns.some(campaign => campaign.value === extendedFilters.campaignId);
    if (!campaignExists) {
      setExtendedFilters(prev => ({ ...prev, campaignId: 'todas' }));
    }
  }, [extendedFilters.campaignId, filteredCampaigns]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (extendedFilters.brokerId !== 'todos') count++;
    if (extendedFilters.pipelineId !== 'todos') count++;
    if (extendedFilters.stageId !== 'todas') count++;
    if (extendedFilters.targetQueueId !== 'todas') count++;
    if (extendedFilters.sourceChannel !== 'todos') count++;
    if (extendedFilters.campaignId !== 'todas') count++;
    if (extendedFilters.slaBucket !== 'todos') count++;
    if (filters.status && filters.status !== 'todos') count++;
    if (filters.queue) count++;
    if (filters.tag) count++;
    if (filters.periodo.inicio) count++;
    if (filters.periodo.fim) count++;
    return count;
  }, [extendedFilters, filters]);

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pagination.perPage));
  const currentPageSelected = leads.length > 0 && leads.every(lead => isLeadSelected(lead.id));
  const showSelectAllBanner = !selectAllMatching && currentPageSelected && total > leads.length;

  const handleToggleRow = (leadId: string, checked: boolean) => {
    toggleRow(leadId, checked);
  };

  const handleToggleCurrentPage = (checked: boolean) => {
    toggleCurrentPage(checked);
  };

  const handleSelectAllMatching = () => {
    enableSelectAllMatching();
  };

  const handlePreview = async () => {
    if (!hasSelection) {
      toast.error('Selecione ao menos um lead para pré-visualizar.');
      return;
    }

    try {
      const preview = await previewRedistribution();
      if (preview) {
        setPreviewOpen(true);
      }
    } catch (err) {
      console.error('Erro ao pré-visualizar redistribuição:', err);
      toast.error('Erro ao pré-visualizar redistribuição');
    }
  };

  const handleExecute = async () => {
    if (!hasSelection) return;

    try {
      const response = await executeRedistribution(currentUser?.id?.toString() ?? 'Usuário Atual');
      if (response) {
        toast.success('Redistribuição iniciada com sucesso');
        setPreviewOpen(false);
      }
    } catch (err) {
      console.error('Erro ao executar redistribuição:', err);
      toast.error('Erro ao iniciar redistribuição');
    }
  };

  const handleOpenDestination = () => {
    setTempDestination(destination);
    setIsDestinationOpen(true);
  };

  const handleSaveDestination = () => {
    setDestination(tempDestination);
    setIsDestinationOpen(false);
    toast.success('Destino atualizado');
  };

  const handleResetAllFilters = () => {
    resetFilters();
    setExtendedFilters(defaultExtendedFilters);
    setSearch('');
  };

  const handleImportBatch = async () => {
    if (!batchForm.name.trim()) {
      toast.error('Informe um nome para o lote.');
      return;
    }
    if (batchForm.quantity <= 0) {
      toast.error('Quantidade mínima é 1.');
      return;
    }

    try {
      await importBatch({
        name: batchForm.name.trim(),
        quantity: Number(batchForm.quantity),
        source: batchForm.source,
        reason: batchForm.reason,
      });
      toast.success('Lote importado com sucesso');
      setBatchOpen(false);
      setBatchForm(defaultBatchForm);
    } catch (err) {
      console.error('Erro ao importar lote:', err);
      toast.error('Erro ao importar lote');
    }
  };

  if (!canManage) {
    return (
      <Default403State
        description={(
          <>
            Você precisa da permissão <strong>distribution.manage</strong> ou <strong>leads.redistribute</strong> para acessar esta aba.
          </>
        )}
      />
    );
  }

  const destinationConfig = destination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Selecione leads arquivados para redistribuir automaticamente para um destino configurado.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setBatchOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Adicionar lote
          </Button>
          <Button variant="outline" onClick={handleOpenDestination}>
            <Target className="mr-2 h-4 w-4" />
            Configurar destino
          </Button>
          <Button
            onClick={handlePreview}
            disabled={!hasSelection || previewLoading}
            className="bg-[hsl(var(--accent))] text-white hover:bg-[#E65C00]"
          >
            {previewLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users2 className="mr-2 h-4 w-4" />}
            Pré-visualizar redistribuição
          </Button>
        </div>
      </div>

      {filtersOpen && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Filtros completos</p>
                <p className="text-sm text-muted-foreground">
                  Filtre por corretor, funil, fase do funil, fila de origem/destino, canal, campanha, tipo de imóvel,
                  status atual, período da redistribuição e SLA.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Corretor</Label>
                <Select
                  value={extendedFilters.brokerId}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, brokerId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {REDISTRIBUICAO_CORRETORES.map(broker => (
                      <SelectItem key={broker.value} value={broker.value}>
                        {broker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Funil</Label>
                <Select
                  value={extendedFilters.pipelineId}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, pipelineId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {REDISTRIBUICAO_FUNIS.map(funil => (
                      <SelectItem key={funil.value} value={funil.value}>
                        {funil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fase do funil</Label>
                <Select
                  value={extendedFilters.stageId}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, stageId: value }))}
                  disabled={extendedFilters.pipelineId === 'todos'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {availableStages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fila de origem</Label>
                <Select
                  value={filters.queue || 'todas'}
                  onValueChange={value => setFilters({ queue: value === 'todas' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {metadata.queues.map(queue => (
                      <SelectItem key={queue} value={queue}>
                        {queue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fila de destino</Label>
                <Select
                  value={extendedFilters.targetQueueId}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, targetQueueId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {REDISTRIBUICAO_FILAS.map(queue => (
                      <SelectItem key={queue.value} value={queue.value}>
                        {queue.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Canal de origem</Label>
                <Select
                  value={extendedFilters.sourceChannel}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, sourceChannel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {REDISTRIBUICAO_CANAIS.map(canal => (
                      <SelectItem key={canal.value} value={canal.value}>
                        {canal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campanha</Label>
                <Select
                  value={extendedFilters.campaignId}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, campaignId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {filteredCampaigns.map(campaign => (
                      <SelectItem key={campaign.value} value={campaign.value}>
                        {campaign.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de imóvel</Label>
                <Select
                  value={filters.tag || 'todas'}
                  onValueChange={value => setFilters({ tag: value === 'todas' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {metadata.tags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status atual do lead</Label>
                <Select
                  value={filters.status || 'todos'}
                  onValueChange={value => setFilters({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {REDISTRIBUICAO_STATUS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data da redistribuição</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">A partir de</span>
                    <Input
                      type="date"
                      value={filters.periodo.inicio ?? ''}
                      onChange={event => setFilters({ periodo: { ...filters.periodo, inicio: event.target.value } })}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Até</span>
                    <Input
                      type="date"
                      value={filters.periodo.fim ?? ''}
                      onChange={event => setFilters({ periodo: { ...filters.periodo, fim: event.target.value } })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tempo até redistribuição (SLA)</Label>
                <Select
                  value={extendedFilters.slaBucket}
                  onValueChange={value => setExtendedFilters(prev => ({ ...prev, slaBucket: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    {REDISTRIBUICAO_SLA.map(sla => (
                      <SelectItem key={sla.value} value={sla.value}>
                        {sla.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>{activeFilters} filtro(s) aplicados</span>
              <Button
                variant="ghost"
                size="sm"
                className="self-start text-muted-foreground hover:text-foreground"
                onClick={handleResetAllFilters}
                disabled={activeFilters === 0}
              >
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-1 border-b bg-muted/40 p-6">
            <CardTitle className="text-base font-semibold">Leads arquivados</CardTitle>
            <p className="text-sm text-muted-foreground">{pagination.total} resultado(s) encontrados</p>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="px-6 py-4 text-sm text-destructive">{error}</div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={currentPageSelected || (selectAllMatching && deselectedIds.size === 0)}
                        onCheckedChange={value => handleToggleCurrentPage(Boolean(value))}
                        aria-label="Selecionar todos"
                      />
                    </TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead className="text-right">Arquivado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell colSpan={6} className="p-4">
                            <Skeleton className="h-5 w-full" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}

                  {!loading && leads.map(lead => (
                    <TableRow key={lead.id} className={isLeadSelected(lead.id) ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={isLeadSelected(lead.id)}
                          onCheckedChange={value => handleToggleRow(lead.id, Boolean(value))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{lead.nome}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                          {lead.tags && lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {lead.tags.map(tag => (
                                <Badge key={`${lead.id}-${tag}`} variant="outline" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lead.motivo}</TableCell>
                      <TableCell>{lead.responsavel}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{lead.origem}</span>
                          {lead.filaAnterior && (
                            <span className="text-xs text-muted-foreground">Fila: {lead.filaAnterior}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(lead.arquivadoEm)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {!loading && leads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        Nenhum lead encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {showSelectAllBanner && (
              <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-3 text-sm">
                <span className="text-muted-foreground">
                  Todos os {leads.length} leads desta página foram selecionados.
                </span>
                <Button variant="ghost" size="sm" onClick={handleSelectAllMatching}>
                  Selecionar todos os {total} leads filtrados
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm">
                {selectAllMatching ? (
                  <span>
                    Todos os <strong>{selectedCount}</strong> leads filtrados selecionados
                    {deselectedIds.size > 0 && ` (${deselectedIds.size} removidos manualmente)`}.
                  </span>
                ) : (
                  <span>
                    <strong>{selectedCount}</strong> lead(s) selecionado(s).
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" onClick={clearSelection} disabled={!hasSelection}>
                  Limpar seleção
                </Button>
              </div>
            </div>

            <div className="border-t bg-muted/30 px-6 py-4">
              <Pagination>
                <PaginationContent className="flex-wrap gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        if (pagination.page > 1) {
                          setPage(pagination.page - 1);
                        }
                      }}
                      className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === pagination.page;
                    if (totalPages > 6) {
                      if (pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - pagination.page) <= 1) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={event => {
                                event.preventDefault();
                                setPage(pageNumber);
                              }}
                              isActive={isActive}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (pageNumber === 2 && pagination.page > 3) {
                        return (
                          <PaginationItem key="start-ellipsis">
                            <span className="px-3 text-muted-foreground">...</span>
                          </PaginationItem>
                        );
                      }
                      if (pageNumber === totalPages - 1 && pagination.page < totalPages - 2) {
                        return (
                          <PaginationItem key="end-ellipsis">
                            <span className="px-3 text-muted-foreground">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={event => {
                            event.preventDefault();
                            setPage(pageNumber);
                          }}
                          isActive={isActive}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={event => {
                        event.preventDefault();
                        if (pagination.page < totalPages) {
                          setPage(pagination.page + 1);
                        }
                      }}
                      className={pagination.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="border-b bg-muted/40 p-6">
            <CardTitle className="text-base font-semibold">Resumo do destino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1">
              <span className="text-xs uppercase text-muted-foreground">Destino configurado</span>
              <p className="text-lg font-semibold">{destinationConfig.targetName}</p>
              <p className="text-sm text-muted-foreground">
                {destinationConfig.strategy === 'fila' ? 'Redistribuição para fila' : 'Redistribuição para usuário específico'}
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Prioridade</span>
                <Badge variant="secondary">
                  {destinationConfig.priority === 'balanceada' ? 'Balanceada' : 'Prioridade do destino'}
                </Badge>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Preservar proprietário</span>
                <span>{destinationConfig.preserveOwnership ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Notificar responsáveis</span>
                <span>{destinationConfig.notifyOwners ? 'Sim' : 'Não'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Leads selecionados</span>
                <span className="font-semibold">{selectedCount}</span>
              </div>
            </div>

            {destinationConfig.notes && (
              <div className="rounded-lg border bg-muted/50 p-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Observações</span>
                <p className="mt-1 whitespace-pre-line">{destinationConfig.notes}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Último job</span>
                {lastJob ? (
                  <Badge variant="outline">{formatDate(lastJob.createdAt)}</Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
              {lastJob && (
                <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
                  <p className="font-medium">{lastJob.destino.targetName}</p>
                  <p className="text-xs text-muted-foreground">
                    {lastJob.totalLeads} leads • Status: {lastJob.status}
                  </p>
                  {lastAudit && (
                    <p className="text-xs text-muted-foreground">{lastAudit.mensagem}</p>
                  )}
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full" onClick={handleOpenDestination}>
              Ajustar destino
            </Button>
          </CardContent>
        </Card>
      </div>

      <ResponsiveModal
        open={isDestinationOpen}
        onOpenChange={setIsDestinationOpen}
        title="Configurar destino"
        description="Defina para onde os leads selecionados serão redistribuídos."
        footer={
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDestinationOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDestination}>Salvar configuração</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de destino</Label>
            <RadioGroup
              value={tempDestination.strategy}
              onValueChange={value =>
                setTempDestination(prev => ({ ...prev, strategy: value as DestinationConfig['strategy'] }))
              }
              className="grid gap-3 md:grid-cols-2"
            >
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                <RadioGroupItem value="fila" className="mt-1" />
                <div>
                  <p className="font-medium">Fila</p>
                  <p className="text-sm text-muted-foreground">Redistribui para uma fila existente</p>
                </div>
              </Label>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3">
                <RadioGroupItem value="usuario" className="mt-1" />
                <div>
                  <p className="font-medium">Usuário</p>
                  <p className="text-sm text-muted-foreground">Entrega diretamente para um usuário</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{tempDestination.strategy === 'fila' ? 'Fila destino' : 'Usuário destino'}</Label>
            <Select
              value={tempDestination.targetId}
              onValueChange={value => {
                const options = tempDestination.strategy === 'fila' ? filaOptions : usuarioOptions;
                const option = options.find(item => item.id === value);
                setTempDestination(prev => ({
                  ...prev,
                  targetId: value,
                  targetName: option?.name ?? value,
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar destino" />
              </SelectTrigger>
              <SelectContent>
                {(tempDestination.strategy === 'fila' ? filaOptions : usuarioOptions).map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select
              value={tempDestination.priority}
              onValueChange={value =>
                setTempDestination(prev => ({
                  ...prev,
                  priority: value as DestinationConfig['priority'],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanceada">Distribuição balanceada</SelectItem>
                <SelectItem value="prioridade_destino">Priorizar destino selecionado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Preservar proprietário atual</p>
                <p className="text-xs text-muted-foreground">Mantém o corretor original quando possível</p>
              </div>
              <Switch
                checked={tempDestination.preserveOwnership}
                onCheckedChange={value =>
                  setTempDestination(prev => ({ ...prev, preserveOwnership: value }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Notificar responsáveis</p>
                <p className="text-xs text-muted-foreground">Envia alerta para novos responsáveis</p>
              </div>
              <Switch
                checked={tempDestination.notifyOwners}
                onCheckedChange={value => setTempDestination(prev => ({ ...prev, notifyOwners: value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={tempDestination.notes ?? ''}
              onChange={event => setTempDestination(prev => ({ ...prev, notes: event.target.value }))}
              placeholder="Anote instruções adicionais sobre a redistribuição"
              rows={3}
            />
          </div>
        </div>
      </ResponsiveModal>

      <ResponsiveModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Pré-visualização da redistribuição"
        description="Confira a distribuição prevista antes de iniciar o processo."
        size="lg"
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleExecute}
              disabled={executing}
              className="bg-[hsl(var(--accent))] text-white hover:bg-[#E65C00]"
            >
              {executing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Iniciar redistribuição
            </Button>
          </div>
        }
      >
        {previewData ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Total selecionado</p>
                <p className="text-2xl font-semibold">{previewData.totalSelecionados}</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Estimativa de duração</p>
                <p className="text-2xl font-semibold">{previewData.duracaoEstimadaMinutos} min</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-xs uppercase text-muted-foreground">Conclusão prevista</p>
                <p className="text-sm font-medium">{formatDate(previewData.estimativaConclusao)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Motivos</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {previewData.motivos.map(item => (
                  <div key={item.motivo} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <span>{item.motivo}</span>
                    <Badge variant="secondary">{item.quantidade}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase text-muted-foreground">Distribuição</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Destino</TableHead>
                      <TableHead className="text-right">Leads</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.distribuicaoPorDestino.map(item => (
                      <TableRow key={item.targetId}>
                        <TableCell>{item.targetName}</TableCell>
                        <TableCell className="text-right">{item.leads}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal
        open={batchOpen}
        onOpenChange={setBatchOpen}
        title="Adicionar lote de leads"
        description="Simule a importação de novos leads arquivados reutilizando a configuração de destino."
        footer={
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setBatchOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportBatch} disabled={batchLoading}>
              {batchLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Importar lote
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do lote</Label>
            <Input
              value={batchForm.name}
              onChange={event => setBatchForm(prev => ({ ...prev, name: event.target.value }))}
              placeholder="Ex: Leads campanha Facebook"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min={1}
                value={batchForm.quantity}
                onChange={event => setBatchForm(prev => ({ ...prev, quantity: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Origem</Label>
              <Input
                value={batchForm.source}
                onChange={event => setBatchForm(prev => ({ ...prev, source: event.target.value }))}
                placeholder="Origem do lote"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Motivo de arquivamento</Label>
            <Select
              value={batchForm.reason}
              onValueChange={value => setBatchForm(prev => ({ ...prev, reason: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sem contato">Sem contato</SelectItem>
                <SelectItem value="Dados incompletos">Dados incompletos</SelectItem>
                <SelectItem value="Duplicado">Duplicado</SelectItem>
                <SelectItem value="Sem interesse">Sem interesse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            O lote será enviado para <strong>{destinationConfig.targetName}</strong>, conforme configuração atual.
          </div>
        </div>
      </ResponsiveModal>
    </div>
  );
}
