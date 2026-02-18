'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import { useRouter } from '@/shims/next-navigation';

import { Filter, FilterAddButton, FilterSearchInput } from '@/shared/components/filters';
import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/properties/components/tables/condominiums-table/columns';
import { getCondominiums } from '@/features/dashboard/properties/api/condominiums';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function CondominiumsClient() {
  const { user } = useAuth();
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['condominiums', pagination],
    queryFn: () => getCondominiums(pagination, search),
  });

  return (
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

        {hasFeature(user?.userInfo.profile.permissions, '2301') && (
          <FilterAddButton onClick={() => router.push('/dashboard/manage-condominiums/condominium/new')} icon={Plus} />
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
              pageCount={data.totalPages}
              columns={columns}
              data={data.content}
            />
          )}
        </>
      )}
    </div>
  );
}
