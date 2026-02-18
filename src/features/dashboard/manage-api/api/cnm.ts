import { api } from '@/shared/lib/api';
import { CnmIntegrationData } from '@/shared/types';

export async function getCnmIntegration() {
  const { data } = await api.get<CnmIntegrationData>('dashboard/external/integration/cnm');
  return data;
}

export async function toggleCnmIntegrationActive(isActive: boolean) {
  await api.put('dashboard/external/integration/cnm', { isActive });
}

export async function updateCnmIntegrationToken() {
  await api.put('dashboard/external/integration/cnm/token');
}

export async function downloadCnmIntegrationData(token: string) {
  const { data } = await api.get(`webhook/cnm/download?token=${token}`);
  return data;
}
