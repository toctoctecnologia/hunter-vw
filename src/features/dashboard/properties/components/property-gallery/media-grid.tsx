'use client';
import React, { useState } from 'react';
import Image from '@/shims/next-image';
import { Play, X, Plus, Star, GripVertical, Check } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/shared/lib/utils';
import { TypographySmall } from '@/shared/components/ui/typography';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import type { MediaGridProps, MediaItem } from './types';

// Componente interno para item sortable
function SortableMediaItem({
  item,
  index,
  isMainPicture,
  editMode,
  onItemPress,
  onRemoveItem,
  onSetMainPicture,
  onUpdateDescription,
  selectionMode,
  isSelected,
  onToggleSelection,
}: {
  item: MediaItem;
  index: number;
  isMainPicture: boolean;
  editMode: boolean;
  onItemPress: (item: MediaItem, index: number) => void;
  onRemoveItem?: (id: string) => void;
  onSetMainPicture?: (id: string) => void;
  onUpdateDescription?: (id: string, description: string) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}) {
  const [localDescription, setLocalDescription] = useState(item.description || '');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDescriptionBlur = () => {
    if (onUpdateDescription && localDescription !== item.description) {
      onUpdateDescription(item.id, localDescription);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-2">
      <div
        onClick={() => {
          if (selectionMode && item.type === 'image' && onToggleSelection) {
            onToggleSelection(item.id);
          } else if (!editMode && !selectionMode) {
            onItemPress(item, index);
          }
        }}
        className={cn(
          'relative aspect-square rounded-xl overflow-hidden bg-secondary transition-transform',
          !editMode && 'hover:scale-[1.02] cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          isSelected && 'ring-4 ring-primary',
        )}
        role="button"
        tabIndex={0}
      >
        {/* Imagem/Vídeo */}
        <Image
          src={item.thumbnail || item.uri}
          alt={item.description || `Mídia ${index + 1}`}
          fill
          className="object-cover"
          unoptimized
        />

        {/* Indicador de seleção */}
        {selectionMode && item.type === 'image' && (
          <div className="absolute top-2 right-2 z-20">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center transition-all',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/80 text-gray-600',
              )}
            >
              {isSelected && <Check className="h-5 w-5" />}
            </div>
          </div>
        )}

        {/* Overlay para vídeos */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white/90 rounded-full p-2">
              <Play className="h-6 w-6 fill-black" />
            </div>
            {item.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
                <TypographySmall className="text-white text-xs font-semibold">
                  {formatDuration(item.duration)}
                </TypographySmall>
              </div>
            )}
          </div>
        )}

        {/* Botões de ação no modo edição */}
        {editMode && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {/* Botão de definir como principal (apenas para imagens) */}
            {item.type === 'image' && onSetMainPicture && (
              <div
                className={cn(
                  'h-8 w-8 rounded-md text-white flex items-center justify-center cursor-pointer transition-colors',
                  !isMainPicture ? 'bg-black/70 hover:bg-black/90' : 'bg-primary/100 hover:bg-primary/100',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isMainPicture) onSetMainPicture(item.id);
                }}
                role="button"
                tabIndex={0}
              >
                <Star className="h-4 w-4" />
              </div>
            )}

            {/* Botão de remover */}
            {onRemoveItem && (
              <div
                className="h-8 w-8 rounded-md bg-black/70 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                role="button"
                tabIndex={0}
              >
                <X className="h-4 w-4" />
              </div>
            )}
          </div>
        )}

        {/* Handle para drag no modo edição */}
        {editMode && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 h-8 w-8 rounded-md bg-black/70 hover:bg-black/90 text-white flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors z-10"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Campo de descrição no modo edição */}
      {editMode && onUpdateDescription && (
        <div className="flex flex-col gap-1">
          <Label htmlFor={`description-${item.id}`} className="text-xs text-muted-foreground">
            Descrição (SEO)
          </Label>
          <Input
            id={`description-${item.id}`}
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Descrição da imagem..."
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
}

export function MediaGrid({
  items,
  maxItems = 4,
  editMode = false,
  onItemPress,
  onRemoveItem,
  mainPictureId,
  onAddItem,
  onSetMainPicture,
  onUpdateDescription,
  selectionMode = false,
  selectedItems = new Set(),
  onToggleSelection,
}: MediaGridProps) {
  const displayItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;
  const hasMore = remainingCount > 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-4xl">
      {displayItems.map((item, index) => {
        const isMainPicture = item.isMainPicture || mainPictureId === item.id;
        const isSelected = selectedItems.has(item.id);

        // No modo edição, usar SortableMediaItem
        if (editMode) {
          return (
            <SortableMediaItem
              key={item.id}
              item={item}
              index={index}
              isMainPicture={isMainPicture}
              editMode={editMode}
              onItemPress={onItemPress}
              onRemoveItem={onRemoveItem}
              onSetMainPicture={onSetMainPicture}
              onUpdateDescription={onUpdateDescription}
              selectionMode={false}
              isSelected={false}
              onToggleSelection={undefined}
            />
          );
        }

        // Modo visualização (sem drag-and-drop)
        return (
          <div
            key={item.id}
            onClick={() => {
              if (selectionMode && item.type === 'image' && onToggleSelection) {
                onToggleSelection(item.id);
              } else if (!selectionMode) {
                onItemPress(item, index);
              }
            }}
            className={cn(
              'relative aspect-square rounded-xl overflow-hidden bg-secondary transition-transform cursor-pointer',
              !selectionMode && 'hover:scale-[1.02]',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              isSelected && 'ring-4 ring-primary',
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (selectionMode && item.type === 'image' && onToggleSelection) {
                  onToggleSelection(item.id);
                } else if (!selectionMode) {
                  onItemPress(item, index);
                }
              }
            }}
          >
            <Image
              src={item.thumbnail || item.uri}
              alt={item.description || `Mídia ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Indicador de seleção */}
            {selectionMode && item.type === 'image' && (
              <div className="absolute top-2 right-2 z-20">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center transition-all',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/80 text-gray-600',
                  )}
                >
                  {isSelected && <Check className="h-5 w-5" />}
                </div>
              </div>
            )}

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/90 rounded-full p-2">
                  <Play className="h-6 w-6 fill-black" />
                </div>
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
                    <TypographySmall className="text-white text-xs font-semibold">
                      {(() => {
                        const mins = Math.floor(item.duration / 60);
                        const secs = item.duration % 60;
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                      })()}
                    </TypographySmall>
                  </div>
                )}
              </div>
            )}

            {index === maxItems - 1 && hasMore && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <span className="text-white text-2xl font-bold">+{remainingCount}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Botão de adicionar no modo edição */}
      {editMode && onAddItem && (
        <button
          onClick={onAddItem}
          className={cn(
            'aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25',
            'hover:border-primary/50 transition-colors',
            'flex flex-col items-center justify-center gap-2',
            'focus:outline-none focus:ring-2 focus:ring-primary',
          )}
          type="button"
        >
          <Plus className="h-8 w-8 text-muted-foreground" />
          <TypographySmall className="text-muted-foreground">Adicionar</TypographySmall>
        </button>
      )}
    </div>
  );
}
