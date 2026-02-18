import { useQuery } from '@tanstack/react-query';
import { getGoogleTokens, isTokenExpired } from '@/shared/lib/google-oauth';

type GoogleAdsMetrics = {
  leads: number;
  conversions: number;
  conversionRate: number;
  cpl: number;
  roi: number;
  totalCost: number;
  totalConversionsValue: number;
  clicks: number;
};

type GoogleAdsResponse = {
  success: boolean;
  customerId: string;
  period: string;
  metrics: GoogleAdsMetrics;
  campaigns: number;
};

/**
 * Hook para buscar métricas do Google Ads
 * Requer que o usuário tenha configurado o Google Ads OAuth previamente
 */
export function useGoogleAds() {
  return useQuery<GoogleAdsResponse>({
    queryKey: ['google-ads-metrics'],
    queryFn: async () => {
      const tokens = getGoogleTokens('ads');

      if (!tokens) {
        throw new Error('Google Ads não está conectado. Configure a integração primeiro.');
      }

      if (isTokenExpired('ads')) {
        throw new Error('Token do Google Ads expirado. Reconecte sua conta.');
      }

      // Faz a chamada para a API (encode do access_token para evitar problemas com caracteres especiais)
      const response = await fetch(`/api/google/ads?access_token=${encodeURIComponent(tokens.access_token)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar métricas do Google Ads');
      }

      return response.json();
    },
    // Revalida a cada 5 minutos
    staleTime: 5 * 60 * 1000,
    // Mantém os dados em cache por 10 minutos
    gcTime: 10 * 60 * 1000,
    // Não refetch automaticamente (usuário pode forçar refresh)
    refetchOnWindowFocus: false,
    // Requer que esteja conectado para fazer a query
    enabled: !!getGoogleTokens('ads'),
  });
}
