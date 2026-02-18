import { api } from '@/shared/lib/api';

import { ArchivedByChannelItem, ArchivedByReasonItem, LeadsDashboardFilters, LeadsDashboardItem } from '@/shared/types';

export async function getMetrics(filter: LeadsDashboardFilters) {
  const params: LeadsDashboardFilters = {
    month: filter.month,
    year: filter.year,
    ...(filter.teamUuid && { teamUuid: filter.teamUuid }),
    ...(filter.funnelType && { funnelType: filter.funnelType }),
    ...(filter.campaignUuid && { campaignUuid: filter.campaignUuid }),
    ...(filter.propertyPurpose && { propertyPurpose: filter.propertyPurpose }),
    ...(filter.funnelStepId && { funnelStepId: filter.funnelStepId }),
    ...(filter.intensityType && { intensityType: filter.intensityType }),
    ...(filter.originType && { originType: filter.originType }),
    ...(filter.catcherId && { catcherId: filter.catcherId }),
  };
  const { data } = await api.get<LeadsDashboardItem>('dashboard/lead/metrics/detailed', { params });
  return data;
}

export async function getArchivedByChannelMetrics(startDate: string, endDate: string) {
  const params = { startDate, endDate };
  const { data } = await api.get<ArchivedByChannelItem[]>('dashboard/lead/metrics/archived-by-channel', { params });
  return data;
}

export async function getArchivedByReasonMetrics(startDate: string, endDate: string) {
  const params = { startDate, endDate };
  const { data } = await api.get<ArchivedByReasonItem[]>('dashboard/lead/metrics/archived-by-reason', { params });
  return data;
}
