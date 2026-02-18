import { useQuery } from '@tanstack/react-query';
import { getMetaConnection, isMetaTokenExpired } from '@/shared/lib/meta-oauth';

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
    queryKey: ['meta-leads-metrics'],
    queryFn: async () => {
      const metaConnection = getMetaConnection();

      if (!metaConnection) {
        throw new Error('Meta Leads não está conectado. Configure a integração primeiro.');
      }

      if (isMetaTokenExpired()) {
        throw new Error('Token do Meta expirado. Reconecte sua conta.');
      }

      const { tokens, accountData } = metaConnection;

      // Faz a chamada para a API
      const params = new URLSearchParams({
        access_token: tokens.access_token,
        ad_account_id: accountData.ad_account_id || '',
      });

      const response = await fetch(`/api/meta/leads?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao buscar métricas do Meta Leads');
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
    enabled: !!connection && !!connection.accountData.ad_account_id,
  });
}
