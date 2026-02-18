import { addHours, subDays, addDays } from 'date-fns';
import type { Ticket, User } from '@/types/service-management';

const team: User[] = [
  {
    id: 'user-1',
    name: 'Paula Mendes',
    avatarUrl: '/uploads/6af569d2-dc3a-4668-8d4f-843a7c62507d.png',
    role: 'Coordenação'
  },
  {
    id: 'user-2',
    name: 'Bruno Silva',
    avatarUrl: '/uploads/ed0a4b9c-2f78-4d72-8d20-31cf3a3a1d54.png',
    role: 'Suporte'
  },
  {
    id: 'user-3',
    name: 'Camila Rocha',
    avatarUrl: '/uploads/9b2f91d5-2a29-4e15-bab4-31e2d8b7b1d9.png',
    role: 'Suporte'
  },
  {
    id: 'user-4',
    name: 'Diego Santos',
    avatarUrl: '/uploads/3d0a4b9c-12f7-4f9a-8d20-31cf3a3a1d99.png',
    role: 'Produtos'
  }
];

const now = new Date();

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    code: 'SRV1234',
    title: 'Atualizar domínio do cliente nas integrações',
    description: 'Cliente solicitou a troca do domínio em todos os pontos do sistema e disparos.',
    clientId: 'client-aurora',
    clientName: 'Residencial Aurora',
    category: 'Integrações',
    priority: 'alta',
    status: 'pendente',
    origin: 'plataforma',
    slaHours: 48,
    createdAt: subDays(now, 2).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    dueAt: addHours(subDays(now, 2), 48).toISOString(),
    tags: ['domínio', 'integração'],
    assigneeId: team[1].id,
    assigneeName: team[1].name,
    hasSchedule: true,
    scheduleStart: addDays(now, 1).toISOString(),
    scheduleEnd: addDays(now, 1.5).toISOString(),
    scheduleLocation: 'Reunião online',
    scheduleNotes: 'Confirmar responsáveis técnicos do cliente.',
    comments: [],
    attachments: [],
    history: [
      {
        id: 'hist-1',
        type: 'created',
        description: 'Ticket criado via plataforma.',
        createdAt: subDays(now, 2).toISOString(),
        author: team[0]
      }
    ]
  },
  {
    id: 'ticket-2',
    code: 'SRV1235',
    title: 'Orçamento para landing de lançamento',
    description: 'Solicitação de orçamento para criação de página de lançamento com prazo de 20 dias.',
    clientId: 'client-premium',
    clientName: 'Premium Brokers',
    category: 'Design',
    priority: 'media',
    status: 'orcamento',
    origin: 'email',
    slaHours: 72,
    createdAt: subDays(now, 4).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
    dueAt: addHours(subDays(now, 4), 72).toISOString(),
    tags: ['landing', 'orçamento'],
    assigneeId: team[3].id,
    assigneeName: team[3].name,
    hasSchedule: false,
    comments: [],
    attachments: [],
    history: [
      {
        id: 'hist-2',
        type: 'created',
        description: 'Ticket criado via email.',
        createdAt: subDays(now, 4).toISOString(),
        author: team[0]
      }
    ]
  },
  {
    id: 'ticket-3',
    code: 'SRV1236',
    title: 'Ajuste de SLA para cliente VIP',
    description: 'Rever os prazos de SLA e adicionar prioridade máxima para o cliente.',
    clientId: 'client-horizonte',
    clientName: 'Grupo Horizonte',
    category: 'Operações',
    priority: 'urgente',
    status: 'em_andamento',
    origin: 'whatsapp',
    slaHours: 24,
    createdAt: subDays(now, 1).toISOString(),
    updatedAt: addHours(subDays(now, 1), 6).toISOString(),
    dueAt: addHours(subDays(now, 1), 24).toISOString(),
    tags: ['sla', 'vip'],
    assigneeId: team[2].id,
    assigneeName: team[2].name,
    hasSchedule: true,
    scheduleStart: addHours(now, 6).toISOString(),
    scheduleEnd: addHours(now, 8).toISOString(),
    scheduleLocation: 'Sala 2 - Escritório',
    scheduleNotes: 'Revisar SLA em conjunto com o cliente.',
    comments: [
      {
        id: 'comment-1',
        author: team[2],
        message: 'Em contato com o cliente para confirmar o novo SLA.',
        createdAt: addHours(subDays(now, 1), 6).toISOString(),
        internal: true
      }
    ],
    attachments: [],
    history: [
      {
        id: 'hist-3',
        type: 'created',
        description: 'Ticket criado via WhatsApp.',
        createdAt: subDays(now, 1).toISOString(),
        author: team[0]
      }
    ]
  },
  {
    id: 'ticket-4',
    code: 'SRV1237',
    title: 'Treinamento da equipe de atendimento',
    description: 'Agendar treinamento para o time de atendimento sobre o novo módulo.',
    clientId: 'client-prime',
    clientName: 'Imob Prime',
    category: 'Treinamento',
    priority: 'baixa',
    status: 'resolvido',
    origin: 'telefone',
    slaHours: 96,
    createdAt: subDays(now, 6).toISOString(),
    updatedAt: subDays(now, 2).toISOString(),
    dueAt: addHours(subDays(now, 6), 96).toISOString(),
    tags: ['treinamento'],
    assigneeId: team[1].id,
    assigneeName: team[1].name,
    resolvedAt: subDays(now, 2).toISOString(),
    hasSchedule: false,
    comments: [],
    attachments: [],
    history: [
      {
        id: 'hist-4',
        type: 'status',
        description: 'Ticket resolvido e treinamento confirmado.',
        createdAt: subDays(now, 2).toISOString(),
        author: team[1]
      }
    ]
  },
  {
    id: 'ticket-5',
    code: 'SRV1238',
    title: 'Revisão de plano e migração',
    description: 'Cliente deseja migrar para o plano Enterprise com ajustes contratuais.',
    clientId: 'client-aspen',
    clientName: 'Grupo Aspen',
    category: 'Planos',
    priority: 'alta',
    status: 'pendente',
    origin: 'plataforma',
    slaHours: 48,
    createdAt: subDays(now, 3).toISOString(),
    updatedAt: subDays(now, 3).toISOString(),
    dueAt: addHours(subDays(now, 3), 48).toISOString(),
    tags: ['migração', 'contrato'],
    assigneeId: team[3].id,
    assigneeName: team[3].name,
    hasSchedule: false,
    comments: [],
    attachments: [],
    history: [
      {
        id: 'hist-5',
        type: 'created',
        description: 'Ticket criado via plataforma.',
        createdAt: subDays(now, 3).toISOString(),
        author: team[0]
      }
    ]
  },
  {
    id: 'ticket-6',
    code: 'SRV1239',
    title: 'Ticket descartado por duplicidade',
    description: 'Solicitação duplicada, manter apenas o ticket SRV1234.',
    clientId: 'client-aurora',
    clientName: 'Residencial Aurora',
    category: 'Operações',
    priority: 'media',
    status: 'arquivado',
    origin: 'email',
    slaHours: 48,
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 4).toISOString(),
    dueAt: addHours(subDays(now, 5), 48).toISOString(),
    tags: ['duplicado'],
    assigneeId: team[1].id,
    assigneeName: team[1].name,
    archivedAt: subDays(now, 4).toISOString(),
    hasSchedule: false,
    comments: [],
    attachments: [],
    history: [
      {
        id: 'hist-6',
        type: 'status',
        description: 'Ticket arquivado por duplicidade.',
        createdAt: subDays(now, 4).toISOString(),
        author: team[1]
      }
    ]
  }
];

export const mockUsers = team;
