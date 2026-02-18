import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { PropertyBuilder } from '@/shared/types';

export async function getBuilders(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = search ? { search, page: pageIndex, size: pageSize } : { page: pageIndex, size: pageSize };
  const { data } = await api.get<PropertyBuilder[]>('dashboard/property/builder', { params });
  return data;
}

export async function newBuilder(data: Omit<PropertyBuilder, 'uuid'>) {
  const response = await api.post('dashboard/property/builder', data);
  return response.data;
}

export async function updateBuilder(data: PropertyBuilder) {
  const response = await api.put(`dashboard/property/builder/${data.uuid}`, data);
  return response.data;
}

export async function deleteBuilder(id: string) {
  await api.delete(`dashboard/property/builder/${id}`);
}
