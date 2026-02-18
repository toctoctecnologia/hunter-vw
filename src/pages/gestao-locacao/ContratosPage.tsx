import { ReactNode, useMemo, useState } from 'react';
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
  FileText,
  Filter,
  ChevronRight,
  MoreVertical,
  Settings2,
  AlertTriangle,
  CalendarClock,
  ShieldCheck,
  Wallet,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  listContratos,
  summaryContratos,
  type ContratoLocacao,
  type ContratosFilters,
} from '@/services/gestao-locacao/contratosLocacaoService';

const defaultFilters: ContratosFilters = {
  vigencia: '',
  locador: '',
  locatario: '',
  imovel: '',
  garantia: '',
  status: '',
  faixaValor: '',
  diaVencimento: '',
};

const columnsConfig = [
  { id: 'valorAluguel', label: 'Valor do aluguel', tooltip: 'Valor mensal vigente para o contrato.' },
  { id: 'diaVencimento', label: 'Dia de vencimento', tooltip: 'Dia do mês definido em contrato para vencimento.' },
  { id: 'tipoGarantia', label: 'Tipo de garantia', tooltip: 'Garantia locatícia vinculada ao contrato.' },
  { id: 'inadimplencia', label: 'Inadimplência atual', tooltip: 'Indica se há parcelas em atraso.' },
  { id: 'saldoAberto', label: 'Saldo em aberto', tooltip: 'Valor total em aberto no contrato.' },
] as const;

type ColumnKey = (typeof columnsConfig)[number]['id'];
type DrawerRow = Record<string, string> & { id: string };
type IndicadorId = 'ativos' | 'encerramento' | 'vencendo' | 'inadimplentes';

