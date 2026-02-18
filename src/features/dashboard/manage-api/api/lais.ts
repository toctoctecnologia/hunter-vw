import { api } from '@/shared/lib/api';
import { LaisIntegrationData } from '@/shared/types';

export async function getLaisIntegration() {
  const { data } = await api.get<LaisIntegrationData>('dashboard/external/integration/lais');
  return data;
}

export async function changeIntegrationActive(isActive: boolean) {
  await api.put('dashboard/external/integration/lais', { isActive });
}

export async function generateNewIntegrationKey() {
  await api.put('dashboard/external/integration/lais/key');
}
