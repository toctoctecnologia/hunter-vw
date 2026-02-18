import { api } from '@/shared/lib/api';
import { DwvIntegrationData } from '@/shared/types';

export async function getDwvIntegration() {
  const { data } = await api.get<DwvIntegrationData>('dashboard/external/integration/dwv');
  return data;
}

export async function updateDwvIntegrationToken(isActive: boolean, token?: string) {
  await api.put('dashboard/external/integration/dwv', { token, isActive });
}
