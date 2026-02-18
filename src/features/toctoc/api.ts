const TOC_TOC_BASE_URL = 'https://nptskariuzsbvxqocdxf.supabase.co/functions/v1';

export interface TocTocProperty {
  id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  photos?: string[];
  price?: number | string;
  type_property?: string;
  [key: string]: unknown;
}

export interface TocTocFilters {
  city?: string;
  state?: string;
  type_property?: string;
  limit?: number;
  offset?: number;
}

export interface TocTocResponse {
  success: boolean;
  data: TocTocProperty[];
  total: number;
  limit: number;
  offset: number;
}

export interface TocTocPropertyDetail {
  id: string;
  name?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  type_property?: string;
  size_property?: string;
  quantity_rooms?: number;
  description?: string;
  photos?: { url: string; order?: number }[] | string[];
  price?: number | string;
  [key: string]: unknown;
}

export interface TocTocPropertyDetailResponse {
  success: boolean;
  data: TocTocPropertyDetail | null;
}

export interface TocTocServicePhotoEntry {
  service_id: string;
  service_name: string;
  service_code?: string;
  address?: string;
  city?: string;
  state?: string;
  completed_at?: string;
  photos?: string[];
  photos_count?: number;
}

export interface TocTocServicePhotosResponse {
  success: boolean;
  data: TocTocServicePhotoEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface TocTocPropertyPhotosResponse {
  success: boolean;
  data: {
    service_id: string;
    service_name?: string;
    service_code?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    type_property?: string;
    size_property?: string;
    quantity_rooms?: number;
    completed_at?: string;
    photos?: { url: string; order?: number }[];
    photos_count?: number;
  } | null;
}

export interface TocTocRecentPhoto {
  photo_url: string;
  service_id: string;
  service_name?: string;
  city?: string;
  state?: string;
  completed_at?: string;
}

export interface TocTocRecentPhotosResponse {
  success: boolean;
  data: TocTocRecentPhoto[];
  total: number;
}

export interface TocTocLocationsResponse {
  success: boolean;
  data: {
    states: { state: string; cities: string[] }[];
    total_cities: number;
    total_states: number;
  };
}

export interface TocTocPropertyTypesResponse {
  success: boolean;
  data: { type: string; count: number }[];
  total: number;
}

const ENDPOINTS = {
  properties: `${TOC_TOC_BASE_URL}/api-properties`,
  propertyDetail: `${TOC_TOC_BASE_URL}/api-property-detail`,
  servicePhotos: `${TOC_TOC_BASE_URL}/api-service-photos`,
  propertyPhotos: `${TOC_TOC_BASE_URL}/api-property-photos`,
  recentPhotos: `${TOC_TOC_BASE_URL}/api-recent-photos`,
  locations: `${TOC_TOC_BASE_URL}/api-locations`,
  propertyTypes: `${TOC_TOC_BASE_URL}/api-property-types`,
} as const;

const clampLimit = (limit?: number, max = 100) => {
  if (typeof limit !== 'number' || Number.isNaN(limit)) {
    return undefined;
  }

  const normalized = Math.max(1, Math.floor(limit));
  return Math.min(normalized, max);
};

const normalizeFilters = (filters: TocTocFilters) => {
  const limit = clampLimit(filters.limit);

  return {
    city: filters.city?.trim() || undefined,
    state: filters.state?.trim() || undefined,
    type_property: filters.type_property?.trim() || undefined,
    limit,
    offset: Math.max(0, filters.offset ?? 0),
  } satisfies TocTocFilters;
};

export const fetchTocTocProperties = async (
  filters: TocTocFilters = {},
): Promise<TocTocResponse> => {
  const normalizedFilters = normalizeFilters(filters);
  const searchParams = new URLSearchParams();

  (Object.entries(normalizedFilters) as [keyof TocTocFilters, unknown][]).forEach(
    ([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    },
  );

  const url = `${ENDPOINTS.properties}?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar imóveis na TocToc (status ${response.status})`);
  }

  const payload = await response.json();

  if (payload?.success === false) {
    throw new Error(payload?.message ?? 'A API TocToc retornou uma falha.');
  }

  const data: TocTocProperty[] = Array.isArray(payload?.data) ? payload.data : [];

  return {
    success: Boolean(payload?.success ?? true),
    data,
    total: typeof payload?.total === 'number' ? payload.total : data.length,
    limit: typeof payload?.limit === 'number' ? payload.limit : normalizedFilters.limit ?? 50,
    offset: typeof payload?.offset === 'number' ? payload.offset : normalizedFilters.offset ?? 0,
  };
};

export const fetchTocTocPropertyDetail = async (
  id: string,
): Promise<TocTocPropertyDetailResponse> => {
  if (!id) {
    throw new Error('O ID do imóvel é obrigatório para consultar detalhes.');
  }

  const url = `${ENDPOINTS.propertyDetail}?id=${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar detalhes do imóvel (status ${response.status})`);
  }

  const payload = await response.json();

  return {
    success: Boolean(payload?.success ?? true),
    data: payload?.data ?? null,
  };
};

