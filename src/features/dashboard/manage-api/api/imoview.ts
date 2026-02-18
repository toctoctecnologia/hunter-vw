import { api } from '@/shared/lib/api';
import { ImoviewIntegrationData } from '@/shared/types';

export async function getIntegration() {
  const { data } = await api.get<ImoviewIntegrationData | null>('dashboard/external/integration/imoview');
  return data;
}

export async function updateIntegrationSettings(data: {
  email: string;
  password: string;
  apiKey: string;
  isActive: boolean;
}) {
  await api.put('dashboard/external/integration/imoview', data);
}
