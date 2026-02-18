import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VendasLayout } from '@/layouts/VendasLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  FileText,
  Handshake,
  Home,
  Landmark,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { FilterBar } from '@/components/gestao-locacao/interactive/FilterBar';
import { KpiCardClickable } from '@/components/gestao-locacao/interactive/KpiCardClickable';
import { DetailsDrawer } from '@/components/gestao-locacao/interactive/DetailsDrawer';
import { DataTable, type DataTableColumn } from '@/components/gestao-locacao/interactive/DataTable';
import { useModuleFilters } from '@/hooks/gestao-locacao/useModuleFilters';
import { useDetailsDrawer } from '@/hooks/gestao-locacao/useDetailsDrawer';
import { useFakeLoading } from '@/hooks/useFakeLoading';
import {
  listSaleContracts,
  summarySaleContracts,
  type SaleContractFilters,
} from '@/services/gestao-vendas/saleContractsService';
import { brokers, buyers, developmentsMock, properties, sellers } from '@/mocks/gestao-vendas/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleContractFilters = {
  periodo: '',
  corretor: '',
  comprador: '',
  imovel: '',
  incorporadora: '',
  status: '',
  tipoVenda: '',
  banco: '',
};

type ContractRow = {
  id: string;
  codigo: string;
  comprador: string;
  vendedor: string;
  corretor: string;
  imovel: string;
  status: string;
  valor: string;
  assinatura: string;
};

