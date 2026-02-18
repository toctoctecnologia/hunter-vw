import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useId,
} from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Camera,
  Upload,
  Plus,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ImovelMedia } from '@/types/imovel';
import { ImageCard } from '@/features/imoveis/components/ImageCard';
import {
  PROPERTY_LOGO_OVERLAY_EVENT,
  getProperty,
  normalizePropertyLogoOverlayState,
  type PropertyLogoOverlayEventDetail,
  type PropertyLogoOverlayState,
} from '@/features/imoveis/state/imovelLocalStore';
import { getLogoOverlayStyles, shouldRenderLogoOverlay } from '@/features/imoveis/utils/logoOverlay';
import { cn } from '@/lib/utils';
import SeoImagemModal from '@/components/imoveis/SeoImagemModal';
import { type SeoGenerationContext } from '@/features/imoveis/utils/seo';
import { updateImovelMediaSeo } from '@/services/imovel';

type MediaCategory = 'imovel' | 'lazer';

type MediaCollection = Record<MediaCategory, ImovelMedia[]>;

const MEDIA_CATEGORIES: MediaCategory[] = ['imovel', 'lazer'];

const sortAndReindex = (items: ImovelMedia[]): ImovelMedia[] =>
  items
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));

const splitMediasByType = (items: ImovelMedia[]): MediaCollection => ({
  imovel: sortAndReindex(items.filter(item => item.type === 'imovel')),
  lazer: sortAndReindex(items.filter(item => item.type === 'lazer')),
});

const mergeMediasByType = (collection: MediaCollection): ImovelMedia[] => [
  ...collection.imovel,
  ...collection.lazer,
];

