const STORAGE_PREFIX = 'property.';

export interface PropertyPhotoCO {
  title: string;
  description: string;
  keywords: string[];
  alt: string;
  url: string;
}

export interface PropertyLocalPhotosState {
  [photoId: string]: {
    co?: PropertyPhotoCO;
    [key: string]: unknown;
  };
}

export type PropertyCatalogKey =
  | 'facebookStore'
  | 'facebookAds'
  | 'googleAds'
  | 'googleMerchant';

export type PropertyLogoOverlayApplyMode = 'all' | 'new';

export interface PropertyLogoOverlayState {
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  overlayId?: string;
  src?: string;
  sizePct: number;
  opacity: number;
  margin: number;
  applyMode: PropertyLogoOverlayApplyMode;
}

export const DEFAULT_PROPERTY_LOGO_OVERLAY_STATE: PropertyLogoOverlayState = {
  enabled: false,
  position: 'bottom-right',
  overlayId: '',
  src: undefined,
  sizePct: 24,
  opacity: 90,
  margin: 3,
  applyMode: 'new',
};

export function normalizePropertyLogoOverlayState(
  state?: Partial<PropertyLogoOverlayState> | null,
): PropertyLogoOverlayState {
  return {
    ...DEFAULT_PROPERTY_LOGO_OVERLAY_STATE,
    enabled: Boolean(state?.enabled),
    position: state?.position ?? DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.position,
    overlayId: state?.overlayId ?? DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.overlayId,
    src: state?.src ?? DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.src,
    sizePct:
      typeof state?.sizePct === 'number'
        ? state.sizePct
        : DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.sizePct,
    opacity:
      typeof state?.opacity === 'number'
        ? state.opacity
        : DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.opacity,
    margin:
      typeof state?.margin === 'number'
        ? state.margin
        : DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.margin,
    applyMode: state?.applyMode ?? DEFAULT_PROPERTY_LOGO_OVERLAY_STATE.applyMode,
  };
}

export interface PropertyCatalogChannelState {
  enabled: boolean;
  catalogId?: string;
}

export type PropertyCatalogState = {
  [key in PropertyCatalogKey]?: PropertyCatalogChannelState;
};

export interface PropertyFeedPayload {
  type?: PropertyCatalogKey;
  generatedAt: string;
  catalogId?: string;
  items: unknown[];
  [key: string]: unknown;
}

export interface PropertyFeedsState {
  facebookStore?: PropertyFeedPayload;
  facebookAds?: PropertyFeedPayload;
  googleAds?: PropertyFeedPayload;
  googleMerchant?: PropertyFeedPayload;
  [key: string]: PropertyFeedPayload | undefined;
}

export interface PropertyLocalState {
  photos?: PropertyLocalPhotosState;
  logoOverlay?: PropertyLogoOverlayState;
  catalogs?: PropertyCatalogState;
  feeds?: PropertyFeedsState;
  [key: string]: unknown;
}

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const PROPERTY_LOGO_OVERLAY_EVENT = 'property-logo-overlay-change';

export interface PropertyLogoOverlayEventDetail {
  propertyId: string;
  state?: PropertyLogoOverlayState;
}

export function emitPropertyLogoOverlayChange(
  propertyId: string,
  state?: PropertyLogoOverlayState,
): void {
  if (!isBrowser()) {
    return;
  }

  const detail: PropertyLogoOverlayEventDetail = { propertyId, state };
  window.dispatchEvent(
    new CustomEvent<PropertyLogoOverlayEventDetail>(PROPERTY_LOGO_OVERLAY_EVENT, {
      detail,
    }),
  );
}

function getStorageKey(id: string) {
  return `${STORAGE_PREFIX}${id}`;
}

export function getProperty<T extends PropertyLocalState = PropertyLocalState>(id: string): T | undefined {
  if (!id || !isBrowser()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(id));
    if (!raw) {
      return undefined;
    }

    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('[imovelLocalStore] Failed to parse property from localStorage', error);
    return undefined;
  }
}

export function setProperty<T extends PropertyLocalState = PropertyLocalState>(
  id: string,
  patch: Partial<T> | T,
): T | undefined {
  if (!id || !isBrowser()) {
    return undefined;
  }

  const current = (getProperty<T>(id) ?? {}) as T;
  const next = { ...current, ...patch } as T;

  try {
    window.localStorage.setItem(getStorageKey(id), JSON.stringify(next));
  } catch (error) {
    console.warn('[imovelLocalStore] Failed to store property in localStorage', error);
  }

  return next;
}

export function mergeProperty<T extends PropertyLocalState = PropertyLocalState>(
  id: string,
  updater: (previous: T) => T,
): T | undefined {
  if (!id || !isBrowser()) {
    return undefined;
  }

  const previous = (getProperty<T>(id) ?? {}) as T;
  const next = updater(previous);

  try {
    window.localStorage.setItem(getStorageKey(id), JSON.stringify(next));
  } catch (error) {
    console.warn('[imovelLocalStore] Failed to merge property into localStorage', error);
  }

  return next;
}
