export const PIPELINE_STAGES = [
  'pré_atendimento',
  'em_atendimento',
  'agendamento',
  'visita',
  'proposta_enviada',
  'em_negociação',
  'negócio_fechado',
  'indicação',
  'receita_gerada',
  'pós_venda',
  'perdido',
  'arquivado',
] as const;

export type LeadStage = (typeof PIPELINE_STAGES)[number];

export const stageIndex = (stage: LeadStage): number =>
  PIPELINE_STAGES.indexOf(stage);

export const nextStageOf = (stage: LeadStage): LeadStage | undefined => {
  const index = stageIndex(stage);
  return PIPELINE_STAGES[index + 1];
};

export const isForward = (from: LeadStage, to: LeadStage): boolean =>
  stageIndex(to) > stageIndex(from);

export const STAGE_TOASTS: Record<LeadStage, { title: string }> = {
  pré_atendimento: { title: 'Lead movido para Pré-Atendimento' },
  em_atendimento: { title: 'Lead em Atendimento' },
  agendamento: { title: 'Lead em Agendamento' },
  visita: { title: 'Lead em Visita' },
  proposta_enviada: { title: 'Proposta enviada' },
  em_negociação: { title: 'Em negociação' },
  negócio_fechado: { title: 'Negócio fechado' },
  indicação: { title: 'Lead indicado' },
  receita_gerada: { title: 'Receita gerada' },
  pós_venda: { title: 'Pós-venda' },
  perdido: { title: 'Lead perdido' },
  arquivado: { title: 'Lead arquivado' },
};

