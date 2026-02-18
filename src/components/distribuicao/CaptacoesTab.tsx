import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { filasApi } from '@/api/filas';
import type { CaptacaoLead } from '@/types/filas';
import { formatDateWithFallback } from '@/utils/date';

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'novo', label: 'Novo' },
  { value: 'distribuido', label: 'Distribuído' },
  { value: 'atendido', label: 'Atendido' },
  { value: 'perdido', label: 'Perdido' },
  { value: 'represado', label: 'Represado' },
];

const ORIGEM_OPTIONS = [
  { value: 'todas', label: 'Todas as origens' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Site', label: 'Site' },
  { value: 'Google', label: 'Google' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'WhatsApp', label: 'WhatsApp' },
];

const EQUIPE_OPTIONS = [
  { value: 'todas', label: 'Todas as equipes' },
  { value: 'TINIS', label: 'TINIS' },
  { value: 'CHEFIM', label: 'CHEFIM' },
];

const CAPTADOR_OPTIONS = [
  { value: 'todos', label: 'Todos os captadores' },
  { value: 'Carlos Lima', label: 'Carlos Lima' },
  { value: 'Bia Souza', label: 'Bia Souza' },
  { value: 'Leandro Martins', label: 'Leandro Martins' },
  { value: 'Mariana Duarte', label: 'Mariana Duarte' },
];

const PAGE_SIZE = 10;

export default function CaptacoesTab() {
  const [captacoes, setCaptacoes] = useState<CaptacaoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filaOptions, setFilaOptions] = useState<{ value: string; label: string }[]>([
    { value: 'todas', label: 'Todas as filas' },
  ]);
  const [selectedLead, setSelectedLead] = useState<CaptacaoLead | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: 'todos',
    origem: 'todas',
    equipe: 'todas',
    captador: 'todos',
    filaId: 'todas',
    startDate: '',
    endDate: ''
  });

  const loadCaptacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await filasApi.getCaptacoes({
        page,
        perPage: PAGE_SIZE,
        ...Object.fromEntries(
          Object.entries(filters).map(([key, value]) => [
            key,
            (value === 'todos' || value === 'todas') ? '' : value
          ])
        )
      });
      setCaptacoes(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao carregar captações:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar captações');
      setCaptacoes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadCaptacoes();
  }, [loadCaptacoes]);

  useEffect(() => {
    const carregarFilas = async () => {
      try {
        const filas = await filasApi.getFilas();
        setFilaOptions([
          { value: 'todas', label: 'Todas as filas' },
          ...filas.map((fila) => ({ value: fila.id, label: fila.nome })),
        ]);
      } catch (err) {
        console.error('Erro ao carregar filas', err);
      }
    };

    carregarFilas();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'novo':
        return 'default';
      case 'distribuido':
        return 'success';
      case 'atendido':
        return 'success';
      case 'perdido':
        return 'destructive';
      case 'represado':
        return 'warning';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const option = STATUS_OPTIONS.find(s => s.value === status);
    return option?.label || status;
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Captações</h1>
        <p className="text-muted-foreground mt-1">
          Leads captados e seu status de distribuição
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border/80 bg-muted/40">
        <div className="flex items-center gap-2 border-b px-4 py-3 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Ajuste os filtros para encontrar as captações certas
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm font-medium mb-2 block">Origem</label>
            <Select
              value={filters.origem}
              onValueChange={(value) => handleFilterChange('origem', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar origem" />
              </SelectTrigger>
              <SelectContent>
                {ORIGEM_OPTIONS.map((origem) => (
                  <SelectItem key={origem.value} value={origem.value}>
                    {origem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Equipe</label>
            <Select
              value={filters.equipe}
              onValueChange={(value) => handleFilterChange('equipe', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar equipe" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Captador</label>
            <Select
              value={filters.captador}
              onValueChange={(value) => handleFilterChange('captador', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar captador" />
              </SelectTrigger>
              <SelectContent>
                {CAPTADOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Fila de distribuição</label>
            <Select
              value={filters.filaId}
              onValueChange={(value) => handleFilterChange('filaId', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar fila" />
              </SelectTrigger>
              <SelectContent>
                {filaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:col-span-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Data início</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data fim</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Carregando captações...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Captador</TableHead>
                  <TableHead>Captação</TableHead>
                  <TableHead>Fila</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma captação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  captacoes.map((captacao) => (
                    <TableRow
                      key={captacao.id}
                      className="cursor-pointer transition hover:bg-muted/60"
                      onClick={() => setSelectedLead(captacao)}
                    >
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {formatDateWithFallback(captacao.dataCaptura)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{captacao.nome}</div>
                          <div className="text-sm text-muted-foreground">{captacao.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{captacao.telefone || 'Sem telefone'}</div>
                          <div className="text-muted-foreground">{captacao.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">{captacao.origem}</Badge>
                          {captacao.equipe && (
                            <Badge variant="secondary" className="text-xs">
                              {captacao.equipe}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{captacao.captador || '—'}</div>
                          <div className="text-muted-foreground">Equipe {captacao.equipe || 'não informada'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {captacao.campanha && (
                            <div className="font-medium">{captacao.campanha}</div>
                          )}
                          {captacao.formulario && (
                            <div className="text-muted-foreground">{captacao.formulario}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{captacao.filaNome || 'Fila não informada'}</div>
                          <div className="text-xs text-muted-foreground">ID: {captacao.filaId || '—'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(captacao.status) as any}>
                          {getStatusLabel(captacao.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        onClick={() => page > 1 && setPage(page - 1)}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink className="cursor-default">
                        Página {page} de {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        onClick={() => page < totalPages && setPage(page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Card>

      <Drawer open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              {selectedLead?.nome}
            </DrawerTitle>
            <DrawerDescription>Detalhes completos da captação e distribuição.</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="px-4 pb-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoLine label="Contato" value={selectedLead?.email} description={selectedLead?.telefone} />
                <InfoLine label="Origem" value={selectedLead?.origem} description={selectedLead?.formulario} />
                <InfoLine label="Equipe / Captador" value={selectedLead?.equipe} description={selectedLead?.captador} />
                <InfoLine label="Campanha" value={selectedLead?.campanha || 'Não informado'} />
                <InfoLine label="Fila de distribuição" value={selectedLead?.filaNome || '—'} description={selectedLead?.filaId} />
                <InfoLine
                  label="Status"
                  value={selectedLead ? getStatusLabel(selectedLead.status) : '--'}
                  badgeVariant={selectedLead ? getStatusBadgeVariant(selectedLead.status) : undefined}
                />
              </div>
              <Separator />
              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Observações rápidas</p>
                <p className="mt-1">Use esse painel para decidir se o lead segue para a equipe correta antes da distribuição.</p>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface InfoLineProps {
  label: string;
  value?: string;
  description?: string;
  badgeVariant?: string;
}

function InfoLine({ label, value, description, badgeVariant }: InfoLineProps) {
  return (
    <div className="space-y-1 rounded-lg border bg-card/60 p-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      {badgeVariant ? (
        <Badge variant={badgeVariant as any}>{value}</Badge>
      ) : (
        <p className="text-sm font-medium text-foreground">{value || '—'}</p>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}