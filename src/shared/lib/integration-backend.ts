import { api } from '@/shared/lib/api';

function toAbsoluteUrl(path: string) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const normalizedPath = path.replace(/^\//, '');
  return new URL(normalizedPath, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`).toString();
}

export const integrationBackend = {
  buildOAuthStartUrl(provider: 'google' | 'meta' | 'whatsapp', params?: URLSearchParams) {
    const urlPath = `integrations/${provider}/oauth/start`;
    const query = params?.toString();
    return toAbsoluteUrl(query ? `${urlPath}?${query}` : urlPath);
  },

  buildOAuthCallbackUrl(provider: 'whatsapp', params: URLSearchParams) {
    return toAbsoluteUrl(`integrations/${provider}/oauth/callback?${params.toString()}`);
  },

  async getGoogleAdsMetrics(accessToken: string) {
    const { data } = await api.get('integrations/google/ads', {
      params: { access_token: accessToken },
    });

    return data;
  },

  async getMetaLeadsMetrics(accessToken: string, adAccountId: string) {
    const { data } = await api.get('integrations/meta/leads', {
      params: {
        access_token: accessToken,
        ad_account_id: adAccountId,
      },
    });

    return data;
  },
};
