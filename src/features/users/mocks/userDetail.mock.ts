import { KpiDetalhado, AuditEvent, UserHealthSnapshot } from '../types';
import { mockUserLastSales } from './userLastSales.mock';

export const mockUserMetrics: KpiDetalhado = {
  resumo: {
    captacoes: 12,
    vendasQtd: 5,
    vendasValorTotal: 4978000,
    leadsRecebidos: 180,
    vendas: 5,
    visitas: 68,
    propostas: 15,
    ticketMedio: 995600,
    tempoMedioFechamentoDias: 36,
    taxaFollowUp: 0.82,
    agendaCumprida: 0.91,
    tempoMedioRespostaMin: 14,
    usoFerramentasScore: 0.88,
    nps: 8.5,
    indicacoes: 3,
    retencoes: 2,
  },
  
  funilConversao: {
    leads: 180,
    visitas: 68,
    propostas: 15,
    vendas: 5,
  },
  
  vacancia: [
    { mes: '2024-12', vendeu: false, vendasQtd: 0 },
    { mes: '2025-01', vendeu: true, vendasQtd: 2 },
    { mes: '2025-02', vendeu: true, vendasQtd: 1 },
    { mes: '2025-03', vendeu: false, vendasQtd: 0 },
    { mes: '2025-04', vendeu: true, vendasQtd: 1 },
    { mes: '2025-05', vendeu: true, vendasQtd: 1 },
    { mes: '2025-06', vendeu: false, vendasQtd: 0 },
  ],
  
  ultimasVendas: mockUserLastSales,
  
  ultimasIndicacoes: [
    {
      nome: 'Carlos Lima',
      origem: 'Helena Almeida',
      data: '2025-07-29',
    },
    {
      nome: 'Marina Santos',
      origem: 'Cliente Anterior',
      data: '2025-07-25',
    },
    {
      nome: 'Roberto Silva',
      origem: 'Parceiro Imobiliário',
      data: '2025-07-20',
    }
  ],
  
  ultimosFeedbacks: [
    {
      cliente: 'Helena Almeida',
      imovel: 'Falcon Tower • Apto',
      data: '2025-07-23',
      estrelas: 4,
      comentario: 'Atendimento ágil e claro.',
    },
    {
      cliente: 'João Silva',
      imovel: 'Torre Premium • Cobertura',
      data: '2025-07-18',
      estrelas: 5,
      comentario: 'Excelente profissional, muito atencioso e conhece bem o mercado.',
    },
    {
      cliente: 'Maria Costa',
      imovel: 'Residencial Park • Casa',
      data: '2025-07-10',
      estrelas: 4,
      comentario: 'Processo de compra muito tranquilo, recomendo!',
    }
  ],
};

export const mockUserAudit: AuditEvent[] = [
  {
    id: '1',
    ts: '2025-08-29T10:30:00Z',
    type: 'login',
    label: 'Login no sistema',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { userAgent: 'Chrome/120.0.0.0', device: 'Desktop' }
  },
  {
    id: '2',
    ts: '2025-08-29T10:25:00Z',
    type: 'view_property',
    label: 'Visualizou imóvel',
    targetId: 'prop_2702',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { propertyType: 'apartment', value: 4978000 }
  },
  {
    id: '3',
    ts: '2025-08-29T10:20:00Z',
    type: 'download_photos',
    label: 'Download de fotos',
    targetId: 'prop_2702',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { photoCount: 15, format: 'jpg' }
  },
  {
    id: '4',
    ts: '2025-08-29T09:45:00Z',
    type: 'schedule_visit',
    label: 'Agendou visita',
    targetId: 'prop_2702',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { visitDate: '2025-08-30T14:00:00Z', clientName: 'Helena Almeida' }
  },
  {
    id: '5',
    ts: '2025-08-29T09:30:00Z',
    type: 'view_owner_phone',
    label: 'Visualizou telefone do proprietário',
    targetId: 'owner_123',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { ownerName: 'João Silva' }
  },
  {
    id: '6',
    ts: '2025-08-28T16:20:00Z',
    type: 'lead_update',
    label: 'Atualizou lead',
    targetId: 'lead_456',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { previousStatus: 'contacted', newStatus: 'qualified' }
  },
  {
    id: '7',
    ts: '2025-08-28T15:10:00Z',
    type: 'upload_photos',
    label: 'Upload de fotos',
    targetId: 'prop_789',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { photoCount: 8, totalSize: '12.5MB' }
  },
  {
    id: '8',
    ts: '2025-08-28T14:30:00Z',
    type: 'share_listing',
    label: 'Compartilhou anúncio',
    targetId: 'prop_2702',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { platform: 'WhatsApp', recipients: 3 }
  },
  {
    id: '9',
    ts: '2025-08-28T11:15:00Z',
    type: 'export_csv',
    label: 'Exportou relatório CSV',
    actorUserId: '1',
    ip: '192.168.1.100',
    meta: { reportType: 'leads', recordCount: 150 }
  },
  {
    id: '10',
    ts: '2025-08-27T17:45:00Z',
    type: 'login',
    label: 'Login no sistema',
    actorUserId: '1',
    ip: '192.168.1.101',
    meta: { userAgent: 'Chrome/120.0.0.0', device: 'Mobile' }
  }
];

