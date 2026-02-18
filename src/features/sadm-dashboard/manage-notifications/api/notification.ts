import { api } from '@/shared/lib/api';

export async function SendNotification(title: string, description: string) {
  await api.post('dashboard/notifications/broadcast', { title, description });
}
