import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { UnitDetail } from '@/shared/types';

import { UnitFormData } from '@/features/dashboard/properties/components/form/unit-form/schema';

export async function getUnits(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = search ? { name: search, page: pageIndex, size: pageSize } : { page: pageIndex, size: pageSize };
  const { data } = await api.get<UnitDetail[]>('dashboard/company/unit', { params });
  return data;
}

export async function getUnit(unitId: string) {
  const { data } = await api.get<UnitDetail>(`dashboard/company/unit/${unitId}`);
  return data;
}

export async function newUnit(formData: UnitFormData) {
  const { data } = await api.post('dashboard/company/unit', formData);
  return data;
}

export async function updateUnit(unitId: string, formData: UnitFormData) {
  const { data } = await api.put(`dashboard/company/unit/${unitId}`, formData);
  return data;
}

export async function deleteUnit(unitId: string) {
  await api.delete(`dashboard/company/unit/${unitId}`);
}
