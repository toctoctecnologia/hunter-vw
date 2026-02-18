import { api } from '@/shared/lib/api';

import {
  DeactivateUserMetricsData,
  UserLeadQualificationMetricItem,
  UserPropertyQualificationMetricItem,
} from '@/shared/types';

import { DeactivateUserFormData } from '@/features/dashboard/access-control/components/form/deactivate-user-form/schema';

export async function getUserLeadQualificationTimeMetrics(userUuid: string, month: number, year: number) {
  const { data } = await api.get<UserLeadQualificationMetricItem[]>(
    `dashboard/user/${userUuid}/lead/qualification/time/metrics?month=${month}&year=${year}`,
  );
  return data;
}

export async function getUserPropertyQualificationTimeMetrics(userUuid: string, startDate: string, endDate: string) {
  const { data } = await api.get<UserPropertyQualificationMetricItem[]>(
    `dashboard/user/${userUuid}/property/qualification/time/metrics?startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
}

export async function deactivateUser(formData: DeactivateUserFormData) {
  await api.post('dashboard/user/deactivate', formData);
}

export async function deactivateUserMetrics(userUuid: string) {
  const { data } = await api.get<DeactivateUserMetricsData>(`dashboard/user/${userUuid}/deactivate/metrics`);
  return data;
}
