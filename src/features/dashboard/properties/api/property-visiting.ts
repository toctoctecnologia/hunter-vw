import { api } from '@/shared/lib/api';

import { PropertyVisitingFormData } from '@/features/dashboard/properties/components/form/property-visiting-form/schema';

import { DayOfWeek, PropertyVisiting } from '@/shared/types';

export async function getPropertyVisitings(propertyUuid: string) {
  const { data } = await api.get<PropertyVisiting[]>(`dashboard/property/${propertyUuid}/visiting`);
  return data;
}

export async function newPropertyVisiting(propertyUuid: string, formData: PropertyVisitingFormData) {
  await api.post(`dashboard/property/${propertyUuid}/visiting/${formData.dayOfWeek}`, {
    startTime: formData.startTime,
    endTime: formData.endTime,
  });
}

export async function updatePropertyVisiting(propertyUuid: string, formData: PropertyVisitingFormData) {
  await api.patch(`dashboard/property/${propertyUuid}/visiting/${formData.dayOfWeek}`, {
    startTime: formData.startTime,
    endTime: formData.endTime,
  });
}

export async function deletePropertyVisiting(propertyUuid: string, dayOfWeek: DayOfWeek) {
  await api.delete(`dashboard/property/${propertyUuid}/visiting/${dayOfWeek}`);
}
