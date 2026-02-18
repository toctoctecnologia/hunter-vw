import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ImovelMedia } from '@/types/imovel';
import {
  generateSeoFromContext,
  type SeoGenerationContext,
  toSlug,
} from '@/features/imoveis/utils/seo';

interface SeoImagemModalProps {
  open: boolean;
  media: ImovelMedia | null;
  context: SeoGenerationContext;
  onClose: () => void;
  onSave: (mediaId: string, seo: NonNullable<ImovelMedia['seo']>) => Promise<void> | void;
  isSaving?: boolean;
}

export function SeoImagemModal({
  open,
  media,
  context,
  onClose,
  onSave,
  isSaving = false,
}: SeoImagemModalProps) {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [slug, setSlug] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; altText?: string; slug?: string }>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    if (media?.seo) {
      setTitle(media.seo.title);
      setAltText(media.seo.alt);
      setSlug(media.seo.slug);
      setTagsInput(media.seo.tags.join(', '));
    } else {
      setTitle(media?.descricao || '');
      setAltText(media?.descricao || '');
      setSlug(media ? toSlug(media.descricao || media.sigla || media.id) : '');
      setTagsInput('');
    }

    setSlugManuallyEdited(false);
    setErrors({});
  }, [media, open]);

  const tags = useMemo(
    () =>
      tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    [tagsInput],
  );

  const handleGenerateSeo = () => {
    if (!media) {
      return;
    }
    const generated = generateSeoFromContext(media, context);
    setTitle(generated.title);
    setAltText(generated.alt);
    setSlug(generated.slug);
    setTagsInput(generated.tags.join(', '));
    setSlugManuallyEdited(false);
    setErrors({});
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(toSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugManuallyEdited(true);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }
    onClose();
  };

  const handleSave = async () => {
    if (!media) {
      return;
    }

    const validationErrors: typeof errors = {};
    if (!title.trim()) {
      validationErrors.title = 'Informe um título para SEO.';
    }
    if (!altText.trim()) {
      validationErrors.altText = 'Informe um texto alternativo.';
    }
    if (!slug.trim()) {
      validationErrors.slug = 'Informe um slug.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSave(media.id, {
      title: title.trim(),
      alt: altText.trim(),
      slug: toSlug(slug.trim()),
      tags,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl rounded-2xl border border-gray-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            SEO da imagem
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Configure os campos de SEO para melhorar a performance nos portais e facilitar a organização interna.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-sm font-medium text-gray-700">
              {media?.sigla ? `Imagem ${media.sigla}` : 'Imagem sem sigla'}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200"
              onClick={handleGenerateSeo}
              aria-label="Gerar dados de SEO automaticamente"
              disabled={!media}
            >
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Gerar SEO
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="seo-title">Título</Label>
              <Input
                id="seo-title"
                value={title}
                onChange={event => handleTitleChange(event.target.value)}
                placeholder="Título para SEO"
                aria-describedby={errors.title ? 'seo-title-error' : undefined}
              />
              {errors.title && (
                <p id="seo-title-error" className="text-xs text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo-alt">Texto alternativo</Label>
              <Textarea
                id="seo-alt"
                value={altText}
                onChange={event => setAltText(event.target.value)}
                placeholder="Descreva a imagem para acessibilidade"
                rows={3}
                aria-describedby={errors.altText ? 'seo-alt-error' : undefined}
              />
              {errors.altText && (
                <p id="seo-alt-error" className="text-xs text-red-500">
                  {errors.altText}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo-slug">Slug</Label>
              <Input
                id="seo-slug"
                value={slug}
                onChange={event => handleSlugChange(event.target.value)}
                placeholder="slug-da-imagem"
                aria-describedby={errors.slug ? 'seo-slug-error' : undefined}
              />
              {errors.slug && (
                <p id="seo-slug-error" className="text-xs text-red-500">
                  {errors.slug}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seo-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="seo-tags"
                value={tagsInput}
                onChange={event => setTagsInput(event.target.value)}
                placeholder="imóvel, lazer, piscina"
              />
              <p className="text-xs text-gray-500">
                Use tags para organizar e facilitar buscas internas.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="rounded-xl border-gray-200"
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-[hsl(var(--accent))] text-white hover:bg-[hsl(var(--accentHover))]"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Salvar SEO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SeoImagemModal;
