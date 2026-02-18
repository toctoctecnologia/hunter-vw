import { useQuery } from '@tanstack/react-query';
import { fetchTocTocLocations, type TocTocLocationsResponse } from './api';

export const useTocTocLocations = (enabled = true) => {
  return useQuery<TocTocLocationsResponse>({
    queryKey: ['toctoc-locations'],
    enabled,
    queryFn: () => fetchTocTocLocations(),
    staleTime: 1000 * 60 * 30,
  });
};
