import { api } from '@/shared/lib/api';

import { LeadAdditionalInfoItem } from '@/shared/types';

export async function getAdditionalInfo(leadUuid: string) {
  const { data } = await api.get<LeadAdditionalInfoItem[]>(`dashboard/lead/${leadUuid}/additional-info`);
  return data;
}

export async function newAdditionalInfo(leadUuid: string, description: string) {
  await api.post(`dashboard/lead/${leadUuid}/additional-info`, { description });
}
