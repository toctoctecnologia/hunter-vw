import { useMemo, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import TocTocFiltersForm from './components/TocTocFilters';
import TocTocPropertyCard from './components/TocTocPropertyCard';
import { useTocTocProperties } from './useTocTocProperties';
import type { TocTocFilters } from './api';

const DEFAULT_LIMIT = 12;

const buildPageInfo = (total: number, limit: number, offset: number) => {
  const safeLimit = Math.max(1, limit);
  const currentPage = Math.floor(offset / safeLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return { currentPage, totalPages };
};

interface TocTocPropertiesSectionProps {
  onSelectProperty?: (propertyId: string) => void;
  selectedPropertyId?: string;
}

export const TocTocPropertiesSection = ({
  onSelectProperty,
  selectedPropertyId,
}: TocTocPropertiesSectionProps) => {
  const [filters, setFilters] = useState<TocTocFilters>({ limit: DEFAULT_LIMIT, offset: 0 });
  const [appliedFilters, setAppliedFilters] = useState<TocTocFilters>(filters);

  const { data, isFetching, isError, error } = useTocTocProperties(appliedFilters);

  const { currentPage, totalPages } = useMemo(() => {
    return buildPageInfo(data?.total ?? 0, appliedFilters.limit ?? DEFAULT_LIMIT, appliedFilters.offset ?? 0);
  }, [appliedFilters.limit, appliedFilters.offset, data?.total]);

  const handleSubmit = () => {
    setAppliedFilters({
      ...filters,
      offset: 0,
    });
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (!data) return;

    const limit = appliedFilters.limit ?? DEFAULT_LIMIT;
    const currentOffset = appliedFilters.offset ?? 0;
    const nextOffset = direction === 'next' ? currentOffset + limit : Math.max(0, currentOffset - limit);

    if (direction === 'next' && nextOffset >= data.total) {
      return;
    }

    setFilters(prev => ({ ...prev, offset: nextOffset }));
    setAppliedFilters(prev => ({ ...prev, offset: nextOffset }));
  };

  const hasResults = (data?.data?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Integração TocToc</p>
          <h2 className="text-2xl font-bold text-foreground">Imóveis disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            Busque imóveis diretamente da API TocToc usando filtros de cidade, estado ou tipo.
          </p>
        </div>
        <Card className="p-4">
          <TocTocFiltersForm filters={filters} onChange={setFilters} onSubmit={handleSubmit} isLoading={isFetching} />
        </Card>
      </div>

      <Separator />

      {isError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">Erro ao buscar imóveis</p>
            <p className="text-sm">{(error as Error)?.message ?? 'Não foi possível carregar os dados.'}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {isFetching ? 'Buscando imóveis...' : `${data?.total ?? 0} imóveis encontrados`}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isFetching && !hasResults
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-full animate-pulse bg-muted/60" />
            ))
          : data?.data?.map(property => (
              <TocTocPropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                isActive={selectedPropertyId === property.id}
              />
            ))}
      </div>

      {hasResults && (
        <Pagination className="pt-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={event => {
                  event.preventDefault();
                  handlePageChange('prev');
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={event => {
                  event.preventDefault();
                  handlePageChange('next');
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {isFetching && hasResults && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Atualizando imóveis...
        </div>
      )}
    </div>
  );
};

export default TocTocPropertiesSection;
