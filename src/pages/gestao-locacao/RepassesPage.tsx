import { Fragment, ReactNode, useMemo, useState } from 'react';
import { AlugueisLayout } from '@/layouts/AlugueisLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DollarSign,
  Download,
  Send,
  MoreVertical,
  Info,
  Wallet,
  HandCoins,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProcessarRepassesModal } from '@/components/gestao-locacao/repasses';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import {
  copyRowsToClipboard,
  exportGestaoLocacaoData,
  type ExportColumn,
} from '@/utils/gestaoLocacaoExport';
import {
  listTransferencias,
  summaryTransferencias,
  type Transferencia,
  type TransferenciasFilters,
} from '@/services/gestao-locacao/transferenciasService';

const defaultFilters: TransferenciasFilters = {
  periodo: '',
  locador: '',
  locatario: '',
  imovel: '',
  status: '',
  competencia: '',
  metodo: '',
  responsavel: '',
};

type DrawerRow = Record<string, string> & { id: string };

export const RepassesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepasses, setSelectedRepasses] = useState<string[]>([]);
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'periodo', label: 'Período' },
    { key: 'locador', label: 'Locador' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'status', label: 'Status' },
    { key: 'competencia', label: 'Competência' },
    { key: 'metodo', label: 'Método' },
    { key: 'responsavel', label: 'Responsável' },
  ]);
  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerSourceRows, setDrawerSourceRows] = useState<DrawerRow[]>([]);
  const [drawerExtraFilters, setDrawerExtraFilters] = useState<Record<string, string>>({});

  const { items: repasses } = useMemo(() => listTransferencias(filters), [filters]);
  const filteredRepasses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return repasses.filter((repasse) => {
      const matchesSearch = !search ||
        repasse.locador.toLowerCase().includes(search) ||
        repasse.imovel.toLowerCase().includes(search) ||
        repasse.contrato.toLowerCase().includes(search);

      return matchesSearch;
    });
  }, [repasses, searchTerm]);

  const groupedRepasses = useMemo(() => {
    return filteredRepasses.reduce<Record<string, Transferencia[]>>((acc, repasse) => {
      if (!acc[repasse.locador]) acc[repasse.locador] = [];
      acc[repasse.locador].push(repasse);
      return acc;
    }, {});
  }, [filteredRepasses]);

  const drawerRows = useMemo(
    () =>
      drawerSourceRows.filter((row) =>
        Object.entries(drawerExtraFilters).every(([key, value]) => !value || row[key] === value)
      ),
    [drawerSourceRows, drawerExtraFilters]
  );

  const locadores = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.locador))), [repasses]);
  const locatarios = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.locatario))), [repasses]);
  const imoveis = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.imovel))), [repasses]);
  const competencias = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.competencia))), [repasses]);
  const metodos = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.metodo))), [repasses]);
  const responsaveis = useMemo(() => Array.from(new Set(repasses.map((repasse) => repasse.responsavel))), [repasses]);

  const { summary } = useMemo(() => summaryTransferencias(filters), [filters]);

  const statsData = [
    { id: 'transferir', label: 'Total a transferir no período', value: `R$ ${summary.totalTransferir.toLocaleString('pt-BR')}`, icon: Wallet, color: 'text-[hsl(var(--accent))]', bg: 'bg-[hsl(var(--accent)/0.12)]' },
    { id: 'transferido', label: 'Total já transferido', value: `R$ ${summary.totalTransferido.toLocaleString('pt-BR')}`, icon: HandCoins, color: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success)/0.12)]' },
    { id: 'retido', label: 'Valores retidos', value: `R$ ${summary.totalRetido.toLocaleString('pt-BR')}`, icon: Building2, color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning)/0.12)]' },
    { id: 'comissao', label: 'Comissão da imobiliária', value: `R$ ${summary.totalComissao.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-[hsl(var(--danger))]', bg: 'bg-[hsl(var(--danger)/0.12)]' },
  ];

  const getStatusBadge = (status: Transferencia['status']) => {
    const styles = {
      Pendente: 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      Processando: 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
      Concluída: 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      Cancelada: 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]',
    };
    return <Badge className={`${styles[status]} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  const toggleRepasse = (id: string) => {
    setSelectedRepasses(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRepasses.length === filteredRepasses.length) {
      setSelectedRepasses([]);
    } else {
      setSelectedRepasses(filteredRepasses.map(r => r.id));
    }
  };

  const handleRowClick = (repasseId: string) => navigate(`/gestao-locacao/repasses/${repasseId}`);

  const selectedRepassesData = filteredRepasses.filter((repasse) => selectedRepasses.includes(repasse.id));

  const openDetails = (type: 'transferir' | 'transferido' | 'retido' | 'comissao') => {
    const baseFilters = [
      ...activeFilters,
      ...(searchTerm ? [{ label: 'Busca', value: searchTerm }] : []),
    ];

    if (type === 'transferir') {
      const rows = filteredRepasses
        .filter((repasse) => ['Pendente', 'Processando'].includes(repasse.status))
        .map((repasse) => ({
          id: repasse.id,
          locador: repasse.locador,
          locatario: repasse.locatario,
          imovel: repasse.imovel,
          competencia: repasse.competencia,
          valorBruto: repasse.valorBruto,
          comissao: repasse.comissao,
          retido: repasse.valorRetido,
          valorLiquido: repasse.valorLiquido,
          status: repasse.status,
          dataPrevista: repasse.dataPrevista,
        }));
      setDrawerColumns([
        { key: 'locador', label: 'Locador', sortable: true },
        { key: 'locatario', label: 'Locatário' },
        { key: 'imovel', label: 'Imóvel' },
        { key: 'competencia', label: 'Competência', sortable: true },
        { key: 'valorBruto', label: 'Valor bruto', align: 'right' },
        { key: 'comissao', label: 'Comissão', align: 'right' },
        { key: 'retido', label: 'Retido', align: 'right' },
        { key: 'valorLiquido', label: 'Valor líquido', align: 'right' },
        { key: 'status', label: 'Status' },
        { key: 'dataPrevista', label: 'Data prevista' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({ status: '' });
      setDrawerFilterContent(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--ui-text)]">Status</label>
            <Select value={drawerExtraFilters.status ?? ''} onValueChange={(value) => setDrawerExtraFilters({ status: value })}>
              <SelectTrigger className="h-9 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Processando">A processar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      detailsDrawer.openDrawer({
        title: 'Transferências pendentes',
        description: 'Valores previstos ou em processamento para transferir.',
        filters: [...baseFilters, { label: 'Status', value: 'Pendente ou a processar' }],
        rows,
      });
      return;
    }

    if (type === 'transferido') {
      const rows = filteredRepasses
        .filter((repasse) => repasse.status === 'Concluída')
        .map((repasse) => ({
          id: repasse.id,
          locador: repasse.locador,
          locatario: repasse.locatario,
          imovel: repasse.imovel,
          competencia: repasse.competencia,
          valorBruto: repasse.valorBruto,
          comissao: repasse.comissao,
          retido: repasse.valorRetido,
          valorLiquido: repasse.valorLiquido,
          status: repasse.status,
          dataExecucao: repasse.dataExecucao ?? '-',
          comprovante: repasse.comprovante ?? '-',
        }));
      setDrawerColumns([
        { key: 'locador', label: 'Locador', sortable: true },
        { key: 'locatario', label: 'Locatário' },
        { key: 'imovel', label: 'Imóvel' },
        { key: 'competencia', label: 'Competência' },
        { key: 'valorLiquido', label: 'Valor líquido', align: 'right' },
        { key: 'status', label: 'Status' },
        { key: 'dataExecucao', label: 'Data execução' },
        { key: 'comprovante', label: 'Comprovante' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Transferências concluídas',
        description: 'Transferências já executadas no período.',
        filters: [...baseFilters, { label: 'Status', value: 'Concluída' }],
        rows,
      });
      return;
    }

    if (type === 'retido') {
      const rows = filteredRepasses
        .filter((repasse) => repasse.valorRetido !== 'R$ 0,00')
        .map((repasse) => ({
          id: repasse.id,
          motivo: repasse.motivoRetencao ?? 'Ajuste',
          valorRetido: repasse.valorRetido,
          referencia: repasse.competencia,
          status: repasse.status,
          dataPrevista: repasse.dataPrevista,
        }));
      setDrawerColumns([
        { key: 'motivo', label: 'Motivo retenção', sortable: true },
        { key: 'valorRetido', label: 'Valor retido', align: 'right' },
        { key: 'referencia', label: 'Referência' },
        { key: 'status', label: 'Status' },
        { key: 'dataPrevista', label: 'Data' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Valores retidos',
        description: 'Itens com retenções aplicadas por ajustes e inadimplência.',
        filters: [...baseFilters, { label: 'Retenção', value: 'Ativa' }],
        rows,
      });
      return;
    }

    const rows = filteredRepasses.map((repasse) => ({
      id: repasse.id,
      baseCalculo: repasse.valorBruto,
      percentual: '10%',
      comissao: repasse.comissao,
      contrato: repasse.imovel,
      competencia: repasse.competencia,
    }));
    setDrawerColumns([
      { key: 'baseCalculo', label: 'Base de cálculo', align: 'right' },
      { key: 'percentual', label: 'Percentual', align: 'center' },
      { key: 'comissao', label: 'Comissão', align: 'right' },
      { key: 'contrato', label: 'Contrato' },
      { key: 'competencia', label: 'Competência' },
    ]);
    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(null);
    detailsDrawer.openDrawer({
      title: 'Comissão da imobiliária',
      description: 'Detalhamento das comissões sobre transferências.',
      filters: baseFilters,
      rows,
    });
  };

  const exportColumns: ExportColumn[] = [
    { key: 'contrato', label: 'Contrato' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'competencia', label: 'Competência' },
    { key: 'valorBruto', label: 'Valor bruto' },
    { key: 'comissao', label: 'Comissão' },
    { key: 'valorRetido', label: 'Retido' },
    { key: 'valorLiquido', label: 'Valor líquido' },
    { key: 'status', label: 'Status' },
    { key: 'locador', label: 'Locador' },
    { key: 'locatario', label: 'Locatário' },
  ];

  const exportRows = useMemo(
    () =>
      (selectedRepasses.length ? filteredRepasses.filter((repasse) => selectedRepasses.includes(repasse.id)) : filteredRepasses)
        .map((repasse) => ({
          contrato: repasse.contrato,
          imovel: repasse.imovel,
          competencia: repasse.competencia,
          valorBruto: repasse.valorBruto,
          comissao: repasse.comissao,
          valorRetido: repasse.valorRetido,
          valorLiquido: repasse.valorLiquido,
          status: repasse.status,
          locador: repasse.locador,
          locatario: repasse.locatario,
        })),
    [filteredRepasses, selectedRepasses]
  );

  const handleExport = (format: 'csv' | 'pdf') => {
    exportGestaoLocacaoData({
      format,
      section: 'transferencias',
      data: exportRows,
      columns: exportColumns,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <DollarSign className="w-4 h-4" />
        <span>Filtros de transferência</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Processando">Processando</SelectItem>
              <SelectItem value="Concluída">Concluída</SelectItem>
              <SelectItem value="Cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Locador</label>
          <Select value={filters.locador} onValueChange={(value) => updateFilter('locador', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {locadores.map((locador) => (
                <SelectItem key={locador} value={locador}>{locador}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Competência</label>
          <Select value={filters.competencia} onValueChange={(value) => updateFilter('competencia', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {competencias.map((competencia) => (
                <SelectItem key={competencia} value={competencia}>{competencia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Locatário</label>
          <Select value={filters.locatario} onValueChange={(value) => updateFilter('locatario', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {locatarios.map((locatario) => (
                <SelectItem key={locatario} value={locatario}>{locatario}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Imóvel</label>
          <Select value={filters.imovel} onValueChange={(value) => updateFilter('imovel', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {imoveis.map((imovel) => (
                <SelectItem key={imovel} value={imovel}>{imovel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Método de transferência</label>
          <Select value={filters.metodo} onValueChange={(value) => updateFilter('metodo', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {metodos.map((metodo) => (
                <SelectItem key={metodo} value={metodo}>{metodo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Responsável</label>
          <Select value={filters.responsavel} onValueChange={(value) => updateFilter('responsavel', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {responsaveis.map((responsavel) => (
                <SelectItem key={responsavel} value={responsavel}>{responsavel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <AlugueisLayout
      searchValue={searchTerm}
      onSearchChange={(event) => setSearchTerm(event.target.value)}
      filtersContent={filtersContent}
      filtersTitle="Filtros de transferências"
      filtersDescription="Acompanhe transferências por locador, competência e status."
      filtersCount={count + (searchTerm ? 1 : 0)}
      hasActiveFilters={hasActiveFilters || !!searchTerm}
      onClearFilters={() => {
        setSearchTerm('');
        clearFilters();
      }}
    >
      <TooltipProvider>
        <div className="mb-6">
          <FilterBar
            title="Filtros de transferência"
            actions={(
              <Button
                variant="ghost"
                className="rounded-xl text-[hsl(var(--link))] hover:bg-[var(--ui-stroke)]/50"
                onClick={() => {
                  clearFilters();
                  setSearchTerm('');
                }}
              >
                Limpar filtros
              </Button>
            )}
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Período</span>
              <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
                <SelectTrigger className="h-10 w-40 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="mes_atual">Mês atual</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="ano">Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Status</span>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Processando">Processando</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Locador</span>
              <Select value={filters.locador} onValueChange={(value) => updateFilter('locador', value)}>
                <SelectTrigger className="h-10 w-52 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {locadores.map((locador) => (
                    <SelectItem key={locador} value={locador}>{locador}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Competência</span>
              <Select value={filters.competencia} onValueChange={(value) => updateFilter('competencia', value)}>
                <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {competencias.map((competencia) => (
                    <SelectItem key={competencia} value={competencia}>{competencia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FilterBar>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat) => (
            <KpiCardClickable
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              tone={stat.color}
              iconBg={stat.bg}
              onClick={() => openDetails(stat.id as 'transferir' | 'transferido' | 'retido' | 'comissao')}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl h-11 px-5 shadow-lg shadow-[var(--brand-focus)]" onClick={() => setProcessModalOpen(true)}>
            <Send className="w-4 h-4 mr-2" />Processar transferências
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-11 px-5 border-[var(--ui-stroke)] bg-[var(--ui-card)] hover:bg-[var(--ui-stroke)]/50">
                <Download className="w-4 h-4 mr-2" />Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => handleExport('csv')}>Exportar CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>Exportar PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Transferências por locador ({filteredRepasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--ui-stroke)]">
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedRepasses.length === filteredRepasses.length && filteredRepasses.length > 0} onCheckedChange={toggleAll} className="rounded" />
                <span className="text-sm text-[var(--ui-text-subtle)]">Selecionar</span>
              </div>
              {selectedRepasses.length > 0 && (
                <span className="text-sm text-[hsl(var(--link))] font-medium">{selectedRepasses.length} selecionado(s)</span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide bg-[var(--ui-stroke)]/30">
                    <th className="px-6 py-3 text-left">Contrato</th>
                    <th className="px-6 py-3 text-left">Imóvel</th>
                    <th className="px-6 py-3 text-left">Competência</th>
                    <th className="px-6 py-3 text-left">Valor bruto</th>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center gap-1">
                        Comissão
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                          </TooltipTrigger>
                          <TooltipContent>Comissão da imobiliária aplicada à transferência.</TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left">Retido</th>
                    <th className="px-6 py-3 text-left">Valor líquido</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ui-stroke)]">
                  {filteredRepasses.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-10 text-center text-sm text-[var(--ui-text-subtle)]">
                        Nenhuma transferência encontrada. Ajuste os filtros ou processe novas transferências.
                      </td>
                    </tr>
                  ) : (
                    Object.entries(groupedRepasses).map(([locador, repasses]) => (
                      <Fragment key={locador}>
                        <tr key={`${locador}-header`} className="bg-muted/30">
                          <td colSpan={9} className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[var(--ui-text)]">{locador}</span>
                              <Badge className="bg-[var(--ui-stroke)] text-[var(--ui-text)] rounded-lg px-2.5 py-0.5 text-xs font-medium">
                                {repasses.length} transferência(s)
                              </Badge>
                            </div>
                          </td>
                        </tr>
                        {repasses.map((repasse) => (
                          <tr
                            key={repasse.id}
                            className="hover:bg-[var(--ui-stroke)]/30 transition-colors cursor-pointer"
                            onClick={() => handleRowClick(repasse.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Checkbox checked={selectedRepasses.includes(repasse.id)} onCheckedChange={() => toggleRepasse(repasse.id)} onClick={(event) => event.stopPropagation()} className="rounded" />
                                <span className="text-sm text-[hsl(var(--link))] font-medium hover:underline">{repasse.contrato}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text-subtle)]">{repasse.imovel}</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{repasse.competencia}</td>
                            <td className="px-6 py-4 text-sm font-medium text-[var(--ui-text)]">{repasse.valorBruto}</td>
                            <td className="px-6 py-4 text-sm text-[hsl(var(--danger))] font-medium">{repasse.comissao}</td>
                            <td className="px-6 py-4 text-sm text-[hsl(var(--warning))] font-medium">{repasse.valorRetido}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-[hsl(var(--success))]">{repasse.valorLiquido}</td>
                            <td className="px-6 py-4">{getStatusBadge(repasse.status)}</td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(event) => event.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem>Marcar como pago</DropdownMenuItem>
                                  <DropdownMenuItem>Exportar comprovante</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Ver detalhamento por contrato</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      <ProcessarRepassesModal
        open={processModalOpen}
        onOpenChange={setProcessModalOpen}
        repasses={selectedRepassesData}
        onConfirm={() => setProcessModalOpen(false)}
      />

      {detailsDrawer.context && (
        <DetailsDrawer
          open={detailsDrawer.open}
          onOpenChange={detailsDrawer.setOpen}
          title={detailsDrawer.context.title}
          description={detailsDrawer.context.description}
          filters={detailsDrawer.context.filters}
          onClearFilters={() => setDrawerExtraFilters({})}
          onExportCsv={() =>
            exportGestaoLocacaoData({
              format: 'csv',
              section: 'transferencias_detalhadas',
              data: drawerRows,
              columns: drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              })),
            })
          }
          onExportPdf={() =>
            exportGestaoLocacaoData({
              format: 'pdf',
              section: 'transferencias_detalhadas',
              data: drawerRows,
              columns: drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              })),
            })
          }
          onCopyList={() =>
            copyRowsToClipboard(
              drawerRows,
              drawerColumns.map((column) => ({
                key: String(column.key),
                label: column.label,
              }))
            )
          }
          filterContent={drawerFilterContent}
        >
          <DataTable
            columns={drawerColumns}
            rows={drawerRows}
            searchPlaceholder="Buscar transferências"
            emptyMessage="Nenhuma transferência encontrada."
            onRowClick={(row) => handleRowClick(row.id)}
          />
        </DetailsDrawer>
      )}
    </AlugueisLayout>
  );
};

export default RepassesPage;
