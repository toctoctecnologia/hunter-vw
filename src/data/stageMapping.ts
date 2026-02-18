export const STAGE_LABEL_TO_SLUG: Record<string, string> = {
  'Pré-Atendimento': 'pré_atendimento',
  'Em Atendimento': 'em_atendimento',
  'Agendamento': 'agendamento',
  'Visita': 'visita',
  'Proposta Enviada': 'proposta_enviada',
  'Em Negociação': 'em_negociação',
  'Negócio Fechado': 'negócio_fechado',
  'Indicação': 'indicação',
  'Receita Gerada': 'receita_gerada',
  'Pós-venda': 'pós_venda',
  'Perdido': 'perdido',
  'Arquivado': 'arquivado'
};

export const STAGE_SLUG_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(STAGE_LABEL_TO_SLUG).map(([label, slug]) => [slug, label])
);
