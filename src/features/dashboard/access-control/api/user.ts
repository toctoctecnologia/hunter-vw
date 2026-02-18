import { removeNonNumeric } from '@/shared/lib/masks';
import { PaginationState } from '@tanstack/react-table';
import { Plus, TrendingUp, UsersIcon } from 'lucide-react';

import { AuditEvent, Record } from '@/shared/types';
import { api } from '@/shared/lib/api';

import { User, UserDetails, UserMetrics } from '@/features/dashboard/access-control/types';

import { UserFormData } from '@/features/dashboard/access-control/components/form/user-form/schema';

export async function getUsers(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    page: pageIndex,
    size: pageSize,
    ...(search && { filter: search }),
  };
  const { data } = await api.get<Record<User>>('dashboard/user/list', { params });
  return data;
}

export async function createUser(userData: UserFormData) {
  const { data } = await api.post('user/invite', {
    ...userData,
    phone: removeNonNumeric(userData.phone),
  });
  return data;
}

export async function getUserMetrics() {
  const { data } = await api.get<UserMetrics>('dashboard/user/metrics');
  const userMetricsFormatted = [
    { title: 'Total de Usuários', value: data.totalUsers, icon: UsersIcon, description: 'últimos 30 dias' },
    { title: 'Usuários Ativos', value: data.activeUsers, icon: TrendingUp, description: 'últimos 30 dias' },
    { title: 'Novos Usuários', value: data.newUsers, icon: Plus, description: 'últimos 30 dias' },
  ];
  return userMetricsFormatted;
}

export async function toggleRoletao(userUuid: string, isActive: boolean) {
  await api.put(`dashboard/user/roullete-signature/status?userUuid=${userUuid}&isActive=${isActive}`);
}

export async function changeUserStatus(userUuid: string, isActive: boolean) {
  await api.put(`dashboard/user/status?userUuid=${userUuid}&isActive=${isActive}`);
}

export async function getUserHistory(
  userUuid: string,
  pagination: PaginationState,
  eventType: string | null = null,
  startDate: Date | null = null,
  endDate: Date | null = null,
) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    page: pageIndex,
    size: pageSize,
    userUuid,
    ...(eventType && { eventType }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  };
  const { data } = await api.get<Record<AuditEvent>>(`/audit`, { params });
  return data;
}

export async function getUserDetail(userUuid: string) {
  const { data } = await api.get<UserDetails>(`dashboard/user/details?userUuid=${userUuid}`);
  return data;
}
