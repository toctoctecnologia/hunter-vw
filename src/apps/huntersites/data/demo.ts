import type { ReactNode } from 'react';

type Trend = 'up' | 'down' | 'neutral';

export interface HunterSitesStat {
  id: string;
  label: string;
  value: string;
  helper?: string;
  trend?: Trend;
}

export interface HunterSite {
  id: string;
  name: string;
  domain: string;
  status: 'online' | 'draft' | 'paused';
  updatedAt: string;
  previewUrl: string;
  description: string;
  tags: string[];
}

export interface HunterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string;
}

export interface HunterLanding {
  id: string;
  name: string;
  focus: string;
  performance: string;
  previewUrl: string;
}

export interface HunterAnalyticsRow {
  id: string;
  source: string;
  visitors: number;
  leads: number;
  conversion: number;
  trend: Trend;
}

export interface HunterBillingRow {
  id: string;
  reference: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  issuedAt: string;
}

export interface HunterTeamMember {
  id: string;
  name: string;
  role: string;
  avatarFallback: ReactNode;
}

export interface HunterSitesDemoData {
  stats: HunterSitesStat[];
  sites: HunterSite[];
  templates: HunterTemplate[];
  landings: HunterLanding[];
  analytics: HunterAnalyticsRow[];
  billing: HunterBillingRow[];
  team: HunterTeamMember[];
  highlights: string[];
}

export const hunterSitesDemoData: HunterSitesDemoData = {
  stats: [
    {
      id: 'visits',
      label: 'Visitas no mês',
      value: '38.420',
      helper: '+18% vs. mês anterior',
      trend: 'up',
    },
    {
      id: 'leads',
      label: 'Leads capturados',
      value: '964',
      helper: 'Taxa de conversão 12,5%',
      trend: 'up',
    },
    {
      id: 'sites',
      label: 'Sites publicados',
      value: '12',
      helper: '3 em rascunho',
      trend: 'neutral',
    },
    {
      id: 'pages',
      label: 'Landing pages',
      value: '24',
      helper: '5 páginas com desempenho acima da média',
      trend: 'up',
    },
  ],
  sites: [
    {
      id: 'atlantic-lofts',
      name: 'Atlantic Lofts',
      domain: 'atlanticlofts.huntersites.com.br',
      status: 'online',
      updatedAt: 'Atualizado há 2 dias',
      previewUrl: 'https://www.huntercrm.com.br',
      description: 'Site institucional com tour 360º e integração com CRM.',
      tags: ['Residencial', 'Tour Virtual', 'CRM'],
    },
    {
      id: 'aurora-sky',
      name: 'Aurora Sky',
      domain: 'aurorasky.huntersites.com.br',
      status: 'online',
      updatedAt: 'Atualizado há 5 dias',
      previewUrl: 'https://www.huntercrm.com.br',
      description: 'Landing focada em captação de leads com formulários dinâmicos.',
      tags: ['Captação', 'Integração WhatsApp'],
    },
    {
      id: 'villa-parque',
      name: 'Villa Parque',
      domain: 'villaparque.huntersites.com.br',
      status: 'paused',
      updatedAt: 'Pausado há 1 semana',
      previewUrl: 'https://www.huntercrm.com.br',
      description: 'Campanha sazonal para plantão de vendas.',
      tags: ['Campanha', 'Plantão'],
    },
  ],
  templates: [
    {
      id: 'prime',
      name: 'Prime Residencial',
      category: 'Lançamentos',
      description: 'Layout premium com seções para argumentos de venda, tour virtual e depoimentos.',
      previewUrl: 'https://www.huntercrm.com.br',
    },
    {
      id: 'signature',
      name: 'Signature',
      category: 'Construtoras',
      description: 'Modelo sofisticado para empreendimentos de alto padrão com galeria ampla.',
      previewUrl: 'https://www.huntercrm.com.br',
    },
    {
      id: 'essential',
      name: 'Essential',
      category: 'Captação',
      description: 'Estrutura otimizada para gerar leads com blocos personalizáveis.',
      previewUrl: 'https://www.huntercrm.com.br',
    },
  ],
  landings: [
    {
      id: 'black-friday',
      name: 'Black Friday 2024',
      focus: 'Campanha relâmpago com gatilhos de urgência',
      performance: 'Taxa de conversão 18,4%',
      previewUrl: 'https://www.huntercrm.com.br',
    },
    {
      id: 'whatsapp',
      name: 'Atendimento WhatsApp',
      focus: 'Lead magnet com disparo automático no CRM',
      performance: 'Tempo médio de resposta 4min',
      previewUrl: 'https://www.huntercrm.com.br',
    },
    {
      id: 'corretor-do-mes',
      name: 'Corretor do mês',
      focus: 'Landing interna para reconhecimento da equipe',
      performance: 'Engajamento 82%',
      previewUrl: 'https://www.huntercrm.com.br',
    },
  ],
  analytics: [
    {
      id: 'google',
      source: 'Google Ads',
      visitors: 18920,
      leads: 432,
      conversion: 12.4,
      trend: 'up',
    },
    {
      id: 'meta',
      source: 'Meta Ads',
      visitors: 15340,
      leads: 351,
      conversion: 9.1,
      trend: 'up',
    },
    {
      id: 'organic',
      source: 'Orgânico',
      visitors: 8420,
      leads: 98,
      conversion: 4.2,
      trend: 'neutral',
    },
    {
      id: 'referrals',
      source: 'Parcerias',
      visitors: 2690,
      leads: 83,
      conversion: 6.1,
      trend: 'down',
    },
  ],
  billing: [
    {
      id: '2024-06',
      reference: 'Junho/2024',
      amount: 'R$ 1.280,00',
      status: 'paid',
      issuedAt: '05/06/2024',
    },
    {
      id: '2024-05',
      reference: 'Maio/2024',
      amount: 'R$ 1.280,00',
      status: 'paid',
      issuedAt: '05/05/2024',
    },
    {
      id: '2024-04',
      reference: 'Abril/2024',
      amount: 'R$ 1.280,00',
      status: 'overdue',
      issuedAt: '05/04/2024',
    },
  ],
  team: [
    {
      id: 'raissa',
      name: 'Raíssa Martins',
      role: 'Gestora de Marketing',
      avatarFallback: 'RM',
    },
    {
      id: 'gabriel',
      name: 'Gabriel Silva',
      role: 'Coordenador Digital',
      avatarFallback: 'GS',
    },
    {
      id: 'patricia',
      name: 'Patrícia Nunes',
      role: 'Copywriter',
      avatarFallback: 'PN',
    },
  ],
  highlights: [
    'Integração com CRM Hunter ativa',
    'Fluxo de publicação automatizado para novos empreendimentos',
    'Templates personalizados para cada etapa do funil',
  ],
};

export interface HunterSitesDataSource {
  data: HunterSitesDemoData;
  usingMock: boolean;
}

function parseCookieValue(cookieString: string, key: string): string | undefined {
  return cookieString
    .split(';')
    .map((piece) => piece.trim())
    .find((piece) => piece.startsWith(`${key}=`))
    ?.split('=')[1];
}

export function resolveHunterSitesData(cookieString?: string): HunterSitesDataSource {
  if (typeof window === 'undefined' && !cookieString) {
    return { data: hunterSitesDemoData, usingMock: true };
  }

  const source = cookieString ?? (typeof document !== 'undefined' ? document.cookie : '');
  const token = source ? parseCookieValue(source, 'hs_token') : undefined;

  return {
    data: hunterSitesDemoData,
    usingMock: !token,
  };
}

export type HunterSitesOutletContext = HunterSitesDataSource;
