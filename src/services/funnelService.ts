import type { FunnelFilters, FunnelResponse } from '@/types/dashboard';

const BASE_STAGES = [
  { id: 'pre-atendimento', label: 'Pré Atendimento', value: 0, percent: 0 },
  { id: 'em-atendimento', label: 'Em Atendimento', value: 0, percent: 0 },
  { id: 'agendamento', label: 'Agendamento', value: 0, percent: 0 },
  { id: 'visita', label: 'Visita', value: 0, percent: 0 },
  { id: 'proposta-enviada', label: 'Proposta Enviada', value: 0, percent: 0 },
  { id: 'em-negociacao', label: 'Em Negociação', value: 0, percent: 0 },
  { id: 'negocio-fechado', label: 'Negócio Fechado', value: 0, percent: 0 },
  { id: 'indicacao', label: 'Indicação', value: 0, percent: 0 },
  { id: 'receita-gerada', label: 'Receita Gerada', value: 0, percent: 0 },
  { id: 'pos-venda', label: 'Pós venda', value: 0, percent: 0 },
];

const FUNNEL_DATASETS: Record<'financeiro' | 'contabil', number[]> = {
  financeiro: [120, 95, 78, 54, 32, 18, 12, 6, 4, 2],
  contabil: [90, 70, 52, 35, 20, 12, 9, 5, 3, 1],
};

export async function getFunnelData(filters: FunnelFilters): Promise<FunnelResponse> {
  const dataset = FUNNEL_DATASETS[filters.funnelType] ?? FUNNEL_DATASETS.financeiro;
  const total = dataset[0] || 1;

  const stages = BASE_STAGES.map((stage, index) => {
    const value = dataset[index] ?? 0;
    return {
      ...stage,
      value,
      percent: Math.round((value / total) * 100),
    };
  });

  const rates = stages.map(() => ({
    averageRate: '-',
    meta: 'N/A',
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stages,
        rates,
        meta: {
          lastUpdated: new Date().toISOString(),
        },
      });
    }, 200);
  });
}