interface PhotoGalleryModalProps {
  photos: ImovelMedia[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  logoOverlay?: PropertyLogoOverlayState;
}

function PhotoGalleryModal({
  photos,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  logoOverlay,
}: PhotoGalleryModalProps) {
  const currentPhoto = photos[currentIndex];
  const overlay = shouldRenderLogoOverlay(logoOverlay) ? logoOverlay : undefined;

  if (!currentPhoto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
        aria-label="Fechar galeria"
      >
        <X className="h-6 w-6" />
      </button>

      {photos.length > 1 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {photos.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Próxima foto"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center">
        <div className="relative flex w-full max-h-[80vh] items-center justify-center">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.seo?.alt || currentPhoto.descricao || currentPhoto.roomTag || 'Foto do imóvel'}
            className="max-h-[80vh] w-full rounded-lg object-contain"
          />
          {overlay && (
            <img
              src={overlay.src}
              alt="Logo do imóvel"
              className="pointer-events-none select-none"
              style={getLogoOverlayStyles(overlay)}
              draggable={false}
            />
          )}
        </div>

        <div className="mt-4 text-center text-white">
          <p className="text-lg font-medium">{currentPhoto.descricao || 'Sem legenda'}</p>
          <p className="mt-1 text-sm text-white/70">
            {currentIndex + 1} de {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}

interface MediaUploadSectionProps {
  medias: ImovelMedia[];
  onMediasChange: (medias: ImovelMedia[]) => void;
  propertyId?: string;
}

interface SortableMediaItemProps {
  media: ImovelMedia;
  index: number;
  onUpdate: (id: string, updates: Partial<ImovelMedia>) => void;
  onRemove: (id: string) => void;
  onSetCover: (id: string) => void;
  onPhotoClick: (index: number) => void;
  logoOverlay?: PropertyLogoOverlayState;
  onEditSeo: (media: ImovelMedia) => void;
}

function SortableMediaItem({
  media,
  index,
  onUpdate,
  onRemove,
  onSetCover,
  onPhotoClick,
  logoOverlay,
  onEditSeo,
}: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: media.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;

  return (
    <ImageCard
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      media={media}
      index={index}
      onUpdate={onUpdate}
      onRemove={onRemove}
      onSetCover={onSetCover}
      onPhotoClick={onPhotoClick}
      logoOverlay={logoOverlay}
      onEditSeo={onEditSeo}
      dragHandleProps={{ attributes, listeners }}
    />
  );
}

export function MediaUploadSection({ medias, onMediasChange, propertyId }: MediaUploadSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [reordered, setReordered] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [photoCategory, setPhotoCategory] = useState<MediaCategory>('imovel');
  const [logoOverlay, setLogoOverlay] = useState<PropertyLogoOverlayState | undefined>(() => {
    if (!propertyId) {
      return undefined;
    }

    const stored = getProperty(propertyId)?.logoOverlay;
    return stored ? normalizePropertyLogoOverlayState(stored) : undefined;
  });
  const fileInputId = useId();
  const [seoModalMedia, setSeoModalMedia] = useState<ImovelMedia | null>(null);
  const [seoModalContext, setSeoModalContext] = useState<SeoGenerationContext>({
    category: 'imovel',
  });
  const [isSeoSaving, setIsSeoSaving] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      setLogoOverlay(undefined);
      return;
    }

    const stored = getProperty(propertyId)?.logoOverlay;
    setLogoOverlay(stored ? normalizePropertyLogoOverlayState(stored) : undefined);

    const listener: EventListener = event => {
      const customEvent = event as CustomEvent<PropertyLogoOverlayEventDetail>;
      if (customEvent.detail?.propertyId !== propertyId) {
        return;
      }

      setLogoOverlay(
        customEvent.detail.state ? normalizePropertyLogoOverlayState(customEvent.detail.state) : undefined,
      );
    };

    window.addEventListener(PROPERTY_LOGO_OVERLAY_EVENT, listener);
    return () => {
      window.removeEventListener(PROPERTY_LOGO_OVERLAY_EVENT, listener);
    };
  }, [propertyId]);

  useEffect(() => {
    if (medias.length === 0) {
      const exemploFotos: ImovelMedia[] = [
        {
          id: '1',
          url: '/uploads/6f12cb48-e678-4bb3-9f5f-fc5e7252f802.png',
          order: 0,
          descricao: 'Sala de jantar com mesa para 6 pessoas',
          sigla: 'SALA',
          isCover: true,
          type: 'imovel',
          roomTag: 'SALA',
          co: 'CO-001',
          seo: {
            title: 'Apartamento amplo - Sala de jantar com mesa para 6 pessoas',
            alt: 'Sala de jantar espaçosa com mesa para seis pessoas',
            slug: 'apartamento-sala-de-jantar-co-001',
            tags: ['imóvel', 'sala', 'jantar', 'CO-001'],
          },
        },
        {
          id: '2',
          url: '/uploads/83256e9e-7549-4811-88fd-006d4af79dfb.png',
          order: 1,
          descricao: 'Cozinha moderna com bancada em granito',
          sigla: 'COZ',
          type: 'imovel',
          roomTag: 'COZ',
          co: 'CO-002',
          seo: {
            title: 'Cozinha moderna com bancada em granito',
            alt: 'Cozinha com armários planejados e bancada em granito',
            slug: 'cozinha-moderna-co-002',
            tags: ['imóvel', 'cozinha', 'granito'],
          },
        },
        {
          id: '3',
          url: '/uploads/a2ccab04-075d-468a-960a-95feac3902b7.png',
          order: 2,
          descricao: 'Quarto principal com vista para o mar',
          sigla: 'QTO',
          type: 'imovel',
          roomTag: 'QTO',
          co: 'CO-003',
          seo: {
            title: 'Quarto principal com vista para o mar',
            alt: 'Suíte principal com varanda e vista para o mar',
            slug: 'quarto-principal-com-vista-para-o-mar',
            tags: ['imóvel', 'quarto', 'vista-mar'],
          },
        },
        {
          id: '4',
          url: '/uploads/c3175c8b-aefd-479a-9a58-f6109248a8f0.png',
          order: 3,
          descricao: 'Varanda com vista panorâmica da cidade',
          sigla: 'VAR',
          type: 'imovel',
          roomTag: 'VAR',
          co: 'CO-004',
          seo: {
            title: 'Varanda com vista panorâmica da cidade',
            alt: 'Varanda gourmet com vista para a cidade',
            slug: 'varanda-com-vista-panoramica',
            tags: ['imóvel', 'varanda', 'vista'],
          },
        },
        {
          id: '5',
          url: '/uploads/ec0a215b-c210-46ee-a291-15ae72ca4a6a.png',
          order: 0,
          descricao: 'Área de lazer com piscina',
          sigla: 'LAZ',
          isCover: true,
          type: 'lazer',
          roomTag: 'PISC',
          co: 'CO-005',
          seo: {
            title: 'Área de lazer com piscina do condomínio',
            alt: 'Piscina externa com cadeiras e área verde ao redor',
            slug: 'area-de-lazer-com-piscina',
            tags: ['lazer', 'piscina', 'condomínio'],
          },
        },
      ];

      onMediasChange(exemploFotos);
    }
  }, [medias.length, onMediasChange]);

  const mediasByType = useMemo(() => splitMediasByType(medias), [medias]);
  const currentMedias = mediasByType[photoCategory];

  useEffect(() => {
    setSelectedPhotoIndex(null);
  }, [photoCategory]);

  useEffect(() => {
    setSelectedPhotoIndex(prev => {
      if (prev === null) {
        return prev;
      }

      if (prev >= currentMedias.length) {
        return currentMedias.length > 0 ? currentMedias.length - 1 : null;
      }

      return prev;
    });
  }, [currentMedias.length]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const collection = splitMediasByType(medias);
      const nextCategoryItems = [
        ...collection[photoCategory],
        ...acceptedFiles.map((file, index) => ({
          id: `${Date.now()}-${index}`,
          url: URL.createObjectURL(file),
          order: collection[photoCategory].length + index,
          descricao: '',
          sigla: '',
          isCover: false,
          type: photoCategory,
          roomTag: '',
          co: '',
          seo: undefined,
        })),
      ].map((media, index) => ({ ...media, order: index }));

      const updatedCollection: MediaCollection = {
        ...collection,
        [photoCategory]: nextCategoryItems,
      };

      onMediasChange(mergeMediasByType(updatedCollection));
    },
    [medias, onMediasChange, photoCategory],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: true,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const collection = splitMediasByType(medias);
    const items = collection[photoCategory];
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    collection[photoCategory] = arrayMove(items, oldIndex, newIndex).map((media, index) => ({
      ...media,
      order: index,
    }));

    onMediasChange(mergeMediasByType(collection));
    setReordered(true);
  };

