import { ReactNode, useMemo, useState } from 'react';
import { VendasLayout } from '@/layouts/VendasLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { ChartCardClickable } from '@/components/gestao-locacao/interactive/ChartCardClickable';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import {
  getCharts,
  getMetrics,
  listDrilldown,
  type DadosVendasFilters,
} from '@/services/gestao-vendas/salesAnalyticsService';
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  Download,
  LineChart,
  Target,
  Timer,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: DadosVendasFilters = {
  periodo: '',
  corretor: '',
  empreendimento: '',
  origem: '',
  tipoVenda: '',
};

type DrawerRow = Record<string, string> & { id: string };

export const DadosVendasPage = () => {
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'periodo', label: 'Período' },
    { key: 'corretor', label: 'Corretor' },
    { key: 'empreendimento', label: 'Empreendimento' },
    { key: 'origem', label: 'Origem' },
    { key: 'tipoVenda', label: 'Tipo de venda' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<DrawerRow>();
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DrawerRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);
  const [drawerRows, setDrawerRows] = useState<DrawerRow[]>([]);

  const { summary: metrics } = useMemo(() => getMetrics(filters), [filters]);
  const { chartData } = useMemo(() => getCharts(filters), [filters]);

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
    setDrawerRows(rows);
    setDrawerFilterContent(null);
    detailsDrawer.openDrawer({
      title,
      description,
      filters: activeFilters,
      rows,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <BarChart3 className="w-4 h-4" />
        <span>Filtros de dados de vendas</span>
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
          <label className="text-sm font-medium text-[var(--ui-text)]">Corretor</label>
          <Select value={filters.corretor} onValueChange={(value) => updateFilter('corretor', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="aline">Aline Moura</SelectItem>
              <SelectItem value="rafael">Rafael Santana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Empreendimento</label>
          <Select value={filters.empreendimento} onValueChange={(value) => updateFilter('empreendimento', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="aurora">Residencial Aurora</SelectItem>
              <SelectItem value="vale">Jardins do Vale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Origem</label>
          <Select value={filters.origem} onValueChange={(value) => updateFilter('origem', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="indicacao">Indicação</SelectItem>
              <SelectItem value="parcerias">Parcerias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Tipo de venda</label>
          <Select value={filters.tipoVenda} onValueChange={(value) => updateFilter('tipoVenda', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="pronto">Pronto</SelectItem>
              <SelectItem value="planta">Na planta</SelectItem>
              <SelectItem value="permuta">Permuta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const metricCards = [
    { id: 'conversao', title: metrics[0].title, value: metrics[0].value, change: metrics[0].change, icon: Target },
    { id: 'tempo-fechamento', title: metrics[1].title, value: metrics[1].value, change: metrics[1].change, icon: Timer },
    { id: 'ticket-medio', title: metrics[2].title, value: metrics[2].value, change: metrics[2].change, icon: TrendingUp },
    { id: 'comissao-media', title: metrics[3].title, value: metrics[3].value, change: metrics[3].change, icon: ClipboardCheck },
  ];

  const extraWidgets = [
    { id: 'origem-leads', title: metrics[4].title, value: metrics[4].value, change: metrics[4].change, icon: Users },
    { id: 'corretor-top', title: metrics[5].title, value: metrics[5].value, change: metrics[5].change, icon: Users },
    { id: 'empreendimento-top', title: metrics[6].title, value: metrics[6].value, change: metrics[6].change, icon: Calendar },
    { id: 'motivo-perda', title: metrics[7].title, value: metrics[7].value, change: metrics[7].change, icon: LineChart },
  ];

  return (
    <VendasLayout
      filtersContent={filtersContent}
      filtersTitle="Filtros de dados de vendas"
      filtersDescription="Acompanhe métricas e performance por etapa do funil de vendas."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Dados de vendas"
          description="Insights de conversão, tempo de fechamento e performance de corretores."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[110px] rounded-2xl" />
            ))
          ) : (
            metricCards.map((metric) => (
              <KpiCardClickable
                key={metric.id}
                title={metric.title}
                value={metric.value}
                description={metric.change}
                icon={metric.icon}
                onClick={() => openDetails(metric.id, metric.title)}
              />
            ))
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`extra-skeleton-${index}`} className="h-[110px] rounded-2xl" />
            ))
          ) : (
            extraWidgets.map((widget) => (
              <KpiCardClickable
                key={widget.id}
                title={widget.title}
                value={widget.value}
                description={widget.change}
                icon={widget.icon}
                onClick={() => openDetails(widget.id, widget.title)}
              />
            ))
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={`chart-skeleton-${index}`} className="h-[240px] rounded-2xl" />
            ))
          ) : (
            <>
              <ChartCardClickable
                title="Taxa de conversão por etapa"
                icon={<Target className="w-4 h-4" />}
                onClick={() => openDetails('conversao', 'Taxa de conversão por etapa')}
              >
                <div className="space-y-3">
                  {chartData.conversaoEtapas.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className="w-24 text-[var(--ui-text-subtle)]">{item.label}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-[var(--ui-text-subtle)] mb-1">
                          <span>{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--ui-stroke)]/50">
                          <div className="h-2 rounded-full bg-[hsl(var(--accent))]" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCardClickable>
              <ChartCardClickable
                title="Tempo médio de fechamento"
                icon={<Timer className="w-4 h-4" />}
                onClick={() => openDetails('tempo-fechamento', 'Tempo médio de fechamento')}
              >
                <div className="space-y-3">
                  {chartData.tempoFechamento.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--ui-text-subtle)]">{item.label}</span>
                      <span className="font-medium text-[var(--ui-text)]">{item.value} dias</span>
                    </div>
                  ))}
                </div>
              </ChartCardClickable>
              <ChartCardClickable
                title="Ticket médio de venda"
                icon={<TrendingUp className="w-4 h-4" />}
                onClick={() => openDetails('ticket-medio', 'Ticket médio de venda')}
              >
                <div className="space-y-3">
                  {chartData.ticketMedio.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--ui-text-subtle)]">{item.label}</span>
                      <span className="font-medium text-[var(--ui-text)]">{item.display ?? item.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCardClickable>
              <ChartCardClickable
                title="Comissão média"
                icon={<ClipboardCheck className="w-4 h-4" />}
                onClick={() => openDetails('comissao-media', 'Comissão média')}
              >
                <div className="space-y-3">
                  {chartData.comissaoMedia.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--ui-text-subtle)]">{item.label}</span>
                      <span className="font-medium text-[var(--ui-text)]">{item.value} mil</span>
                    </div>
                  ))}
                </div>
              </ChartCardClickable>
              <ChartCardClickable
                title="Origem de leads x fechamento"
                icon={<Users className="w-4 h-4" />}
                onClick={() => openDetails('origem-leads', 'Origem de leads x fechamento')}
              >
                <div className="space-y-3">
                  {chartData.origemLeads.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--ui-text-subtle)]">{item.label}</span>
                      <span className="font-medium text-[var(--ui-text)]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </ChartCardClickable>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Exportar relatório
          </Button>
        </div>
      </div>

      <DetailsDrawer
        open={detailsDrawer.open}
        onOpenChange={detailsDrawer.setOpen}
        title={detailsDrawer.context?.title}
        description={detailsDrawer.context?.description}
        filters={detailsDrawer.context?.filters}
        filterContent={drawerFilterContent}
      >
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhum dado encontrado." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default DadosVendasPage;
