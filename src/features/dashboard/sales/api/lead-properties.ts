import { api } from '@/shared/lib/api';

import { LeadPropertyItem } from '@/shared/types';

export async function getLeadProperties(leadUuid: string) {
  const { data } = await api.get<LeadPropertyItem[]>(`dashboard/lead/${leadUuid}/property`);
  return data;
}

export async function deleteLeadProperty(leadUuid: string, propertyCode: string) {
  await api.delete(`dashboard/lead/${leadUuid}/property/${propertyCode}`);
}

export async function signPropertyToLead(leadUuid: string, propertyCode: string) {
  await api.post(`dashboard/lead/${leadUuid}/property/${propertyCode}/sign`);
}
