'use client';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Home, Palmtree, Video, HardHat, Upload, Download, X, Check } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { toast } from 'sonner';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { TypographyP } from '@/shared/components/ui/typography';

import type { MediaCategory, PropertyGalleryProps, MediaItem } from './types';

import { MediaViewerModal } from './media-viewer-modal';
import { MediaGrid } from './media-grid';

const CATEGORY_CONFIG = {
  property: { label: 'Fotos do Imóvel', icon: Home },
  leisure: { label: 'Fotos do Lazer', icon: Palmtree },
  video: { label: 'Vídeos', icon: Video },
  construction: { label: 'Vídeos da Obra', icon: HardHat },
} as const;

export function PropertyGallery({
  media,
  editMode = false,
  onAddMedia,
  onRemoveMedia,
  onSetMainPicture,
  onUpdateDescription,
  onReorderMedia,
  mainPictureId,
  excludedCategories = [],
}: PropertyGalleryProps) {
  const availableCategories = (Object.keys(CATEGORY_CONFIG) as MediaCategory[]).filter(
    (cat) => !excludedCategories.includes(cat),
  );

  const [activeCategory, setActiveCategory] = useState<MediaCategory>(availableCategories[0] || 'property');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const mediaByCategory = useMemo(
    () =>
      media.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<MediaCategory, MediaItem[]>),
    [media],
  );

  const currentCategoryMedia = useMemo(() => mediaByCategory[activeCategory] || [], [mediaByCategory, activeCategory]);

  const handleItemPress = (item: MediaItem, index: number) => {
    if (editMode) return;
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const handleViewAll = () => {
    setViewerIndex(0);
    setViewerVisible(true);
  };

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0 && onAddMedia) {
        onAddMedia(activeCategory, selectedFiles);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [activeCategory, onAddMedia],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = currentCategoryMedia.findIndex((item) => item.id === active.id);
      const newIndex = currentCategoryMedia.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Pegar os valores de 'order' dos itens nas posições oldIndex e newIndex
      const fromOrder = currentCategoryMedia[oldIndex].order;
      const toOrder = currentCategoryMedia[newIndex].order;

      if (onReorderMedia) {
        onReorderMedia(fromOrder, toOrder);
      }
    },
    [currentCategoryMedia, onReorderMedia],
  );

  const handleToggleSelection = useCallback((itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allImageIds = currentCategoryMedia.filter((item) => item.type === 'image').map((item) => item.id);
    setSelectedItems(new Set(allImageIds));
  }, [currentCategoryMedia]);

  const handleClearSelection = useCallback(() => {
    setSelectedItems(new Set());
    setSelectionMode(false);
  }, []);

  const handleDownloadSelected = useCallback(async () => {
    if (selectedItems.size === 0) return;

    const itemsToDownload = currentCategoryMedia.filter((item) => selectedItems.has(item.id) && item.type === 'image');

    if (itemsToDownload.length === 0) {
      toast.error('Nenhuma imagem selecionada para download');
      return;
    }

    toast.loading(`Baixando ${itemsToDownload.length} imagem(ns)...`);

    try {
      for (const item of itemsToDownload) {
        const response = await fetch(item.uri);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${item.description || 'imagem'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      toast.dismiss();
      toast.success(`${itemsToDownload.length} imagem(ns) baixada(s) com sucesso!`);
      handleClearSelection();
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao baixar imagens');
      console.error('Download error:', error);
    }
  }, [selectedItems, currentCategoryMedia, handleClearSelection]);

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de ações quando em modo seleção */}
      {selectionMode && !editMode && (
        <div className="flex items-center justify-between gap-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleClearSelection} className="gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <div className="h-6 w-px bg-border" />
            <TypographyP className="text-sm font-medium">
              {selectedItems.size} {selectedItems.size === 1 ? 'imagem selecionada' : 'imagens selecionadas'}
            </TypographyP>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll} className="gap-2">
              <Check className="h-4 w-4" />
              Selecionar Todas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelected}
              disabled={selectedItems.size === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar
            </Button>
          </div>
        </div>
      )}

      {/* Tabs de Categorias */}
      <div className="flex gap-2 overflow-x-auto p-2 scrollbar-hide">
        {availableCategories.map((category) => {
          const config = CATEGORY_CONFIG[category];
          const count = mediaByCategory[category]?.length || 0;
          const isActive = activeCategory === category;
          const Icon = config.icon;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              )}
              type="button"
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{config.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full min-w-[20px] text-center text-xs font-bold',
                    isActive ? 'bg-primary-foreground/20' : 'bg-background',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Botão para ativar modo seleção */}
      {!editMode && currentCategoryMedia.length > 0 && !selectionMode && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)} className="gap-2">
            <Check className="h-4 w-4" />
            Selecionar Imagens
          </Button>
        </div>
      )}

      {/* Grid de Mídia */}
      {currentCategoryMedia.length > 0 ? (
        <>
          {editMode ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={currentCategoryMedia.map((item) => item.id)} strategy={rectSortingStrategy}>
                <MediaGrid
                  items={currentCategoryMedia}
                  maxItems={currentCategoryMedia.length}
                  editMode={editMode}
                  mainPictureId={mainPictureId}
                  onItemPress={handleItemPress}
                  onRemoveItem={onRemoveMedia}
                  onAddItem={() => fileInputRef.current?.click()}
                  onSetMainPicture={onSetMainPicture}
                  onUpdateDescription={onUpdateDescription}
                  selectionMode={false}
                  selectedItems={selectedItems}
                  onToggleSelection={handleToggleSelection}
                />
              </SortableContext>
            </DndContext>
          ) : (
            <MediaGrid
              items={currentCategoryMedia}
              maxItems={selectionMode ? currentCategoryMedia.length : 4}
              editMode={editMode}
              mainPictureId={mainPictureId}
              onItemPress={handleItemPress}
              onRemoveItem={onRemoveMedia}
              onAddItem={undefined}
              onSetMainPicture={onSetMainPicture}
              selectionMode={selectionMode}
              selectedItems={selectedItems}
              onToggleSelection={handleToggleSelection}
            />
          )}

          {/* Botão "Ver todos" */}
          {currentCategoryMedia.length > 4 && !editMode && !selectionMode && (
            <Button variant="outline" onClick={handleViewAll} className="w-full">
              Ver todos ({currentCategoryMedia.length})
            </Button>
          )}
        </>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center rounded-xl bg-secondary gap-4">
          <TypographyP className="text-muted-foreground">
            {editMode ? 'Adicione mídias nesta categoria' : 'Nenhuma mídia nesta categoria'}
          </TypographyP>
          {editMode && onAddMedia && (
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2" type="button">
              <Upload className="h-4 w-4" />
              Adicionar Mídia
            </Button>
          )}
        </div>
      )}

      {/* Input de arquivo oculto */}
      {editMode && (
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      )}

      {/* Modal Viewer */}
      <MediaViewerModal
        open={viewerVisible}
        items={currentCategoryMedia}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </div>
  );
}
