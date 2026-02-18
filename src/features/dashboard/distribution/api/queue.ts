import { PaginationState } from '@tanstack/react-table';
import { api } from '@/shared/lib/api';

import {
  AuditEvent,
  Record,
  QueueFilters,
  QueueItem,
  QueueItemDetail,
  QueueItemDetailUser,
  QueueRule,
} from '@/shared/types';

import { QueueFormData } from '@/features/dashboard/distribution/components/form/new-queue-schema';
import { SelectedItem } from '@/shared/components/modal/catcher-list-modal';

export async function getQueues(filters: QueueFilters, searchTerm: string) {
  const params = {
    ...filters,
    isActive: filters.isActive.length > 0 ? filters.isActive === '0' : undefined,
    filter: searchTerm,
  };
  const { data } = await api.get<QueueItem[]>('distribution/queue', { params });
  return data;
}

export async function getQueue(queueId: string) {
  const { data } = await api.get<QueueItemDetail>(`distribution/queue/${queueId}`);
  return data;
}

export async function getRules() {
  const { data } = await api.get<QueueRule[]>('distribution/rule');
  return data;
}

export async function newQueue(formData: QueueFormData & { users: QueueItemDetailUser[] }) {
  const { data } = await api.post('distribution/queue', {
    ...formData,
    checkinConfig: {
      ...formData.checkinConfig,
      daysOfWeek: `{${formData.checkinConfig.daysOfWeek}}`,
    },
  });
  return data;
}

export async function updateQueue(formData: QueueFormData & { users: QueueItemDetailUser[] }, queueId: string) {
  const { data } = await api.put(`distribution/queue/${queueId}`, formData);
  return data;
}

export async function changeQueueOrder(queueId: string, newOrder: number) {
  await api.patch(`distribution/queue/${queueId}/order/${newOrder}`);
}

export async function changeActiveQueue(queueId: string, isActive: boolean) {
  await api.patch(`distribution/queue/${queueId}/active?isActive=${isActive}`);
}

export async function deleteQueue(queueId: string) {
  await api.delete(`distribution/queue/${queueId}`);
}

export async function getDistributionHistory(
  pagination: PaginationState,
  eventType: string | null = null,
  startDate: Date | null = null,
  endDate: Date | null = null,
  selectedCatcher: SelectedItem | null = null,
) {
  const { pageIndex, pageSize } = pagination;
  const params = {
    page: pageIndex,
    size: pageSize,
    ...(eventType && { eventType }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() }),
    ...(selectedCatcher && { userUuid: selectedCatcher.uuid }),
  };
  const { data } = await api.get<Record<AuditEvent>>(`/audit`, { params });
  return data;
}
