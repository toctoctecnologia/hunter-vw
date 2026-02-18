import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { navItems, sadmNavItems } from '@/shared/constants/navItems';

import {
  CaptationStatus,
  CommissionAgentType,
  CondominiumFeatureType,
  DayOfWeek,
  DistributionReportStatus,
  FunnelDirection,
  LeadFunnelStages,
  LeadIntensityType,
  LeadNegotiationType,
  LeadPaymentExchangeType,
  LeadPaymentPriceIndex,
  LeadProposalStatus,
  LeadQualification,
  LeadStatusType,
  NotificationFrequency,
  NotificationType,
  OverlaySettingPosition,
  PropertyConstructionStatus,
  PropertyDestination,
  PropertyFeatureType,
  PropertyKeychainStatus,
  PropertyLaunchType,
  PropertyNoteType,
  PropertyPositionType,
  PropertyQualification,
  PropertySignStatus,
  PropertySituation,
  QueueRuleNames,
  QueueRuleOperationTypes,
  RedistributionBatchJobItemStatus,
  UserInformation,
} from '@/shared/types';
import { hasFeature } from './permissions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPageTitleByPath(path: string) {
  // Busca nos navItems
  const allNavItems = [...navItems, ...sadmNavItems];

  for (const item of allNavItems) {
    if (item.exact) {
      if (path === item.href) return item.title;
    } else {
      if (path === item.href || path.startsWith(`${item.href}/`)) return item.title;
    }
  }

  // Fallback para casos especiais
  const pathTitleMap: Record<string, string> = {
    '/dashboard/notifications': 'Notificações',
    '/dashboard/profile': 'Meu Perfil',
    '/sadm-dashboard/notifications': 'Notificações',
  };

  if (pathTitleMap[path]) return pathTitleMap[path];

  if (path.startsWith('/sadm-dashboard/clients/')) return 'Detalhes do Cliente';

  return '';
}

export function getPageDescriptionByPath(path: string) {
  // Busca nos navItems
  const allNavItems = [...navItems, ...sadmNavItems];

  for (const item of allNavItems) {
    if (item.exact) {
      if (path === item.href) return item.description || '';
    } else {
      if (path === item.href || path.startsWith(`${item.href}/`)) return item.description || '';
    }
  }

  // Fallback para casos especiais
  const pathDescriptionMap: Record<string, string> = {
    '/dashboard/notifications': 'Visualize suas notificações',
    '/dashboard/profile': 'Visualize e gerencie as informacões do seu perfil',
    '/sadm-dashboard/notifications': 'Visualize suas notificações',
  };

  if (pathDescriptionMap[path]) return pathDescriptionMap[path];

  if (path.startsWith('/sadm-dashboard/clients/')) return 'Visualize e gerencie as informações detalhadas do cliente';

  return '';
}

export function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getURL(path = 'auth/confirm') {
  let url = import.meta.env.VITE_SITE_URL ?? 'http://localhost:8080/';
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return `${url}${path}`;
}

export function getUserNameInitials(name: string) {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  return initials.length > 2 ? initials.charAt(0) + initials.charAt(initials.length - 1) : initials;
}

export function formatValue(value: number) {
  return Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format(value);
}

export function formatLongDateHour(dateString: string) {
  return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });
}

export function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
}

export function formatShortDate(dateString?: string) {
  return dateString ? format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR }) : '--/--/----';
}

export function getHumanExpirationDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
}

export function tryGetValueInObject<T>(obj: T | null | undefined, key: keyof T): string {
  if (!obj) return 'N/A';

  const value = obj[key];

  if (value === null || value === undefined) return 'N/A';

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return 'N/A';
    }
  }

  return String(value).trim() ? String(value) : 'N/A';
}

export function translateSignatureStatus(status: string): string {
  const statusTranslations: Record<string, string> = {
    ACTIVE: 'Ativo',
    WAITING_PAYMENT_CONFIRMATION: 'Aguardando Confirmação de Pagamento',
    WAITING_RELEASE: 'Aguardando Liberação',
    OVERDUE: 'Em Atraso',
    TEST_PERIOD_ACTIVE: 'Período de Teste Ativo',
    SUPER_ADMIN: 'Super Administrador',
  };

  return statusTranslations[status] || status.replace(/_/g, ' ');
}

