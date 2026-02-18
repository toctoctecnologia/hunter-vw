import type { PropertyMedia } from '@/shared/types';
import type { MediaItem, MediaCategory } from './types';
import { FEATURE_TO_CATEGORY_MAP } from './types';

/**
 * Converte PropertyMedia (vindo da API) para MediaItem (usado no componente)
 */
export function propertyMediaToMediaItem(propertyMedia: PropertyMedia): MediaItem {
  const mediaFeature = propertyMedia.mediaFeature as keyof typeof FEATURE_TO_CATEGORY_MAP;
  const category: MediaCategory = FEATURE_TO_CATEGORY_MAP[mediaFeature] || 'property';

  const type = propertyMedia.mediaType.toUpperCase() === 'VIDEO' ? 'video' : 'image';

  return {
    id: propertyMedia.url, // Usar URL como ID para dados da API
    category,
    type,
    uri: propertyMedia.url,
    description: propertyMedia.description || '',
    order: propertyMedia.order,
  };
}

/**
 * Converte array de PropertyMedia para array de MediaItem
 * Ordena pelo campo 'order' crescente
 */
export function propertyMediaArrayToMediaItems(propertyMediaArray: PropertyMedia[]): MediaItem[] {
  return propertyMediaArray.map(propertyMediaToMediaItem).sort((a, b) => a.order - b.order);
}

/**
 * Converte MediaItem para PropertyMedia (para enviar à API)
 */
export function mediaItemToPropertyMedia(mediaItem: MediaItem): PropertyMedia & { file?: File } {
  const mediaFeature = {
    property: 'PROPERTY',
    leisure: 'LEISURE',
    video: 'VIDEO',
    construction: 'CONSTRUCTION',
  }[mediaItem.category] as PropertyMedia['mediaFeature'];

  const mediaType = mediaItem.type === 'video' ? 'VIDEO' : 'IMAGE';

  return {
    mediaFeature,
    mediaType,
    principalMedia: mediaItem.isMainPicture || false,
    url: mediaItem.uri,
    file: mediaItem.file,
    description: mediaItem.description,
    order: mediaItem.order,
  };
}

/**
 * Agrupa MediaItems por categoria
 */
export function groupMediaByCategory(media: MediaItem[]): Record<MediaCategory, MediaItem[]> {
  return media.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MediaCategory, MediaItem[]>);
}
