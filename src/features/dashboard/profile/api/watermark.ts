import { OverlaySetting } from '@/shared/types';
import { api } from '@/shared/lib/api';

export async function getOverlaySettings() {
  const { data } = await api.get<OverlaySetting>('account/overlay/settings');
  return data;
}

export async function updateOverlaySettings(formData: OverlaySetting) {
  await api.put(`account/overlay/settings`, formData);
}

export async function uploadWatermarkImage(file: File) {
  const formData = new FormData();
  formData.append('watermarkImage', file);

  const { data } = await api.post<{ url: string }>('account/overlay/watermark/presigned-url', {
    fileName: `${Date.now()}-${file.name}`,
    mediaType: file.type,
  });

  if (data.url) {
  }

  await api.put(data.url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
}
