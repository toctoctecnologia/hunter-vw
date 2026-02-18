'use client';
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { PlanNames } from '@/shared/types';

import { planNameToLabel } from '@/shared/lib/utils';

import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { DataTable } from '@/shared/components/ui/data-table';

import { columns } from '@/features/sadm-dashboard/access-control/components/tables/clients-table/columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { getClients } from '@/features/sadm-dashboard/clients/api/get-clients';
import { DropdownMenuSeparator } from '@/shared/components/ui/dropdown-menu';

export function Client() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [filterByPlan, setFilterByPlan] = useState<PlanNames | ''>('');
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sadm-saas-clients', pagination, search, filterByPlan],
    queryFn: () => getClients(pagination, search, filterByPlan),
  });

  return (
    <>
      <Filter>
        <FilterSearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          showFilterButton={false}
          onKeyDown={(e) => {
            if (e.key === 'Enter') refetch();
          }}
        />

        <Select
          value={filterByPlan}
          onValueChange={(value) => setFilterByPlan(value === 'undefined' ? '' : (value as PlanNames))}
        >
          <SelectTrigger className="w-full md:w-auto">
            <SelectValue placeholder="Filtro por plano" />
          </SelectTrigger>

          <SelectContent>
            {Object.values(PlanNames).map((status) => (
              <SelectItem key={status} value={status}>
                {planNameToLabel(status)}
              </SelectItem>
            ))}
            <DropdownMenuSeparator className="bg-zinc-700" />
            <SelectItem value="undefined">Limpar seleção</SelectItem>
          </SelectContent>
        </Select>
      </Filter>

      {isLoading ? (
        <div>
          <Loader className="animate-spin" />
        </div>
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
    </>
  );
}
