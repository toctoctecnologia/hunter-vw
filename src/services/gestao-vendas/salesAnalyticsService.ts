export interface DadosVendasFilters extends Record<string, string> {
  periodo: string;
  corretor: string;
  empreendimento: string;
  origem: string;
  tipoVenda: string;
}

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  change?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
  display?: string;
}

export interface DrilldownRow {
  id: string;
  label: string;
  detail: string;
  value: string;
  status?: string;
}

export const getMetrics = (_filters: Partial<DadosVendasFilters>) => ({
  summary: [
    { id: 'conversao', title: 'Taxa de conversão por etapa', value: '68%', change: '+2,4% no mês' },
    { id: 'tempo-fechamento', title: 'Tempo médio de fechamento', value: '41 dias', change: '-3 dias no trimestre' },
    { id: 'ticket-medio', title: 'Ticket médio de venda', value: 'R$ 612 mil', change: '+4,1% no semestre' },
    { id: 'comissao-media', title: 'Comissão média', value: 'R$ 24,8 mil', change: '+1,2% no mês' },
    { id: 'origem-leads', title: 'Origem de leads x fechamento', value: '32% inbound', change: '+6% vs último trimestre' },
    { id: 'corretor-top', title: 'Vendas por corretor', value: '12 negociações', change: 'Top performer' },
    { id: 'empreendimento-top', title: 'Vendas por empreendimento', value: 'Residencial Aurora', change: '8 fechamentos' },
    { id: 'motivo-perda', title: 'Motivos de perda', value: 'Crédito negado', change: '19% dos casos' },
  ],
});

export const getCharts = (_filters: Partial<DadosVendasFilters>) => ({
  chartData: {
    conversaoEtapas: [
      { label: 'Proposta', value: 74 },
      { label: 'Crédito', value: 62 },
      { label: 'Assinatura', value: 54 },
      { label: 'Registro', value: 42 },
    ],
    tempoFechamento: [
      { label: 'Ago', value: 48 },
      { label: 'Set', value: 45 },
      { label: 'Out', value: 42 },
      { label: 'Nov', value: 41 },
    ],
    ticketMedio: [
      { label: 'Centro', value: 720, display: 'R$ 720 mil' },
      { label: 'Zona Norte', value: 560, display: 'R$ 560 mil' },
      { label: 'Zona Sul', value: 640, display: 'R$ 640 mil' },
    ],
    comissaoMedia: [
      { label: 'Ago', value: 22 },
      { label: 'Set', value: 24 },
      { label: 'Out', value: 25 },
      { label: 'Nov', value: 24 },
    ],
    origemLeads: [
      { label: 'Inbound', value: 42 },
      { label: 'Indicação', value: 28 },
      { label: 'Parcerias', value: 18 },
      { label: 'Outbound', value: 12 },
    ],
  },
});

export const listDrilldown = (key: string) => {
  const map: Record<string, DrilldownRow[]> = {
    conversao: [
      { id: '1', label: 'Propostas aprovadas', detail: 'Etapa crédito', value: '62%' },
      { id: '2', label: 'Assinaturas concluídas', detail: 'Etapa contrato', value: '54%' },
    ],
    'tempo-fechamento': [
      { id: '1', label: 'Residencial', detail: 'Tempo médio', value: '38 dias' },
      { id: '2', label: 'Comercial', detail: 'Tempo médio', value: '49 dias' },
    ],
    'ticket-medio': [
      { id: '1', label: 'Ticket médio', detail: 'Carteira geral', value: 'R$ 612 mil' },
    ],
    'comissao-media': [
      { id: '1', label: 'Comissão média', detail: 'Mês atual', value: 'R$ 24,8 mil' },
    ],
    'origem-leads': [
      { id: '1', label: 'Inbound', detail: 'Fechamentos', value: '32%' },
      { id: '2', label: 'Indicação', detail: 'Fechamentos', value: '24%' },
    ],
    'corretor-top': [
      { id: '1', label: 'Corretor destaque', detail: '12 vendas', value: 'R$ 7,2 mi' },
    ],
    'empreendimento-top': [
      { id: '1', label: 'Residencial Aurora', detail: '8 vendas', value: 'R$ 4,3 mi' },
    ],
    'motivo-perda': [
      { id: '1', label: 'Crédito negado', detail: '19% dos casos', value: '12 negócios' },
      { id: '2', label: 'Desistência', detail: '14% dos casos', value: '9 negócios' },
    ],
  };

  return { items: map[key] ?? [] };
};
