import { api } from '@/shared/lib/api';

import { formatPriceForBackend } from '@/shared/lib/masks';

import { EnterprisePlanFormData } from '@/features/sadm-dashboard/access-control/components/form/enterprise-plan-schema';
import { SavePlan } from '@/features/sadm-dashboard/access-control/types';

export async function savePlan(plan: SavePlan) {
  const { data } = await api.patch(`dashboard/super-admin/plan/${plan.uuid}`, {
    ...plan,
    monthlyPrice: formatPriceForBackend(plan.monthlyPrice),
    annualPrice: formatPriceForBackend(plan.annualPrice),
  });
  return data;
}

export async function configureEnterprisePlan(accountId: string, formData: EnterprisePlanFormData) {
  await api.patch(`dashboard/super-admin/account/${accountId}`, formData);
}

export async function getEnterprisePlanPaymentLink(accountId: string) {
  const { data } = await api.post<{ paymentLink: string }>(`dashboard/super-admin/account/${accountId}/payment/link`);
  return data;
}