  const handleUpdateMedia = (id: string, updates: Partial<ImovelMedia>) => {
    const collection = splitMediasByType(medias);
    const currentCategory = MEDIA_CATEGORIES.find(category =>
      collection[category].some(media => media.id === id),
    );

    if (!currentCategory) {
      return;
    }

    const currentItems = collection[currentCategory];
    const targetIndex = currentItems.findIndex(media => media.id === id);

    if (targetIndex === -1) {
      return;
    }

    const nextType = updates.type ?? currentItems[targetIndex].type;
    const updatedMedia: ImovelMedia = {
      ...currentItems[targetIndex],
      ...updates,
      type: nextType,
    };

    if (nextType === currentCategory) {
      const nextItems = [...currentItems];
      nextItems[targetIndex] = updatedMedia;
      collection[currentCategory] = nextItems.map((media, index) => ({ ...media, order: index }));
    } else {
      const nextCurrentItems = currentItems
        .filter(media => media.id !== id)
        .map((media, index) => ({ ...media, order: index }));
      const nextDestinationItems = [...collection[nextType], updatedMedia].map((media, index) => ({
        ...media,
        order: index,
      }));

      collection[currentCategory] = nextCurrentItems;
      collection[nextType] = nextDestinationItems;
    }

    onMediasChange(mergeMediasByType(collection));
  };

  const handleRemoveMedia = (id: string) => {
    const collection = splitMediasByType(medias);
    let removed = false;

    MEDIA_CATEGORIES.forEach(category => {
      if (removed) {
        return;
      }

      if (collection[category].some(media => media.id === id)) {
        collection[category] = collection[category]
          .filter(media => media.id !== id)
          .map((media, index) => ({ ...media, order: index }));
        removed = true;
      }
    });

    if (removed) {
      onMediasChange(mergeMediasByType(collection));
    }
  };

