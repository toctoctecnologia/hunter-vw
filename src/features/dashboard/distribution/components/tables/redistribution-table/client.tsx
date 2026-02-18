'use client';
import React, { useEffect, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

import { RedistributionFilters, RedistributionItem } from '@/shared/types';

import { getRedistributions } from '@/features/dashboard/distribution/api/redistribution';

import { columns } from '@/features/dashboard/distribution/components/tables/redistribution-table/columns';
import { DataTable } from '@/shared/components/ui/data-table';
import { Loading } from '@/shared/components/loading';

interface RedistributionClientProps {
  filters: RedistributionFilters;
  onChangeSelectedRows: (data: RedistributionItem[]) => void;
}

export function RedistributionClient({ filters, onChangeSelectedRows }: RedistributionClientProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['captations', pagination, filters],
    queryFn: () => getRedistributions(pagination, filters),
  });

  useEffect(() => {
    if (data?.content) {
      onChangeSelectedRows(
        Object.keys(rowSelection)
          .filter((key) => rowSelection[key])
          .map((index) => data.content[Number(index)])
          .filter(Boolean),
      );
    }
  }, [data?.content, onChangeSelectedRows, rowSelection]);

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
              data={data.content}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          )}
        </>
      )}
    </div>
  );
}
