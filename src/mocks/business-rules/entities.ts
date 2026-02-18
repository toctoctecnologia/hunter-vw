import type { BusinessEntity } from '@/types/businessRules';

export const businessRuleEntities: BusinessEntity[] = [
  { entityId: 'profile-admin', type: 'profile', name: 'Administrador', description: 'Acesso completo ao Hunter CRM', tags: ['admin', 'full'] },
  { entityId: 'profile-closer', type: 'profile', name: 'Closer', description: 'Foco em negociações e propostas', tags: ['vendas', 'fechamento'] },
  { entityId: 'profile-sdr', type: 'profile', name: 'SDR', description: 'Prospecção e qualificação de leads', tags: ['leads', 'qualificacao'] },
  { entityId: 'team-imoveis', type: 'team', name: 'Time Imóveis', description: 'Equipe responsável pela base de imóveis', tags: ['imoveis'] },
  { entityId: 'team-funil', type: 'team', name: 'Time Funil', description: 'Squad de otimização do funil', tags: ['funil'] },
  { entityId: 'team-leads', type: 'team', name: 'Time Leads', description: 'Gestão e enriquecimento de leads', tags: ['leads'] },
  { entityId: 'team-negociacoes', type: 'team', name: 'Time Negociações', description: 'Equipe de propostas e follow-up', tags: ['negociacoes'] },
  { entityId: 'form-captacao', type: 'form', name: 'Formulário de Captação', description: 'Campos para novos leads', metadata: { version: '1.0' }, tags: ['leads', 'form'] },
  { entityId: 'form-visita', type: 'form', name: 'Formulário de Visita', description: 'Agendamento e feedback de visitas', metadata: { version: '1.2' }, tags: ['agenda'] },
  { entityId: 'form-proposta', type: 'form', name: 'Formulário de Proposta', description: 'Detalhes para submissão de propostas', metadata: { version: '2.0' }, tags: ['negociacoes'] },
  { entityId: 'lookup-status-lead', type: 'lookup-table', name: 'Status de Lead', description: 'Lista de status padrão do lead', tags: ['leads', 'status'] },
  { entityId: 'lookup-tags-imoveis', type: 'lookup-table', name: 'Tags de Imóveis', description: 'Classificações para imóveis', tags: ['imoveis', 'tags'] },
  { entityId: 'lookup-origens', type: 'lookup-table', name: 'Origens de Lead', description: 'Origem e canais de aquisição', tags: ['leads', 'origens'] },
  { entityId: 'lookup-cadencia', type: 'lookup-table', name: 'Modelos de Cadência', description: 'Templates de cadência de contato', tags: ['cadencia', 'templates'] },
  { entityId: 'lookup-webhooks', type: 'lookup-table', name: 'Endpoints de Webhook', description: 'Configurações de callbacks externos', tags: ['integracoes', 'webhook'] },
];

export default businessRuleEntities;
