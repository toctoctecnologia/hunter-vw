import { PaginationState } from '@tanstack/react-table';

import { PropertyMedia, CondominiumDetail, Record } from '@/shared/types';
import { api } from '@/shared/lib/api';

import { CondominiumFormData } from '@/features/dashboard/properties/components/form/condominium-form/schema';
import { MediaCategory, MediaItem } from '@/features/dashboard/properties/components/property-gallery/types';

export async function getCondominiums(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = search ? { search, page: pageIndex, size: pageSize } : { page: pageIndex, size: pageSize };
  const { data } = await api.get<Record<CondominiumDetail>>('dashboard/property/condominium', { params });
  return data;
}

export async function getCondominiumById(uuid: string) {
  const { data } = await api.get<CondominiumDetail>(`dashboard/property/condominium/${uuid}`);
  return data;
}

export async function newCondominium(condominium: CondominiumFormData) {
  const { data } = await api.post<CondominiumDetail>('dashboard/property/condominium', {
    ...condominium,
    price: condominium.price ?? null,
    years: condominium.years ?? null,
  });
  return data;
}

export async function getCondominiumMedias(uuid: string) {
  const { data } = await api.get<PropertyMedia[]>(`dashboard/property/condominium/${uuid}/media`);
  return data;
}

export async function updateCondominium(uuid: string, condominium: CondominiumFormData) {
  const { data } = await api.put(`dashboard/property/condominium/${uuid}`, {
    ...condominium,
    price: condominium.price ?? null,
    years: condominium.years ?? null,
  });
  return data;
}

export async function saveCondominiumMedias(uuid: string, medias: MediaItem[], mainPictureId: string) {
  const newMedias = medias.filter((media) => media.id.endsWith('-new-media'));

  for (const item of newMedias) {
    const { id, category, type, file } = item;
    const { data } = await api.post<{ url: string }>(`dashboard/property/condominium/${uuid}/media/upload`, {
      mediaFeature: category.toUpperCase(),
      mediaType: type,
      fileName: file?.name,
      mainPicture: mainPictureId === id,
      description: item.description,
    });

    if (file) {
      await api.put(data.url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
    }
  }
}

export async function deleteCondominium(uuid: string) {
  const { data } = await api.delete(`dashboard/property/condominium/${uuid}`);
  return data;
}

export async function deleteCondominiumMedia(uuid: string, mediaCategory: MediaCategory, mediaFilename: string) {
  await api.delete(`dashboard/property/condominium/${uuid}/media/${mediaCategory.toUpperCase()}/file/${mediaFilename}`);
}

export async function changePrincipalMedia(uuid: string, mediaCategory: MediaCategory, mediaFilename: string) {
  await api.patch(
    `dashboard/property/condominium/${uuid}/media/${mediaCategory.toUpperCase()}/file/${mediaFilename}/principal`,
  );
}

export async function changeMediaOrder(uuid: string, from: number, to: number) {
  await api.patch(`dashboard/property/condominium/${uuid}/media/order`, { from, to });
}
