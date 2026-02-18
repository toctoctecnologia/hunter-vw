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
  Plus,
  FileText,
  DollarSign,
  Calendar as CalendarIcon,
  Download,
  MoreVertical,
  Info,
  Wallet,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  listBoletos,
  summaryBoletos,
  type Boleto,
  type BoletosFilters,
} from '@/services/gestao-locacao/boletosService';

const defaultFilters: BoletosFilters = {
  periodo: '',
  vencimento: '',
  status: '',
  locatario: '',
  locador: '',
  imovel: '',
  formaPagamento: '',
  busca: '',
};

const statusSections = [
  { id: 'Em atraso', label: 'Em atraso', badge: 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]' },
  { id: 'Em aberto', label: 'Em aberto', badge: 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]' },
  { id: 'Pago', label: 'Pagos', badge: 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]' },
] as const;

type DrawerRow = Record<string, string> & { id: string };

export const FaturasPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaturas, setSelectedFaturas] = useState<string[]>([]);
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'periodo', label: 'Período' },
    { key: 'vencimento', label: 'Vencimento' },
    { key: 'status', label: 'Status' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'locador', label: 'Locador' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'formaPagamento', label: 'Forma de pagamento' },
  ]);
  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerSourceRows, setDrawerSourceRows] = useState<DrawerRow[]>([]);
  const [drawerExtraFilters, setDrawerExtraFilters] = useState<Record<string, string>>({});

  const { items: boletosData } = useMemo(() => listBoletos(filters), [filters]);
  const { summary } = useMemo(() => summaryBoletos(filters), [filters]);

  const locadores = useMemo(() => Array.from(new Set(boletosData.map((boleto) => boleto.locador))), [boletosData]);
  const locatarios = useMemo(() => Array.from(new Set(boletosData.map((boleto) => boleto.locatario))), [boletosData]);
  const imoveis = useMemo(() => Array.from(new Set(boletosData.map((boleto) => boleto.imovel))), [boletosData]);
  const competencias = useMemo(() => Array.from(new Set(boletosData.map((boleto) => boleto.competencia))), [boletosData]);
  const formasPagamento = useMemo(() => Array.from(new Set(boletosData.map((boleto) => boleto.formaPagamento))), [boletosData]);

  const filteredFaturas = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return boletosData.filter((fatura) => {
      const matchesSearch = !search ||
        fatura.numero.toLowerCase().includes(search) ||
        fatura.contrato.toLowerCase().includes(search) ||
        fatura.locatario.toLowerCase().includes(search) ||
        fatura.imovel.toLowerCase().includes(search);

      return matchesSearch;
    });
  }, [boletosData, searchTerm]);

  const groupedFaturas = useMemo(() => {
    return statusSections.map((section) => ({
      ...section,
      items: filteredFaturas.filter((fatura) => fatura.status === section.id),
    }));
  }, [filteredFaturas]);

  const statsData = [
    { id: 'faturado', label: 'Total faturado no mês', value: `R$ ${summary.totalFaturado.toLocaleString('pt-BR')}`, icon: FileText, color: 'text-[hsl(var(--accent))]', bg: 'bg-[hsl(var(--accent)/0.12)]' },
    { id: 'pago', label: 'Total pago', value: `R$ ${summary.totalPago.toLocaleString('pt-BR')}`, icon: Wallet, color: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success)/0.12)]' },
    { id: 'aberto', label: 'Total em aberto', value: `R$ ${summary.totalAberto.toLocaleString('pt-BR')}`, icon: CalendarIcon, color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning)/0.12)]' },
    { id: 'atraso', label: 'Total em atraso', value: `R$ ${summary.totalAtraso.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-[hsl(var(--danger))]', bg: 'bg-[hsl(var(--danger)/0.12)]' },
  ];

  const getStatusBadge = (status: Boleto['status']) => {
    const styles = {
      'Pago': 'bg-[hsl(var(--success)/0.16)] text-[hsl(var(--success))]',
      'Em aberto': 'bg-[hsl(var(--warning)/0.16)] text-[hsl(var(--warning))]',
      'Em atraso': 'bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]',
    };
    return <Badge className={`${styles[status]} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>{status}</Badge>;
  };

  const toggleFatura = (id: string) => {
    setSelectedFaturas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedFaturas.length === filteredFaturas.length) {
      setSelectedFaturas([]);
    } else {
      setSelectedFaturas(filteredFaturas.map(f => f.id));
    }
  };

  const drawerRows = useMemo(
    () =>
      drawerSourceRows.filter((row) =>
        Object.entries(drawerExtraFilters).every(([key, value]) => !value || row[key] === value)
      ),
    [drawerExtraFilters, drawerSourceRows]
  );

  const openDetails = (type: 'faturado' | 'pago' | 'aberto' | 'atraso') => {
    const baseFilters = [
      ...activeFilters,
      ...(searchTerm ? [{ label: 'Busca', value: searchTerm }] : []),
    ];

    const rows = filteredFaturas
      .filter((fatura) => {
        if (type === 'pago') return fatura.status === 'Pago';
        if (type === 'aberto') return fatura.status === 'Em aberto';
        if (type === 'atraso') return fatura.status === 'Em atraso';
        return true;
      })
      .map((fatura) => ({
        id: fatura.id,
        numero: fatura.numero,
        contrato: fatura.contrato,
        locatario: fatura.locatario,
        competencia: fatura.competencia,
        vencimento: fatura.vencimento,
        multaJuros: fatura.multaJuros,
        formaPagamento: fatura.formaPagamento,
        valor: fatura.valor,
        status: fatura.status,
        dataPagamento: fatura.dataPagamento ?? '-',
        diasAtraso: fatura.diasAtraso ? `${fatura.diasAtraso} dias` : '-',
      }));

    setDrawerColumns([
      { key: 'numero', label: 'Número boleto' },
      { key: 'contrato', label: 'Contrato' },
      { key: 'locatario', label: 'Locatário' },
      { key: 'competencia', label: 'Competência' },
      { key: 'vencimento', label: 'Vencimento' },
      { key: 'multaJuros', label: 'Multa/juros', align: 'right' },
      { key: 'formaPagamento', label: 'Forma pagamento' },
      { key: 'valor', label: 'Valor', align: 'right' },
      { key: 'status', label: 'Status' },
      ...(type === 'pago' ? [{ key: 'dataPagamento', label: 'Data pagamento' }] : []),
      ...(type === 'atraso' ? [{ key: 'diasAtraso', label: 'Dias atraso' }] : []),
    ]);

    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(null);

    detailsDrawer.openDrawer({
      title:
        type === 'faturado'
          ? 'Total faturado no mês'
          : type === 'pago'
            ? 'Boletos pagos'
            : type === 'aberto'
              ? 'Boletos em aberto'
              : 'Boletos em atraso',
      description: 'Detalhamento completo dos boletos com filtros aplicados.',
      filters: [
        ...baseFilters,
        ...(type === 'pago' ? [{ label: 'Status', value: 'Pago' }] : []),
        ...(type === 'aberto' ? [{ label: 'Status', value: 'Em aberto' }] : []),
        ...(type === 'atraso' ? [{ label: 'Status', value: 'Em atraso' }] : []),
      ],
      rows,
    });
  };

  const exportColumns: ExportColumn[] = [
    { key: 'numero', label: 'Número boleto' },
    { key: 'contrato', label: 'Contrato' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'competencia', label: 'Competência' },
    { key: 'vencimento', label: 'Vencimento' },
    { key: 'multaJuros', label: 'Multa/juros' },
    { key: 'formaPagamento', label: 'Forma pagamento' },
    { key: 'valor', label: 'Valor' },
    { key: 'status', label: 'Status' },
    { key: 'dataPagamento', label: 'Data pagamento' },
  ];

  const exportRows = useMemo(
    () =>
      (selectedFaturas.length ? filteredFaturas.filter((fatura) => selectedFaturas.includes(fatura.id)) : filteredFaturas)
        .map((fatura) => ({
          numero: fatura.numero,
          contrato: fatura.contrato,
          locatario: fatura.locatario,
          competencia: fatura.competencia,
          vencimento: fatura.vencimento,
          multaJuros: fatura.multaJuros,
          formaPagamento: fatura.formaPagamento,
          valor: fatura.valor,
          status: fatura.status,
          dataPagamento: fatura.dataPagamento ?? '-',
        })),
    [filteredFaturas, selectedFaturas]
  );

  const handleExport = (format: 'csv' | 'pdf') => {
    exportGestaoLocacaoData({
      format,
      section: 'boletos',
      data: exportRows,
      columns: exportColumns,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <FileText className="w-4 h-4" />
        <span>Filtros financeiros</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Em atraso">Em atraso</SelectItem>
              <SelectItem value="Em aberto">Em aberto</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Competência</label>
          <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
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
          <label className="text-sm font-medium text-[var(--ui-text)]">Vencimento</label>
          <Select value={filters.vencimento} onValueChange={(value) => updateFilter('vencimento', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="7dias">Próximos 7 dias</SelectItem>
              <SelectItem value="15dias">Próximos 15 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Forma de pagamento</label>
          <Select value={filters.formaPagamento} onValueChange={(value) => updateFilter('formaPagamento', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {formasPagamento.map((forma) => (
                <SelectItem key={forma} value={forma}>{forma}</SelectItem>
              ))}
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
      </div>
    </div>
  );

  return (
    <AlugueisLayout
      searchValue={searchTerm}
      onSearchChange={(event) => setSearchTerm(event.target.value)}
      filtersContent={filtersContent}
      filtersTitle="Filtros de boletos"
      filtersDescription="Acompanhe boletos por status, competência e forma de pagamento."
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
            title="Filtros de boletos"
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
                <SelectTrigger className="h-10 w-40 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Em aberto">Em aberto</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Em atraso">Em atraso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Competência</span>
              <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
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
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Vencimento</span>
              <Select value={filters.vencimento} onValueChange={(value) => updateFilter('vencimento', value)}>
                <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="7dias">Próximos 7 dias</SelectItem>
                  <SelectItem value="15dias">Próximos 15 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Forma pagamento</span>
              <Select value={filters.formaPagamento} onValueChange={(value) => updateFilter('formaPagamento', value)}>
                <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-[var(--ui-text-subtle)]">Locatário</span>
              <Select value={filters.locatario} onValueChange={(value) => updateFilter('locatario', value)}>
                <SelectTrigger className="h-10 w-48 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {locatarios.map((locatario) => (
                    <SelectItem key={locatario} value={locatario}>{locatario}</SelectItem>
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
              onClick={() => openDetails(stat.id as 'faturado' | 'pago' | 'aberto' | 'atraso')}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-xl h-11 px-5 shadow-lg shadow-[var(--brand-focus)]"
            onClick={() => navigate('/gestao-locacao/faturas/nova')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo boleto
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-11 px-5 border-[var(--ui-stroke)] bg-background hover:bg-[var(--ui-stroke)]/50">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Boletos ({filteredFaturas.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--ui-stroke)]">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFaturas.length === filteredFaturas.length && filteredFaturas.length > 0}
                  onCheckedChange={toggleAll}
                  className="rounded"
                />
                <span className="text-sm text-[var(--ui-text-subtle)]">Selecionar</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-xs font-medium text-[var(--ui-text-subtle)] uppercase tracking-wide bg-[var(--ui-stroke)]/30">
                    <th className="px-6 py-3 text-left">Número</th>
                    <th className="px-6 py-3 text-left">Contrato</th>
                    <th className="px-6 py-3 text-left">Locatário</th>
                    <th className="px-6 py-3 text-left">Competência</th>
                    <th className="px-6 py-3 text-left">Vencimento</th>
                    <th className="px-6 py-3 text-left">
                      <div className="flex items-center gap-1">
                        Multa/Juros
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-[var(--ui-text-subtle)]" />
                          </TooltipTrigger>
                          <TooltipContent>Valores aplicados por atraso.</TooltipContent>
                        </Tooltip>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left">Forma de pagamento</th>
                    <th className="px-6 py-3 text-left">Valor</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ui-stroke)]">
                  {filteredFaturas.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-10 text-center text-sm text-[var(--ui-text-subtle)]">
                        Nenhum boleto encontrado. Ajuste os filtros ou emita um novo boleto.
                      </td>
                    </tr>
                  ) : (
                    groupedFaturas.map((section) => (
                      <Fragment key={section.id}>
                        <tr key={`${section.id}-header`} className="bg-muted/30">
                          <td colSpan={10} className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-[var(--ui-text)]">{section.label}</span>
                              <Badge className={`${section.badge} rounded-lg px-2.5 py-0.5 text-xs font-medium`}>
                                {section.items.length} boletos
                              </Badge>
                            </div>
                          </td>
                        </tr>
                        {section.items.map((fatura) => (
                          <tr
                            key={fatura.id}
                            className="hover:bg-[var(--ui-stroke)]/30 transition-colors cursor-pointer"
                            onClick={() => navigate(`/gestao-locacao/faturas/${fatura.id}`)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedFaturas.includes(fatura.id)}
                                  onCheckedChange={() => toggleFatura(fatura.id)}
                                  onClick={(event) => event.stopPropagation()}
                                  className="rounded"
                                />
                                <span className="text-sm font-medium text-[hsl(var(--link))] hover:underline">
                                  {fatura.numero}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                to={`/gestao-locacao/contratos/${fatura.contrato}`}
                                className="text-sm text-[hsl(var(--link))] hover:underline"
                                onClick={(event) => event.stopPropagation()}
                              >
                                {fatura.contrato}
                              </Link>
                            </td>
                            <td className="px-6 py-4 text-sm text-[hsl(var(--link))] hover:underline">{fatura.locatario}</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{fatura.competencia}</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{fatura.vencimento}</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text)]">{fatura.multaJuros}</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text-subtle)]">{fatura.formaPagamento}</td>
                            <td className="px-6 py-4 text-sm font-medium text-[var(--ui-text)]">{fatura.valor}</td>
                            <td className="px-6 py-4">{getStatusBadge(fatura.status)}</td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(event) => event.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                  <DropdownMenuItem>Emitir segunda via</DropdownMenuItem>
                                  <DropdownMenuItem>Registrar pagamento manual</DropdownMenuItem>
                                  <DropdownMenuItem>Enviar cobrança</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Ver histórico do boleto</DropdownMenuItem>
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
                section: 'boletos_detalhados',
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
                section: 'boletos_detalhados',
                data: drawerRows,
                columns: drawerColumns.map((column) => ({
                  key: String(column.key),
                  label: column.label,
                })),
              })
            }
            onCopyList={() => copyRowsToClipboard(drawerRows, drawerColumns.map((column) => ({
              key: String(column.key),
              label: column.label,
            })))}
            filterContent={drawerFilterContent}
          >
            <DataTable
              columns={drawerColumns}
              rows={drawerRows}
              searchPlaceholder="Buscar boletos"
              emptyMessage="Nenhum boleto encontrado."
              onRowClick={(row) => navigate(`/gestao-locacao/faturas/${row.id}`)}
            />
          </DetailsDrawer>
        )}
      </TooltipProvider>
    </AlugueisLayout>
  );
};

export default FaturasPage;
