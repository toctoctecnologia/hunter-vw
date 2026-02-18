import { addDays, set } from 'date-fns';
import type { AgendaTask } from '@/types/agenda';
import type { Event } from '@/types/event';

export const USE_MOCK_TASKS = true;

export interface AgendaLeadMock {
  leadId: string;
  leadName: string;
  leadStage: string;
  productOrServiceTitle: string;
  interestSummary: string;
  origin: string;
  tagOrigin?: string;
  intensityLevel?: string;
  nextActionTitle?: string;
  nextActionDueAt?: string;
  negotiationId?: string;
}

export interface AgendaNegotiationMock {
  negotiationId: string;
  title: string;
  stage: string;
  updatedAt: string;
  value: string;
}

const today = new Date();

const dateWithTime = (offsetDays: number, hour: number, minute: number) =>
  set(addDays(today, offsetDays), {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0
  }).toISOString();

export const agendaLeadsMock: AgendaLeadMock[] = [
  {
    leadId: 'l1',
    leadName: 'Maria Santos',
    leadStage: 'Pré atendimento',
    productOrServiceTitle: 'Casa Jardim Paulista',
    interestSummary: 'Procura casa com jardim amplo',
    origin: 'Site',
    tagOrigin: 'Site',
    intensityLevel: 'Alta',
    nextActionTitle: 'Visita confirmada',
    nextActionDueAt: dateWithTime(0, 11, 30),
    negotiationId: 'neg-1001'
  },
  {
    leadId: 'l2',
    leadName: 'Carlos Oliveira',
    leadStage: 'Em atendimento',
    productOrServiceTitle: 'Apartamento Vila Madalena',
    interestSummary: 'Busca primeiro imóvel, 2 dorms',
    origin: 'Instagram Leads',
    tagOrigin: 'Instagram',
    intensityLevel: 'Média',
    nextActionTitle: 'Enviar proposta revisada',
    nextActionDueAt: dateWithTime(0, 17, 0),
    negotiationId: 'neg-1002'
  },
  {
    leadId: 'l3',
    leadName: 'Ana Costa',
    leadStage: 'Pré atendimento',
    productOrServiceTitle: 'Sala Comercial Faria Lima',
    interestSummary: 'Investimento em sala pronta',
    origin: 'Indicação',
    tagOrigin: 'Indicação',
    intensityLevel: 'Alta',
    nextActionTitle: 'Retornar com condições',
    nextActionDueAt: dateWithTime(1, 10, 0)
  },
  {
    leadId: 'l4',
    leadName: 'Juliana Lima',
    leadStage: 'Visita agendada',
    productOrServiceTitle: 'Cobertura Mooca',
    interestSummary: 'Cobertura duplex com área gourmet',
    origin: 'WhatsApp',
    tagOrigin: 'WhatsApp',
    intensityLevel: 'Alta',
    nextActionTitle: 'Visita presencial',
    nextActionDueAt: dateWithTime(2, 16, 0)
  },
  {
    leadId: 'l5',
    leadName: 'Roberto Silva',
    leadStage: 'Proposta enviada',
    productOrServiceTitle: 'Casa Alto de Pinheiros',
    interestSummary: 'Casa alto padrão 5 suítes',
    origin: 'Internet',
    tagOrigin: 'Portal',
    intensityLevel: 'Alta',
    nextActionTitle: 'Revisar proposta',
    nextActionDueAt: dateWithTime(-1, 18, 0),
    negotiationId: 'neg-1003'
  },
  {
    leadId: 'l6',
    leadName: 'Paula Freitas',
    leadStage: 'Pré atendimento',
    productOrServiceTitle: 'Loft Centro',
    interestSummary: 'Busca loft para investimento',
    origin: 'Site',
    tagOrigin: 'Site',
    intensityLevel: 'Média',
    nextActionTitle: 'Follow-up inicial',
    nextActionDueAt: dateWithTime(3, 9, 0)
  }
];