export const ContratosVendaPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { status?: string } | null;
  const loading = useFakeLoading();
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
    { key: 'comprador', label: 'Comprador' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'incorporadora', label: 'Incorporadora' },
    { key: 'status', label: 'Status' },
    { key: 'tipoVenda', label: 'Tipo de venda' },
    { key: 'banco', label: 'Banco' },
  ]);

  const detailsDrawer = useDetailsDrawer<ContractRow>();
  const [drawerRows, setDrawerRows] = useState<ContractRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<ContractRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (locationState?.status) {
      updateFilter('status', locationState.status);
    }
  }, [locationState?.status, updateFilter]);

  const { items } = useMemo(() => listSaleContracts(filters), [filters]);
  const { summary } = useMemo(() => summarySaleContracts(filters), [filters]);

  const rows: ContractRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        codigo: item.codigo,
        comprador: buyers.find((buyer) => buyer.id === item.compradorId)?.nome ?? 'Comprador Demo',
        vendedor: sellers.find((seller) => seller.id === item.vendedorId)?.nome ?? 'Vendedor Demo',
        corretor: brokers.find((broker) => broker.id === item.corretorId)?.nome ?? 'Corretor Demo',
        imovel: `${item.imovel.tipo} | ${item.imovel.endereco}`,
        status: item.status,
        valor: item.valorVenda,
        assinatura: item.dataAssinatura,
      })),
    [items]
  );

  const columns: DataTableColumn<ContractRow>[] = [
    { key: 'codigo', label: 'Contrato', sortable: true },
    { key: 'comprador', label: 'Comprador' },
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'corretor', label: 'Corretor' },
    { key: 'imovel', label: 'Imóvel' },
    { key: 'status', label: 'Status' },
    { key: 'valor', label: 'Valor', align: 'right' },
    { key: 'assinatura', label: 'Assinatura', align: 'center' },
  ];

  const openKpiDetails = (status: string, title: string) => {
    const filtered = rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Listagem filtrada automaticamente pelo status selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <FileText className="w-4 h-4" />
        <span>Filtros de contratos de venda</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Período</label>
          <Select value={filters.periodo} onValueChange={(value) => updateFilter('periodo', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="criacao">Criação</SelectItem>
              <SelectItem value="assinatura">Assinatura</SelectItem>
              <SelectItem value="conclusao">Conclusão</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Corretor responsável</label>
          <Select value={filters.corretor} onValueChange={(value) => updateFilter('corretor', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {brokers.map((broker) => (
                <SelectItem key={broker.id} value={broker.nome}>
                  {broker.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Cliente comprador</label>
          <Select value={filters.comprador} onValueChange={(value) => updateFilter('comprador', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {buyers.map((buyer) => (
                <SelectItem key={buyer.id} value={buyer.nome}>
                  {buyer.nome}
                </SelectItem>
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
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.endereco}>
                  {property.tipo} | {property.endereco}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Incorporadora</label>
          <Select value={filters.incorporadora} onValueChange={(value) => updateFilter('incorporadora', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {developmentsMock.map((dev) => (
                <SelectItem key={dev.id} value={dev.incorporadora}>
                  {dev.incorporadora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status do contrato</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Ativo', 'Em assinatura', 'Em financiamento', 'Em pós-venda', 'Concluído', 'Pendente'].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
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
              {['Pronto', 'Na planta', 'Permuta', 'Financiamento'].map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Banco financiamento</label>
          <Select value={filters.banco} onValueChange={(value) => updateFilter('banco', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Banco Aurora', 'Banco Horizonte', 'Banco Faro', 'Banco Atlântico', 'Banco Lumen'].map((banco) => (
                <SelectItem key={banco} value={banco}>
                  {banco}
                </SelectItem>
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
      filtersTitle="Filtros de contratos de venda"
      filtersDescription="Ajuste a listagem por período, corretor, status e tipo de venda."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Contratos de venda"
          description="Acompanhe contratos por etapa e status operacional."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[110px] rounded-2xl" />
            ))
          ) : (
            <>
              <KpiCardClickable
                title="Contratos ativos"
                value={summary.ativos}
                icon={Handshake}
                onClick={() => openKpiDetails('Ativo', 'Contratos ativos')}
              />
              <KpiCardClickable
                title="Contratos em assinatura"
                value={summary.assinatura}
                icon={FileText}
                onClick={() => openKpiDetails('Em assinatura', 'Contratos em assinatura')}
              />
              <KpiCardClickable
                title="Contratos em financiamento"
                value={summary.financiamento}
                icon={Landmark}
                onClick={() => openKpiDetails('Em financiamento', 'Contratos em financiamento')}
              />
              <KpiCardClickable
                title="Contratos em pós venda"
                value={summary.posVenda}
                icon={Users}
                onClick={() => openKpiDetails('Em pós-venda', 'Contratos em pós-venda')}
              />
              <KpiCardClickable
                title="Contratos concluídos"
                value={summary.concluidos}
                icon={Calendar}
                onClick={() => openKpiDetails('Concluído', 'Contratos concluídos')}
              />
              <KpiCardClickable
                title="Contratos pendentes"
                value={summary.pendentes}
                icon={Wallet}
                onClick={() => openKpiDetails('Pendente', 'Contratos pendentes')}
              />
            </>
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Lista de contratos</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Clique em um contrato para abrir o detalhe completo do processo de venda.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">
                Exportar
              </Button>
              <Button className="rounded-xl">Novo contrato</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={rows}
              searchPlaceholder="Buscar contratos"
              emptyMessage="Nenhum contrato encontrado para os filtros aplicados."
              onRowClick={(row) => navigate(`/gestao-vendas/contratos/${row.id}`)}
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Resumo da carteira</CardTitle>
            <Badge className="rounded-full" variant="secondary">
              {rows.length} contratos
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={`summary-skeleton-${index}`} className="h-[88px] rounded-xl" />
              ))
            ) : (
              [
                { label: 'Valor total vendido', value: 'R$ 9,2 mi', icon: Home },
                { label: 'Ticket médio', value: 'R$ 612 mil', icon: Wallet },
                { label: 'Corretores ativos', value: '6', icon: User },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[var(--ui-stroke)] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[var(--ui-text-subtle)]">{item.label}</p>
                    <p className="text-lg font-semibold text-[var(--ui-text)]">{item.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--ui-stroke)]/40 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[var(--ui-text)]" />
                  </div>
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
        <DataTable
          columns={drawerColumns}
          rows={drawerRows}
          emptyMessage="Nenhum contrato encontrado para este filtro."
        />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default ContratosVendaPage;