export interface TocTocServicePhotosFilters {
  real_estate_id: string;
  service_id?: string;
  limit?: number;
  offset?: number;
}

export const fetchTocTocServicePhotos = async (
  filters: TocTocServicePhotosFilters,
): Promise<TocTocServicePhotosResponse> => {
  if (!filters.real_estate_id) {
    throw new Error('real_estate_id é obrigatório para listar fotos de serviços.');
  }

  const searchParams = new URLSearchParams();
  searchParams.append('real_estate_id', filters.real_estate_id);

  if (filters.service_id) searchParams.append('service_id', filters.service_id);
  const limit = clampLimit(filters.limit, 100);
  if (limit) searchParams.append('limit', String(limit));

  const offset = Math.max(0, filters.offset ?? 0);
  searchParams.append('offset', String(offset));

  const url = `${ENDPOINTS.servicePhotos}?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao listar fotos de serviços (status ${response.status})`);
  }

  const payload = await response.json();
  const data: TocTocServicePhotoEntry[] = Array.isArray(payload?.data) ? payload.data : [];

  return {
    success: Boolean(payload?.success ?? true),
    data,
    total: typeof payload?.total === 'number' ? payload.total : data.length,
    limit: typeof payload?.limit === 'number' ? payload.limit : limit ?? 50,
    offset: typeof payload?.offset === 'number' ? payload.offset : offset,
  };
};

export const fetchTocTocPropertyPhotos = async (
  serviceId: string,
): Promise<TocTocPropertyPhotosResponse> => {
  if (!serviceId) {
    throw new Error('service_id é obrigatório para consultar fotos do imóvel.');
  }

  const url = `${ENDPOINTS.propertyPhotos}?service_id=${encodeURIComponent(serviceId)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao buscar fotos do imóvel (status ${response.status})`);
  }

  const payload = await response.json();
  return {
    success: Boolean(payload?.success ?? true),
    data: payload?.data ?? null,
  };
};

export interface TocTocRecentPhotosFilters {
  real_estate_id?: string;
  days?: number;
  limit?: number;
}

export const fetchTocTocRecentPhotos = async (
  filters: TocTocRecentPhotosFilters = {},
): Promise<TocTocRecentPhotosResponse> => {
  // The current TocToc mock backend (external Supabase project used for demos)
  // does not ship the `api-recent-photos` function. Avoid triggering a 404
  // request that breaks the preview.
  if (TOC_TOC_BASE_URL.includes('nptskariuzsbvxqocdxf')) {
    return { success: true, data: [], total: 0 };
  }

  const searchParams = new URLSearchParams();
  if (filters.real_estate_id) searchParams.append('real_estate_id', filters.real_estate_id);
  if (filters.days) searchParams.append('days', String(Math.min(Math.max(1, filters.days), 90)));

  const limit = clampLimit(filters.limit, 50);
  if (limit) searchParams.append('limit', String(limit));

  const url = `${ENDPOINTS.recentPhotos}?${searchParams.toString()}`;

  try {
    const response = await fetch(url);

    // Se a função não existir (404), retorna dados vazios sem erro
    if (response.status === 404) {
      console.warn('api-recent-photos endpoint not found, returning empty data');
      return { success: true, data: [], total: 0 };
    }

    if (!response.ok) {
      throw new Error(`Falha ao buscar fotos recentes (status ${response.status})`);
    }

    const payload = await response.json();
    const data: TocTocRecentPhoto[] = Array.isArray(payload?.data) ? payload.data : [];

    return {
      success: Boolean(payload?.success ?? true),
      data,
      total: typeof payload?.total === 'number' ? payload.total : data.length,
    };
  } catch (error) {
    console.warn('Erro ao buscar fotos recentes:', error);
    return { success: true, data: [], total: 0 };
  }
};

export const fetchTocTocLocations = async (): Promise<TocTocLocationsResponse> => {
  const response = await fetch(ENDPOINTS.locations);
  if (!response.ok) {
    throw new Error(`Falha ao buscar localizações (status ${response.status})`);
  }

  const payload = await response.json();
  return {
    success: Boolean(payload?.success ?? true),
    data: payload?.data ?? { states: [], total_cities: 0, total_states: 0 },
  };
};

export const fetchTocTocPropertyTypes = async (): Promise<TocTocPropertyTypesResponse> => {
  const response = await fetch(ENDPOINTS.propertyTypes);
  if (!response.ok) {
    throw new Error(`Falha ao buscar tipos de imóvel (status ${response.status})`);
  }

  const payload = await response.json();
  const data: { type: string; count: number }[] = Array.isArray(payload?.data) ? payload.data : [];
  return {
    success: Boolean(payload?.success ?? true),
    data,
    total: typeof payload?.total === 'number' ? payload.total : data.length,
  };
};
