import { api } from '@/shared/lib/api';
import { AppleCalendarStatus } from '@/shared/types';

export async function getStatus() {
  const { data } = await api.get<AppleCalendarStatus>('dashboard/user/integration/apple-calendar/status');
  return data;
}

export async function connect(appleId: string, appSpecificPassword: string) {
  await api.post('dashboard/user/integration/apple-calendar/connect', { appleId, appSpecificPassword });
}

export async function disconnect() {
  await api.delete('dashboard/user/integration/apple-calendar/disconnect');
}