export const agendaNegotiationsMock: AgendaNegotiationMock[] = [
  {
    negotiationId: 'neg-1001',
    title: 'Negociação Casa Jardim Paulista',
    stage: 'Proposta enviada',
    updatedAt: dateWithTime(0, 8, 0),
    value: 'R$ 1.250.000'
  },
  {
    negotiationId: 'neg-1002',
    title: 'Apartamento Vila Madalena',
    stage: 'Em negociação',
    updatedAt: dateWithTime(-1, 19, 0),
    value: 'R$ 780.000'
  },
  {
    negotiationId: 'neg-1003',
    title: 'Casa Alto de Pinheiros',
    stage: 'Proposta revisada',
    updatedAt: dateWithTime(-2, 14, 30),
    value: 'R$ 2.300.000'
  }
];

const sharedDescription =
  'Proposta, R$ 640.000,00, à vista. Obs: proposta aceita pela proprietária. Comissão 5%. Venda em parceria com a Imobile. Eles irão rodar contrato.';

export const agendaTasksMock: AgendaTask[] = [
  // Today (5)
  {
    id: 'task-1',
    taskId: 'task-1',
    title: 'Retornar proposta de financiamento',
    type: 'proposta',
    description: sharedDescription,
    dueAt: dateWithTime(0, 9, 0),
    status: 'today',
    done: false,
    leadId: 'l1',
    channel: 'WhatsApp',
    source: 'Site',
    ownerName: 'Responsável Ana',
    team: 'Equipe Comercial',
    origin: 'Site',
    isFavorite: true,
    priorityColor: '#FF6B00',
    negotiationId: 'neg-1001',
    stage: 'proposta',
    stageDescription: 'Proposta enviada para assinatura',
    qualifications: [
      'Proposta aceita pela proprietária',
      'Comissão 5%',
      'Venda em parceria com a Imobile',
      'Contrato pronto para rodar'
    ]
  },
  {
    id: 'task-2',
    taskId: 'task-2',
    title: 'Visita agendada no Jardim Paulista',
    type: 'visit',
    dueAt: dateWithTime(0, 11, 30),
    status: 'today',
    done: false,
    leadId: 'l1',
    channel: 'Internet',
    source: 'Instagram Leads',
    ownerName: 'Corretor Marcos',
    team: 'Equipe Comercial',
    origin: 'Instagram',
    priorityColor: '#6366F1',
    isFavorite: true,
    stage: 'visita',
    stageDescription: 'Visita confirmada com cliente e proprietário',
    qualifications: ['Lead qualificado', 'Rota definida', 'Chave no stand']
  },
  {
    id: 'task-3',
    taskId: 'task-3',
    title: 'Preparar proposta revisada',
    type: 'proposta',
    description: sharedDescription,
    dueAt: dateWithTime(0, 14, 0),
    status: 'today',
    done: false,
    leadId: 'l2',
    channel: 'Telefone',
    source: 'Instagram Leads',
    ownerName: 'Responsável Pedro',
    team: 'Equipe Comercial',
    origin: 'Instagram',
    priorityColor: 'hsl(var(--accentSoft))',
    negotiationId: 'neg-1002',
    stage: 'proposta',
    stageDescription: 'Proposta revisada aguardando retorno',
    qualifications: ['Valores alinhados', 'Documentação checada']
  },
  {
    id: 'task-4',
    taskId: 'task-4',
    title: 'Follow-up pós tour virtual',
    type: 'follow-up',
    dueAt: dateWithTime(0, 17, 0),
    status: 'today',
    done: false,
    leadId: 'l2',
    channel: 'Telefone',
    source: 'Instagram Leads',
    ownerName: 'Responsável Pedro',
    team: 'Equipe Comercial',
    origin: 'Instagram',
    priorityColor: '#0EA5E9',
    stage: 'agendamento',
    stageDescription: 'Aguardando cliente confirmar visita presencial',
    qualifications: ['Tour virtual realizado', 'Lead em decisão']
  },
  {
    id: 'task-5',
    taskId: 'task-5',
    title: 'Checklist de documentos do lead',
    type: 'document',
    dueAt: dateWithTime(0, 18, 30),
    status: 'today',
    done: false,
    channel: 'Site',
    source: 'Indicação',
    ownerName: 'Equipe Documental',
    team: 'Equipe Documental',
    origin: 'Indicação',
    priorityColor: '#14B8A6',
    stage: 'agendamento',
    stageDescription: 'Documentos separados para envio',
    qualifications: ['Documentos recebidos', 'Checklist prévia pronta']
  },
  // Overdue (3)
  {
    id: 'task-6',
    taskId: 'task-6',
    title: 'Visita atrasada - Cobertura Mooca',
    type: 'visit',
    dueAt: dateWithTime(-1, 16, 0),
    status: 'overdue',
    done: false,
    leadId: 'l4',
    channel: 'WhatsApp',
    source: 'WhatsApp',
    ownerName: 'Corretora Bianca',
    team: 'Equipe Comercial',
    origin: 'WhatsApp',
    priorityColor: '#A855F7',
    stage: 'visita',
    stageDescription: 'Visita atrasada aguardando reagendamento',
    qualifications: ['Cliente avisado', 'Disponibilidade do proprietário']
  },
  {
    id: 'task-7',
    taskId: 'task-7',
    title: 'Revisar contrato comercial',
    type: 'document',
    dueAt: dateWithTime(-2, 10, 30),
    status: 'overdue',
    done: false,
    channel: 'Email',
    source: 'Portal',
    ownerName: 'Jurídico Carla',
    team: 'Equipe Jurídica',
    origin: 'Portal',
    priorityColor: '#FB923C',
    stage: 'proposta',
    stageDescription: 'Aguardando revisão jurídica',
    qualifications: ['Minuta enviada', 'Pendência de assinatura']
  },
  {
    id: 'task-8',
    taskId: 'task-8',
    title: 'Follow-up com proprietário',
    type: 'follow-up',
    dueAt: dateWithTime(-3, 9, 0),
    status: 'overdue',
    done: false,
    channel: 'Telefone',
    source: 'Indicação',
    ownerName: 'Responsável Ana',
    team: 'Equipe Comercial',
    origin: 'Indicação',
    priorityColor: '#F59E0B',
    stage: 'agendamento',
    stageDescription: 'Follow-up para reagendar visita',
    qualifications: ['Lead quente', 'Preferência de manhã']
  },
  // Future (2)
  {
    id: 'task-9',
    taskId: 'task-9',
    title: 'Visita ao empreendimento central',
    type: 'visit',
    dueAt: dateWithTime(2, 10, 0),
    status: 'future',
    done: false,
    leadId: 'l4',
    channel: 'Internet',
    source: 'Site',
    ownerName: 'Corretora Bianca',
    team: 'Equipe Comercial',
    origin: 'Site',
    priorityColor: '#22C55E',
    stage: 'visita',
    stageDescription: 'Visita futura confirmada',
    qualifications: ['Lead qualificado', 'Material enviado']
  },
  {
    id: 'task-10',
    taskId: 'task-10',
    title: 'Prospecção fria - lista atualizada',
    type: 'tarefa',
    dueAt: dateWithTime(3, 9, 30),
    status: 'future',
    done: false,
    channel: 'Telefone',
    source: 'CRM',
    ownerName: 'SDR Camila',
    team: 'Equipe SDR',
    origin: 'CRM',
    priorityColor: '#2563EB',
    stage: 'agendamento',
    stageDescription: 'Prospecção inicial para gerar visitas',
    qualifications: ['Lista atualizada', 'Script validado']
  },
  // Done (2)
  {
    id: 'task-11',
    taskId: 'task-11',
    title: 'Registrar feedback da visita',
    type: 'message',
    dueAt: dateWithTime(-1, 12, 0),
    status: 'done',
    done: true,
    leadId: 'l5',
    channel: 'WhatsApp',
    source: 'Internet',
    ownerName: 'Responsável Pedro',
    team: 'Equipe Comercial',
    origin: 'Internet',
    priorityColor: '#6B7280',
    stage: 'proposta',
    stageDescription: 'Feedback coletado e registrado',
    qualifications: ['Visita concluída', 'Cliente em análise']
  },
  {
    id: 'task-12',
    taskId: 'task-12',
    title: 'Checklist enviado ao cliente',
    type: 'email',
    dueAt: dateWithTime(-2, 18, 0),
    status: 'done',
    done: true,
    leadId: 'l6',
    channel: 'Email',
    source: 'Site',
    ownerName: 'Equipe Documental',
    team: 'Equipe Documental',
    origin: 'Site',
    priorityColor: '#9CA3AF',
    stage: 'agendamento',
    stageDescription: 'Checklist enviado e aguardando retorno',
    qualifications: ['Documentos enviados', 'Cliente ciente dos prazos']
  }
];

