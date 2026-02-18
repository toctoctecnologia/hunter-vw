import { api } from '@/shared/lib/api';

import { UserProfileMetrics } from '@/shared/types';

export async function getMetrics() {
  const { data } = await api.get<UserProfileMetrics>('user/profile/general/metrics');
  return data;
}

export async function updateContactInfo(name: string, phone: string) {
  await api.patch(`user/profile/contact/info`, { name, phone });
}

export async function updateRoulettePopupSetting(show: boolean) {
  await api.patch(`account/user/roulette-popup`, { showRoulettePopup: show });
}

export async function uploadUserImage(file: File) {
  const { data } = await api.post<{ url: string }>('user/profile/picture/presigned-url', {
    fileName: file.name,
    mediaType: file.type,
  });
  await api.put(data.url, file, { headers: { 'Content-Type': file.type } });
}

export async function removeUserImage() {
  await api.delete('user/profile/profile-picture');
}
