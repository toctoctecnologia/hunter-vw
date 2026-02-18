'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Image from '@/shims/next-image';

import { cn } from '@/shared/lib/utils';

import { Dialog, DialogContent, DialogTitle } from '@/shared/components/ui/dialog';
import { VisuallyHidden } from '@/shared/components/ui/visually-hidden';
import { Button } from '@/shared/components/ui/button';

import type { MediaViewerModalProps } from './types';

export function MediaViewerModal({ open, items, initialIndex, onClose }: MediaViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentItem = items[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setIsPlaying(false);
    }
  }, [open, initialIndex]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentIndex, open]);

  const handlePrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [hasPrevious]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [hasNext]);

  // Navegação por teclado
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handlePrevious, handleNext, onClose]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 bg-black border-none">
        <VisuallyHidden>
          <DialogTitle>
            {currentItem.type === 'image' ? 'Visualizador de imagem' : 'Visualizador de vídeo'} - {currentIndex + 1} de{' '}
            {items.length}
          </DialogTitle>
        </VisuallyHidden>

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              aria-label="Fechar visualizador"
            >
              <X className="h-6 w-6" />
            </Button>
            <span className="text-white text-sm font-semibold">
              {currentIndex + 1} / {items.length}
            </span>
            <div className="w-10" /> {/* Spacer para centralizar o contador */}
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex items-center justify-center relative">
            {currentItem.type === 'image' ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentItem.uri}
                  alt={`Mídia ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={currentItem.uri}
                  className="max-w-full max-h-full"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Controle customizado play/pause overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                    type="button"
                  >
                    <div className="bg-white/90 rounded-full p-4">
                      <Play className="h-10 w-10 fill-black" />
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Navegação com setas */}
            {items.length > 1 && (
              <>
                {hasPrevious && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-12 w-12"
                    aria-label="Mídia anterior"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}

                {hasNext && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white h-12 w-12"
                    aria-label="Próxima mídia"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Thumbnails na parte inferior */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent py-4">
            <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-white',
                    currentIndex === index ? 'opacity-100 ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-75',
                  )}
                  type="button"
                >
                  <Image
                    src={item.thumbnail || item.uri}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-4 w-4 fill-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
