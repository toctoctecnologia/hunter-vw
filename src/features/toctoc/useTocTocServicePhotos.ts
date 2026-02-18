import { useQuery } from '@tanstack/react-query';
import {
  fetchTocTocServicePhotos,
  type TocTocServicePhotosFilters,
  type TocTocServicePhotosResponse,
} from './api';

export const useTocTocServicePhotos = (
  filters: TocTocServicePhotosFilters,
  enabled = true,
) => {
  return useQuery<TocTocServicePhotosResponse>({
    queryKey: ['toctoc-service-photos', filters],
    enabled: enabled && Boolean(filters.real_estate_id),
    queryFn: () => fetchTocTocServicePhotos(filters),
    staleTime: 1000 * 60 * 5,
  });
};
