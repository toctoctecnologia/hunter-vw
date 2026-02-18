import type { AgendaTask } from '@/types/agenda';
import { MOCK_LEADS } from '@/mocks/leads';
import { addDays, set } from 'date-fns';

const today = new Date();

function dateWithTime(base: Date, hours: number, minutes: number) {
  return set(base, { hours, minutes, seconds: 0, milliseconds: 0 }).toISOString();
}

function buildTask({
  id,
  leadIndex,
  offsetDays,
  hours,
  minutes,
  ...rest
}: Omit<AgendaTask, 'dueAt' | 'leadId' | 'leadName' | 'leadSummary' | 'leadSource' | 'responsible'> & {
  leadIndex?: number;
  offsetDays: number;
  hours: number;
  minutes: number;
}) {
  const baseDate = addDays(today, offsetDays);
  const dueAt = dateWithTime(baseDate, hours, minutes);
  const lead = typeof leadIndex === 'number' ? MOCK_LEADS[leadIndex % MOCK_LEADS.length] : undefined;

  return {
    ...rest,
    id,
    dueAt,
    leadId: lead ? String(lead.id) : undefined,
    leadName: lead?.name,
    leadSummary: lead?.summary,
    leadSource: lead?.source,
    responsible: lead?.ownerId ? `Responsável ${lead.ownerId}` : undefined,
  } satisfies AgendaTask;
}

export const agendaMockTasks: AgendaTask[] = [
  buildTask({
    id: 't1',
    title: 'Retornar proposta de financiamento',
    type: 'callback',
    notes: 'Explicar condições do banco parceiro',
    offsetDays: 0,
    hours: 9,
    minutes: 0,
    leadIndex: 1,
    status: 'todo',
    done: false,
    origin: 'Site',
    color: 'hsl(var(--accent))',
  }),
  buildTask({
    id: 't2',
    title: 'Visita ao imóvel Jardim Paulista',
    type: 'visit',
    notes: 'Levar folder atualizado',
    offsetDays: 0,
    hours: 11,
    minutes: 30,
    leadIndex: 2,
    status: 'todo',
    done: false,
    origin: 'Indicação',
    color: '#6C5CE7',
  }),
  buildTask({
    id: 't3',
    title: 'Follow-up pós-tour virtual',
    type: 'follow-up',
    notes: 'Confirmar interesse e próxima etapa',
    offsetDays: 0,
    hours: 15,
    minutes: 0,
    leadIndex: 0,
    status: 'todo',
    done: false,
    origin: 'Facebook Ads',
    color: '#00B894',
  }),
  buildTask({
    id: 't4',
    title: 'Enviar documentação preliminar',
    type: 'document',
    offsetDays: 1,
    hours: 10,
    minutes: 15,
    leadIndex: 3,
    status: 'todo',
    done: false,
    origin: 'Google Ads',
    color: '#0984E3',
  }),
  buildTask({
    id: 't5',
    title: 'Confirmar presença em open house',
    type: 'call',
    offsetDays: 2,
    hours: 14,
    minutes: 45,
    leadIndex: 4,
    status: 'todo',
    done: false,
    origin: 'Portais',
    color: '#E17055',
  }),
  buildTask({
    id: 't6',
    title: 'Registrar feedback da visita',
    type: 'message',
    offsetDays: -1,
    hours: 17,
    minutes: 0,
    leadIndex: 5,
    status: 'done',
    done: true,
    origin: 'Feira',
    color: '#2D3436',
  }),
  buildTask({
    id: 't7',
    title: 'Atualizar status no CRM',
    type: 'other',
    offsetDays: -2,
    hours: 16,
    minutes: 30,
    leadIndex: 6,
    status: 'done',
    done: true,
    origin: 'Integração',
    color: '#6C5CE7',
  }),
  buildTask({
    id: 't8',
    title: 'Enviar email de apresentação',
    type: 'email',
    offsetDays: 3,
    hours: 9,
    minutes: 30,
    leadIndex: 2,
    status: 'todo',
    done: false,
    origin: 'Site',
    color: 'hsl(var(--accentSoft))',
  }),
  buildTask({
    id: 't9',
    title: 'Agendar ligação de retorno',
    type: 'call',
    offsetDays: -3,
    hours: 12,
    minutes: 0,
    leadIndex: 1,
    status: 'done',
    done: true,
    origin: 'WhatsApp',
    color: '#10B981',
  }),
  buildTask({
    id: 't10',
    title: 'Preparar proposta de compra',
    type: 'appointment',
    offsetDays: 4,
    hours: 18,
    minutes: 0,
    leadIndex: 0,
    status: 'todo',
    done: false,
    origin: 'Retargeting',
    color: '#1E293B',
  }),
  buildTask({
    id: 't11',
    title: 'Atualizar documentação do imóvel',
    type: 'document',
    offsetDays: -4,
    hours: 8,
    minutes: 30,
    leadIndex: 3,
    status: 'done',
    done: true,
    origin: 'Sistema',
    color: 'hsl(var(--accentSoft))',
  }),
  buildTask({
    id: 't12',
    title: 'Follow-up de proposta enviada',
    type: 'follow-up',
    offsetDays: 5,
    hours: 10,
    minutes: 0,
    leadIndex: 4,
    status: 'todo',
    done: false,
    origin: 'Evento',
    color: '#6366F1',
  }),
];
