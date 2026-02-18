import { api } from '@/shared/lib/api';

import { LeadClosedDealItem } from '@/shared/types';

import { MakeClosedDealFormData } from '@/features/dashboard/sales/components/form/make-closed-deal-schema';

export async function getLeadClosedDeal(leadUuid: string) {
  const { data } = await api.get<LeadClosedDealItem>(`dashboard/lead/${leadUuid}/closed-deal`);
  return data;
}

export async function newLeadClosedDeal(leadUuid: string, formData: MakeClosedDealFormData) {
  await api.post(`dashboard/lead/${leadUuid}/closed-deal`, formData);
}

export async function leadClosedDealSetRevenuePayment(leadUuid: string, revenueGenerationDate: string) {
  await api.patch(`dashboard/lead/${leadUuid}/closed-deal/revenue/payment`, { revenueGenerationDate });
}
