import { ReactNode, useMemo, useState } from 'react';
import { AlugueisLayout } from '@/layouts/AlugueisLayout';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  ClipboardCheck,
  Download,
  FileText,
  LineChart,
  Target,
  TrendingDown,
  TrendingUp,
  Timer,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { ChartCardClickable } from '@/components/gestao-locacao/interactive/ChartCardClickable';
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
  getCharts,
  getMetrics,
  listDrilldown,
  type DadosLocacaoFilters,
} from '@/services/gestao-locacao/dadosLocacaoService';

const defaultFilters: DadosLocacaoFilters = {
  periodo: '',
  unidade: '',
  locador: '',
  locatario: '',
  imovel: '',
  tipoImovel: '',
  faixaValor: '',
  statusContrato: '',
  statusInadimplencia: '',
  garantia: '',
};

type DrawerRow = Record<string, string> & { id: string };

export const AnalisesPage = () => {
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'periodo', label: 'Período' },
    { key: 'unidade', label: 'Unidade' },
    { key: 'locador', label: 'Locador' },
    { key: 'locatario', label: 'Locatário' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'tipoImovel', label: 'Tipo de imóvel' },
    { key: 'faixaValor', label: 'Faixa de valor' },
    { key: 'statusContrato', label: 'Status do contrato' },
    { key: 'statusInadimplencia', label: 'Status inadimplência' },
    { key: 'garantia', label: 'Garantia' },
  ]);
  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerSourceRows, setDrawerSourceRows] = useState<DrawerRow[]>([]);
  const [drawerExtraFilters, setDrawerExtraFilters] = useState<Record<string, string>>({});

  const { summary: metrics } = useMemo(() => getMetrics(filters), [filters]);
  const { chartData } = useMemo(() => getCharts(filters), [filters]);

  const drawerRows = useMemo(
    () =>
      drawerSourceRows.filter((row) =>
        Object.entries(drawerExtraFilters).every(([key, value]) => !value || row[key] === value)
      ),
    [drawerExtraFilters, drawerSourceRows]
  );

  const openDetails = (key: string, title: string, description?: string) => {
    const { items } = listDrilldown(key);
    const rows = items.map((item) => ({
      id: item.id,
      titulo: item.label,
      detalhe: item.detail,
      valor: item.value,
      status: item.status ?? '-',
    }));
    setDrawerColumns([
      { key: 'titulo', label: 'Item' },
      { key: 'detalhe', label: 'Detalhe' },
      { key: 'valor', label: 'Valor', align: 'right' },
      { key: 'status', label: 'Status' },
    ]);
    setDrawerSourceRows(rows);
    setDrawerExtraFilters({});
    setDrawerFilterContent(null);
    detailsDrawer.openDrawer({
      title,
      description,
      filters: activeFilters,
      rows,
    });
  };

  const exportColumns: ExportColumn[] = [
    { key: 'titulo', label: 'Item' },
    { key: 'detalhe', label: 'Detalhe' },
    { key: 'valor', label: 'Valor' },
    { key: 'status', label: 'Status' },
  ];

  const exportRows = useMemo(
    () =>
      listDrilldown('ativos').items.map((item) => ({
        titulo: item.label,
        detalhe: item.detail,
        valor: item.value,
        status: item.status ?? '-',
      })),
    []
  );

  const handleExport = (format: 'csv' | 'pdf') => {
    exportGestaoLocacaoData({
      format,
      section: 'dados_locacao',
      data: exportRows,
      columns: exportColumns,
    });
  };

  const metricCards = [
    { id: 'ativos', title: metrics[0].title, value: metrics[0].value, change: metrics[0].change, icon: Target },
    { id: 'renovacao', title: metrics[1].title, value: metrics[1].value, change: metrics[1].change, icon: ClipboardCheck },
    { id: 'tempo-contrato', title: metrics[2].title, value: metrics[2].value, change: metrics[2].change, icon: Calendar },
    { id: 'ticket-medio', title: metrics[3].title, value: metrics[3].value, change: metrics[3].change, icon: FileText },
  ];

  const extraWidgets = [
    { id: 'vacancia', title: metrics[4].title, value: metrics[4].value, change: metrics[4].change, icon: TrendingDown },
    { id: 'ocupacao', title: metrics[5].title, value: metrics[5].value, change: metrics[5].change, icon: TrendingUp },
    { id: 'tempo-alugar', title: metrics[6].title, value: metrics[6].value, change: metrics[6].change, icon: Timer },
    { id: 'reajustes', title: metrics[7].title, value: metrics[7].value, change: metrics[7].change, icon: Percent },
  ];

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <BarChart3 className="w-4 h-4" />
        <span>Filtros de dados de locação</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Período</label>
          <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="mes_atual">Mês atual</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Unidade</label>
          <Select value={filters.unidade} onValueChange={(value) => updateFilter('unidade', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="matriz">Matriz</SelectItem>
              <SelectItem value="zona-sul">Zona Sul</SelectItem>
              <SelectItem value="zona-norte">Zona Norte</SelectItem>
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
              <SelectItem value="maria">Maria Santos</SelectItem>
              <SelectItem value="joao">João Exemplo</SelectItem>
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
              <SelectItem value="luiz">Luiz Victor Ferreira</SelectItem>
              <SelectItem value="carolina">Carolina Lima</SelectItem>
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
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Tipo de imóvel</label>
          <Select value={filters.tipoImovel} onValueChange={(value) => updateFilter('tipoImovel', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Faixa de valor</label>
          <Select value={filters.faixaValor} onValueChange={(value) => updateFilter('faixaValor', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ate-2500">Até R$ 2.500</SelectItem>
              <SelectItem value="2500-5000">R$ 2.500 a R$ 5.000</SelectItem>
              <SelectItem value="acima-5000">Acima de R$ 5.000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status do contrato</label>
          <Select value={filters.statusContrato} onValueChange={(value) => updateFilter('statusContrato', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="encerramento">Em encerramento</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status de inadimplência</label>
          <Select value={filters.statusInadimplencia} onValueChange={(value) => updateFilter('statusInadimplencia', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="em-dia">Em dia</SelectItem>
              <SelectItem value="atraso">Em atraso</SelectItem>
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
              <SelectItem value="seguro">Seguro fiança</SelectItem>
              <SelectItem value="fiador">Fiador</SelectItem>
              <SelectItem value="caucao">Caução</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <AlugueisLayout
      filtersContent={filtersContent}
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
      filtersTitle="Filtros de dados de locação"
      filtersDescription="Controle a visão por período, unidade e status."
    >
      <div className="mb-6">
        <FilterBar
          title="Filtros de dados de locação"
          actions={(
            <Button
              variant="ghost"
              className="rounded-xl text-[hsl(var(--link))] hover:bg-[var(--ui-stroke)]/50"
              onClick={clearFilters}
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
            <span className="text-xs text-[var(--ui-text-subtle)]">Unidade</span>
            <Select value={filters.unidade} onValueChange={(value) => updateFilter('unidade', value)}>
              <SelectTrigger className="h-10 w-36 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="matriz">Matriz</SelectItem>
                <SelectItem value="zona-sul">Zona Sul</SelectItem>
                <SelectItem value="zona-norte">Zona Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--ui-text-subtle)]">Status contrato</span>
            <Select value={filters.statusContrato} onValueChange={(value) => updateFilter('statusContrato', value)}>
              <SelectTrigger className="h-10 w-44 rounded-xl border-[var(--ui-stroke)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="encerramento">Em encerramento</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
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
                <SelectItem value="seguro">Seguro fiança</SelectItem>
                <SelectItem value="fiador">Fiador</SelectItem>
                <SelectItem value="caucao">Caução</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterBar>
      </div>

      <div className="flex items-center justify-end gap-2 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricCards.map((kpi) => (
          <KpiCardClickable
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            description={kpi.change}
            icon={kpi.icon}
            tone="text-[hsl(var(--accent))]"
            iconBg="bg-[hsl(var(--accent)/0.12)]"
            onClick={() => openDetails(kpi.id, kpi.title, 'Detalhamento do indicador selecionado.')}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCardClickable
          title="Inadimplência da carteira"
          icon={<LineChart className="w-4 h-4" />}
          onClick={() => openDetails('inadimplenciaCarteira', 'Inadimplência da carteira', 'Evolução mensal da inadimplência.')}
        >
          <div className="space-y-4">
            {chartData.inadimplenciaCarteira.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-10">{item.label}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{item.display}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-[hsl(var(--danger))] rounded-full" style={{ width: `${item.value * 15}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <AlertTriangle className="w-4 h-4 text-[hsl(var(--danger))]" />
              Acompanhe a evolução mensal e ative cobranças automáticas para reduzir atrasos.
            </div>
          </div>
        </ChartCardClickable>

        <ChartCardClickable
          title="Performance da carteira"
          icon={<BarChart3 className="w-4 h-4" />}
          onClick={() => openDetails('performanceCarteira', 'Performance da carteira', 'Resumo dos principais indicadores.')}
        >
          <div className="space-y-4">
            {metricCards.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{metric.title}</span>
                <Badge variant="outline">{metric.value}</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCardClickable
          title="Inadimplência por locador"
          icon={<BarChart3 className="w-4 h-4" />}
          onClick={() => openDetails('inadimplenciaLocador', 'Inadimplência por locador', 'Ranking por locador.')}
        >
          <div className="space-y-3">
            {listDrilldown('inadimplenciaLocador').items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline">{item.value}</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>

        <ChartCardClickable
          title="Inadimplência por imóvel"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => openDetails('inadimplenciaImovel', 'Inadimplência por imóvel', 'Imóveis com maior atraso.')}
        >
          <div className="space-y-3">
            {listDrilldown('inadimplenciaImovel').items.map((item) => (
              <div key={item.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge className="bg-[hsl(var(--danger)/0.16)] text-[hsl(var(--danger))]">{item.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </ChartCardClickable>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {extraWidgets.map((widget) => (
          <KpiCardClickable
            key={widget.id}
            title={widget.title}
            value={widget.value}
            description={widget.change}
            icon={widget.icon}
            tone="text-[hsl(var(--accent))]"
            iconBg="bg-[hsl(var(--accent)/0.12)]"
            onClick={() => openDetails(widget.id, widget.title, 'Detalhamento do indicador selecionado.')}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardClickable
          title="Distribuição por tipo de garantia"
          icon={<Percent className="w-4 h-4" />}
          onClick={() => openDetails('garantias', 'Distribuição por tipo de garantia', 'Concentração por garantia.')}
        >
          <div className="space-y-3">
            {chartData.garantias.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline">{item.value}%</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>

        <ChartCardClickable
          title="Receita mensal"
          icon={<TrendingUp className="w-4 h-4" />}
          onClick={() => openDetails('receitaMensal', 'Receita mensal', 'Evolução mensal da receita.')}
        >
          <div className="space-y-3">
            {chartData.receitaMensal.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline">{item.value}%</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCardClickable
          title="Vacância"
          icon={<TrendingDown className="w-4 h-4" />}
          onClick={() => openDetails('vacancia', 'Vacância', 'Evolução mensal da vacância.')}
        >
          <div className="space-y-3">
            {chartData.vacancia.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline">{item.value}%</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>

        <ChartCardClickable
          title="Distratos e encerramentos"
          icon={<AlertTriangle className="w-4 h-4" />}
          onClick={() => openDetails('distratos', 'Distratos e encerramentos', 'Histórico de distratos e encerramentos.')}
        >
          <div className="space-y-3">
            {chartData.distratos.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="outline">{item.value} contratos</Badge>
              </div>
            ))}
          </div>
        </ChartCardClickable>
      </div>

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
              section: 'dados_locacao_detalhados',
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
              section: 'dados_locacao_detalhados',
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
            searchPlaceholder="Buscar registros"
            emptyMessage="Nenhum registro encontrado."
          />
        </DetailsDrawer>
      )}
    </AlugueisLayout>
  );
};

export default AnalisesPage;
