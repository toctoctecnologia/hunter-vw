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
import { listSaleReceipts, type SaleReceiptFilters } from '@/services/gestao-vendas/saleReceiptsService';
import { Calendar, CreditCard, FileText, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleReceiptFilters = {
  status: '',
  periodo: '',
  formaPagamento: '',
  contrato: '',
  cliente: '',
};

type ReceiptRow = {
  id: string;
  contrato: string;
  cliente: string;
  status: string;
  formaPagamento: string;
  valor: string;
  vencimento: string;
  dataPagamento: string;
};

export const RecebimentosPage = () => {
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'status', label: 'Status' },
    { key: 'periodo', label: 'Período' },
    { key: 'formaPagamento', label: 'Forma de pagamento' },
    { key: 'contrato', label: 'Contrato' },
    { key: 'cliente', label: 'Cliente' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<ReceiptRow>();
  const [drawerRows, setDrawerRows] = useState<ReceiptRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<ReceiptRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  const { items } = useMemo(() => listSaleReceipts(filters), [filters]);

  const rows: ReceiptRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        contrato: item.contrato,
        cliente: item.cliente,
        status: item.status,
        formaPagamento: item.formaPagamento,
        valor: item.valor,
        vencimento: item.vencimento,
        dataPagamento: item.dataPagamento,
      })),
    [items]
  );

  const columns: DataTableColumn<ReceiptRow>[] = [
    { key: 'contrato', label: 'Contrato' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'status', label: 'Status' },
    { key: 'formaPagamento', label: 'Forma de pagamento' },
    { key: 'valor', label: 'Valor', align: 'right' },
    { key: 'vencimento', label: 'Vencimento', align: 'center' },
  ];

  const summary = {
    totalMes: rows.length,
    totalReceber: rows.filter((row) => row.status === 'A vencer').length,
    totalVencido: rows.filter((row) => row.status === 'Vencido').length,
    totalRecebido: rows.filter((row) => row.status === 'Pago').length,
  };

  const openDetails = (status: string, title: string) => {
    const filtered = status === 'todos' ? rows : rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    if (status !== 'todos') updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Recebimentos filtrados automaticamente pelo indicador selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <Wallet className="w-4 h-4" />
        <span>Filtros de recebimentos</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Pago', 'A vencer', 'Vencido'].map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Período</label>
          <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="mes">Mês atual</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
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
              {['Pix', 'TED', 'Boleto', 'Cartão'].map((forma) => (
                <SelectItem key={forma} value={forma}>{forma}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Contrato de venda</label>
          <Select value={filters.contrato} onValueChange={(value) => updateFilter('contrato', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {rows.map((row) => (
                <SelectItem key={row.id} value={row.contrato}>{row.contrato}</SelectItem>
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
      filtersTitle="Filtros de recebimentos"
      filtersDescription="Acompanhe recebimentos por status, contrato e forma de pagamento."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Recebimentos"
          description="Controle valores recebidos e em aberto das vendas imobiliárias."
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
                title="Total recebido no mês"
                value={summary.totalMes}
                icon={Wallet}
                onClick={() => openDetails('todos', 'Recebimentos no mês')}
              />
              <KpiCardClickable
                title="Total a receber"
                value={summary.totalReceber}
                icon={Calendar}
                onClick={() => openDetails('A vencer', 'Recebimentos a vencer')}
              />
              <KpiCardClickable
                title="Total vencido"
                value={summary.totalVencido}
                icon={CreditCard}
                onClick={() => openDetails('Vencido', 'Recebimentos vencidos')}
              />
              <KpiCardClickable
                title="Total recebido no período"
                value={summary.totalRecebido}
                icon={FileText}
                onClick={() => openDetails('Pago', 'Recebimentos pagos')}
              />
            </>
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Tabela de recebimentos</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">Registre pagamentos, gere recibos e exporte dados.</p>
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
              searchPlaceholder="Buscar recebimentos"
              emptyMessage="Nenhum recebimento encontrado para os filtros aplicados."
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader>
            <CardTitle className="text-lg">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">Ver detalhes</Button>
            <Button variant="outline" className="rounded-xl">Gerar recibo</Button>
            <Button className="rounded-xl">Nova exportação</Button>
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
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhum recebimento encontrado." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default RecebimentosPage;
