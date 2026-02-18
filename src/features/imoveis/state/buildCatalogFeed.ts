import {
  mergeProperty,
  type PropertyCatalogKey,
  type PropertyFeedPayload,
  type PropertyFeedsState,
  type PropertyLocalState,
  type PropertyPhotoCO,
} from './imovelLocalStore';

interface FeedItemBase {
  id: string;
  title: string;
  description: string;
  altText: string;
  link: string;
  keywords: string[];
}

const CATALOG_KEYS: PropertyCatalogKey[] = [
  'facebookStore',
  'facebookAds',
  'googleAds',
  'googleMerchant',
];

const sanitize = (value?: string, fallback = ''): string => {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const sanitizeCatalogId = (value?: string) => {
  const trimmed = sanitize(value);
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeKeywords = (keywords?: string[]): string[] =>
  Array.isArray(keywords)
    ? keywords.map(keyword => keyword.trim()).filter(keyword => keyword.length > 0)
    : [];

const createBaseItems = (propertyId: string, state: PropertyLocalState): FeedItemBase[] => {
  const photos = state.photos ?? {};

  return Object.entries(photos)
    .map(([photoId, photoState]) => {
      const co = photoState?.co as PropertyPhotoCO | undefined;
      if (!co) {
        return undefined;
      }

      const title = sanitize(co.title, `Imóvel ${photoId}`);
      const description = sanitize(co.description, 'Descrição não informada');
      const altText = sanitize(co.alt, title);
      const link = sanitize(co.url, '#');

      return {
        id: `${propertyId}-${photoId}`,
        title,
        description,
        altText,
        link,
        keywords: normalizeKeywords(co.keywords),
      };
    })
    .filter((item): item is FeedItemBase => Boolean(item));
};

const buildFacebookStoreFeed = (
  items: FeedItemBase[],
  generatedAt: string,
  catalogId?: string,
) => ({
  type: 'facebookStore' as const,
  generatedAt,
  catalogId: sanitizeCatalogId(catalogId),
  items: items.map(item => ({
    retailer_id: item.id,
    name: item.title,
    description: item.description,
    image_link: item.link,
    image_alt_text: item.altText,
    link: item.link,
    search_terms: item.keywords,
  })),
});

const buildFacebookAdsFeed = (
  items: FeedItemBase[],
  generatedAt: string,
  catalogId?: string,
) => ({
  type: 'facebookAds' as const,
  generatedAt,
  catalogId: sanitizeCatalogId(catalogId),
  items: items.map(item => ({
    id: item.id,
    ad_title: item.title,
    ad_description: item.description,
    destination_url: item.link,
    image_link: item.link,
    image_alt_text: item.altText,
    call_to_action: 'LEARN_MORE',
    primary_text: item.description,
    keywords: item.keywords,
  })),
});

const buildGoogleAdsFeed = (
  items: FeedItemBase[],
  generatedAt: string,
  catalogId?: string,
) => ({
  type: 'googleAds' as const,
  generatedAt,
  catalogId: sanitizeCatalogId(catalogId),
  items: items.map(item => ({
    id: item.id,
    headline: item.title,
    description: item.description,
    final_url: item.link,
    image_alt_text: item.altText,
    keywords: item.keywords,
  })),
});

const buildGoogleMerchantFeed = (
  items: FeedItemBase[],
  generatedAt: string,
  catalogId?: string,
) => ({
  type: 'googleMerchant' as const,
  generatedAt,
  catalogId: sanitizeCatalogId(catalogId),
  items: items.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    link: item.link,
    image_link: item.link,
    image_alt_text: item.altText,
    product_type: 'Imóveis',
    custom_labels: item.keywords,
  })),
});

const BUILDERS: Record<
  PropertyCatalogKey,
  (items: FeedItemBase[], generatedAt: string, catalogId?: string) => PropertyFeedPayload
> = {
  facebookStore: buildFacebookStoreFeed,
  facebookAds: buildFacebookAdsFeed,
  googleAds: buildGoogleAdsFeed,
  googleMerchant: buildGoogleMerchantFeed,
};

export function buildCatalogFeed(propertyId: string): PropertyFeedsState | undefined {
  if (!propertyId) {
    return undefined;
  }

  const nextState = mergeProperty(propertyId, previous => {
    const baseItems = createBaseItems(propertyId, previous);
    const generatedAt = new Date().toISOString();
    const catalogs = previous.catalogs ?? {};
    const nextFeeds: PropertyFeedsState = { ...(previous.feeds ?? {}) };

    CATALOG_KEYS.forEach(key => {
      const config = catalogs[key];
      if (config?.enabled) {
        const build = BUILDERS[key];
        nextFeeds[key] = build(baseItems, generatedAt, config.catalogId);
      } else if (key in nextFeeds) {
        delete nextFeeds[key];
      }
    });

    return {
      ...previous,
      feeds: nextFeeds,
    };
  });

  return nextState?.feeds;
}
