import { PropertyMediaFeature } from '@/shared/types';

export type MediaCategory = 'property' | 'leisure' | 'video' | 'construction';
export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  category: MediaCategory;
  type: MediaType;
  description: string;
  order: number;
  uri: string; // URL da imagem/vídeo (para visualização) ou ObjectURL (para upload)
  file?: File; // Arquivo original (apenas em modo edição)
  thumbnail?: string; // Thumbnail para vídeos
  isMainPicture?: boolean; // Indica se é a imagem principal
  duration?: number; // Duração do vídeo em segundos
}

export interface PropertyGalleryProps {
  media: MediaItem[];
  editMode?: boolean;
  onAddMedia?: (category: MediaCategory, files: File[]) => void;
  onRemoveMedia?: (id: string) => void;
  onSetMainPicture?: (id: string) => void;
  onUpdateDescription?: (id: string, description: string) => void;
  onReorderMedia?: (from: number, to: number) => void;
  mainPictureId?: string;
  excludedCategories?: MediaCategory[];
}

export interface MediaGridProps {
  items: MediaItem[];
  maxItems?: number;
  editMode?: boolean;
  mainPictureId?: string;
  onItemPress: (item: MediaItem, index: number) => void;
  onRemoveItem?: (id: string) => void;
  onAddItem?: () => void;
  onSetMainPicture?: (id: string) => void;
  onUpdateDescription?: (id: string, description: string) => void;
  selectionMode?: boolean;
  selectedItems?: Set<string>;
  onToggleSelection?: (id: string) => void;
}

export interface MediaViewerModalProps {
  open: boolean;
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

// Mapeamento de MediaCategory para PropertyMediaFeature
export const CATEGORY_TO_FEATURE_MAP: Record<MediaCategory, PropertyMediaFeature> = {
  property: PropertyMediaFeature.PROPERTY,
  leisure: PropertyMediaFeature.LEISURE,
  video: PropertyMediaFeature.VIDEO,
  construction: PropertyMediaFeature.CONSTRUCTION,
};

// Inverso do mapeamento acima
export const FEATURE_TO_CATEGORY_MAP: Record<PropertyMediaFeature, MediaCategory> = {
  [PropertyMediaFeature.PROPERTY]: 'property',
  [PropertyMediaFeature.LEISURE]: 'leisure',
  [PropertyMediaFeature.VIDEO]: 'video',
  [PropertyMediaFeature.CONSTRUCTION]: 'construction',
};
