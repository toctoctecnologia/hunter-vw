import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PropertyFilters, PropertyStatus } from '@/shared/types';

import { getProperties } from '@/features/dashboard/properties/api/properties';
import { PropertyItem } from '@/features/dashboard/properties/components/properties/property-item';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';

interface PropertiesProps {
  manageProperty?: boolean;
  searchTerm?: string;
  filterByStatus?: PropertyStatus | '';
  filters?: PropertyFilters | null;
}

export function Properties({
  manageProperty = false,
  searchTerm = '',
  filterByStatus = '',
  filters = null,
}: PropertiesProps) {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['properties', currentPage, searchTerm, filterByStatus, filters],
    queryFn: () =>
      getProperties({
        pagination: { pageIndex: currentPage, pageSize: 10 },
        filters: {
          ...filters,
          filter: searchTerm,
          status: filterByStatus || undefined,
        },
      }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar propriedades" />;
  if (!data?.content || data.content.length === 0) {
    return (
      <NoContentCard
        title={searchTerm ? 'Nenhuma propriedade encontrada para sua busca' : 'Nenhuma propriedade cadastrada'}
      />
    );
  }

  const totalPages = data.totalPages;

  return (
    <div className="space-y-4">
      <div className="space-y-6 mb-8">
        {data.content.map((property) => (
          <PropertyItem key={property.uuid} property={property} manage={manageProperty} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 10) {
                  page = i;
                } else if (currentPage < 3) {
                  page = i;
                } else if (currentPage > totalPages - 3) {
                  page = totalPages - 10 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
