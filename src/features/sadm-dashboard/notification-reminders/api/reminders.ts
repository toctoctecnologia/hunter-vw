import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';
import { NotificationReminderBatchResponse, NotificationReminderItem, Record } from '@/shared/types';

import { ReminderBatchFormData } from '@/features/sadm-dashboard/notification-reminders/components/form/reminder-batch-schema';

export async function getReminders(pagination: PaginationState) {
  const params = { page: pagination.pageIndex, size: pagination.pageSize };
  const { data } = await api.get<Record<NotificationReminderItem>>('dashboard/super-admin/notification-reminders', {
    params,
  });
  return data;
}

export async function deleteReminder(uuid: string) {
  await api.delete(`dashboard/super-admin/notification-reminders/${uuid}`);
}

// Creates or updates notification reminders for multiple users in a single request. This is the main endpoint for assigning templates to users.

// Each assignment in the list can:

// Create a new reminder (if reminderUuid is null)
// Update an existing reminder (if reminderUuid is provided)
// Assign a template (via templateUuid) or leave it null for default system message
// Returns detailed results including success/failure counts and error messages.
export async function batchReminders(formData: ReminderBatchFormData[]) {
  const { data } = await api.post<NotificationReminderBatchResponse>(
    'dashboard/super-admin/notification-reminders/batch',
    {
      assignments: formData,
    },
  );
  return data;
}

// Disables all notification reminders for all users. Returns the number of reminders affected.
export async function deactivateAllReminders() {
  const { data } = await api.put<number>('dashboard/super-admin/notification-reminders/deactivate-all');
  return data;
}

// Permanently deletes all notification reminders for all users. This action cannot be undone. Returns the number of reminders deleted.
export async function deleteAllReminders() {
  const { data } = await api.delete('dashboard/super-admin/notification-reminders/delete-all');
  return data;
}

// Enables or disables notification reminders.

// Can target:

// Specific reminder UUIDs (via reminderUuids list)
// All reminders for a template (via templateUuid)
// If both are provided, reminderUuids takes precedence.

// Returns the number of reminders affected.
export async function toggleReminders(isEnabled: boolean, reminderUuids?: string[], templateUuid?: string) {
  const { data } = await api.put<number>('dashboard/super-admin/notification-reminders/toggle', {
    isEnabled,
    reminderUuids,
    templateUuid,
  });
  return data;
}

export async function getRemindersByUser(userUuid: string) {
  const { data } = await api.get<Record<NotificationReminderItem>>(
    `dashboard/super-admin/notification-reminders/user/${userUuid}`,
  );
  return data;
}
