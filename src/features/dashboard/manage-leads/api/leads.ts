import { api } from '@/shared/lib/api';

export async function transferLeads(catcherUuid: string, leadUuids: string[]) {
  await api.post('dashboard/lead/transfer/catcher', { catcherUuid, leadUuids });
}
