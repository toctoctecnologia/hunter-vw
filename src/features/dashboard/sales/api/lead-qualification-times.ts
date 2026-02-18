import { api } from '@/shared/lib/api';

import { LeadQualificationTimesItem } from '@/shared/types';
import { LeadQualificationTimesFormData } from '@/features/dashboard/sales/components/form/lead-qualification-times-form';

export async function getQualificationTimes() {
  const { data } = await api.get<LeadQualificationTimesItem>('dashboard/qualification/lead-qualification-times');
  return data;
}

export async function updateQualificationTimes(formData: LeadQualificationTimesFormData) {
  await api.put('dashboard/qualification/lead-qualification-times', formData);
}
