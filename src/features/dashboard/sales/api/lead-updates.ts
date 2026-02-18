import { api } from '@/shared/lib/api';

import { LeadUpdateItem } from '@/shared/types';

export async function getLeadUpdates(leadUuid: string) {
  const { data } = await api.get<LeadUpdateItem[]>(`dashboard/lead/${leadUuid}/updates`);
  return data;
}

export async function newLeadUpdate(leadUuid: string, description: string) {
  await api.post(`dashboard/lead/${leadUuid}/updates`, { description });
}

export async function deleteLeadUpdate(leadUuid: string, updateUuid: string) {
  await api.delete(`dashboard/lead/${leadUuid}/updates/${updateUuid}`);
}
