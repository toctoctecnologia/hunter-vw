import { useQuery } from '@tanstack/react-query';
import { getGoogleTokens, isTokenExpired } from '@/shared/lib/google-oauth';
import { integrationBackend } from '@/shared/lib/integration-backend';
import { queryKeys } from '@/shared/constants/query-keys';

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
    queryKey: queryKeys.integrations.googleAdsMetrics,
    queryFn: async () => {
      const tokens = getGoogleTokens('ads');

      if (!tokens) {
        throw new Error('Google Ads não está conectado. Configure a integração primeiro.');
      }

      if (isTokenExpired('ads')) {
        throw new Error('Token do Google Ads expirado. Reconecte sua conta.');
      }

      return integrationBackend.getGoogleAdsMetrics(tokens.access_token);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    // Requer que esteja conectado para fazer a query
    enabled: !!getGoogleTokens('ads'),
  });
}