export const agendaEventsMock: Event[] = [
  {
    id: 'event-1',
    eventId: 'event-1',
    title: 'Visita com Maria Santos',
    start: new Date(dateWithTime(0, 10, 0)),
    end: new Date(dateWithTime(0, 11, 0)),
    description: 'Apresentar casa com jardim e validar pontos chave',
    calendar: 'personal',
    status: 'pending',
    type: 'visit',
    leadId: 'l1',
    leadName: 'Maria Santos',
    ownerName: 'Corretor Marcos',
    responsible: 'Corretor Marcos',
    team: 'Equipe Comercial'
  },
  {
    id: 'event-2',
    eventId: 'event-2',
    title: 'Reunião interna de agenda',
    start: new Date(dateWithTime(0, 13, 30)),
    end: new Date(dateWithTime(0, 14, 30)),
    description: 'Organizar rotas de visitas e prioridades',
    calendar: 'work',
    status: 'pending',
    type: 'info',
    ownerName: 'Equipe Comercial',
    responsible: 'Equipe Comercial',
    team: 'Equipe Comercial'
  },
  {
    id: 'event-3',
    eventId: 'event-3',
    title: 'Entrega de proposta Carlos',
    start: new Date(dateWithTime(0, 17, 0)),
    end: new Date(dateWithTime(0, 17, 45)),
    description: 'Confirmar valores e condições',
    calendar: 'personal',
    status: 'pending',
    type: 'service',
    leadId: 'l2',
    leadName: 'Carlos Oliveira',
    negotiationId: 'neg-1002',
    ownerName: 'Responsável Pedro',
    responsible: 'Responsável Pedro',
    team: 'Equipe Comercial'
  },
  {
    id: 'event-4',
    eventId: 'event-4',
    title: 'Visita futura Cobertura',
    start: new Date(dateWithTime(2, 16, 0)),
    end: new Date(dateWithTime(2, 17, 30)),
    description: 'Tour completo na cobertura',
    calendar: 'personal',
    status: 'pending',
    type: 'visit',
    leadId: 'l4',
    leadName: 'Juliana Lima',
    ownerName: 'Corretora Bianca',
    responsible: 'Corretora Bianca',
    team: 'Equipe Comercial'
  },
  {
    id: 'event-5',
    eventId: 'event-5',
    title: 'Follow-up concluído',
    start: new Date(dateWithTime(-1, 18, 0)),
    end: new Date(dateWithTime(-1, 18, 30)),
    description: 'Registrar feedback e concluir agenda',
    calendar: 'work',
    status: 'completed',
    type: 'task',
    ownerName: 'Responsável Pedro',
    responsible: 'Responsável Pedro',
    team: 'Equipe Comercial'
  }
];

export const agendaUsersMock = Array.from(
  new Set(agendaTasksMock.map(task => task.ownerName).filter(Boolean) as string[])
);
