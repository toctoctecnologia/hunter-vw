import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';
import { NotificationReminderItem, NotificationTemplateItem, NotificationType, Record } from '@/shared/types';

export async function getTemplates(type?: NotificationType) {
  const { data } = await api.get<NotificationTemplateItem[]>(`dashboard/super-admin/notification-templates`, {
    params: { type },
  });
  return data;
}

export async function newTemplate(name: string, messageText: string, notificationType: NotificationType) {
  await api.post('dashboard/super-admin/notification-templates', { name, messageText, notificationType });
}

export async function getRemindersForTemplate(pagination: PaginationState, templateUuid: string) {
  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
  };
  const { data } = await api.get<Record<NotificationReminderItem>>(
    `dashboard/super-admin/notification-templates/${templateUuid}/reminders`,
    { params },
  );
  return data;
}

export async function getTemplate(uuid: string) {
  const { data } = await api.get<NotificationTemplateItem>(`dashboard/super-admin/notification-templates/${uuid}`);
  return data;
}

export async function updateTemplate(uuid: string, name: string, messageText: string, isActive: boolean) {
  await api.put(`dashboard/super-admin/notification-templates/${uuid}`, { name, messageText, isActive });
}

export async function deleteTemplate(uuid: string) {
  await api.delete(`dashboard/super-admin/notification-templates/${uuid}`);
}
