import { api } from '@/shared/lib/api';
import { CheckinItem, DistributionCheckinEventType } from '@/shared/types';

export async function getCheckins() {
  const { data } = await api.get<CheckinItem[]>('distribution/checkin');
  return data;
}

export async function newCheckin(queueId: string, eventType: DistributionCheckinEventType) {
  await api.post('distribution/checkin', { queueId, eventType });
}
