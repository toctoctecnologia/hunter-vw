import { api } from '@/shared/lib/api';

import { PropertyKeychainItem } from '@/shared/types';
import { PropertyKeychainFormData } from '@/features/dashboard/properties/components/form/property-keychain-form/schema';

export async function getKeyChains(propertyUuid: string) {
  const { data } = await api.get<PropertyKeychainItem[]>(`dashboard/property/${propertyUuid}/keychain`);
  return data;
}

export async function newKeyChain(propertyUuid: string, formData: PropertyKeychainFormData) {
  await api.post(`dashboard/property/${propertyUuid}/keychain`, formData);
}

export async function updateKeyChain(keychainUuid: string, formData: PropertyKeychainFormData) {
  await api.put(`dashboard/property/keychain/${keychainUuid}`, formData);
}

export async function deleteKeyChain(propertyUuid: string, keychainUuid: string) {
  await api.delete(`dashboard/property/${propertyUuid}/keychain/${keychainUuid}`);
}
