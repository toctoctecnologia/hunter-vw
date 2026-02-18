'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { ScheduleReportFilters } from '@/shared/types';

import { getTasksReportData } from '@/features/dashboard/manage-reports/api/report';

import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/manage-reports/components/tables/schedule-report-table/columns';
import { Loading } from '@/shared/components/loading';

interface ScheduleReportClientProps {
  filters: ScheduleReportFilters;
  searchTerm?: string;
}

export function ScheduleReportClient({ filters, searchTerm }: ScheduleReportClientProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const { data, isLoading } = useQuery({
    queryKey: ['schedule-report', pagination, filters, searchTerm],
    queryFn: () =>
      getTasksReportData(pagination, {
        ...filters,
        search: searchTerm,
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
