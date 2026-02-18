import { api } from '@/shared/lib/api';

import { PropertyGeneralMetrics } from '@/shared/types';

export async function getGeneralMetrics() {
  const { data } = await api.get<PropertyGeneralMetrics>('dashboard/property/general/metrics');
  return data;
}
