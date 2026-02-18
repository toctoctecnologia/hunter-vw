import { useQuery } from '@tanstack/react-query';
import { fetchTocTocProperties, type TocTocFilters, type TocTocResponse } from './api';

const buildKey = (filters: TocTocFilters) => [
  'toctoc-properties',
  {
    city: filters.city ?? '',
    state: filters.state ?? '',
    type_property: filters.type_property ?? '',
    limit: filters.limit ?? 50,
    offset: filters.offset ?? 0,
  },
] as const;

export const useTocTocProperties = (filters: TocTocFilters) => {
  return useQuery<TocTocResponse>({
    queryKey: buildKey(filters),
    queryFn: () => fetchTocTocProperties(filters),
    staleTime: 1000 * 60 * 5,
  });
};
