'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { getArchiveReasons } from '@/features/dashboard/manage-leads/api/archive-reason';

import { DataTable } from '@/shared/components/ui/data-table';

import { SaveArchiveReasonModal } from '@/features/dashboard/manage-leads/components/modal/save-archive-reason-modal';
import { columns } from '@/features/dashboard/manage-leads/components/tables/archive-reason-table/columns';
import { FloatingActionButton } from '@/shared/components/ui/floating-action-button';
import { Loading } from '@/shared/components/loading';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function ArchiveReasonsClient() {
  const { user } = useAuth();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['archiveReasons', pagination],
    queryFn: () => getArchiveReasons(pagination),
  });

  return (
    <>
      <SaveArchiveReasonModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
                // data={data!.content}
                data={data!}
              />
            )}
          </>
        )}
      </div>

      {hasFeature(user?.userInfo.profile.permissions, '2401') && (
        <FloatingActionButton>
          <FloatingActionButton.Trigger onClick={() => setIsModalOpen(true)} label="Novo Motivo de Arquivamento" />
        </FloatingActionButton>
      )}
    </>
  );
}
