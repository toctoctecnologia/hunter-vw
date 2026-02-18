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
import { listSaleCommissions, type SaleCommissionFilters } from '@/services/gestao-vendas/saleCommissionsService';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign, HandCoins, Percent, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleCommissionFilters = {
  status: '',
  corretor: '',
  contrato: '',
};

type CommissionRow = {
  id: string;
  contrato: string;
  corretor: string;
  percentual: string;
  valorBruto: string;
  retencoes: string;
  valorLiquido: string;
  status: string;
  dataPrevista: string;
  dataPaga: string;
};

export const ComissoesPage = () => {
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'status', label: 'Status' },
    { key: 'corretor', label: 'Corretor' },
    { key: 'contrato', label: 'Contrato' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<CommissionRow>();
  const [drawerRows, setDrawerRows] = useState<CommissionRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<CommissionRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  const { items } = useMemo(() => listSaleCommissions(filters), [filters]);

  const rows: CommissionRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        contrato: item.contrato,
        corretor: item.corretor,
        percentual: item.percentual,
        valorBruto: item.valorBruto,
        retencoes: item.retencoes,
        valorLiquido: item.valorLiquido,
        status: item.status,
        dataPrevista: item.dataPrevista,
        dataPaga: item.dataPaga,
      })),
    [items]
  );

  const columns: DataTableColumn<CommissionRow>[] = [
    { key: 'contrato', label: 'Contrato' },
    { key: 'corretor', label: 'Corretor' },
    { key: 'percentual', label: 'Percentual' },
    { key: 'valorBruto', label: 'Valor bruto', align: 'right' },
    { key: 'retencoes', label: 'Retenções', align: 'right' },
    { key: 'valorLiquido', label: 'Valor líquido', align: 'right' },
    { key: 'status', label: 'Status' },
  ];

  const summary = {
    prevista: rows.filter((row) => row.status === 'Prevista').length,
    liberada: rows.filter((row) => row.status === 'Liberada').length,
    paga: rows.filter((row) => row.status === 'Paga').length,
    retida: rows.filter((row) => row.status === 'Retida').length,
  };

  const openDetails = (status: string, title: string) => {
    const filtered = rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Comissões filtradas automaticamente pelo indicador selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <HandCoins className="w-4 h-4" />
        <span>Filtros de comissões</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Prevista', 'Liberada', 'Paga', 'Retida'].map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
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
              {[...new Set(rows.map((row) => row.corretor))].map((corretor) => (
                <SelectItem key={corretor} value={corretor}>{corretor}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Contrato</label>
          <Select value={filters.contrato} onValueChange={(value) => updateFilter('contrato', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {[...new Set(rows.map((row) => row.contrato))].map((contrato) => (
                <SelectItem key={contrato} value={contrato}>{contrato}</SelectItem>
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
      filtersTitle="Filtros de comissões"
      filtersDescription="Analise comissões por corretor, contrato e status de pagamento."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Comissões"
          description="Acompanhe previsões, liberações e pagamentos de comissões por venda."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[110px] rounded-2xl" />
            ))
          ) : (
            <>
              <KpiCardClickable
                title="Comissão prevista"
                value={summary.prevista}
                icon={Wallet}
                onClick={() => openDetails('Prevista', 'Comissão prevista')}
              />
              <KpiCardClickable
                title="Comissão liberada"
                value={summary.liberada}
                icon={CircleDollarSign}
                onClick={() => openDetails('Liberada', 'Comissão liberada')}
              />
              <KpiCardClickable
                title="Comissão paga"
                value={summary.paga}
                icon={HandCoins}
                onClick={() => openDetails('Paga', 'Comissão paga')}
              />
              <KpiCardClickable
                title="Comissão retida"
                value={summary.retida}
                icon={Percent}
                onClick={() => openDetails('Retida', 'Comissão retida')}
              />
            </>
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Tabela de comissões</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">Visualize percentuais, valores e retenções por corretor.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">Exportar</Button>
              <Button className="rounded-xl">Registrar pagamento</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={rows}
              searchPlaceholder="Buscar comissões"
              emptyMessage="Nenhuma comissão encontrada para os filtros aplicados."
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader>
            <CardTitle className="text-lg">Resumo por corretor</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`summary-skeleton-${index}`} className="h-[88px] rounded-xl" />
              ))
            ) : (
              [...new Set(rows.map((row) => row.corretor))].slice(0, 4).map((corretor) => (
                <div key={corretor} className="rounded-xl border border-[var(--ui-stroke)] p-4">
                  <p className="text-sm font-medium text-[var(--ui-text)]">{corretor}</p>
                  <p className="text-xs text-[var(--ui-text-subtle)]">Volume de comissões</p>
                  <Badge variant="secondary" className="rounded-full mt-2">R$ 68 mil</Badge>
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
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhuma comissão encontrada." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default ComissoesPage;
