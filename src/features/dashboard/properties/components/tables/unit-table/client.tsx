'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { getUnits } from '@/features/dashboard/properties/api/units';

import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/properties/components/tables/unit-table/columns';
import { SaveUnitModal } from '@/features/dashboard/properties/components/modal/save-unit-modal';
import { FloatingActionButton } from '@/shared/components/ui/floating-action-button';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function UnitClient() {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 999 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['units', pagination],
    queryFn: () => getUnits(pagination),
  });

  return (
    <>
      <SaveUnitModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="space-y-4">
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
                // data={data.content || []}
                data={data || []}
              />
            )}
          </>
        )}
      </div>

      {hasFeature(user?.userInfo.profile.permissions, '2151') && (
        <FloatingActionButton>
          <FloatingActionButton.Trigger onClick={() => setIsModalOpen(true)} label="Nova Unidade" />
        </FloatingActionButton>
      )}
    </>
  );
}
