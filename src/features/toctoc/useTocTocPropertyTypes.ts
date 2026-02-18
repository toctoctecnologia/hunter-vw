import { useQuery } from '@tanstack/react-query';
import { fetchTocTocPropertyTypes, type TocTocPropertyTypesResponse } from './api';

export const useTocTocPropertyTypes = (enabled = true) => {
  return useQuery<TocTocPropertyTypesResponse>({
    queryKey: ['toctoc-property-types'],
    enabled,
    queryFn: () => fetchTocTocPropertyTypes(),
    staleTime: 1000 * 60 * 30,
  });
};
