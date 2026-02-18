import { api } from '@/shared/lib/api';

import { PropertyQualificationTimesItem } from '@/shared/types';
import { PropertyQualificationTimesFormData } from '@/features/dashboard/properties/components/form/property-qualification-times-form';

export async function getQualificationTimes() {
  const { data } = await api.get<PropertyQualificationTimesItem>(
    'dashboard/qualification/property-qualification-times',
  );
  return data;
}

export async function updateQualificationTimes(formData: PropertyQualificationTimesFormData) {
  await api.put('dashboard/qualification/property-qualification-times', formData);
}