  const handleSetCover = (id: string) => {
    const collection = splitMediasByType(medias);
    const category = MEDIA_CATEGORIES.find(key => collection[key].some(media => media.id === id));

    if (!category) {
      return;
    }

    collection[category] = collection[category].map(media => ({
      ...media,
      isCover: media.id === id,
    }));

    onMediasChange(mergeMediasByType(collection));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      (window as any).analytics?.track('galeria_salvar', {
        qtdMidias: medias.length,
        reordenado: reordered,
      });
    } finally {
      setIsSaving(false);
      setReordered(false);
    }
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseGallery = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < currentMedias.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handleOpenSeoModal = (media: ImovelMedia) => {
    let propertyTitle: string | undefined;
    let neighborhood: string | undefined;
    let city: string | undefined;

    if (propertyId) {
      const propertyData = getProperty(propertyId) as any;
      propertyTitle =
        propertyData?.title ||
        propertyData?.nome ||
        propertyData?.dados?.condominio ||
        propertyData?.dados?.edificio ||
        propertyData?.dados?.codigo;
      neighborhood = propertyData?.dados?.bairro || propertyData?.dados?.localizacao;
      city = propertyData?.dados?.cidade;
    }

    setSeoModalMedia(media);
    setSeoModalContext({
      category: media.type,
      propertyId,
      propertyTitle,
      neighborhood,
      city,
    });
  };

  const handleCloseSeoModal = () => {
    if (isSeoSaving) {
      return;
    }
    setSeoModalMedia(null);
  };

  const handleSaveSeo = async (
    mediaId: string,
    seo: NonNullable<ImovelMedia['seo']>,
  ): Promise<void> => {
    setIsSeoSaving(true);
    try {
      if (propertyId) {
        await updateImovelMediaSeo(propertyId, mediaId, seo);
      }

      handleUpdateMedia(mediaId, { seo });
      setSeoModalMedia(null);
    } finally {
      setIsSeoSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Camera className="h-5 w-5 shrink-0 text-orange-500" />
          <div className="min-w-0 flex-1 overflow-x-auto">
            <div className="flex w-max items-center gap-2 px-2 sm:px-0">
              <button
                onClick={() => setPhotoCategory('imovel')}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  photoCategory === 'imovel'
                    ? 'bg-[hsl(var(--accent))] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
              >
                FOTOS DO IMÓVEL
              </button>
              <button
                onClick={() => setPhotoCategory('lazer')}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  photoCategory === 'lazer'
                    ? 'bg-[hsl(var(--accent))] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
              >
                FOTOS DO LAZER
              </button>
            </div>
          </div>
          {currentMedias.length > 0 && (
            <span className="ml-2 shrink-0 text-sm text-gray-500">({currentMedias.length})</span>
          )}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            className="h-11 w-full rounded-xl bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))] sm:w-auto"
            onClick={open}
            disabled={isSaving}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar foto(s)
          </Button>
          <Button
            className="h-11 w-full rounded-xl bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))] sm:w-auto"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div
        {...getRootProps({
          className: cn(
            'flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center transition-colors',
            isDragActive
              ? 'border-[hsl(var(--accent))] bg-orange-50 text-[hsl(var(--accent))]'
              : 'hover:border-[hsl(var(--accent))] hover:bg-gray-100',
          ),
        })}
      >
        <input id={fileInputId} {...getInputProps()} />
        <Upload className="mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          Arraste e solte fotos do {photoCategory === 'imovel' ? 'imóvel' : 'lazer'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Formatos suportados: JPG, PNG e WEBP. Máx. 20MB cada.</p>
      </div>

      {currentMedias.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentMedias.map(media => media.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-6 grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {currentMedias.map((media, index) => (
                <SortableMediaItem
                  key={media.id}
                  media={media}
                  index={index}
                  onUpdate={handleUpdateMedia}
                  onRemove={handleRemoveMedia}
                  onSetCover={handleSetCover}
                  onPhotoClick={handlePhotoClick}
                  logoOverlay={logoOverlay}
                  onEditSeo={handleOpenSeoModal}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {selectedPhotoIndex !== null && currentMedias[selectedPhotoIndex] && (
        <PhotoGalleryModal
          photos={currentMedias}
          currentIndex={selectedPhotoIndex}
          onClose={handleCloseGallery}
          onPrevious={handlePreviousPhoto}
          onNext={handleNextPhoto}
          logoOverlay={logoOverlay}
        />
      )}

      <SeoImagemModal
        open={Boolean(seoModalMedia)}
        media={seoModalMedia}
        context={seoModalContext}
        onClose={handleCloseSeoModal}
        onSave={handleSaveSeo}
        isSaving={isSeoSaving}
      />
    </div>
  );
}
