import { useQuery } from '@tanstack/react-query';
import { fetchTocTocPropertyDetail, type TocTocPropertyDetailResponse } from './api';

export const useTocTocPropertyDetail = (propertyId?: string) => {
  return useQuery<TocTocPropertyDetailResponse>({
    queryKey: ['toctoc-property-detail', propertyId],
    enabled: Boolean(propertyId),
    queryFn: () => {
      if (!propertyId) {
        throw new Error('O ID do imóvel é obrigatório.');
      }
      return fetchTocTocPropertyDetail(propertyId);
    },
    staleTime: 1000 * 60 * 5,
  });
};
