import { api } from '@/shared/lib/api';
import { Plan } from '@/shared/types';

export async function getPlans() {
  const { data } = await api.get<Plan[]>('dashboard/super-admin/plans');
  return data;
}
