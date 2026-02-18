import { api } from '@/shared/lib/api';

export async function updateContactInfo(name: string, phone: string) {
  await api.patch(`user/profile/contact/info`, { name, phone });
}
