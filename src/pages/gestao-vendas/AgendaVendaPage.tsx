import { ReactNode, useMemo, useState } from 'react';
import { VendasLayout } from '@/layouts/VendasLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import { listSaleEvents, type SaleEventFilters } from '@/services/gestao-vendas/saleEventsService';
import { Badge } from '@/components/ui/badge';
import { Calendar, CalendarDays, CalendarRange, ClipboardCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleEventFilters = {
  status: '',
  responsavel: '',
  periodo: '',
  tipo: '',
};

type EventRow = {
  id: string;
  contrato: string;
  titulo: string;
  data: string;
  horario: string;
  responsavel: string;
  status: string;
  origem: string;
};

const views = [
  { id: 'dia', label: 'Dia', icon: CalendarDays },
  { id: 'semana', label: 'Semana', icon: CalendarRange },
  { id: 'mes', label: 'Mês', icon: Calendar },
];

export const AgendaVendaPage = () => {
  const [activeView, setActiveView] = useState('semana');
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'status', label: 'Status' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'periodo', label: 'Período' },
    { key: 'tipo', label: 'Tipo' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<EventRow>();
  const [drawerRows, setDrawerRows] = useState<EventRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<EventRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  const { items } = useMemo(() => listSaleEvents(filters), [filters]);

  const rows: EventRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        contrato: item.contrato,
        titulo: item.titulo,
        data: item.data,
        horario: item.horario,
        responsavel: item.responsavel,
        status: item.status,
        origem: item.origem,
      })),
    [items]
  );

  const columns: DataTableColumn<EventRow>[] = [
    { key: 'titulo', label: 'Evento' },
    { key: 'data', label: 'Data' },
    { key: 'horario', label: 'Hora' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'status', label: 'Status' },
    { key: 'origem', label: 'Origem' },
  ];

  const openDetails = (status: string, title: string) => {
    const filtered = rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Eventos filtrados automaticamente pelo status selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <ClipboardCheck className="w-4 h-4" />
        <span>Filtros da agenda</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Previsto', 'Confirmado', 'Concluído', 'Cancelado'].map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
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
              {[...new Set(rows.map((row) => row.responsavel))].map((responsavel) => (
                <SelectItem key={responsavel} value={responsavel}>{responsavel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <VendasLayout
      filtersContent={filtersContent}
      filtersTitle="Filtros da agenda de vendas"
      filtersDescription="Acompanhe marcos, reuniões e prazos obrigatórios do processo de venda."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Agenda da venda"
          description="Visualização diária, semanal e mensal dos eventos do processo de venda."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {views.map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? 'default' : 'outline'}
                className="rounded-xl"
                onClick={() => setActiveView(view.id)}
              >
                <view.icon className="w-4 h-4 mr-2" />
                {view.label}
              </Button>
            ))}
          </div>
          <Button className="rounded-xl">Novo evento</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[140px] rounded-2xl" />
            ))
          ) : (
            ['Previsto', 'Confirmado', 'Concluído'].map((status) => (
              <Card key={status} className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">{status}</CardTitle>
                  <Badge variant="secondary" className="rounded-full">{rows.filter((row) => row.status === status).length}</Badge>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="rounded-xl w-full" onClick={() => openDetails(status, `Eventos ${status.toLowerCase()}`)}>
                    Ver eventos
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Agenda de eventos</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">Clique em um evento para atualizar status ou detalhes.</p>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={rows}
              searchPlaceholder="Buscar eventos"
              emptyMessage="Nenhum evento encontrado para os filtros aplicados."
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>

      <DetailsDrawer
        open={detailsDrawer.open}
        onOpenChange={detailsDrawer.setOpen}
        title={detailsDrawer.context?.title}
        description={detailsDrawer.context?.description}
        filters={detailsDrawer.context?.filters}
        filterContent={drawerFilterContent}
      >
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhum evento encontrado." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default AgendaVendaPage;