export const mockUserHealthSnapshot: UserHealthSnapshot = {
  updatedAt: '2025-08-29T10:00:00Z',
  nextCheckpointAt: '2025-08-30T13:00:00Z',
  suspendLeadsUntil: '2025-08-29T18:00:00Z',
  suspendRoletaoUntil: null,
  checkpointReason: 'Revisão de performance semanal para ajustar prioridades de follow-up.',
  leads: [
    {
      id: 'ativos',
      label: 'Leads ativos',
      value: 128,
      color: '#2563eb',
      description: 'Contatos com follow-up recente (≤ 7 dias)',
    },
    {
      id: 'prioritarios',
      label: 'Prioritários',
      value: 46,
      color: '#16a34a',
      description: 'Leads com alta propensão a fechar',
    },
    {
      id: 'reengajar',
      label: 'Reengajar',
      value: 32,
      color: 'hsl(var(--accentSoft))',
      description: 'Sem contato há mais de 15 dias',
    },
  ],
  imoveis: [
    {
      id: 'publicados',
      label: 'Imóveis publicados',
      value: 45,
      color: '#7c3aed',
      description: 'Disponíveis em portais e site',
    },
    {
      id: 'exclusivos',
      label: 'Exclusivos',
      value: 18,
      color: '#facc15',
      description: 'Com contrato de exclusividade ativo',
    },
    {
      id: 'ajuste',
      label: 'Ajustar',
      value: 9,
      color: '#ef4444',
      description: 'Precisam atualizar preço/fotos',
    },
  ],
  tarefas: [
    {
      id: 'tasks-concluido',
      label: 'Concluído',
      value: 11,
      color: 'hsl(var(--success))',
      description: 'Tarefas executadas no prazo',
      href: '/agenda?tab=tasks',
      range: 'concluido',
    },
    {
      id: 'tasks-pendente',
      label: 'Pendente',
      value: 4,
      color: 'hsl(var(--warning))',
      description: 'Ações em andamento e dentro do SLA',
      href: '/agenda?tab=tasks',
      range: 'pendente',
    },
    {
      id: 'tasks-atrasado',
      label: 'Atrasado',
      value: 2,
      color: 'hsl(var(--danger))',
      description: 'Tarefas sem conclusão há mais de 7 dias',
      href: '/agenda?tab=tasks',
      range: 'atrasado',
    },
  ],
  roletao: {
    defaultPeriod: '7d',
    periods: {
      '7d': {
        banner: {
          claimed: 42,
          awaitingToday: 9,
        },
        avgAdvanceTime: 6,
        convRate: 0.28,
        activeParticipation: 0.74,
        claimsPerDay: 6,
      },
      '15d': {
        banner: {
          claimed: 88,
          awaitingToday: 14,
        },
        avgAdvanceTime: 7,
        convRate: 0.26,
        activeParticipation: 0.7,
        claimsPerDay: 5.87,
      },
      '30d': {
        banner: {
          claimed: 180,
          awaitingToday: 21,
        },
        avgAdvanceTime: 8,
        convRate: 0.24,
        activeParticipation: 0.66,
        claimsPerDay: 6,
      },
    },
    custom: {
      range: null,
      metrics: null,
    },
  },
  automations: {
    autoEnforceHealthLeads: false,
    autoEnforceRoletao: false,
    canReceiveNewLeads: true,
    canClaimRoletao: true,
    toggles: [
      {
        id: 'auto-receive-leads',
        title: 'Receber leads automaticamente',
        description:
          'Ative para que novos leads entrem direto na carteira assim que chegam, conforme os critérios definidos. Desative para pausar o recebimento automático.',
        href: '/distribuicao',
        enabled: true,
      },
      {
        id: 'roletao-auto-claim',
        title: 'Pegar leads no roletão',
        description: 'Ative para disputar leads no roletão; inativo envia o lead para o próximo da fila.',
        href: '/gestao-roletao',
        enabled: true,
      },
    ],
    pills: [
      {
        id: 'auto-receive-leads',
        message: 'Liberado',
        variant: 'success',
        reason: 'Recebimento automático ativo: novos leads entram direto na carteira assim que chegam.',
      },
      {
        id: 'roletao-auto-claim',
        message: 'Participando',
        variant: 'success',
        reason: 'Corretor habilitado a disputar leads no roletão automático; se desativar, o lead segue para o próximo da fila.',
      },
    ],
    enforcementReasons: [],
  },
  checkpoint: {
    nextCheckpointAt: '2025-08-30T13:00:00Z',
    suspendLeadsUntil: '2025-08-29T18:00:00Z',
    suspendRoletaoUntil: null,
    reason: 'Revisão de performance semanal para ajustar prioridades de follow-up.',
  },
};
