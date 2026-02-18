import { ReactNode, useMemo, useState } from 'react';
import { VendasLayout } from '@/layouts/VendasLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import { listSaleTransfers, type SaleTransferFilters } from '@/services/gestao-vendas/saleTransfersService';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, FileCheck2, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleTransferFilters = {
  status: '',
  responsavel: '',
  contrato: '',
};

type TransferRow = {
  id: string;
  contrato: string;
  tarefa: string;
  status: string;
  responsavel: string;
  dataPrevista: string;
  dataConclusao: string;
  anexos: string;
};

export const TransferenciasPage = () => {
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
    { key: 'contrato', label: 'Contrato' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<TransferRow>();
  const [drawerRows, setDrawerRows] = useState<TransferRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<TransferRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  const { items } = useMemo(() => listSaleTransfers(filters), [filters]);

  const rows: TransferRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        contrato: item.contrato,
        tarefa: item.tarefa,
        status: item.status,
        responsavel: item.responsavel,
        dataPrevista: item.dataPrevista,
        dataConclusao: item.dataConclusao,
        anexos: item.anexos,
      })),
    [items]
  );

  const columns: DataTableColumn<TransferRow>[] = [
    { key: 'tarefa', label: 'Tarefa' },
    { key: 'status', label: 'Status' },
    { key: 'responsavel', label: 'Responsável' },
    { key: 'dataPrevista', label: 'Data prevista' },
    { key: 'dataConclusao', label: 'Concluída em' },
    { key: 'anexos', label: 'Anexos' },
  ];

  const summary = {
    pendentes: rows.filter((row) => row.status === 'Pendente').length,
    concluidas: rows.filter((row) => row.status === 'Concluída').length,
    vencendo: rows.filter((row) => row.status === 'Atrasada').length,
  };

  const openDetails = (status: string, title: string) => {
    const filtered = rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Transferências filtradas automaticamente pelo indicador selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <RefreshCw className="w-4 h-4" />
        <span>Filtros de transferências</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Pendente', 'Em andamento', 'Concluída', 'Atrasada'].map((status) => (
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
      filtersTitle="Filtros de transferências"
      filtersDescription="Monitore titularidade, água, energia e demais etapas obrigatórias."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Transferências"
          description="Controle transferências de titularidade e tarefas operacionais pós venda."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[110px] rounded-2xl" />
            ))
          ) : (
            <>
              <KpiCardClickable
                title="Transferências pendentes"
                value={summary.pendentes}
                icon={Clock}
                onClick={() => openDetails('Pendente', 'Transferências pendentes')}
              />
              <KpiCardClickable
                title="Transferências concluídas"
                value={summary.concluidas}
                icon={CheckCircle2}
                onClick={() => openDetails('Concluída', 'Transferências concluídas')}
              />
              <KpiCardClickable
                title="Vencendo em 7 dias"
                value={summary.vencendo}
                icon={FileCheck2}
                onClick={() => openDetails('Atrasada', 'Transferências vencendo')}
              />
            </>
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Checklist de transferências</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">Acompanhe cada etapa operacional do pós venda.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">Exportar</Button>
              <Button className="rounded-xl">Nova tarefa</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={rows}
              searchPlaceholder="Buscar transferências"
              emptyMessage="Nenhuma transferência encontrada para os filtros aplicados."
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader>
            <CardTitle className="text-lg">Resumo por contrato</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`summary-skeleton-${index}`} className="h-[88px] rounded-xl" />
              ))
            ) : (
              rows.slice(0, 4).map((row) => (
                <div key={row.id} className="rounded-xl border border-[var(--ui-stroke)] p-4">
                  <p className="text-sm font-medium text-[var(--ui-text)]">{row.contrato}</p>
                  <p className="text-xs text-[var(--ui-text-subtle)]">{row.tarefa}</p>
                  <Badge variant="secondary" className="rounded-full mt-2">{row.status}</Badge>
                </div>
              ))
            )}
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
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhuma transferência encontrada." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default TransferenciasPage;
