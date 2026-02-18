'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { Filter, FilterAddButton, FilterSearchInput } from '@/shared/components/filters';
import { DataTable } from '@/shared/components/ui/data-table';

import { SavePropertyFeatureModal } from '@/features/dashboard/properties/components/modal/save-property-feature-modal';
import { columns } from '@/features/dashboard/properties/components/tables/property-feature-table/columns';
import { getPropertyFeatures } from '@/features/dashboard/properties/api/property-feature';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function PropertyFeatureClient() {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['property-feature', pagination],
    queryFn: () => getPropertyFeatures(pagination, search),
  });

  return (
    <>
      <SavePropertyFeatureModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            showFilterButton={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter') refetch();
            }}
          />

          {hasFeature(user?.userInfo.profile.permissions, '2201') && (
            <FilterAddButton onClick={() => setIsModalOpen(true)} icon={Plus} />
          )}
        </Filter>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data && (
              <DataTable
                pagination={pagination}
                setPagination={setPagination}
                // pageCount={data.totalPages}
                pageCount={1}
                columns={columns}
                // data={data!.content}
                data={data!}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
