'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { getReportExportJobs } from '@/features/dashboard/manage-reports/api/report';

import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/manage-reports/components/tables/export-history-table/columns';
import { Loading } from '@/shared/components/loading';

export function ExportHistoryClient() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const { data, isLoading } = useQuery({
    queryKey: ['export-history', pagination],
    queryFn: () => getReportExportJobs(pagination),
  });

  return (
    <div className="space-y-4">
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
              data={data!.content}
            />
          )}
        </>
      )}
    </div>
  );
}
