import { api } from '@/shared/lib/api';

import {
  LeadManageConversionMetrics,
  LeadManagePerformanceMetrics,
  LeadQualificationTimeMetrics,
} from '@/shared/types';

export async function getConversionMetrics(month: number, year: number) {
  const { data } = await api.get<LeadManageConversionMetrics[]>(
    `dashboard/lead/origin/conversion/metrics?month=${month}&year=${year}`,
  );
  return data;
}

export async function getPerformanceMetrics(month: number, year: number) {
  const { data } = await api.get<LeadManagePerformanceMetrics>(
    `dashboard/lead/performance/metrics?month=${month}&year=${year}`,
  );
  return data;
}

export async function getQualificationTimeMetrics(month: number, year: number) {
  const { data } = await api.get<LeadQualificationTimeMetrics[]>(
    `dashboard/lead/qualification/time/metrics?month=${month}&year=${year}`,
  );
  return data;
}
