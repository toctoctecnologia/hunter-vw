import { api } from '@/shared/lib/api';

import { PropertyOwnerAssignmentItem } from '@/shared/types';
import { OwnerAssignmentFormData } from '@/features/dashboard/properties/components/form/property-owner-assignment-form/schema';

export async function getOwners(propertyUuid: string) {
  const { data } = await api.get<PropertyOwnerAssignmentItem[]>(`dashboard/property/${propertyUuid}/owner`);
  return data;
}

export async function newOwnerAssignment(propertyUuid: string, formData: OwnerAssignmentFormData) {
  await api.post(`dashboard/property/${propertyUuid}/owner`, formData);
}

export async function updateOwnerAssignment(ownerUuid: string, formData: OwnerAssignmentFormData) {
  await api.put(`dashboard/property/owner/${ownerUuid}`, formData);
}

export async function deleteOwnerAssignment(propertyUuid: string, ownerUuid: string) {
  await api.delete(`dashboard/property/${propertyUuid}/owner/${ownerUuid}`);
}
