import { PaginationState } from '@tanstack/react-table';

import { Record, PropertyDetail, PropertyMedia, CatcherItem, PropertyQualification } from '@/shared/types';
import { api } from '@/shared/lib/api';

import { MediaCategory, MediaItem } from '@/features/dashboard/properties/components/property-gallery/types';
import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

export async function getProperties({
  pagination,
  filters,
}: {
  pagination: PaginationState;
  filters?: {
    filter?: string;
    status?: string | null;
    qualificationType?: PropertyQualification | null;
    featureUuids?: string[];
    area?: string;
    rooms?: string;
    bathrooms?: string;
    garageSpots?: string;
    suites?: string;
    internalArea?: string;
    externalArea?: string;
    lotArea?: string;
    garageType?: string | null;
    propertyType?: string | null;
    propertyValue?: string;
    catcherUuids?: string;
  };
}) {
  const { pageIndex, pageSize } = pagination;
  const body = {
    ...(filters && {
      ...(filters.filter && { filter: filters.filter || null }),
      ...(filters.status && { status: filters.status || null }),
      ...(filters.qualificationType && { qualificationType: filters.qualificationType || null }),
      ...(filters.featureUuids && { featureUuids: filters.featureUuids || [] }),
      ...(filters.area && { area: filters.area || null }),
      ...(filters.rooms && { rooms: filters.rooms || null }),
      ...(filters.bathrooms && { bathrooms: filters.bathrooms || null }),
      ...(filters.garageSpots && { garageSpots: filters.garageSpots || null }),
      ...(filters.suites && { suites: filters.suites || null }),
      ...(filters.internalArea && { internalArea: filters.internalArea || null }),
      ...(filters.externalArea && { externalArea: filters.externalArea || null }),
      ...(filters.lotArea && { lotArea: filters.lotArea || null }),
      ...(filters.garageType !== undefined && { garageType: filters.garageType || null }),
      ...(filters.propertyType !== undefined && { propertyType: filters.propertyType || null }),
      ...(filters.catcherUuids && { catcherUuids: filters.catcherUuids || null }),
      ...(filters.propertyValue && {
        propertyValue: filters.propertyValue ? (parseFloat(filters.propertyValue) / 100).toString() : null,
      }),
    }),
  };

  const { data } = await api.post<Record<PropertyDetail>>(
    `dashboard/property/list?page=${pageIndex}&size=${pageSize}`,
    body,
  );
  return data;
}

export async function getPropertyById(uuid: string) {
  const { data } = await api.get<PropertyDetail>(`dashboard/property/${uuid}`);
  return data;
}

export async function getPropertyCatchers() {
  const { data } = await api.get<CatcherItem[]>(`dashboard/property/catchers/list`);
  return data;
}

export async function newProperty(property: PropertyFormData) {
  const { data } = await api.post('dashboard/property/initial/register', {
    ...property,
    previousPrice: property.previousPrice || null,
    info: {
      ...property.info,
      secondaryType: property.info.secondaryType || null,
    },
  });
  return data;
}

export async function updateProperty(uuid: string, property: PropertyFormData) {
  const { data } = await api.put(`dashboard/property/${uuid}`, {
    ...property,
    secondaryDistrictUuid: property.secondaryDistrictUuid || null,
    condominiumUuid: property.condominiumUuid || null,
    commission: property.commission || null,
    price: property.price || null,
    iptuValue: property.iptuValue || null,
    dimension: {
      ...property.dimension,
      internalArea: property.dimension.internalArea || null,
      externalArea: property.dimension.externalArea || null,
      lotArea: property.dimension.lotArea || null,
    },
    info: {
      ...property.info,
      secondaryType: property.info.secondaryType || null,
    },
    feature: {
      ...property.feature,
      rooms: property.feature.rooms || null,
      suites: property.feature.suites || null,
      bathrooms: property.feature.bathrooms || null,
      garageSpots: property.feature.garageSpots || null,
    },
  });
  return data;
}

export async function getPropertyMedias(uuid: string) {
  const { data } = await api.get<PropertyMedia[]>(`dashboard/property/${uuid}/media`);
  return data;
}

export async function savePropertyMedias(uuid: string, medias: MediaItem[], mainPictureId: string) {
  const newMedias = medias.filter((media) => media.id.endsWith('-new-media'));

  for (const item of newMedias) {
    const { id, category, type, file } = item;
    if (!file) continue;

    const { data } = await api.post<{ id: number; url: string }>(`dashboard/property/${uuid}/media/upload`, {
      mediaFeature: category.toUpperCase(),
      mediaType: type,
      fileName: file?.name,
      mainPicture: mainPictureId === id,
      description: item.description,
    });

    await api.put(data.url, file, { headers: { 'Content-Type': file.type } });
    await api.post('dashboard/property/media/upload-complete', { propertyMediaId: data.id });
  }
}

export async function deletePropertyMedia(propertyUuid: string, mediaCategory: MediaCategory, mediaFilename: string) {
  await api.delete(`dashboard/property/${propertyUuid}/media/${mediaCategory.toUpperCase()}/file/${mediaFilename}`);
}

export async function changePrincipalMedia(propertyUuid: string, mediaCategory: MediaCategory, mediaFilename: string) {
  await api.patch(
    `dashboard/property/${propertyUuid}/media/${mediaCategory.toUpperCase()}/file/${mediaFilename}/principal`,
  );
}

export async function deletePropertyCatcher(propertyUuid: string, catcherUuid: string) {
  await api.delete(`dashboard/property/${propertyUuid}/catcher/${catcherUuid}`);
}

export async function changeMediaOrder(propertyUuid: string, from: number, to: number) {
  await api.patch(`dashboard/property/${propertyUuid}/media/order`, { from, to });
}

// Reinicia o processo de atualização para propriedades de integrações IMOVIEW ou DWV.
// Cria um job de integração e envia mensagens para as filas apropriadas para processar as atualizações.
export async function resyncPropertyIntegrations(propertyUuid: string) {
  await api.put('dashboard/property/property-info', { propertyCodes: [propertyUuid] });
}
