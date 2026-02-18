import { PaginationState } from '@tanstack/react-table';

import { NotificationItem, Record } from '@/shared/types';
import { api } from '@/shared/lib/api';

export async function getNotifications(pagination: PaginationState) {
  const params = { page: pagination.pageIndex, size: pagination.pageSize };
  const { data } = await api.get<Record<NotificationItem>>('dashboard/notifications', { params });
  return data;
}

export async function deleteNotification(uuid: string) {
  await api.delete(`dashboard/notifications/${uuid}`);
}

export async function markNotificationAsRead(notificationUuids: string[]) {
  await api.post(`dashboard/notifications/mark-as-viewed`, { notificationUuids });
}
