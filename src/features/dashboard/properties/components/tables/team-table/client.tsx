'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { getTeams } from '@/features/dashboard/properties/api/teams';

import { Filter, FilterAddButton, FilterSearchInput } from '@/shared/components/filters';
import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/properties/components/tables/team-table/columns';
import { SaveTeamModal } from '@/features/dashboard/properties/components/modal/save-team-modal';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function TeamClient() {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['teams', pagination],
    queryFn: () => getTeams(pagination, search),
  });

  return (
    <>
      <SaveTeamModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

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

          {hasFeature(user?.userInfo.profile.permissions, '1451') && (
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
                pageCount={data.totalPages}
                columns={columns}
                data={data.content || []}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