// Calendar Time utilities
export function timeToString(time: { hour: number; minute: number; second: number } | string): string {
  // Se já for string no formato "HH:mm:ss", retorna apenas "HH:mm"
  if (typeof time === 'string') {
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`;
  }
  // Se for objeto Time, formata para "HH:mm"
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

export function stringToTime(timeString: string): { hour: number; minute: number; second: number } {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour: hour || 0, minute: minute || 0, second: 0 };
}

export function propertyStatusToLabel(status: string): string {
  const statusMap: Record<string, string> = {
    DISPONIVEL_NO_SITE: 'Disponível no Site',
    DISPONIVEL_INTERNO: 'Disponível Interno',
    INDISPONIVEL: 'Indisponível',
    EM_CAPTACAO: 'Em Captação',
    EM_PREPARACAO: 'Em Preparação',
    VENDIDO: 'Vendido',
    PUBLICADO: 'Publicado',
    EM_NEGOCIACAO: 'Em Negociação',
    RESERVADO: 'Reservado',
    RETIRADO: 'Retirado',
    PENDING_TO_APPROVE: 'Pendente de Aprovação',
    ARQUIVADO: 'Arquivado',
    ALUGADO: 'Alugado',
  };

  return statusMap[status] || status;
}

export function planNameToLabel(planName: string): string {
  const planNameMap: Record<string, string> = {
    AUTONOMOUS: 'Autônomo',
    START: 'Start',
    PROFESSIONAL: 'Profissional',
    ENTERPRISE: 'Enterprise',
  };

  return planNameMap[planName] || planName;
}

export function LeadOriginTypeToLabel(originType: string): string {
  const originTypeMap: Record<string, string> = {
    WHATSAPP: 'Whatsapp',
    TELEFONE: 'Telefone',
    REDE_SOCIAL: 'Rede Social',
    SHOWROOM: 'Showroom',
    EMAIL_MARKETING: 'Email Marketing',
    VIVA_REAL: 'Viva Real',
    VIVA_REAL_LANCAMENTO: 'Viva Real Lançamento',
    ZAP_IMOVEIS_GRUPO_ZAP: 'Zap Imóveis Grupo Zap',
    IMOVELWEB: 'Imovelweb',
    OLX: 'OLX',
    CHAVES_NA_MAO: 'Chaves na Mão',
    VITRINE: 'Vitrine',
    SITE: 'Site',
    SITE_PROPRIO: 'Site Próprio',
    SITE_PROPRIO_ROCKETIMOB: 'Site Próprio Rocketimob',
    LANDING_PAGE: 'Landing Page',
    RD_STATION_API: 'RD Station API',
    API: 'API',
    TYPEBOT: 'Typebot',
    C2SBOT: 'C2SBot',
    LEADSTER: 'Leadster',
    INDICACAO: 'Indicação',
    RELACIONAMENTO: 'Relacionamento',
    RELACIONAMENTO_AMIGO_PARENTE: 'Relacionamento Amigo/Parente',
    CLIENTE_DE_CARTEIRA: 'Cliente de Carteira',
    LISTA_EXTERNA_DE_CLIENTES: 'Lista Externa de Clientes',
    IMPORTADOS_DA_PLANILHA: 'Importados da Planilha',
    MIDIAS_PARTICULARES: 'Mídias Particulares',
    PARCERIA_COM_OUTRA_IMOBILIARIA: 'Parceria com Outra Imobiliária',
    PLACA_TELEFONE_WHATS: 'Placa Telefone Whats',
  };

  return originTypeMap[originType] || originType;
}

export const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'QUENTE':
      return '#EF4444';
    case 'MORNO':
      return '#FACC15';
    case 'FRIO':
      return '#38BDF8';
    case 'MUITO_FRIO':
      return '#CBD5E1';
    default:
      return '#CCCCCC';
  }
};

export const getIntensityText = (intensity: string) => {
  switch (intensity) {
    case 'QUENTE':
      return 'Quente';
    case 'MORNO':
      return 'Morno';
    case 'FRIO':
      return 'Frio';
    case 'MUITO_FRIO':
      return 'Muito Frio';
    default:
      return 'Desconhecido';
  }
};

export const intensityConfig: Record<LeadIntensityType, { label: string; color: string }> = {
  [LeadIntensityType.QUENTE]: {
    label: 'Quente',
    color: '#EF4444',
  },
  [LeadIntensityType.MORNO]: {
    label: 'Morno',
    color: '#FACC15',
  },
  [LeadIntensityType.FRIO]: {
    label: 'Frio',
    color: '#38BDF8',
  },
  [LeadIntensityType.MUITO_FRIO]: {
    label: 'Muito Frio',
    color: '#CBD5E1',
  },
};

export const leadServiceTypeConfig: Record<string, { label: string; color: string }> = {
  presencial: {
    label: 'Presencial',
    color: '#EF4444',
  },
  online: {
    label: 'Online',
    color: '#CCCCCC',
  },
};

export const leadFunnelStepToLabel = (funnelStep: string) => {
  const funnelStepMap: Record<string, string> = {
    PRE_ATENDIMENTO: 'Pré-Atendimento',
    EM_ATENDIMENTO: 'Em Atendimento',
    AGENDAMENTO: 'Agendamento',
    VISITA: 'Visita',
    PROPOSTA_ENVIADA: 'Proposta Enviada',
    EM_NEGOCIACAO: 'Em Negociação',
    NEGOCIO_FECHADO: 'Negócio Fechado',
    INDICACAO: 'Indicação',
    RECEITA_GERADA: 'Receita Gerada',
    POS_VENDA: 'Pós Venda',
  };
  return funnelStepMap[funnelStep] || funnelStep;
};

export const getActionTypeLabel = (actionType: string): string => {
  const labels: Record<string, string> = {
    ACCOUNT_REGISTERED: 'Conta registrada',
    ACCOUNT_PAYMENT_LINK_GENERATED: 'Link de pagamento gerado',
    ACCOUNT_PLAN_LISTED: 'Planos listados',
    ACCOUNT_SIGNATURE_UPDATED: 'Assinatura da conta atualizada',
    USER_STATUS_CHANGED: 'Status do usuário alterado',
    USER_ROULLETE_SIGNATURE_UPDATED: 'Assinatura da roleta do usuário atualizada',
    USER_METRICS_VIEWED: 'Métricas do usuário visualizadas',
    USER_LIST_VIEWED: 'Lista de usuários visualizada',
    USER_INVITE_CREATED: 'Convite criado',
    USER_INVITE_ACCEPTED: 'Convite aceito',
    USER_WHATSAPP_SESSION_VIEWED: 'Sessão do WhatsApp do usuário visualizada',
    PROPERTY_CREATED: 'Imóvel criado',
    PROPERTY_LIST_VIEWED: 'Lista de imóveis visualizada',
    PROPERTY_MEDIA_UPLOADED: 'Mídia do imóvel enviada',
    PROPERTY_MEDIA_DELETED: 'Mídia do imóvel deletada',
    PROPERTY_MEDIA_ORDER_UPDATED: 'Ordem das mídias do imóvel atualizada',
    PROPERTY_CATCHER_REMOVED: 'Captador removido do imóvel',
    PROPERTY_FEATURE_CREATED: 'Característica do imóvel criada',
    PROPERTY_FEATURE_UPDATED: 'Característica do imóvel atualizada',
    PROPERTY_FEATURE_LIST_VIEWED: 'Lista de características visualizada',
    PROPERTY_BUILDER_CREATED: 'Construtora criada',
    PROPERTY_BUILDER_UPDATED: 'Construtora atualizada',
    PROPERTY_BUILDER_DELETED: 'Construtora deletada',
    PROPERTY_BUILDER_LIST_VIEWED: 'Lista de construtoras visualizada',
    CONDOMINIUM_LIST_VIEWED: 'Lista de condomínios visualizada',
    CONDOMINIUM_CREATED: 'Condomínio criado',
    CONDOMINIUM_DELETED: 'Condomínio deletado',
    CONDOMINIUM_UPDATED: 'Condomínio atualizado',
    SECONDARY_DISTRICT_CREATED: 'Bairro secundário criado',
    SECONDARY_DISTRICT_UPDATED: 'Bairro secundário atualizado',
    SECONDARY_DISTRICT_DELETED: 'Bairro secundário deletado',
    SECONDARY_DISTRICT_LIST_VIEWED: 'Lista de bairros secundários visualizada',
    APPOINTMENT_CREATED: 'Agendamento criado',
    APPOINTMENT_UPDATED: 'Agendamento atualizado',
    APPOINTMENT_DELETED: 'Agendamento deletado',
    APPOINTMENT_LIST_VIEWED: 'Lista de agendamentos visualizada',
    TASK_CREATED: 'Tarefa criada',
    TASK_UPDATED: 'Tarefa atualizada',
    TASK_DELETED: 'Tarefa deletada',
    TASK_COMPLETED: 'Tarefa concluída',
    TASK_LIST_VIEWED: 'Lista de tarefas visualizada',
    TASK_TYPE_LIST_VIEWED: 'Lista de tipos de tarefas visualizada',
    LEAD_CREATED: 'Lead criado',
    LEAD_UPDATED: 'Lead atualizado',
    LEAD_LIST_VIEWED: 'Lista de leads visualizada',
    LEAD_FUNNEL_STEP_CHANGED: 'Etapa do funil do lead alterada',
    LEAD_CREDIT_ANALYSE_CREATED: 'Análise de crédito do lead criada',
    PROPERTY_VISIT_LIST_VIEWED: 'Lista de visitas a imóveis visualizada',
    TEAM_CREATED: 'Equipe criada',
    TEAM_DELETED: 'Equipe deletada',
    TEAM_LIST_VIEWED: 'Lista de equipes visualizada',
    TEAM_MEMBERS_VIEWED: 'Membros da equipe visualizados',
    TEAM_MEMBER_ADDED: 'Membro da equipe adicionado',
    TEAM_MEMBER_REMOVED: 'Membro da equipe removido',
    TEAM_UPDATED: 'Equipe atualizada',
    LEAD_PROPERTY_SIGNED: 'Propriedade do lead assinada',
    LEAD_PROPERTY_UNSIGNED: 'Propriedade do lead não assinada',
    LEAD_SUMMARY_CREATED: 'Resumo do lead criado',
    LEAD_PROPOSAL_CREATED: 'Proposta do lead criada',
    LEAD_PROPOSAL_STATUS_CHANGED: 'Status da proposta do lead alterado',
    LEAD_CREDIT_ANALYSE_UPDATED: 'Análise de crédito do lead atualizada',
    LEAD_CREDIT_ANALYSE_DELETED: 'Análise de crédito do lead deletada',
    LEAD_CREDIT_ANALYSE_DOCUMENT_UPLOADED: 'Documento da análise de crédito do lead enviado',
    LEAD_CREDIT_ANALYSE_DOCUMENT_DELETED: 'Documento da análise de crédito do lead deletado',
  };
  return labels[actionType] || String(actionType).replace(/_/g, ' ');
};

export const negotiationTypeLabels: Record<LeadNegotiationType, string> = {
  [LeadNegotiationType.COMPRA]: 'Compra',
  [LeadNegotiationType.ALUGUEL]: 'Aluguel',
  [LeadNegotiationType.LANCAMENTO]: 'Lançamento',
  [LeadNegotiationType.CAPTACAO]: 'Captação',
  [LeadNegotiationType.INDEFINIDO]: 'Indefinido',
};

export const participantTypeLabels: Record<CommissionAgentType, string> = {
  [CommissionAgentType.REALTOR]: 'Corretor',
  [CommissionAgentType.MANAGER]: 'Gestor',
  [CommissionAgentType.PARTNER]: 'Parceria Externa',
  [CommissionAgentType.CATCHER]: 'Captador',
};

export const proposalStatusColors: Record<LeadProposalStatus, string> = {
  [LeadProposalStatus.PENDING]: '#f59e0b',
  [LeadProposalStatus.ACCEPTED]: '#10b981',
  [LeadProposalStatus.REJECTED]: '#ef4444',
};

export const proposalStatusLabels: Record<LeadProposalStatus, string> = {
  [LeadProposalStatus.PENDING]: 'Pendente',
  [LeadProposalStatus.ACCEPTED]: 'Aceita',
  [LeadProposalStatus.REJECTED]: 'Recusada',
};

export const exchangeTypeLabels: Record<LeadPaymentExchangeType, string> = {
  [LeadPaymentExchangeType.PROPERTY]: 'Imóvel',
  [LeadPaymentExchangeType.VEHICLE]: 'Veículo',
  [LeadPaymentExchangeType.OTHER]: 'Outro',
};

export const priceIndexLabels: Record<LeadPaymentPriceIndex, string> = {
  [LeadPaymentPriceIndex.NO_INDEX]: 'Sem correção',
  [LeadPaymentPriceIndex.INCC]: 'INCC',
  [LeadPaymentPriceIndex.IPCA]: 'IPCA',
  [LeadPaymentPriceIndex.IGPM]: 'IGPM',
};

export const propertyFeatureTypeLabels: Record<PropertyFeatureType, string> = {
  [PropertyFeatureType.EXTERNAL]: 'Externo',
  [PropertyFeatureType.EXTRA]: 'Extra',
  [PropertyFeatureType.INTERNAL]: 'Interno',
  [PropertyFeatureType.LEISURE]: 'Lazer',
};

export const condominiumFeatureTypeLabels: Record<CondominiumFeatureType, string> = {
  [CondominiumFeatureType.EXTERNAL]: 'Externo',
  [CondominiumFeatureType.EXTRA]: 'Extra',
  [CondominiumFeatureType.INTERNAL]: 'Interno',
  [CondominiumFeatureType.LEISURE]: 'Lazer',
};

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: 'Segunda-feira',
  [DayOfWeek.TUESDAY]: 'Terça-feira',
  [DayOfWeek.WEDNESDAY]: 'Quarta-feira',
  [DayOfWeek.THURSDAY]: 'Quinta-feira',
  [DayOfWeek.FRIDAY]: 'Sexta-feira',
  [DayOfWeek.SATURDAY]: 'Sábado',
  [DayOfWeek.SUNDAY]: 'Domingo',
};

export const ALL_DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  // DayOfWeek.SATURDAY,
  // DayOfWeek.SUNDAY,
];

export const getNoteTypeLabel = (type: PropertyNoteType) => {
  const labels: Record<PropertyNoteType, string> = {
    [PropertyNoteType.OK]: 'OK',
    [PropertyNoteType.INFO]: 'Informação',
    [PropertyNoteType.ATENCAO]: 'Atenção',
    [PropertyNoteType.CRITICO]: 'Crítico',
  };
  return labels[type];
};

export const getNoteTypeVariant = (type: PropertyNoteType): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants = {
    [PropertyNoteType.OK]: 'default' as const,
    [PropertyNoteType.INFO]: 'secondary' as const,
    [PropertyNoteType.ATENCAO]: 'outline' as const,
    [PropertyNoteType.CRITICO]: 'destructive' as const,
  };
  return variants[type];
};

export const qualificationConfig = {
  [PropertyQualification.RECENT]: {
    label: 'Recente',
    color: '#22c55e',
    description: 'Imóveis com atualização recente',
  },
  [PropertyQualification.ATTENTION]: {
    label: 'Atenção',
    color: '#eab308',
    description: 'Imóveis precisando de atenção',
  },
  [PropertyQualification.URGENT]: {
    label: 'Urgente',
    color: '#ef4444',
    description: 'Imóveis urgentes para atualização',
  },
};

export const leadQualificationConfig: Record<LeadQualification, { label: string; color: string; description: string }> = {
  [LeadQualification.RECENT]: {
    label: 'Recente',
    color: '#22c55e',
    description: 'Leads com contato recente',
  },
  [LeadQualification.ATTENTION]: {
    label: 'Atenção',
    color: '#eab308',
    description: 'Leads precisando de atenção',
  },
  [LeadQualification.URGENT]: {
    label: 'Urgente',
    color: '#ef4444',
    description: 'Leads urgentes para contato',
  },
};

export const funnelStageLabels: Record<LeadFunnelStages, string> = {
  [LeadFunnelStages.PRE_ATENDIMENTO]: 'Pré-Atendimento',
  [LeadFunnelStages.EM_ATENDIMENTO]: 'Em Atendimento',
  [LeadFunnelStages.AGENDAMENTO]: 'Agendamento',
  [LeadFunnelStages.VISITA]: 'Visita',
  [LeadFunnelStages.PROPOSTA_ENVIADA]: 'Proposta Enviada',
  [LeadFunnelStages.EM_NEGOCIACAO]: 'Em Negociação',
  [LeadFunnelStages.NEGOCIO_FECHADO]: 'Negócio Fechado',
  [LeadFunnelStages.INDICACAO]: 'Indicação',
  [LeadFunnelStages.RECEITA_GERADA]: 'Receita Gerada',
  [LeadFunnelStages.POS_VENDA]: 'Pós-venda',
};

export const positionLabels: Record<OverlaySettingPosition, string> = {
  [OverlaySettingPosition.TOP_LEFT]: 'Superior esquerda',
  [OverlaySettingPosition.TOP_CENTER]: 'Superior centro',
  [OverlaySettingPosition.TOP_RIGHT]: 'Superior direita',
  [OverlaySettingPosition.MIDDLE_LEFT]: 'Meio esquerda',
  [OverlaySettingPosition.MIDDLE]: 'Meio',
  [OverlaySettingPosition.MIDDLE_RIGHT]: 'Meio direita',
  [OverlaySettingPosition.BOTTOM_LEFT]: 'Inferior esquerda',
  [OverlaySettingPosition.BOTTOM_CENTER]: 'Inferior centro',
  [OverlaySettingPosition.BOTTOM_RIGHT]: 'Inferior direita',
};

export const queueRuleLabels: Record<QueueRuleNames, string> = {
  [QueueRuleNames.LEAD_CITY]: 'Cidade',
  [QueueRuleNames.LEAD_KEYWORD]: 'Palavra-chave',
  [QueueRuleNames.LEAD_LIMIT_TYPE]: 'Tipo de Limite',
  [QueueRuleNames.LEAD_NEGOTIATION_TYPE]: 'Tipo de Negociação',
  [QueueRuleNames.LEAD_NEIGHBORHOOD]: 'Bairro',
  [QueueRuleNames.LEAD_ORIGIN_TYPE]: 'Tipo de Origem',
  [QueueRuleNames.LEAD_PRODUCT_PRICE]: 'Preço do Produto',
  [QueueRuleNames.LEAD_PROPERTY_CODE]: 'Código do Imóvel',
  [QueueRuleNames.LEAD_TAG]: 'Tag do Lead',
  [QueueRuleNames.LEAD_TEAM_CATCHER]: 'Equipe Captadora',
  [QueueRuleNames.LEAD_TITLE_TYPE]: 'Tipo de Título',
  [QueueRuleNames.LEAD_USER_CATCHER]: 'Usuário Captador',
  [QueueRuleNames.MEMORY_DAYS]: 'Dias de Memória',
};

export const captationStatusLabels: Record<CaptationStatus, string> = {
  [CaptationStatus.ACCEPTED]: 'Aceito',
  [CaptationStatus.EXPIRED]: 'Expirado',
  [CaptationStatus.PENDING]: 'Pendente',
  [CaptationStatus.REJECTED]: 'Rejeitado',
};

export const propertyConstructionStatusLabels: Record<PropertyConstructionStatus, string> = {
  [PropertyConstructionStatus.FINISHING]: 'Em Acabamento',
  [PropertyConstructionStatus.LAUNCH]: 'Lançamento',
  [PropertyConstructionStatus.PRE_LAUNCH]: 'Pré-Lançamento',
  [PropertyConstructionStatus.READY]: 'Pronto',
  [PropertyConstructionStatus.UNDER_CONSTRUCTION]: 'Em Construção',
};

export const propertyLaunchTypeLabels: Record<PropertyLaunchType, string> = {
  [PropertyLaunchType.HORIZONTAL]: 'Horizontal',
  [PropertyLaunchType.LOTS]: 'Lotes',
  [PropertyLaunchType.VERTICAL]: 'Vertical',
};

export const propertyPositionTypeLabels: Record<PropertyPositionType, string> = {
  [PropertyPositionType.BACK]: 'Fundo',
  [PropertyPositionType.FRONT]: 'Frente',
  [PropertyPositionType.MIDDLE]: 'Meio',
  [PropertyPositionType.SIDE]: 'Lateral',
};

export const propertySituationLabels: Record<PropertySituation, string> = {
  [PropertySituation.VAGO_DISPONIVEL]: 'Vago/Disponível',
  [PropertySituation.EM_REFORMA]: 'Em Reforma',
  [PropertySituation.OCUPADO]: 'Ocupado',
};

export const propertyDestinationLabels: Record<PropertyDestination, string> = {
  [PropertyDestination.RESIDENCIAL]: 'Residencial',
  [PropertyDestination.COMERCIAL]: 'Comercial',
  [PropertyDestination.INDUSTRIAL]: 'Industrial',
  [PropertyDestination.RURAL]: 'Rural',
};

export const funnelDirectionTypeLabels: Record<FunnelDirection, string> = {
  [FunnelDirection.INBOUND]: 'Inbound',
  [FunnelDirection.OUTBOUND]: 'Outbound',
};

export const leadStatusTypeLabels: Record<LeadStatusType, string> = {
  [LeadStatusType.ATIVO]: 'Ativo',
  [LeadStatusType.ARQUIVADO]: 'Arquivado',
};

export const propertyKeychainStatusLabels: Record<PropertyKeychainStatus, string> = {
  [PropertyKeychainStatus.ATIVO]: 'Ativo',
  [PropertyKeychainStatus.INATIVO]: 'Inativo',
  [PropertyKeychainStatus.MANUTENCAO]: 'Manutenção',
};

export const propertyKeychainStatusVariantsLabels: Record<
  PropertyKeychainStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [PropertyKeychainStatus.ATIVO]: 'default',
  [PropertyKeychainStatus.INATIVO]: 'destructive',
  [PropertyKeychainStatus.MANUTENCAO]: 'secondary',
};

export const distributionReportStatusLabels: Record<DistributionReportStatus, string> = {
  [DistributionReportStatus.ACCEPTED]: 'Aceito',
  [DistributionReportStatus.EXPIRED]: 'Expirado',
  [DistributionReportStatus.PENDING]: 'Pendente',
};

export const signStatusLabels: Record<PropertySignStatus, string> = {
  [PropertySignStatus.SOLICITADA]: 'Solicitada',
  [PropertySignStatus.INSTALADA]: 'Instalada',
  [PropertySignStatus.RETIRADA]: 'Retirada',
};

export const FREQUENCY_LABELS: Record<string, string> = {
  [NotificationFrequency.DAILY]: 'Diário',
  [NotificationFrequency.WEEKLY]: 'Semanal',
  [NotificationFrequency.MONTHLY]: 'Mensal',
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  [NotificationType.REMINDER]: 'Lembrete',
  [NotificationType.SUGGESTION]: 'Sugestão',
};

export const redistributionBatchStatusLabel: Record<RedistributionBatchJobItemStatus, string> = {
  [RedistributionBatchJobItemStatus.COMPLETED]: 'Concluído',
  [RedistributionBatchJobItemStatus.FAILED]: 'Falhou',
  [RedistributionBatchJobItemStatus.PENDING]: 'Pendente',
  [RedistributionBatchJobItemStatus.PROCESSING]: 'Processando',
};

export const DAYS_OF_WEEK = [
  { id: 'SUN', label: 'Dom' },
  { id: 'MON', label: 'Seg' },
  { id: 'TUE', label: 'Ter' },
  { id: 'WED', label: 'Qua' },
  { id: 'THU', label: 'Qui' },
  { id: 'FRI', label: 'Sex' },
  { id: 'SAT', label: 'Sáb' },
];

export const OPERATOR_OPTIONS = [
  { value: QueueRuleOperationTypes.CONTAINS, label: 'contém' },
  { value: QueueRuleOperationTypes.EQUALS, label: 'igual a' },
  { value: QueueRuleOperationTypes.GREATER_THAN, label: 'maior que' },
  { value: QueueRuleOperationTypes.LESS_THAN, label: 'menor que' },
];

export function getYearOptions(yearsBack = 3): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = 0; i <= yearsBack; i++) {
    years.push(currentYear - i);
  }
  return years;
}

// Função para gerar cor do gradiente baseado na porcentagem
export function getGradientColor(percentage: number): string {
  const primaryColor = { r: 255, g: 81, b: 6 }; // #ff5106
  const lightColor = { r: 255, g: 200, b: 180 }; // cor mais clara

  // Normaliza a porcentagem (0-1)
  const intensity = percentage / 100;

  // Interpola entre a cor clara e a cor primária
  const r = Math.round(lightColor.r + (primaryColor.r - lightColor.r) * intensity);
  const g = Math.round(lightColor.g + (primaryColor.g - lightColor.g) * intensity);
  const b = Math.round(lightColor.b + (primaryColor.b - lightColor.b) * intensity);

  // Converte para hexadecimal
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getTimeOneHourAhead(hours = 1) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return { hour: now.getHours(), minute: now.getMinutes(), second: 0 };
}

export function formatCatchErrorMessages(error: any): string[] {
  const errorMessage = error?.messagePtBr || error?.message || 'Ocorreu um erro inesperado.';
  const errorCode = error?.code;
  const list = [`${errorMessage} (${errorCode})`, error?.details];
  return list;
}

export function getElapsedTime(dateString: string): string {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function getCalculatedGrid(user: UserInformation | null, permissions: string[], startWith?: number) {
  const availablePermissionsCount = permissions.filter((permission) =>
    hasFeature(user?.userInfo.profile.permissions, permission),
  ).length;
  return `grid-cols-${startWith ? startWith + availablePermissionsCount : availablePermissionsCount}`;
}
