import { api } from '@/shared/lib/api';

import { LeadPropertyPreferenceHistoryFormData } from '@/features/dashboard/sales/components/form/lead-property-preference-history-form';

import { PropertyPreferenceHistoryItem } from '@/shared/types';

export async function getLeadPropertyPreferenceHistory(leadUuid: string) {
  const { data } = await api.get<PropertyPreferenceHistoryItem[]>(
    `dashboard/leads/property-preference-history/${leadUuid}`,
  );
  return data;
}

export async function newLeadPropertyPreferenceHistory(
  leadUuid: string,
  formData: LeadPropertyPreferenceHistoryFormData,
) {
  await api.post(`dashboard/leads/property-preference-history/${leadUuid}`, formData);
}

export async function updateLeadPropertyPreferenceHistory(
  uuid: string,
  formData: LeadPropertyPreferenceHistoryFormData,
) {
  await api.put(`dashboard/leads/property-preference-history/${uuid}`, formData);
}

export async function deleteLeadPropertyPreferenceHistory(uuid: string) {
  await api.delete(`dashboard/leads/property-preference-history/${uuid}`);
}
