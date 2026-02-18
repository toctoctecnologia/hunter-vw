import { addDays, set } from 'date-fns';
import type { Event } from '@/types/event';
import type { Task } from '@/types/task';
import { MOCK_LEADS } from '@/mocks/leads';

const today = new Date();

const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);
const pickLead = (index: number) => MOCK_LEADS[index % MOCK_LEADS.length];

const eventTime = (offsetDays: number, hour: number, minute: number, durationMinutes: number) => {
  const start = set(addDays(today, offsetDays), { hours: hour, minutes: minute, seconds: 0, milliseconds: 0 });
  const end = addMinutes(start, durationMinutes);
  return { start, end };
};

const withLead = (index: number) => {
  const lead = pickLead(index);
  return {
    leadId: String(lead.id),
    leadName: lead.name,
    leadSummary: lead.summary,
    leadSource: lead.source,
    responsible: lead.ownerId,
  };
};

type EventBuilder = Omit<Event, 'id' | 'start' | 'end' | 'calendar'> & {
  calendar?: Event['calendar'];
  leadIndex?: number;
};

const buildEvent = (
  id: string,
  offsetDays: number,
  hour: number,
  minute: number,
  durationMinutes: number,
  extras: EventBuilder
): Event => {
  const { start, end } = eventTime(offsetDays, hour, minute, durationMinutes);
  const { leadIndex, ...rest } = extras;
  const leadData = typeof leadIndex === 'number' ? withLead(leadIndex) : {};

  return {
    id,
    eventId: id,
    start,
    end,
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    calendar: extras.calendar ?? 'personal',
    calendarName: 'Sistema',
    ...leadData,
    ...rest,
  };
};

export const mockEvents: Event[] = [
  buildEvent('event-today-1', 0, 9, 0, 60, {
    title: 'Visita com Lead Exemplo',
    description: 'Apresentação do imóvel e checklist de dúvidas',
    organizer: 'Você',
    calendar: 'personal',
    calendarName: 'Sistema',
    status: 'pending',
    type: 'visit',
    location: 'Rua das Flores, 120',
    leadIndex: 0,
  }),
  buildEvent('event-today-2', 0, 11, 0, 45, {
    title: 'Follow-up por telefone',
    description: 'Confirmar documentos enviados e próximos passos',
    organizer: 'Você',
    calendar: 'work',
    calendarName: 'Equipe',
    status: 'pending',
    type: 'task',
    leadIndex: 1,
  }),
  buildEvent('event-today-3', 0, 13, 0, 60, {
    title: 'Reunião interna de agenda',
    description: 'Organização das rotas de visitas do dia',
    organizer: 'Equipe Comercial',
    calendar: 'work',
    calendarName: 'Equipe',
    status: 'pending',
    type: 'info',
    location: 'Sala 3',
  }),
  buildEvent('event-today-4', 0, 15, 30, 60, {
    title: 'Tour guiado virtual',
    description: 'Compartilhar link da sala e apresentar planta',
    organizer: 'Você',
    calendar: 'google',
    calendarName: 'Pessoal',
    status: 'pending',
    type: 'visit',
    location: 'Videochamada',
    leadIndex: 2,
  }),
  buildEvent('event-today-5', 0, 18, 0, 45, {
    title: 'Ligação de alinhamento de proposta',
    description: 'Revisar valores e condições especiais',
    organizer: 'Você',
    calendar: 'personal',
    calendarName: 'Sistema',
    status: 'pending',
    type: 'service',
    leadIndex: 3,
  }),
  buildEvent('event-future-1', 1, 10, 0, 60, {
    title: 'Apresentação de proposta final',
    description: 'Enviar proposta e acordar prazo de resposta',
    organizer: 'Você',
    calendar: 'work',
    calendarName: 'Equipe',
    status: 'pending',
    type: 'service',
    negotiationId: 'NEG-2025-01',
    leadIndex: 4,
  }),
  buildEvent('event-future-2', 2, 16, 0, 90, {
    title: 'Visita presencial ao empreendimento',
    description: 'Mostrar áreas comuns e unidades modelo',
    organizer: 'Você',
    calendar: 'apple',
    calendarName: 'Pessoal',
    status: 'pending',
    type: 'visit',
    location: 'Av. Central, 500',
    leadIndex: 5,
  }),
  buildEvent('event-future-3', 5, 14, 0, 60, {
    title: 'Reunião com equipe comercial',
    description: 'Planejamento de campanhas da semana',
    organizer: 'Coordenação',
    calendar: 'work',
    calendarName: 'Equipe',
    status: 'pending',
    type: 'info',
  }),
  buildEvent('event-past-1', -1, 9, 30, 60, {
    title: 'Revisão de contrato e assinatura',
    description: 'Validar cláusulas finais',
    organizer: 'Você',
    calendar: 'personal',
    calendarName: 'Sistema',
    status: 'completed',
    type: 'service',
    location: 'Escritório Central',
    leadIndex: 6,
  }),
  buildEvent('event-past-2', -3, 17, 0, 45, {
    title: 'Follow-up pós assinatura',
    description: 'Registrar feedback e próximos passos',
    organizer: 'Você',
    calendar: 'work',
    calendarName: 'Equipe',
    status: 'completed',
    type: 'task',
    leadIndex: 1,
  }),
];

export const mockTasks: Task[] = (() => {
  const today = new Date();
  const addDaysToDate = (d: number) => {
    const date = new Date(today.getTime() + d * 86400000);
    return date.toISOString();
  };
  const now = new Date().toISOString();
  const emptyLead = { id: '0', nome: '' };
  return [
    {
      id: 'mock-1',
      title: 'Fazer ligação de boas-vindas',
      notes: 'Entrar em contato com o lead',
      type: 'call',
      lead: emptyLead,
      dueAt: addDaysToDate(0),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock-2',
      title: 'Enviar e-mail de apresentação',
      notes: 'Apresentar serviços',
      type: 'email',
      lead: emptyLead,
      dueAt: addDaysToDate(1),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock-3',
      title: 'Agendar visita',
      notes: 'Combinar data com o cliente',
      type: 'visit',
      lead: emptyLead,
      dueAt: addDaysToDate(2),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock-4',
      title: 'Preparar documentos',
      type: 'other',
      lead: emptyLead,
      dueAt: addDaysToDate(3),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock-5',
      title: 'Atualizar status no CRM',
      type: 'other',
      lead: emptyLead,
      dueAt: addDaysToDate(4),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'mock-6',
      title: 'Revisar contratos',
      notes: 'Verificar termos pendentes',
      type: 'other',
      lead: emptyLead,
      dueAt: addDaysToDate(5),
      status: 'todo',
      reminders: [],
      createdAt: now,
      updatedAt: now,
    }
  ];
})();
