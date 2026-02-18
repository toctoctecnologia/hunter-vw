import { shouldUseGestaoLocacaoMocks } from './getGestaoLocacaoService';

export interface DadosLocacaoFilters extends Record<string, string> {
  periodo: string;
  unidade: string;
  locador: string;
  locatario: string;
  imovel: string;
  tipoImovel: string;
  faixaValor: string;
  statusContrato: string;
  statusInadimplencia: string;
  garantia: string;
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

export const getMetrics = (_filters: Partial<DadosLocacaoFilters>) => ({
  summary: shouldUseGestaoLocacaoMocks()
    ? [
        { id: 'ativos', title: 'Taxa de contratos de locação ativos', value: '92%', change: '+1,8% vs mês anterior' },
        { id: 'renovacao', title: 'Taxa de renovação', value: '78%', change: '+3,2% no trimestre' },
        { id: 'tempo-contrato', title: 'Tempo médio de contrato', value: '26 meses', change: '+1 mês' },
        { id: 'ticket-medio', title: 'Ticket médio de aluguel', value: 'R$ 2.850', change: '+4,6% no semestre' },
        { id: 'vacancia', title: 'Vacância', value: '6,2%', change: '-0,4% no mês' },
        { id: 'ocupacao', title: 'Ocupação', value: '93,8%', change: '+0,4% no mês' },
        { id: 'tempo-alugar', title: 'Tempo médio para alugar', value: '18 dias', change: '-2 dias no trimestre' },
        { id: 'reajustes', title: 'Reajustes aplicados', value: '42 contratos', change: 'R$ 38 mil impacto' },
      ]
    : [],
});

export const getCharts = (_filters: Partial<DadosLocacaoFilters>) => ({
  chartData: shouldUseGestaoLocacaoMocks()
    ? {
        inadimplenciaCarteira: [
          { label: 'Ago', value: 3.4, display: 'R$ 126.000' },
          { label: 'Set', value: 3.1, display: 'R$ 118.400' },
          { label: 'Out', value: 3.6, display: 'R$ 139.700' },
          { label: 'Nov', value: 3.2, display: 'R$ 121.900' },
          { label: 'Dez', value: 2.9, display: 'R$ 112.300' },
        ],
        receitaMensal: [
          { label: 'Ago', value: 82 },
          { label: 'Set', value: 88 },
          { label: 'Out', value: 94 },
          { label: 'Nov', value: 91 },
          { label: 'Dez', value: 96 },
        ],
        vacancia: [
          { label: 'Ago', value: 6.8 },
          { label: 'Set', value: 6.4 },
          { label: 'Out', value: 6.7 },
          { label: 'Nov', value: 6.3 },
          { label: 'Dez', value: 6.2 },
        ],
        distratos: [
          { label: 'Ago', value: 4 },
          { label: 'Set', value: 6 },
          { label: 'Out', value: 3 },
          { label: 'Nov', value: 5 },
          { label: 'Dez', value: 2 },
        ],
        garantias: [
          { label: 'Seguro fiança', value: 42 },
          { label: 'Fiador', value: 26 },
          { label: 'Caução', value: 18 },
          { label: 'Título de capitalização', value: 14 },
        ],
      }
    : {
        inadimplenciaCarteira: [],
        receitaMensal: [],
        vacancia: [],
        distratos: [],
        garantias: [],
      },
});

export const listDrilldown = (key: string) => {
  const map: Record<string, DrilldownRow[]> = {
    renovacao: [
      { id: '1', label: 'Contrato 2093477/1', detail: 'Renovado em 10/11/2024', value: 'R$ 2.500' },
      { id: '2', label: 'Contrato 1477462/1', detail: 'A renovar em 05/01/2025', value: 'R$ 3.200' },
    ],
    ativos: [
      { id: '1', label: 'Contratos ativos', detail: 'Carteira principal', value: '92%' },
    ],
    'tempo-contrato': [
      { id: '1', label: 'Contratos residenciais', detail: 'Tempo médio', value: '24 meses' },
      { id: '2', label: 'Contratos comerciais', detail: 'Tempo médio', value: '30 meses' },
    ],
    'ticket-medio': [
      { id: '1', label: 'Ticket residencial', detail: 'Média atual', value: 'R$ 2.600' },
      { id: '2', label: 'Ticket comercial', detail: 'Média atual', value: 'R$ 3.400' },
    ],
    inadimplenciaLocador: [
      { id: '1', label: 'Maria Santos', detail: '2 contratos em atraso', value: 'R$ 9.300' },
      { id: '2', label: 'João Exemplo', detail: '1 contrato em atraso', value: 'R$ 3.200' },
    ],
    inadimplenciaImovel: [
      { id: '1', label: 'Apartamento | Rua Exemplo, 100', detail: '12 dias em atraso', value: 'R$ 1.280' },
      { id: '2', label: 'Casa | Rua das Flores, 250', detail: '16 dias em atraso', value: 'R$ 2.340' },
    ],
    inadimplenciaCarteira: [
      { id: '1', label: 'Carteira residencial', detail: 'Taxa atual', value: '3,2%' },
      { id: '2', label: 'Carteira comercial', detail: 'Taxa atual', value: '2,6%' },
    ],
    vacancia: [
      { id: '1', label: 'Zona Sul', detail: '12 imóveis vagos', value: '6,2%' },
      { id: '2', label: 'Zona Norte', detail: '8 imóveis vagos', value: '5,4%' },
    ],
    ocupacao: [
      { id: '1', label: 'Carteira residencial', detail: '412 imóveis ocupados', value: '93,8%' },
    ],
    'tempo-alugar': [
      { id: '1', label: 'Apartamentos', detail: 'Tempo médio', value: '16 dias' },
      { id: '2', label: 'Salas comerciais', detail: 'Tempo médio', value: '22 dias' },
    ],
    reajustes: [
      { id: '1', label: 'Contratos reajustados', detail: 'Último mês', value: '42 contratos' },
      { id: '2', label: 'Impacto financeiro', detail: 'Mês atual', value: 'R$ 38 mil' },
    ],
    garantias: [
      { id: '1', label: 'Seguro fiança', detail: 'Contratos ativos', value: '42%' },
      { id: '2', label: 'Fiador', detail: 'Contratos ativos', value: '26%' },
    ],
    receitaMensal: [
      { id: '1', label: 'Receita recorrente', detail: 'Mês atual', value: 'R$ 1,2 mi' },
    ],
    distratos: [
      { id: '1', label: 'Distratos', detail: 'Últimos 30 dias', value: '2 contratos' },
      { id: '2', label: 'Encerramentos', detail: 'Últimos 30 dias', value: '5 contratos' },
    ],
    performanceCarteira: [
      { id: '1', label: 'Taxa de contratos ativos', detail: 'Carteira geral', value: '92%' },
      { id: '2', label: 'Taxa de renovação', detail: 'Trimestre', value: '78%' },
    ],
  };

  return { items: shouldUseGestaoLocacaoMocks() ? map[key] ?? [] : [] };
};
