import { PaginationState } from '@tanstack/react-table';

import { CaptationFilters, CaptationItem, Record } from '@/shared/types';
import { api } from '@/shared/lib/api';

export async function getCaptations(pagination: PaginationState, filters: CaptationFilters) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...filters,
    catcherUuid: filters.selectedCatcher?.uuid,
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<Record<CaptationItem>>('dashboard/captations/offers', { params });
  return data;
}
