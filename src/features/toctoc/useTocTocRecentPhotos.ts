import { useQuery } from '@tanstack/react-query';
import {
  fetchTocTocRecentPhotos,
  type TocTocRecentPhotosFilters,
  type TocTocRecentPhotosResponse,
} from './api';

export const useTocTocRecentPhotos = (
  filters: TocTocRecentPhotosFilters = {},
  enabled = true,
) => {
  return useQuery<TocTocRecentPhotosResponse>({
    queryKey: ['toctoc-recent-photos', filters],
    enabled,
    queryFn: () => fetchTocTocRecentPhotos(filters),
    staleTime: 1000 * 60 * 5,
  });
};
