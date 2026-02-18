import { api } from '@/shared/lib/api';
import { IntegrationType, IntegrationItem } from '@/shared/types';

export async function getIntegrations(type?: IntegrationType) {
  const { data } = await api.get<IntegrationItem[]>('dashboard/external/integration/jobs', {
    params: type ? { integrationType: type } : {},
  });
  return data;
}

export async function getIntegration(integrationUuid: string) {
  const { data } = await api.get<IntegrationItem>(`dashboard/external/integration/jobs/${integrationUuid}`);
  return data;
}

export async function importIntegration(type: IntegrationType) {
  await api.post(`dashboard/external/integration/import?integrationType=${type}`);
}
