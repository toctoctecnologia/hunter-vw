import type { ImovelMedia } from '@/types/imovel';

export type SeoGenerationContext = {
  category: 'imovel' | 'lazer';
  propertyTitle?: string;
  propertyId?: string;
  neighborhood?: string;
  city?: string;
};

export const toSlug = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
};

export const generateSeoFromContext = (
  media: ImovelMedia,
  context: SeoGenerationContext,
): NonNullable<ImovelMedia['seo']> => {
  const friendlyCategory = context.category === 'imovel' ? 'imóvel' : 'lazer';
  const propertyTitle = context.propertyTitle?.trim() || 'Imóvel Novo Hunter';

  const fallbackDescricao = media.descricao.trim() || `Foto do ${friendlyCategory}`;
  const title = `${propertyTitle} - ${fallbackDescricao}`.trim();

  const altSegments = [
    media.descricao.trim() || undefined,
    media.roomTag ? `Ambiente: ${media.roomTag}` : undefined,
    context.neighborhood ? `Bairro: ${context.neighborhood}` : undefined,
    context.city ? `Cidade: ${context.city}` : undefined,
    `Categoria: ${friendlyCategory}`,
  ].filter(Boolean) as string[];

  const alt = altSegments.join(' | ') || `Foto do ${friendlyCategory}`;

  const slugSource = [
    context.propertyTitle,
    media.roomTag,
    media.sigla,
    media.co,
    friendlyCategory,
  ]
    .filter(Boolean)
    .join(' ');

  const slug = toSlug(slugSource || `${friendlyCategory}-${media.id}`);

  const tags = [
    propertyTitle,
    media.roomTag,
    media.sigla,
    media.co,
    friendlyCategory,
    context.neighborhood,
    context.city,
  ]
    .map(tag => tag?.toString().trim())
    .filter((tag): tag is string => Boolean(tag))
    .filter((tag, index, array) => array.indexOf(tag) === index);

  return {
    title,
    alt,
    slug,
    tags,
  };
};
