'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { DistributionReportFilters } from '@/shared/types';

import { getDistributionReportData } from '@/features/dashboard/manage-reports/api/report';

import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/manage-reports/components/tables/distribution-report-table/columns';
import { Loading } from '@/shared/components/loading';

interface DistributionReportClientProps {
  filters: DistributionReportFilters;
}

export function DistributionReportClient({ filters }: DistributionReportClientProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const { data, isLoading } = useQuery({
    queryKey: ['distribution-report', pagination, filters],
    queryFn: () =>
      getDistributionReportData(pagination, {
        ...filters,
      }),
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
