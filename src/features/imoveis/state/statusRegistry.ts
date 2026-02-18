import { PropertyStatus } from '@/types/imovel';
import { getCurrentUser, hasRole } from '@/utils/auth';

const STORAGE_KEY = 'status.registry';
export const PROPERTY_STATUS_REGISTRY_EVENT = 'property-status-registry-change';

export interface PropertyStatusRegistryEventDetail {
  statuses: PropertyStatus[];
}

const FALLBACK_COLOR = '#2563eb';

export const DEFAULT_PROPERTY_STATUSES: PropertyStatus[] = [
  {
    id: 'disponivel-site',
    label: 'Disponível no site',
    color: '#16a34a',
    description: 'Publicado no site e disponível para divulgação.',
    isActive: true,
    order: 1,
  },
  {
    id: 'disponivel-interno',
    label: 'Disponível interno',
    color: '#f59e0b',
    description: 'Visível apenas internamente para a equipe.',
    isActive: true,
    order: 2,
  },
  {
    id: 'vago-disponivel',
    label: 'Vago/Disponível',
    color: '#2563eb',
    description: 'Imóvel pronto para divulgação aguardando publicação.',
    isActive: true,
    order: 3,
  },
  {
    id: 'indisponivel',
    label: 'Indisponível',
    color: '#dc2626',
    description: 'Imóvel indisponível para oferta.',
    isActive: true,
    order: 4,
  },
];

export const DEFAULT_STATUS_IDS = new Set(
  DEFAULT_PROPERTY_STATUSES.map(status => status.id),
);

let cachedStatuses: PropertyStatus[] | null = null;

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function normalizeHexColor(color?: string): string {
  if (!color) {
    return FALLBACK_COLOR;
  }

  const trimmed = color.trim();
  if (!HEX_COLOR_REGEX.test(trimmed)) {
    return FALLBACK_COLOR;
  }

  if (trimmed.length === 4) {
    const [, short] = trimmed.split('#');
    const expanded = short
      .split('')
      .map(char => char + char)
      .join('');
    return `#${expanded}`.toLowerCase();
  }

  return trimmed.toLowerCase();
}

function normalizeStatuses(input?: PropertyStatus[] | null): PropertyStatus[] {
  const base = input && input.length > 0 ? input : DEFAULT_PROPERTY_STATUSES;

  const seen = new Map<string, PropertyStatus>();

  base.forEach((status, index) => {
    const fallback = DEFAULT_PROPERTY_STATUSES[index];
    const label = (status.label ?? fallback?.label ?? `Status ${index + 1}`).trim();
    const preferredId = status.id || label || fallback?.id || `status-${index + 1}`;
    const normalizedId = slugify(preferredId) || `status-${index + 1}`;

    if (seen.has(normalizedId)) {
      return;
    }

    const normalizedStatus: PropertyStatus = {
      id: normalizedId,
      label,
      color: normalizeHexColor(status.color ?? fallback?.color ?? FALLBACK_COLOR),
      description: status.description?.toString().trim() || fallback?.description || '',
      isActive: status.isActive !== false,
      order:
        typeof status.order === 'number' && Number.isFinite(status.order)
          ? status.order
          : fallback?.order ?? index + 1,
    };

    seen.set(normalizedId, normalizedStatus);
  });

  const unique = Array.from(seen.values());

  unique.sort((a, b) => {
    if (a.order === b.order) {
      return a.label.localeCompare(b.label);
    }
    return a.order - b.order;
  });

  return unique.map((status, index) => ({
    ...status,
    order: index + 1,
  }));
}

function readStatusesFromStorage(): PropertyStatus[] | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return undefined;
    }

    return parsed as PropertyStatus[];
  } catch (error) {
    console.warn('[statusRegistry] Failed to parse statuses from localStorage', error);
    return undefined;
  }
}

function emitChange(statuses: PropertyStatus[]): void {
  if (!isBrowser()) {
    return;
  }

  const detail: PropertyStatusRegistryEventDetail = { statuses };
  window.dispatchEvent(
    new CustomEvent<PropertyStatusRegistryEventDetail>(PROPERTY_STATUS_REGISTRY_EVENT, {
      detail,
    }),
  );
}

export function getAll(): PropertyStatus[] {
  if (cachedStatuses) {
    return cachedStatuses.map(status => ({ ...status }));
  }

  const stored = readStatusesFromStorage();
  const normalized = normalizeStatuses(stored);
  cachedStatuses = normalized;
  return normalized.map(status => ({ ...status }));
}

export function saveStatuses(statuses: PropertyStatus[]): PropertyStatus[] {
  const normalized = normalizeStatuses(statuses);
  cachedStatuses = normalized;

  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {
      console.warn('[statusRegistry] Failed to persist statuses in localStorage', error);
    }
    emitChange(normalized);
  }

  return normalized.map(status => ({ ...status }));
}

export function hasAdmin(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const user = getCurrentUser();
  return hasRole(user, ['admin', 'gestor']);
}
