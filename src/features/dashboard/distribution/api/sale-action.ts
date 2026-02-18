import { PaginationState } from '@tanstack/react-table';

import { Record, SaleActionDetail, SaleActionFilters, SaleActionItem, SaleActionMetricData } from '@/shared/types';
import { api } from '@/shared/lib/api';

export async function getSaleActions(pagination: PaginationState, filters: SaleActionFilters, searchTerm: string) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...filters,
    filter: searchTerm,
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<Record<SaleActionItem>>('sale-actions/execution', { params });
  return data;
}

export async function getSaleAction(saleActionUuid: string) {
  const { data } = await api.get<SaleActionDetail>(`sale-actions/execution/${saleActionUuid}`);
  return data;
}

export async function getSaleActionMetrics() {
  const { data } = await api.get<SaleActionMetricData>('sale-actions/metrics');
  return data;
}
