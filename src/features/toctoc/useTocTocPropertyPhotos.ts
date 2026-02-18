import { useQuery } from '@tanstack/react-query';
import { fetchTocTocPropertyPhotos, type TocTocPropertyPhotosResponse } from './api';

export const useTocTocPropertyPhotos = (serviceId?: string, enabled = true) => {
  return useQuery<TocTocPropertyPhotosResponse>({
    queryKey: ['toctoc-property-photos', serviceId],
    enabled: enabled && Boolean(serviceId),
    queryFn: () => {
      if (!serviceId) {
        throw new Error('service_id é obrigatório para buscar as fotos do imóvel.');
      }
      return fetchTocTocPropertyPhotos(serviceId);
    },
    staleTime: 1000 * 60 * 5,
  });
};
