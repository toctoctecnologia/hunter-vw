import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { Client, Record } from '@/shared/types';

export async function getClients(pagination: PaginationState, search?: string, filterByPlan?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...(search && { search }),
    ...(filterByPlan && { plan: filterByPlan }),
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<Record<Client>>('dashboard/super-admin/account/list', { params });
  return data;
}
