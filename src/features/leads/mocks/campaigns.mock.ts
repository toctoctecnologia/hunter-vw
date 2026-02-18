export interface CampaignKpiMock {
  id: string;
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: string;
}

export interface CampaignTableRowMock {
  id: string;
  name: string;
  channelId: string;
  channelName: string;
  status: 'ativo' | 'pausado';
  leads: number;
  opportunities: number;
  conversions: number;
  spend: number;
  revenue: number;
  conversionRate: number;
  costPerLead: number;
  roi: number;
}

export interface CampaignFunnelStageMock {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
  tooltip: string;
}

export const campaignsAnalyticsMock = {
  kpis: <CampaignKpiMock[]>[
    {
      id: 'captured-leads',
      label: 'Leads captados',
      value: 1284,
      change: 12,
      changeLabel: 'vs. período anterior',
      icon: 'Users',
    },
    {
      id: 'qualified-leads',
      label: 'Leads qualificados',
      value: 482,
      change: 6,
      changeLabel: 'taxa de qualificação',
      icon: 'BadgeCheck',
    },
    {
      id: 'investment',
      label: 'Investimento',
      value: 31250,
      change: -8,
      changeLabel: 'custo total',
      icon: 'Coins',
    },
    {
      id: 'roi',
      label: 'ROI médio',
      value: 4.2,
      change: 18,
      changeLabel: 'retorno',
      icon: 'TrendingUp',
    },
  ],
  campaigns: <CampaignTableRowMock[]>[
    {
      id: 'cmp-001',
      name: 'Google Ads - Busca Imóveis',
      channelId: 'google_ads',
      channelName: 'Google Ads',
      status: 'ativo',
      leads: 420,
      opportunities: 180,
      conversions: 52,
      spend: 12500,
      revenue: 54000,
      conversionRate: 12.4,
      costPerLead: 29.76,
      roi: 4.32,
    },
    {
      id: 'cmp-002',
      name: 'Facebook Ads - Lançamento Centro',
      channelId: 'facebook_ads',
      channelName: 'Facebook Ads',
      status: 'ativo',
      leads: 286,
      opportunities: 132,
      conversions: 28,
      spend: 6800,
      revenue: 24500,
      conversionRate: 9.8,
      costPerLead: 23.78,
      roi: 3.6,
    },
    {
      id: 'cmp-003',
      name: 'Instagram - Stories Conversão',
      channelId: 'instagram_ads',
      channelName: 'Instagram Ads',
      status: 'ativo',
      leads: 198,
      opportunities: 104,
      conversions: 21,
      spend: 4100,
      revenue: 16400,
      conversionRate: 10.6,
      costPerLead: 20.71,
      roi: 4,
    },
    {
      id: 'cmp-004',
      name: 'Portais - Destaque Premium',
      channelId: 'portals',
      channelName: 'Portais imobiliários',
      status: 'pausado',
      leads: 164,
      opportunities: 74,
      conversions: 14,
      spend: 5200,
      revenue: 17250,
      conversionRate: 8.5,
      costPerLead: 31.71,
      roi: 3.3,
    },
    {
      id: 'cmp-005',
      name: 'Email Marketing - Reengajamento',
      channelId: 'email',
      channelName: 'Email marketing',
      status: 'ativo',
      leads: 124,
      opportunities: 62,
      conversions: 16,
      spend: 950,
      revenue: 9800,
      conversionRate: 12.9,
      costPerLead: 7.66,
      roi: 10.3,
    },
    {
      id: 'cmp-006',
      name: 'WhatsApp - Fluxo Automatizado',
      channelId: 'whatsapp',
      channelName: 'WhatsApp Business',
      status: 'ativo',
      leads: 92,
      opportunities: 44,
      conversions: 12,
      spend: 550,
      revenue: 7200,
      conversionRate: 13,
      costPerLead: 5.98,
      roi: 12.1,
    },
  ],
  funnel: <CampaignFunnelStageMock[]>[
    {
      id: 'impressions',
      label: 'Impressões',
      value: 184520,
      percentage: 100,
      color: '#fed7aa',
      tooltip: 'Total de vezes que os anúncios foram exibidos.',
    },
    {
      id: 'clicks',
      label: 'Cliques',
      value: 34520,
      percentage: 18.7,
      color: '#fb923c',
      tooltip: 'Cliques recebidos nos anúncios.',
    },
    {
      id: 'leads',
      label: 'Leads',
      value: 1284,
      percentage: 3.7,
      color: 'hsl(var(--accentSoft))',
      tooltip: 'Leads captados a partir das campanhas.',
    },
    {
      id: 'qualified',
      label: 'Qualificados',
      value: 482,
      percentage: 1.4,
      color: '#c2410c',
      tooltip: 'Leads qualificados após triagem.',
    },
    {
      id: 'deals',
      label: 'Negócios',
      value: 133,
      percentage: 0.4,
      color: '#9a3412',
      tooltip: 'Negócios originados das campanhas.',
    },
  ],
};

export const campaignsIntegrationsMock = {
  channels: [
    { id: 'google_ads', name: 'Google Ads', icon: 'Search' },
    { id: 'facebook_ads', name: 'Facebook Ads', icon: 'Facebook' },
    { id: 'instagram_ads', name: 'Instagram Ads', icon: 'Instagram' },
    { id: 'portals', name: 'Portais imobiliários', icon: 'Globe' },
    { id: 'email', name: 'Email marketing', icon: 'Mail' },
    { id: 'whatsapp', name: 'WhatsApp Business', icon: 'MessageCircle' },
  ],
  campaigns: [
    { id: 'cmp-001', name: 'Google Ads - Busca Imóveis', channelId: 'google_ads' },
    { id: 'cmp-002', name: 'Facebook Ads - Lançamento Centro', channelId: 'facebook_ads' },
    { id: 'cmp-003', name: 'Instagram - Stories Conversão', channelId: 'instagram_ads' },
    { id: 'cmp-004', name: 'Portais - Destaque Premium', channelId: 'portals' },
    { id: 'cmp-005', name: 'Email Marketing - Reengajamento', channelId: 'email' },
    { id: 'cmp-006', name: 'WhatsApp - Fluxo Automatizado', channelId: 'whatsapp' },
  ],
};
