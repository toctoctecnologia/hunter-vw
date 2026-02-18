import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { PropertyFeature, PropertyFeatureType } from '@/shared/types';

export async function getPropertyFeatures(pagination: PaginationState, search?: string, type?: PropertyFeatureType) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    ...(search && { search }),
    ...(type && { type }),
    page: pageIndex,
    size: pageSize,
  };
  const { data } = await api.get<PropertyFeature[]>('dashboard/property/feature', { params });
  return data;
}

export async function newPropertyFeature(data: Omit<PropertyFeature, 'uuid'>) {
  const response = await api.post('dashboard/property/feature', data);
  return response.data;
}

export async function updatePropertyFeature(data: PropertyFeature) {
  const response = await api.put(`dashboard/property/feature/${data.uuid}`, data);
  return response.data;
}

export async function deletePropertyFeature(id: string) {
  await api.delete(`dashboard/property/feature/${id}`);
}
