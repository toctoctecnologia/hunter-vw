import { useQuery } from '@tanstack/react-query';
import { getMetaConnection, isMetaTokenExpired } from '@/shared/lib/meta-oauth';
import { integrationBackend } from '@/shared/lib/integration-backend';
import { queryKeys } from '@/shared/constants/query-keys';

type MetaLeadsMetrics = {
  leads: number;
  conversions: number;
  conversionRate: number;
  cpl: number;
  roi: number;
  totalCost: number;
  totalConversionsValue: number;
  clicks: number;
  impressions: number;
};

type MetaLeadsResponse = {
  success: boolean;
  adAccountId: string;
  period: string;
  metrics: MetaLeadsMetrics;
  campaigns: number;
};

/**
 * Hook para buscar métricas do Meta Leads (Facebook/Instagram)
 * Requer que o usuário tenha configurado o Meta OAuth previamente
 */
export function useMetaLeads() {
  const connection = getMetaConnection();

  return useQuery<MetaLeadsResponse>({
    queryKey: queryKeys.integrations.metaLeadsMetrics,
    queryFn: async () => {
      const metaConnection = getMetaConnection();

      if (!metaConnection) {
        throw new Error('Meta Leads não está conectado. Configure a integração primeiro.');
      }

      if (isMetaTokenExpired()) {
        throw new Error('Token do Meta expirado. Reconecte sua conta.');
      }

      const { tokens, accountData } = metaConnection;

      return integrationBackend.getMetaLeadsMetrics(tokens.access_token, accountData.ad_account_id || '');
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    // Requer que esteja conectado para fazer a query
    enabled: !!connection && !!connection.accountData.ad_account_id,
  });
}
