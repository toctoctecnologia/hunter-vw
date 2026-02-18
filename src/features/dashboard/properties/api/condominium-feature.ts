import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { CondominiumFeature, CondominiumFeatureType } from '@/shared/types';

export async function getCondominiumFeatures(
  pagination: PaginationState,
  search?: string,
  type?: CondominiumFeatureType,
) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...(search && { search }),
    ...(type && { type }),
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<CondominiumFeature[]>('dashboard/condominium/feature', { params });
  return data;
}

export async function newCondominiumFeature(data: Omit<CondominiumFeature, 'uuid'>) {
  const response = await api.post('dashboard/condominium/feature', data);
  return response.data;
}

export async function updateCondominiumFeature(data: CondominiumFeature) {
  const response = await api.put(`dashboard/condominium/feature/${data.uuid}`, data);
  return response.data;
}

export async function deleteCondominiumFeature(id: string) {
  await api.delete(`dashboard/condominium/feature/${id}`);
}
