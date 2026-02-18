import { api } from '@/shared/lib/api';

import { PropertyQualificationUpdateMetrics, PropertyMetricsItem } from '@/shared/types';

export async function getPropertyMetrics(startDate: string, endDate: string) {
  const { data } = await api.get<PropertyMetricsItem>('dashboard/property/management/metrics', {
    params: { startDate, endDate },
  });
  return data;
}

export async function getQualificationUpdateMetrics(startDate: string, endDate: string) {
  const { data } = await api.get<PropertyQualificationUpdateMetrics[]>(
    `dashboard/property/qualification/time/metrics?startDate=${startDate}&endDate=${endDate}`,
  );
  return data;
}
