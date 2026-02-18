export type FilterOption = { value: string; label: string; type?: 'user' | 'system' };

export type CampaignOption = FilterOption & { channel: string };

export const PROPERTY_SCOPE: 'development' | 'property' = 'development';

export const REDISTRIBUICAO_MOTIVOS = [
  { value: 'sem-contato', label: 'Sem contato' },
  { value: 'dados-incompletos', label: 'Dados incompletos' },
  { value: 'duplicado', label: 'Duplicado' },
  { value: 'sem-interesse', label: 'Sem interesse' },
  { value: 'tempo-expirado', label: 'Tempo expirado' },
];

export const REDISTRIBUICAO_CORRETORES = [
  { value: 'broker-ana', label: 'Ana Lima' },
  { value: 'broker-carlos', label: 'Carlos Silva' },
  { value: 'broker-juliana', label: 'Juliana Mendes' },
  { value: 'broker-lucas', label: 'Lucas Souza' },
];

export const REDISTRIBUICAO_RESPONSAVEIS: FilterOption[] = [
  { value: 'system', label: 'Sistema (automático)', type: 'system' },
  { value: 'user-ana', label: 'Ana Lima', type: 'user' },
  { value: 'user-carlos', label: 'Carlos Silva', type: 'user' },
  { value: 'user-equipe-digital', label: 'Equipe Digital', type: 'user' },
  { value: 'user-equipe-especialista', label: 'Equipe Especialista', type: 'user' },
];

export const REDISTRIBUICAO_FILAS = [
  { value: 'fila-geral', label: 'Fila Geral' },
  { value: 'fila-premium', label: 'Fila Premium' },
  { value: 'fila-digital', label: 'Fila Digital' },
  { value: 'fila-campanha', label: 'Campanha Social' },
];

export const REDISTRIBUICAO_TAGS = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'studio', label: 'Studio' },
  { value: 'rural', label: 'Rural' },
];

export const REDISTRIBUICAO_FUNIS = [
  { value: 'pipeline-vendas', label: 'Venda' },
  { value: 'pipeline-locacao', label: 'Locação' },
  { value: 'pipeline-orcamento', label: 'Orçamento' },
  { value: 'pipeline-shortsale', label: 'Shortsale' },
];

export const REDISTRIBUICAO_FASES: Record<string, FilterOption[]> = {
  'pipeline-vendas': [
    { value: 'stage-pre-atendimento', label: 'Pré-atendimento' },
    { value: 'stage-atendimento', label: 'Atendimento' },
    { value: 'stage-agendamento', label: 'Agendamento' },
    { value: 'stage-visita-proposta', label: 'Visita proposta enviada' },
    { value: 'stage-negociacao', label: 'Negociação' },
    { value: 'stage-negocio-fechado', label: 'Negócio fechado' },
    { value: 'stage-indicacao', label: 'Indicação' },
    { value: 'stage-receita-gerada', label: 'Receita gerada' },
    { value: 'stage-pos-venda', label: 'Pós-venda' },
  ],
  'pipeline-locacao': [
    { value: 'stage-pre-atendimento', label: 'Pré-atendimento' },
    { value: 'stage-atendimento', label: 'Atendimento' },
    { value: 'stage-agendamento', label: 'Agendamento' },
    { value: 'stage-visita-proposta', label: 'Visita proposta enviada' },
    { value: 'stage-negociacao', label: 'Negociação' },
    { value: 'stage-negocio-fechado', label: 'Negócio fechado' },
    { value: 'stage-indicacao', label: 'Indicação' },
    { value: 'stage-receita-gerada', label: 'Receita gerada' },
    { value: 'stage-pos-venda', label: 'Pós-venda' },
  ],
  'pipeline-orcamento': [
    { value: 'stage-pre-atendimento', label: 'Pré-atendimento' },
    { value: 'stage-atendimento', label: 'Atendimento' },
    { value: 'stage-agendamento', label: 'Agendamento' },
    { value: 'stage-visita-proposta', label: 'Visita proposta enviada' },
    { value: 'stage-negociacao', label: 'Negociação' },
    { value: 'stage-negocio-fechado', label: 'Negócio fechado' },
    { value: 'stage-indicacao', label: 'Indicação' },
    { value: 'stage-receita-gerada', label: 'Receita gerada' },
    { value: 'stage-pos-venda', label: 'Pós-venda' },
  ],
  'pipeline-shortsale': [
    { value: 'stage-pre-atendimento', label: 'Pré-atendimento' },
    { value: 'stage-atendimento', label: 'Atendimento' },
    { value: 'stage-agendamento', label: 'Agendamento' },
    { value: 'stage-visita-proposta', label: 'Visita proposta enviada' },
    { value: 'stage-negociacao', label: 'Negociação' },
    { value: 'stage-negocio-fechado', label: 'Negócio fechado' },
    { value: 'stage-indicacao', label: 'Indicação' },
    { value: 'stage-receita-gerada', label: 'Receita gerada' },
    { value: 'stage-pos-venda', label: 'Pós-venda' },
  ],
};

export const REDISTRIBUICAO_EMPREENDIMENTOS = [
  { value: 'dev-vista', label: 'Vista Garden' },
  { value: 'dev-mar', label: 'Mar Residencial' },
  { value: 'dev-parque', label: 'Parque Boutique' },
];

export const REDISTRIBUICAO_UNIDADES = [
  { value: 'prop-101', label: 'Unidade 101' },
  { value: 'prop-202', label: 'Unidade 202' },
  { value: 'prop-303', label: 'Unidade 303' },
];

export const REDISTRIBUICAO_CANAIS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'portais', label: 'Portais' },
  { value: 'indicacao', label: 'Indicação' },
  { value: 'landing', label: 'Landing page' },
  { value: 'organico', label: 'Orgânico' },
  { value: 'outros', label: 'Outros' },
];

export const REDISTRIBUICAO_TIPOS_OPERACAO = [
  { value: 'sale', label: 'Venda' },
  { value: 'rent', label: 'Locação' },
  { value: 'short_stay', label: 'Short stay' },
  { value: 'launch', label: 'Lançamento' },
];

export const REDISTRIBUICAO_TIPOS = [
  { value: 'todas', label: 'Todas' },
  { value: 'automatic', label: 'Automática' },
  { value: 'manual', label: 'Manual' },
];

export const REDISTRIBUICAO_SLA = [
  { value: 'todos', label: 'Todos' },
  { value: 'lte_5m', label: 'Até 5 min' },
  { value: 'lte_15m', label: 'Até 15 min' },
  { value: 'lte_1h', label: 'Até 1 h' },
  { value: 'lte_24h', label: 'Até 24 h' },
  { value: 'gt_24h', label: 'Mais de 24 h' },
];

export const REDISTRIBUICAO_CAMPANHAS: CampaignOption[] = [
  { value: 'camp-facebook', label: 'Facebook Leads Q1', channel: 'facebook' },
  { value: 'camp-instagram', label: 'Instagram Stories Abril', channel: 'instagram' },
  { value: 'camp-google', label: 'Google Search Investidores', channel: 'google' },
  { value: 'camp-whatsapp', label: 'WhatsApp Comunidade', channel: 'whatsapp' },
  { value: 'camp-portais', label: 'Portais Premium', channel: 'portais' },
  { value: 'camp-organico', label: 'Orgânico Local', channel: 'organico' },
];

export const REDISTRIBUICAO_STATUS = [
  { value: 'em_atendimento', label: 'Em atendimento' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'arquivado', label: 'Arquivado' },
  { value: 'perdido', label: 'Perdido' },
  { value: 'rearquivado', label: 'Rearquivado' },
];