export const ContratosPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContratos, setSelectedContratos] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    valorAluguel: true,
    diaVencimento: true,
    tipoGarantia: true,
    inadimplencia: true,
    saldoAberto: true,
  });
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'vigencia', label: 'Vigência' },
    { key: 'locador', label: 'Locador' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'garantia', label: 'Garantia' },
    { key: 'status', label: 'Status' },
    { key: 'faixaValor', label: 'Faixa de valor' },
    { key: 'diaVencimento', label: 'Dia de vencimento' },
  ]);
  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerSourceRows, setDrawerSourceRows] = useState<DrawerRow[]>([]);
  const [drawerExtraFilters, setDrawerExtraFilters] = useState<Record<string, string>>({});

  const { items: contratosData } = useMemo(() => listContratos(filters), [filters]);
  const { summary } = useMemo(() => summaryContratos(filters), [filters]);

  const locadores = useMemo(() => Array.from(new Set(contratosData.map((contrato) => contrato.locador))), [contratosData]);
  const locatarios = useMemo(() => Array.from(new Set(contratosData.map((contrato) => contrato.locatario))), [contratosData]);
  const imoveis = useMemo(() => Array.from(new Set(contratosData.map((contrato) => contrato.imovel.endereco))), [contratosData]);
  const garantias = useMemo(() => Array.from(new Set(contratosData.map((contrato) => contrato.tipoGarantia))), [contratosData]);

  const indicadores = useMemo<Array<{ id: IndicadorId; label: string; value: string; icon: typeof ShieldCheck; tone: string; bg: string }>>(
    () => [
      { id: 'ativos', label: 'Contratos de locação ativos', value: summary.ativos, icon: ShieldCheck, tone: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success)/0.12)]' },
      { id: 'encerramento', label: 'Contratos de locação em encerramento', value: summary.encerramento, icon: AlertTriangle, tone: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning)/0.12)]' },
      { id: 'vencendo', label: 'Vencendo em 30/60/90 dias', value: `${summary.vencendo30} / ${summary.vencendo60} / ${summary.vencendo90}`, icon: CalendarClock, tone: 'text-[hsl(var(--accent))]', bg: 'bg-[hsl(var(--accent)/0.12)]' },
      { id: 'inadimplentes', label: 'Contratos de locação inadimplentes', value: summary.inadimplentes, icon: Wallet, tone: 'text-[hsl(var(--danger))]', bg: 'bg-[hsl(var(--danger)/0.12)]' },
    ],
    [summary]
  );

  const filteredContratos = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    return contratosData.filter((contrato) => {
      const matchesSearch = !searchValue ||
        contrato.codigo.toLowerCase().includes(searchValue) ||
        contrato.imovel.endereco.toLowerCase().includes(searchValue) ||
        contrato.imovel.codigo.toLowerCase().includes(searchValue) ||
        contrato.locador.toLowerCase().includes(searchValue) ||
        contrato.locatario.toLowerCase().includes(searchValue);

      return matchesSearch;
    });
  }, [contratosData, searchTerm]);

  const drawerRows = useMemo(
    () =>
      drawerSourceRows.filter((row) =>
        Object.entries(drawerExtraFilters).every(([key, value]) => !value || row[key] === value)
      ),
    [drawerExtraFilters, drawerSourceRows]
  );

  const getStatusBadge = (status: ContratoLocacao['status']) => {
    const styles = {
      'Ativo': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Em encerramento': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Pendente': 'bg-[hsl(var(--accent)/0.16)] text-[hsl(var(--accent))]',
      'Encerrado': 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'
    };
    return <Badge className={`${styles[status]} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  const toggleContrato = (id: string) => {
    setSelectedContratos(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedContratos.length === filteredContratos.length) {
      setSelectedContratos([]);
    } else {
      setSelectedContratos(filteredContratos.map(c => c.id));
    }
  };
  const openDetails = (type: 'ativos' | 'encerramento' | 'vencendo-30' | 'vencendo-60' | 'vencendo-90' | 'inadimplentes') => {
    const baseFilters = [
      ...activeFilters,
      ...(searchTerm ? [{ label: 'Busca', value: searchTerm }] : []),
    ];

    if (type === 'ativos') {
      const rows = filteredContratos
        .filter((contrato) => contrato.status === 'Ativo')
        .map((contrato) => ({
          id: contrato.id,
          contrato: contrato.codigo,
          imovel: contrato.imovel.endereco,
          locador: contrato.locador,
          locatario: contrato.locatario,
          inicio: contrato.inicio,
          fim: contrato.fim,
          valor: contrato.valorAluguel,
          vencimento: contrato.diaVencimento,
          garantia: contrato.tipoGarantia,
          status: contrato.status,
        }));
      setDrawerColumns([
        { key: 'contrato', label: 'Contrato' },
        { key: 'imovel', label: 'Imóvel' },
        { key: 'locador', label: 'Locador' },
        { key: 'locatario', label: 'Locatário' },
        { key: 'inicio', label: 'Início' },
        { key: 'fim', label: 'Fim' },
        { key: 'valor', label: 'Valor aluguel', align: 'right' },
        { key: 'vencimento', label: 'Dia vencimento' },
        { key: 'garantia', label: 'Garantia' },
        { key: 'status', label: 'Status' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Contratos ativos',
        description: 'Lista de contratos de locação ativos.',
        filters: [...baseFilters, { label: 'Status', value: 'Ativo' }],
        rows,
      });
      return;
    }

    if (type === 'encerramento') {
      const rows = filteredContratos
        .filter((contrato) => contrato.status === 'Em encerramento')
        .map((contrato) => ({
          id: contrato.id,
          contrato: contrato.codigo,
          motivo: contrato.motivoEncerramento ?? 'Revisão contratual',
          dataPrevista: contrato.fim,
          status: contrato.status,
        }));
      setDrawerColumns([
        { key: 'contrato', label: 'Contrato' },
        { key: 'motivo', label: 'Motivo encerramento' },
        { key: 'dataPrevista', label: 'Data prevista' },
        { key: 'status', label: 'Status' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({});
      setDrawerFilterContent(null);
      detailsDrawer.openDrawer({
        title: 'Contratos em encerramento',
        description: 'Contratos com encerramento em andamento.',
        filters: [...baseFilters, { label: 'Status', value: 'Em encerramento' }],
        rows,
      });
      return;
    }

    if (type.startsWith('vencendo')) {
      const days = type === 'vencendo-30' ? 30 : type === 'vencendo-60' ? 60 : 90;
      const rows = filteredContratos
        .filter((contrato) => contrato.diasParaVencimento <= 90)
        .map((contrato) => ({
          id: contrato.id,
          contrato: contrato.codigo,
          fim: contrato.fim,
          diasRestantes: `${contrato.diasParaVencimento} dias`,
          valor: contrato.valorAluguel,
          locatario: contrato.locatario,
          janela: contrato.diasParaVencimento <= 30 ? '30' : contrato.diasParaVencimento <= 60 ? '60' : '90',
        }));
      setDrawerColumns([
        { key: 'contrato', label: 'Contrato' },
        { key: 'fim', label: 'Data fim' },
        { key: 'diasRestantes', label: 'Dias restantes' },
        { key: 'valor', label: 'Valor aluguel', align: 'right' },
        { key: 'locatario', label: 'Locatário' },
      ]);
      setDrawerSourceRows(rows);
      setDrawerExtraFilters({ janela: String(days) });
      setDrawerFilterContent(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--ui-text)]">Janela</label>
            <Select
              value={drawerExtraFilters.janela ?? String(days)}
              onValueChange={(value) => setDrawerExtraFilters({ janela: value })}
            >
              <SelectTrigger className="h-9 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="60">60 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      detailsDrawer.openDrawer({
        title: `Contratos vencendo em ${days} dias`,
        description: 'Contratos próximos do vencimento.',
        filters: [...baseFilters, { label: 'Vencimento', value: `${days} dias` }],
        rows,
      });
      return;
    }

    const rows = filteredContratos
      .filter((contrato) => contrato.inadimplente)
      .map((contrato) => ({
        id: contrato.id,
        contrato: contrato.codigo,
        locatario: contrato.locatario,
        parcelasAtraso: '2 parcelas',
        valorAtraso: contrato.saldoAberto,
        diasAtraso: '12 dias',
        status: 'Cobrança ativa',
      }));
    setDrawerColumns([
      { key: 'contrato', label: 'Contrato' },
      { key: 'locatario', label: 'Locatário' },
      { key: 'parcelasAtraso', label: 'Parcelas em atraso' },
      { key: 'valorAtraso', label: 'Valor em atraso', align: 'right' },
      { key: 'diasAtraso', label: 'Dias atraso' },
      { key: 'status', label: 'Status cobrança' },
    ]);
    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(null);
    detailsDrawer.openDrawer({
      title: 'Contratos inadimplentes',
      description: 'Contratos com parcelas em atraso.',
      filters: [...baseFilters, { label: 'Inadimplência', value: 'Ativa' }],
      rows,
    });
  };

  const exportColumns: ExportColumn[] = [
    { key: 'contrato', label: 'Contrato' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'locador', label: 'Locador' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'reajuste', label: 'Reajuste' },
    { key: 'valorAluguel', label: 'Valor do aluguel' },
    { key: 'diaVencimento', label: 'Dia vencimento' },
    { key: 'tipoGarantia', label: 'Tipo garantia' },
    { key: 'inadimplente', label: 'Inadimplente' },
    { key: 'saldoAberto', label: 'Saldo em aberto' },
    { key: 'status', label: 'Status' },
  ];

  const exportRows = useMemo(
    () =>
      (selectedContratos.length
        ? filteredContratos.filter((contrato) => selectedContratos.includes(contrato.id))
        : filteredContratos
      ).map((contrato) => ({
        contrato: contrato.codigo,
        imovel: contrato.imovel.endereco,
        locador: contrato.locador,
        locatario: contrato.locatario,
        reajuste: contrato.reajuste,
        valorAluguel: contrato.valorAluguel,
        diaVencimento: `Dia ${contrato.diaVencimento}`,
        tipoGarantia: contrato.tipoGarantia,
        inadimplente: contrato.inadimplente ? 'Sim' : 'Não',
        saldoAberto: contrato.saldoAberto,
        status: contrato.status,
      })),
    [filteredContratos, selectedContratos]
  );

  const handleExport = (format: 'csv' | 'pdf') => {
    exportGestaoLocacaoData({
      format,
      section: 'contratos_locacao',
      data: exportRows,
      columns: exportColumns,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <Filter className="w-4 h-4" />
        <span>Filtros avançados</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Período de vigência</label>
          <Select value={filters.vigencia} onValueChange={(value) => updateFilter('vigencia', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ate-6m">Até 6 meses</SelectItem>
              <SelectItem value="6-12m">6 a 12 meses</SelectItem>
              <SelectItem value="acima-12m">Acima de 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Em encerramento">Em encerramento</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Encerrado">Encerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Locador</label>
          <Select value={filters.locador} onValueChange={(value) => updateFilter('locador', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione um locador" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {locadores.map((locador) => (
                <SelectItem key={locador} value={locador}>{locador}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Locatário</label>
          <Select value={filters.locatario} onValueChange={(value) => updateFilter('locatario', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione um locatário" />
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
              <SelectValue placeholder="Selecione um imóvel" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {imoveis.map((imovel) => (
                <SelectItem key={imovel} value={imovel}>{imovel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Faixa de valor</label>
          <Select value={filters.faixaValor} onValueChange={(value) => updateFilter('faixaValor', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione a faixa" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ate-2500">Até R$ 2.500</SelectItem>
              <SelectItem value="2500-5000">R$ 2.500 a R$ 5.000</SelectItem>
              <SelectItem value="acima-5000">Acima de R$ 5.000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Garantia</label>
          <Select value={filters.garantia} onValueChange={(value) => updateFilter('garantia', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {garantias.map((garantia) => (
                <SelectItem key={garantia} value={garantia}>{garantia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Dia de vencimento</label>
          <Select value={filters.diaVencimento} onValueChange={(value) => updateFilter('diaVencimento', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="01">Dia 01</SelectItem>
              <SelectItem value="05">Dia 05</SelectItem>
              <SelectItem value="10">Dia 10</SelectItem>
              <SelectItem value="15">Dia 15</SelectItem>
              <SelectItem value="20">Dia 20</SelectItem>
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
      filtersTitle="Filtros de contratos de locação"
      filtersDescription="Refine contratos de locação por status, pessoas, imóvel e inadimplência."
      filtersCount={count + (searchTerm ? 1 : 0)}
      hasActiveFilters={hasActiveFilters || !!searchTerm}
      onClearFilters={() => {
        clearFilters();
        setSearchTerm('');
      }}
    >
      <TooltipProvider>
        <div className="mb-6">
          <FilterBar
            title="Filtros de contratos"
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
              <span className="text-xs text-[var(--ui-text-subtle)]">Status</span>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Em encerramento">Em encerramento</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Encerrado">Encerrado</SelectItem>
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
              <span className="text-xs text-[var(--ui-text-subtle)]">Locatário</span>
              <Select value={filters.locatario} onValueChange={(value) => updateFilter('locatario', value)}>
                <SelectTrigger className="h-10 w-52 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {locatarios.map((locatario) => (
                    <SelectItem key={locatario} value={locatario}>{locatario}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Garantia</span>
              <Select value={filters.garantia} onValueChange={(value) => updateFilter('garantia', value)}>
                <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {garantias.map((garantia) => (
                    <SelectItem key={garantia} value={garantia}>{garantia}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Vigência</span>
              <Select value={filters.vigencia} onValueChange={(value) => updateFilter('vigencia', value)}>
                <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ate-6m">Até 6 meses</SelectItem>
                  <SelectItem value="6-12m">6 a 12 meses</SelectItem>
                  <SelectItem value="acima-12m">Acima de 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FilterBar>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {indicadores.map((indicador) => (
            <KpiCardClickable
              key={indicador.label}
              title={indicador.label}
              value={indicador.value}
              icon={indicador.icon}
              tone={indicador.tone}
              iconBg={indicador.bg}
              onClick={() => {
                if (indicador.id === 'vencendo') {
                  openDetails('vencendo-30');
                  return;
                }
                openDetails(indicador.id === 'inadimplentes' ? 'inadimplentes' : indicador.id);
              }}
            />
          ))}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-3 border-b border-[var(--ui-stroke)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Contratos de locação ({filteredContratos.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 rounded-lg border-[var(--ui-stroke)] text-sm">
                      <Settings2 className="w-4 h-4 mr-2" />
                      Colunas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl w-64">
                    {columnsConfig.map((column) => (
                      <DropdownMenuItem
                        key={column.id}
                        className="flex items-center justify-between gap-2 cursor-pointer rounded-lg"
                        onSelect={(event) => event.preventDefault()}
                        onClick={() => setColumnVisibility((prev) => ({ ...prev, [column.id]: !prev[column.id] }))}
                      >
                        <span className="text-sm text-[var(--ui-text)]">{column.label}</span>
                        <Checkbox checked={columnVisibility[column.id]} className="rounded" />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 rounded-lg border-[var(--ui-stroke)] text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>Exportar CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>Exportar PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select defaultValue="data_cadastro">
                  <SelectTrigger className="w-44 h-9 rounded-lg border-[var(--ui-stroke)] text-sm">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="data_cadastro">Data de cadastro</SelectItem>
                    <SelectItem value="reajuste">Data de reajuste</SelectItem>
                    <SelectItem value="locatario">Locatário</SelectItem>
                    <SelectItem value="locador">Locador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--ui-stroke)]">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedContratos.length === filteredContratos.length && filteredContratos.length > 0}
                  onCheckedChange={toggleAll}
                  className="rounded"
                />
                <span className="text-sm text-[var(--ui-text-subtle)]">Selecionar</span>
              </div>
              {selectedContratos.length > 0 && (
                <span className="text-sm text-[hsl(var(--link))] font-medium">
                  {selectedContratos.length} selecionado(s)
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[var(--ui-stroke)]/30 text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Contrato</th>
                    <th className="px-6 py-3 text-left">Imóvel</th>
                    <th className="px-6 py-3 text-left">Locador</th>
                    <th className="px-6 py-3 text-left">Locatário</th>
                    <th className="px-6 py-3 text-left">Reajuste</th>
                    {columnVisibility.valorAluguel && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center gap-1">
                          Valor do aluguel
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                            </TooltipTrigger>
                            <TooltipContent>Valor vigente do aluguel mensal.</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    )}
                    {columnVisibility.diaVencimento && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center gap-1">
                          Dia de vencimento
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                            </TooltipTrigger>
                            <TooltipContent>Dia do mês definido em contrato.</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    )}
                    {columnVisibility.tipoGarantia && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center gap-1">
                          Tipo de garantia
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                            </TooltipTrigger>
                            <TooltipContent>Garantia locatícia formalizada.</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    )}
                    {columnVisibility.inadimplencia && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center gap-1">
                          Inadimplência
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                            </TooltipTrigger>
                            <TooltipContent>Existem parcelas em atraso.</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    )}
                    {columnVisibility.saldoAberto && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center gap-1">
                          Saldo em aberto
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                            </TooltipTrigger>
                            <TooltipContent>Valor pendente de cobrança.</TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                    )}
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ui-stroke)]">
                  {filteredContratos.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-10 text-center text-sm text-[var(--ui-text-subtle)]">
                        Nenhum contrato encontrado. Ajuste os filtros ou crie um novo contrato para iniciar a gestão.
                      </td>
                    </tr>
                  ) : (
                    filteredContratos.map((contrato) => (
                      <tr
                        key={contrato.id}
                        className="hover:bg-[var(--ui-stroke)]/30 transition-colors cursor-pointer"
                        onClick={(event) => {
                          if ((event.target as HTMLElement).closest('[data-stop-row]')) return;
                          navigate(`/gestao-locacao/contratos/${contrato.id}`);
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedContratos.includes(contrato.id)}
                              onCheckedChange={() => toggleContrato(contrato.id)}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded"
                            />
                            <span className="text-sm text-[hsl(var(--link))] font-medium hover:underline">
                              {contrato.codigo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[hsl(var(--link))] hover:underline font-medium">
                            {contrato.imovel.tipo} | {contrato.imovel.codigo}
                          </span>
                          <p className="text-xs text-[var(--ui-text-subtle)] mt-1">{contrato.imovel.endereco}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-[hsl(var(--link))] hover:underline">{contrato.locador}</td>
                        <td className="px-6 py-4 text-sm text-[hsl(var(--link))] hover:underline">{contrato.locatario}</td>
                        <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{contrato.reajuste}</td>
                        {columnVisibility.valorAluguel && (
                          <td className="px-6 py-4 text-sm font-medium text-[var(--ui-text)]">{contrato.valorAluguel}</td>
                        )}
                        {columnVisibility.diaVencimento && (
                          <td className="px-6 py-4 text-sm text-[var(--ui-text)]">Dia {contrato.diaVencimento}</td>
                        )}
                        {columnVisibility.tipoGarantia && (
                          <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{contrato.tipoGarantia}</td>
                        )}
                        {columnVisibility.inadimplencia && (
                          <td className="px-6 py-4">
                            <Badge
                              className={cn(
                                'rounded-lg px-2.5 py-0.5 text-xs font-medium',
                                contrato.inadimplente
                                  ? 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]'
                                  : 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]'
                              )}
                            >
                              {contrato.inadimplente ? 'Sim' : 'Não'}
                            </Badge>
                          </td>
                        )}
                        {columnVisibility.saldoAberto && (
                          <td className="px-6 py-4 text-sm font-semibold text-[var(--ui-text)]">{contrato.saldoAberto}</td>
                        )}
                        <td className="px-6 py-4">
                          {getStatusBadge(contrato.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2" data-stop-row>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuItem onClick={() => navigate(`/gestao-locacao/contratos/${contrato.id}`)}>
                                  Visualizar contrato
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/gestao-locacao/contratos/${contrato.id}`)}>
                                  Editar contrato
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/gestao-locacao/faturas')}>
                                  Ir para boletos vinculados
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Encerrar contrato</DropdownMenuItem>
                                <DropdownMenuItem>Renovar contrato</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <ChevronRight className="w-4 h-4 text-[var(--ui-text-subtle)]" />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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
                section: 'contratos_detalhados',
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
                section: 'contratos_detalhados',
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
              searchPlaceholder="Buscar contratos"
              emptyMessage="Nenhum contrato encontrado."
              onRowClick={(row) => navigate(`/gestao-locacao/contratos/${row.id}`)}
            />
          </DetailsDrawer>
        )}
      </TooltipProvider>
    </AlugueisLayout>
  );
};

export default ContratosPage;
