import { api } from '@/shared/lib/api';
import { RoulleteNextQueueSettings, RoulleteNextQueueUserItem } from '@/shared/types';

export async function getNextQueueSettings() {
  const { data } = await api.get<RoulleteNextQueueSettings>('dashboard/next-queue');
  return data;
}

export async function updateNextQueueSettings(formData: RoulleteNextQueueSettings) {
  await api.put('dashboard/next-queue', formData);
}

export async function getNextQueueUsers() {
  const { data } = await api.get<RoulleteNextQueueUserItem[]>('dashboard/next-queue/users');
  return data;
}
