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
import { listSaleDocuments, type SaleDocumentFilters } from '@/services/gestao-vendas/saleDocumentsService';
import { Badge } from '@/components/ui/badge';
import { FolderOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultFilters: SaleDocumentFilters = {
  status: '',
  categoria: '',
  contrato: '',
};

type DocumentRow = {
  id: string;
  contrato: string;
  nome: string;
  categoria: string;
  status: string;
  atualizadoEm: string;
  tags: string;
};

export const DocumentosPage = () => {
  const {
    filters,
    updateFilter,
    activeFilters,
    count,
    hasActiveFilters,
    clearFilters,
  } = useModuleFilters(defaultFilters, [
    { key: 'status', label: 'Status' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'contrato', label: 'Contrato' },
  ]);
  const loading = useFakeLoading();

  const detailsDrawer = useDetailsDrawer<DocumentRow>();
  const [drawerRows, setDrawerRows] = useState<DocumentRow[]>([]);
  const [drawerColumns, setDrawerColumns] = useState<DataTableColumn<DocumentRow>[]>([]);
  const [drawerFilterContent, setDrawerFilterContent] = useState<ReactNode>(null);

  const { items } = useMemo(() => listSaleDocuments(filters), [filters]);

  const rows: DocumentRow[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        contrato: item.contratoId,
        nome: item.nome,
        categoria: item.categoria,
        status: item.status,
        atualizadoEm: item.atualizadoEm,
        tags: item.tags.join(', '),
      })),
    [items]
  );

  const columns: DataTableColumn<DocumentRow>[] = [
    { key: 'nome', label: 'Documento' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'status', label: 'Status' },
    { key: 'atualizadoEm', label: 'Atualizado em' },
    { key: 'tags', label: 'Tags' },
  ];

  const openDetails = (status: string, title: string) => {
    const filtered = rows.filter((row) => row.status === status);
    setDrawerColumns(columns);
    setDrawerRows(filtered);
    setDrawerFilterContent(null);
    updateFilter('status', status);
    detailsDrawer.openDrawer({
      title,
      description: 'Documentos filtrados automaticamente pelo status selecionado.',
      filters: activeFilters,
      rows: filtered,
    });
  };

  const filtersContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ui-text)]">
        <FolderOpen className="w-4 h-4" />
        <span>Filtros de documentos</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Status</label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {['Validado', 'Em análise', 'Expirado'].map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--ui-text)]">Categoria</label>
          <Select value={filters.categoria} onValueChange={(value) => updateFilter('categoria', value)}>
            <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {[
                'Contratos e aditivos',
                'Certidões',
                'Matrícula e ônus',
                'Comprovantes de pagamento',
                'Documentos do financiamento',
                'Documentos de cartório',
                'Documentos do condomínio e transferências',
              ].map((categoria) => (
                <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
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
      filtersTitle="Filtros de documentos"
      filtersDescription="Gerencie documentos de contratos, certidões e validações por categoria."
      filtersCount={count}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}
    >
      <div className="space-y-6">
        <FilterBar
          title="Documentos"
          description="Upload, validação e controle de documentos do processo de venda."
          activeFilters={activeFilters}
          onClear={clearFilters}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`kpi-skeleton-${index}`} className="h-[140px] rounded-2xl" />
            ))
          ) : (
            ['Validado', 'Em análise', 'Expirado'].map((status) => (
              <Card key={status} className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">{status}</CardTitle>
                  <Badge variant="secondary" className="rounded-full">{rows.filter((row) => row.status === status).length}</Badge>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="rounded-xl w-full" onClick={() => openDetails(status, `Documentos ${status.toLowerCase()}`)}>
                    Ver documentos
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Lista de documentos</CardTitle>
              <p className="text-sm text-[var(--ui-text-subtle)]">Visualize tags, categoria e status de cada arquivo.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">Exportar</Button>
              <Button className="rounded-xl">Enviar documento</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              rows={rows}
              searchPlaceholder="Buscar documentos"
              emptyMessage="Nenhum documento encontrado para os filtros aplicados."
              loading={loading}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
          <CardHeader>
            <CardTitle className="text-lg">Validações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl">Marcar como validado</Button>
            <Button variant="outline" className="rounded-xl">Marcar como expirado</Button>
            <Button className="rounded-xl">Abrir checklist</Button>
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
        <DataTable columns={drawerColumns} rows={drawerRows} emptyMessage="Nenhum documento encontrado." />
      </DetailsDrawer>
    </VendasLayout>
  );
};

export default DocumentosPage;
