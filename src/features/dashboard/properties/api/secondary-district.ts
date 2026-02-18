import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { PropertySecondaryDistrict } from '@/shared/types';

export async function getDistricts(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = search ? { search, page: pageIndex, size: pageSize } : { page: pageIndex, size: pageSize };
  const { data } = await api.get<PropertySecondaryDistrict[]>('dashboard/property/secondary-district', { params });
  return data;
}

export async function newDistrict(data: Omit<PropertySecondaryDistrict, 'uuid'>) {
  const response = await api.post('dashboard/property/secondary-district', data);
  return response.data;
}

export async function updateDistrict(data: PropertySecondaryDistrict) {
  const response = await api.put(`dashboard/property/secondary-district/${data.uuid}`, data);
  return response.data;
}

export async function deleteDistrict(id: string) {
  await api.delete(`dashboard/property/secondary-district/${id}`);
}
