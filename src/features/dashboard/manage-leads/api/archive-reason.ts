import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { ArchiveReason } from '@/shared/types';

export async function getArchiveReasons(pagination: PaginationState) {
  const { pageIndex, pageSize } = pagination;
  const params = { page: pageIndex, size: pageSize };
  const { data } = await api.get<ArchiveReason[]>('dashboard/lead/archive-reason', { params });
  return data;
}

export async function newArchiveReason(data: Omit<ArchiveReason, 'uuid'>) {
  const response = await api.post('dashboard/lead/archive-reason', data);
  return response.data;
}

export async function updateArchiveReason(data: ArchiveReason) {
  const response = await api.put(`dashboard/lead/archive-reason/${data.uuid}`, data);
  return response.data;
}
