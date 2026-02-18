'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { LeadsReportFilters } from '@/shared/types';

import { getLeadsReportData } from '@/features/dashboard/manage-reports/api/report';

import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/dashboard/manage-reports/components/tables/lead-report-table/columns';
import { Loading } from '@/shared/components/loading';

interface LeadReportClientProps {
  filters: LeadsReportFilters;
  searchTerm?: string;
}

export function LeadReportClient({ filters, searchTerm }: LeadReportClientProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const { data, isLoading } = useQuery({
    queryKey: ['leads-report', pagination, filters, searchTerm],
    queryFn: () =>
      getLeadsReportData(pagination, {
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
