import { PaginationState } from '@tanstack/react-table';

import { removeNonNumeric } from '@/shared/lib/masks';

import { api } from '@/shared/lib/api';
import {
  AuditEvent,
  CatcherItem,
  FunnelLeadsFilters,
  LeadDetail,
  LeadFunnelItem,
  LeadFunnelStages,
  NegotiationFilters,
  Record,
} from '@/shared/types';

import { LeadFormData } from '@/features/dashboard/sales/components/form/lead-form';

export async function getLeads({
  filters,
  searchTerm,
  pagination,
}: {
  filters?: NegotiationFilters | null;
  searchTerm?: string;
  pagination: PaginationState;
}) {
  const { pageIndex, pageSize } = pagination;
  const { data } = await api.post<Record<LeadDetail>>(
    'dashboard/lead/list',
    {
      ...(filters && { ...filters }),
      ...(searchTerm && { filter: searchTerm }),
    },
    {
      params: {
        page: pageIndex,
        size: pageSize,
      },
    },
  );
  return data;
}

export async function getLeadById(uuid: string) {
  const { data } = await api.get<LeadDetail>(`dashboard/lead/${uuid}`);
  return data;
}

export async function getCatchers() {
  const { data } = await api.get<CatcherItem[]>('dashboard/lead/catchers/list');
  return data;
}

export async function createLead(leadData: LeadFormData) {
  const { data } = await api.post('dashboard/lead/initial/register', {
    ...leadData,
    phone1: leadData.phone1 ? removeNonNumeric(leadData.phone1) : undefined,
    phone2: leadData.phone2 ? removeNonNumeric(leadData.phone2) : undefined,
  });
  return data;
}

export async function updateLeadFunnelStep(leadUuid: string, funnelStep: LeadFunnelStages) {
  await api.patch(`dashboard/lead/${leadUuid}/funnel/step/${funnelStep}`);
}

export async function updateLeadAssistantReaderAvailable(leadUuid: string, isAvailable: boolean) {
  await api.patch(`dashboard/lead/${leadUuid}/accessor/visibility?isEnabled=${isAvailable}`);
}

export async function updateLead(leadUuid: string, leadData: Partial<LeadFormData>) {
  const { data } = await api.put(`dashboard/lead/${leadUuid}`, {
    ...leadData,
    phone1: leadData.phone1 ? removeNonNumeric(leadData.phone1) : undefined,
    phone2: leadData.phone2 ? removeNonNumeric(leadData.phone2) : undefined,
  });
  return data;
}

export async function getFunnelLeads(filters: FunnelLeadsFilters) {
  const body = {
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.catcherUuid && { catcherUuid: filters.catcherUuid }),
    ...(filters.funnelType && { funnelType: filters.funnelType }),
    ...(filters.unitUuid && { unitUuid: filters.unitUuid }),
    ...(filters.originType && { originType: filters.originType }),
  };
  const { data } = await api.post<LeadFunnelItem[]>('dashboard/lead/funnel/step/metrics', body);
  return data;
}

export async function getFunnelLeadsWithoutFilters() {
  const { data } = await api.get<LeadFunnelItem[]>('dashboard/lead/funnel/step/metrics');
  return data;
}

export async function archiveLead(leadUuid: string, reasonUuid: string) {
  await api.patch(`dashboard/lead/${leadUuid}/archive/reason/${reasonUuid}`);
}

export async function unarchiveLead(leadUuid: string) {
  await api.put(`dashboard/lead/${leadUuid}/status`);
}

export async function getDistributionPendingOffers() {
  const { data } = await api.get<LeadDetail[]>('dashboard/lead/distribution/pending-offers');
  return data;
}

export async function getRoulettePendingOffers() {
  const { data } = await api.get<LeadDetail[]>('dashboard/lead/roulette/pending-offers');
  return data;
}

export async function captureRouletteLead(leadUuid: string) {
  await api.post(`dashboard/lead/roulette/pending-offers/accept`, { leadUuid });
}

export async function captureDistributionLead(leadUuid: string) {
  await api.post(`dashboard/lead/distribution/pending-offers/accept`, { leadUuid });
}

export async function getLeadHistory(
  leadUuid: string,
  pagination: PaginationState,
  eventType: string | null = null,
  startDate: Date | null = null,
  endDate: Date | null = null,
) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    page: pageIndex,
    size: pageSize,
    ...(eventType && { eventType }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
  };
  const { data } = await api.get<Record<AuditEvent>>(`audit/lead/${leadUuid}`, { params });
  return data;
}

export async function updateFunnelStepTargetPercentage(funnelStage: LeadFunnelStages, targetPercentage: number) {
  await api.put('funnel-step/management', { targetPercentage, funnelStepCode: funnelStage });
}
