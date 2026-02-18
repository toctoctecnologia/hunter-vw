import React, { useEffect, useState } from 'react';
import { Edit3, GripVertical, Save, Sparkles, Star, Trash2, XCircle } from 'lucide-react';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ImovelMedia } from '@/types/imovel';
import type { PropertyLogoOverlayState } from '@/features/imoveis/state/imovelLocalStore';
import { getLogoOverlayStyles, shouldRenderLogoOverlay } from '@/features/imoveis/utils/logoOverlay';

const ROOM_TAG_OPTIONS = [
  { value: 'SALA', label: 'Sala' },
  { value: 'COZ', label: 'Cozinha' },
  { value: 'QTO', label: 'Quarto' },
  { value: 'VAR', label: 'Varanda' },
  { value: 'BAN', label: 'Banheiro' },
  { value: 'SUITE', label: 'Suíte' },
  { value: 'ESCR', label: 'Escritório' },
  { value: 'GAR', label: 'Garagem' },
  { value: 'PISC', label: 'Piscina' },
  { value: 'OUTRO', label: 'Outro' },
];

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export interface ImageCardProps {
  media: ImovelMedia;
  index: number;
  onUpdate: (id: string, updates: Partial<ImovelMedia>) => void;
  onRemove: (id: string) => void;
  onSetCover: (id: string) => void;
  onPhotoClick: (index: number) => void;
  dragHandleProps?: DragHandleProps;
  style?: React.CSSProperties;
  isDragging?: boolean;
  logoOverlay?: PropertyLogoOverlayState;
  onEditSeo?: (media: ImovelMedia) => void;
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>((props, ref) => {
  const {
    media,
    index,
    onUpdate,
    onRemove,
    onSetCover,
    onPhotoClick,
    dragHandleProps,
    style,
    isDragging,
    logoOverlay,
    onEditSeo,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [localDescricao, setLocalDescricao] = useState(media.descricao);
  const [localSigla, setLocalSigla] = useState(media.sigla);
  const [coTouched, setCoTouched] = useState(false);

  const hasSeo = Boolean(media.seo?.title && media.seo?.alt && media.seo?.slug);

  useEffect(() => {
    setLocalDescricao(media.descricao);
  }, [media.descricao]);

  useEffect(() => {
    setLocalSigla(media.sigla);
  }, [media.sigla]);

  useEffect(() => {
    setCoTouched(false);
  }, [media.id]);

  const handleDescricaoChange = (value: string) => {
    setLocalDescricao(value);
    const firstWord = value.trim().split(' ')[0];
    if (firstWord) {
      setLocalSigla(firstWord.substring(0, 6).toUpperCase());
    }
  };

  const handleSave = () => {
    onUpdate(media.id, {
      descricao: localDescricao,
      sigla: localSigla,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalDescricao(media.descricao);
    setLocalSigla(media.sigla);
    setIsEditing(false);
  };

  const coError = coTouched && !media.co.trim();

  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-200',
        isDragging ? 'shadow-lg ring-2 ring-[hsl(var(--accent))]/60' : 'shadow-sm hover:shadow-md',
      )}
    >
      {dragHandleProps && (
        <button
          type="button"
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--accent))]"
          aria-label="Reordenar foto"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      <div className="relative w-full cursor-pointer overflow-hidden rounded-xl" onClick={() => onPhotoClick(index)}>
        <div className="aspect-[4/3]">
          <img
            src={media.url}
            alt={media.seo?.alt || media.descricao || 'Foto do imóvel'}
            className="h-full w-full object-cover"
          />
        </div>

        {shouldRenderLogoOverlay(logoOverlay) && (
          <img
            src={logoOverlay.src}
            alt="Logo do imóvel"
            style={getLogoOverlayStyles(logoOverlay)}
            className="pointer-events-none select-none"
            draggable={false}
          />
        )}

        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            onRemove(media.id);
          }}
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white"
          aria-label="Remover foto"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {media.isCover ? (
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onSetCover(media.id);
            }}
            className="absolute right-12 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500 text-white shadow-sm"
            aria-label="Foto de capa"
          >
            <Star className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onSetCover(media.id);
            }}
            className="absolute right-12 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white"
            aria-label="Definir como capa"
          >
            <Star className="h-4 w-4" />
          </button>
        )}

        <div className="absolute left-3 bottom-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
            {media.sigla || '—'}
          </span>
          <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase text-gray-700">
            {media.type === 'imovel' ? 'Imóvel' : 'Lazer'}
          </span>
          <span
            className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase text-gray-700"
            aria-label={`CO da foto: ${media.co || 'não informado'}`}
          >
            CO {media.co || '—'}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
          <Badge
            variant={hasSeo ? 'success' : 'warning'}
            aria-label={hasSeo ? 'SEO configurado para esta foto' : 'SEO pendente para esta foto'}
          >
            {hasSeo ? 'SEO pronto' : 'SEO pendente'}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-gray-200"
            onClick={() => onEditSeo?.(media)}
            aria-label={`Editar SEO da foto ${media.descricao || media.sigla || media.co || media.id}`}
          >
            <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
            SEO
          </Button>
        </div>

        {isEditing ? (
          <>
            <Textarea
              value={localDescricao}
              onChange={event => handleDescricaoChange(event.target.value)}
              maxLength={60}
              rows={2}
              className="rounded-xl border-gray-200 text-sm focus:border-[hsl(var(--accent))]"
              placeholder="Digite uma legenda"
              aria-label="Legenda da foto"
            />
            <Input
              value={localSigla}
              onChange={event => setLocalSigla(event.target.value.toUpperCase().slice(0, 6))}
              maxLength={6}
              className="h-10 rounded-xl border-gray-200 text-sm focus:border-[hsl(var(--accent))]"
              placeholder="Sigla"
              aria-label="Sigla da foto"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleSave}
                size="sm"
                className="flex-1 rounded-xl bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))]"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex w-full items-start justify-between rounded-xl border border-dashed border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition-colors hover:border-[hsl(var(--accent))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[hsl(var(--accent))]"
          >
            <span className="line-clamp-2 pr-3">{media.descricao || 'Adicionar legenda'}</span>
            <Edit3 className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          </button>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600" htmlFor={`room-tag-${media.id}`}>
              Ambiente
            </label>
            <Select
              value={media.roomTag || undefined}
              onValueChange={value => onUpdate(media.id, { roomTag: value })}
            >
              <SelectTrigger
                id={`room-tag-${media.id}`}
                className="h-10 rounded-xl border-gray-200 text-sm focus:border-[hsl(var(--accent))]"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TAG_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600" htmlFor={`co-${media.id}`}>
              CO
            </label>
            <Input
              id={`co-${media.id}`}
              value={media.co}
              onChange={event => {
                setCoTouched(true);
                onUpdate(media.id, { co: event.target.value });
              }}
              onBlur={() => setCoTouched(true)}
              maxLength={12}
              required
              className={cn(
                'h-10 rounded-xl border-gray-200 text-sm focus:border-[hsl(var(--accent))]',
                coError && 'border-red-300 focus:border-red-400',
              )}
              placeholder="Código"
              aria-invalid={coError}
            />
            {coError && (
              <div className="flex items-center gap-1 text-xs text-red-500">
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Informe um CO para esta foto.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ImageCard.displayName = 'ImageCard';

export default ImageCard;
