import { api } from '@/shared/lib/api';

import { PropertyCatcherAssignmentItem } from '@/shared/types';
import { PropertyCatcherAssignmentFormData } from '@/features/dashboard/properties/components/form/property-catcher-assignment-form/schema';

export async function getCatchers(propertyUuid: string) {
  const { data } = await api.get<PropertyCatcherAssignmentItem[]>(
    `dashboard/property/${propertyUuid}/catcher-assignment`,
  );
  return data;
}

export async function newCatcherAssignment(propertyUuid: string, formData: PropertyCatcherAssignmentFormData) {
  await api.post(`dashboard/property/${propertyUuid}/catcher-assignment`, formData);
}

export async function updateCatcherAssignment(
  catcherAssignmentUuid: string,
  formData: PropertyCatcherAssignmentFormData,
) {
  await api.put(`dashboard/property/catcher-assignment/${catcherAssignmentUuid}`, formData);
}

export async function deleteCatcherAssignment(propertyUuid: string, catcherAssignmentUuid: string) {
  await api.delete(`dashboard/property/${propertyUuid}/catcher-assignment/${catcherAssignmentUuid}`);
}
