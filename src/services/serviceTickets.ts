import { addHours } from 'date-fns';
import { nanoid } from 'nanoid';
import type {
  Attachment,
  Comment,
  CreateTicketInput,
  Status,
  Ticket,
  UpdateTicketInput,
  Task,
  CalendarEvent,
  SyncAuditRecord
} from '@/types/service-management';
import { mockTickets } from '@/data/serviceTickets';
import { PRIORITY_TO_TASK_PRIORITY, STATUS_TO_TASK_STATUS } from '@/services/servicesRules';

const SIMULATE_LATENCY = import.meta.env.DEV ? 600 : 0;
const SIMULATE_ERRORS = import.meta.env.DEV && import.meta.env.VITE_SERVICOS_ERRORS === 'true';

let ticketsStore: Ticket[] = mockTickets.map(ticket => ({
  ...ticket,
  comments: [...ticket.comments],
  attachments: [...ticket.attachments],
  history: [...ticket.history]
}));
let tasksStore: Task[] = [];
let calendarStore: CalendarEvent[] = [];
let syncAuditStore: SyncAuditRecord[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const maybeThrow = () => {
  if (SIMULATE_ERRORS && Math.random() < 0.12) {
    throw new Error('Falha temporária ao carregar tickets.');
  }
};

const withLatency = async <T,>(fn: () => T): Promise<T> => {
  if (SIMULATE_LATENCY) {
    await delay(SIMULATE_LATENCY);
  }
  maybeThrow();
  return fn();
};

const cloneTicket = (ticket: Ticket): Ticket => ({
  ...ticket,
  comments: ticket.comments.map(comment => ({ ...comment })),
  attachments: ticket.attachments.map(attachment => ({ ...attachment })),
  history: ticket.history.map(entry => ({ ...entry }))
});

const cloneTask = (task: Task): Task => ({
  ...task,
  metadata: { ...task.metadata }
});

const cloneEvent = (event: CalendarEvent): CalendarEvent => ({
  ...event
});

const cloneAudit = (record: SyncAuditRecord): SyncAuditRecord => ({ ...record });

const getTicketIndex = (ticketId: string) => ticketsStore.findIndex(ticket => ticket.id === ticketId);

const getTicketDueAt = (ticket: Ticket): string =>
  ticket.dueAt ?? addHours(new Date(ticket.createdAt), ticket.slaHours).toISOString();

const ensureTicketDates = (ticket: Ticket): Ticket => ({
  ...ticket,
  dueAt: getTicketDueAt(ticket),
  hasSchedule: Boolean(ticket.scheduleStart && ticket.scheduleEnd)
});

const addSyncAudit = (record: Omit<SyncAuditRecord, 'id' | 'createdAt'>) => {
  const entry: SyncAuditRecord = {
    id: `sync-${nanoid(6)}`,
    createdAt: new Date().toISOString(),
    ...record
  };
  syncAuditStore = [entry, ...syncAuditStore].slice(0, 30);
};

export const syncTaskFromTicket = (ticket: Ticket, options?: { comment?: string; attachment?: string }) => {
  const normalized = ensureTicketDates(ticket);
  const existingIndex = tasksStore.findIndex(task => task.ticketId === normalized.id);
  const now = new Date().toISOString();
  const status = STATUS_TO_TASK_STATUS[normalized.status];

  const baseTask: Task = {
    id: existingIndex >= 0 ? tasksStore[existingIndex].id : `task-${nanoid(6)}`,
    ticketId: normalized.id,
    title: normalized.title,
    status,
    priority: PRIORITY_TO_TASK_PRIORITY[normalized.priority],
    assigneeId: normalized.assigneeId,
    assigneeName: normalized.assigneeName,
    dueAt: normalized.dueAt,
    createdAt: existingIndex >= 0 ? tasksStore[existingIndex].createdAt : now,
    updatedAt: now,
    completedAt: normalized.status === 'resolvido' ? normalized.resolvedAt ?? now : undefined,
    archivedAt: normalized.status === 'arquivado' ? normalized.archivedAt ?? now : undefined,
    source: 'servicos',
    metadata: {
      code: normalized.code,
      client: normalized.clientName,
      lastComment: options?.comment ?? tasksStore[existingIndex]?.metadata.lastComment,
      lastAttachment: options?.attachment ?? tasksStore[existingIndex]?.metadata.lastAttachment
    }
  };

  if (existingIndex >= 0) {
    tasksStore[existingIndex] = baseTask;
  } else {
    tasksStore = [baseTask, ...tasksStore];
  }

  const ticketIndex = getTicketIndex(normalized.id);
  if (ticketIndex >= 0) {
    ticketsStore[ticketIndex] = {
      ...normalized,
      hasTask: true,
      taskId: baseTask.id
    };
  }

  addSyncAudit({
    ticketId: normalized.id,
    type: 'task',
    status: 'success',
    message: 'Task sincronizada com sucesso.'
  });

  return baseTask;
};

export const syncCalendarFromTicket = (ticket: Ticket) => {
  const normalized = ensureTicketDates(ticket);
  const scheduleActive = Boolean(normalized.scheduleStart && normalized.scheduleEnd);
  const existingIndex = calendarStore.findIndex(event => event.ticketId === normalized.id);

  if (!scheduleActive) {
    if (existingIndex >= 0) {
      calendarStore = calendarStore.filter(event => event.ticketId !== normalized.id);
      addSyncAudit({
        ticketId: normalized.id,
        type: 'calendar',
        status: 'success',
        message: 'Evento removido por ausência de agendamento.'
      });
    }

    const ticketIndex = getTicketIndex(normalized.id);
    if (ticketIndex >= 0) {
      ticketsStore[ticketIndex] = {
        ...normalized,
        hasSchedule: false,
        calendarEventId: undefined
      };
    }

    return null;
  }

  const linkedTask = tasksStore.find(task => task.ticketId === normalized.id);
  const now = new Date().toISOString();
  const event: CalendarEvent = {
    id: existingIndex >= 0 ? calendarStore[existingIndex].id : `evt-${nanoid(6)}`,
    ticketId: normalized.id,
    taskId: linkedTask?.id,
    title: normalized.title,
    startAt: normalized.scheduleStart ?? now,
    endAt: normalized.scheduleEnd ?? now,
    assigneeId: normalized.assigneeId,
    clientId: normalized.clientId,
    location: normalized.scheduleLocation,
    notes: normalized.scheduleNotes,
    createdAt: existingIndex >= 0 ? calendarStore[existingIndex].createdAt : now,
    updatedAt: now
  };

  if (existingIndex >= 0) {
    calendarStore[existingIndex] = event;
  } else {
    calendarStore = [event, ...calendarStore];
  }

  const ticketIndex = getTicketIndex(normalized.id);
  if (ticketIndex >= 0) {
    ticketsStore[ticketIndex] = {
      ...normalized,
      hasSchedule: true,
      calendarEventId: event.id
    };
  }

  addSyncAudit({
    ticketId: normalized.id,
    type: 'calendar',
    status: 'success',
    message: 'Evento de agenda sincronizado.'
  });

  return event;
};

const initializeSync = () => {
  ticketsStore = ticketsStore.map(ticket => ensureTicketDates(ticket));
  ticketsStore.forEach(ticket => {
    syncTaskFromTicket(ticket);
    syncCalendarFromTicket(ticket);
  });
};

initializeSync();

export const listTickets = async (): Promise<Ticket[]> =>
  withLatency(() => ticketsStore.map(cloneTicket));

export const listTasks = async (): Promise<Task[]> =>
  withLatency(() => tasksStore.map(cloneTask));

export const listCalendarEvents = async (): Promise<CalendarEvent[]> =>
  withLatency(() => calendarStore.map(cloneEvent));

export const listSyncAudit = async (): Promise<SyncAuditRecord[]> =>
  withLatency(() => syncAuditStore.map(cloneAudit));

export const createTicket = async (payload: CreateTicketInput): Promise<Ticket> =>
  withLatency(() => {
    const now = new Date();
    const id = `ticket-${nanoid(6)}`;
    const code = `SRV${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: Ticket = ensureTicketDates({
      id,
      code,
      title: payload.title,
      description: payload.description,
      clientId: payload.clientId,
      clientName: payload.clientName,
      category: payload.category,
      priority: payload.priority,
      status: 'pendente',
      origin: payload.origin,
      slaHours: payload.slaHours,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueAt: addHours(now, payload.slaHours).toISOString(),
      tags: payload.tags ?? [],
      assigneeId: payload.assigneeId,
      assigneeName: payload.assigneeName,
      hasSchedule: Boolean(payload.hasSchedule),
      scheduleStart: payload.scheduleStart,
      scheduleEnd: payload.scheduleEnd,
      scheduleLocation: payload.scheduleLocation,
      scheduleNotes: payload.scheduleNotes,
      comments: [],
      attachments: [],
      history: [
        {
          id: `hist-${nanoid(6)}`,
          type: 'created',
          description: 'Ticket criado pelo operador.',
          createdAt: now.toISOString(),
          author: payload.assigneeId ? { id: payload.assigneeId, name: payload.assigneeName ?? 'Responsável' } : undefined
        }
      ]
    });

    ticketsStore = [newTicket, ...ticketsStore];
    syncTaskFromTicket(newTicket);
    syncCalendarFromTicket(newTicket);
    return cloneTicket(newTicket);
  });

export const updateTicket = async (ticketId: string, payload: UpdateTicketInput): Promise<Ticket> =>
  withLatency(() => {
    const index = getTicketIndex(ticketId);
    if (index === -1) {
      throw new Error('Ticket não encontrado.');
    }

    const now = new Date();
    const ticket = ticketsStore[index];
    const updated: Ticket = ensureTicketDates({
      ...ticket,
      ...payload,
      updatedAt: now.toISOString(),
      assigneeId: payload.assigneeId === null ? undefined : payload.assigneeId ?? ticket.assigneeId,
      assigneeName: payload.assigneeName === null ? undefined : payload.assigneeName ?? ticket.assigneeName,
      hasSchedule: payload.hasSchedule ?? ticket.hasSchedule,
      scheduleStart: payload.hasSchedule === false ? undefined : payload.scheduleStart ?? ticket.scheduleStart,
      scheduleEnd: payload.hasSchedule === false ? undefined : payload.scheduleEnd ?? ticket.scheduleEnd,
      scheduleLocation: payload.scheduleLocation ?? ticket.scheduleLocation,
      scheduleNotes: payload.scheduleNotes ?? ticket.scheduleNotes,
      history: [
        {
          id: `hist-${nanoid(6)}`,
          type: 'updated',
          description: 'Dados do ticket atualizados.',
          createdAt: now.toISOString(),
          author: ticket.assigneeId ? { id: ticket.assigneeId, name: ticket.assigneeName ?? 'Responsável' } : undefined
        },
        ...ticket.history
      ]
    });

    ticketsStore[index] = updated;
    syncTaskFromTicket(updated);
    syncCalendarFromTicket(updated);
    return cloneTicket(updated);
  });

export const moveTicketStatus = async (ticketId: string, status: Status): Promise<Ticket> =>
  withLatency(() => {
    const index = getTicketIndex(ticketId);
    if (index === -1) {
      throw new Error('Ticket não encontrado.');
    }

    const now = new Date();
    const ticket = ticketsStore[index];
    const updated: Ticket = ensureTicketDates({
      ...ticket,
      status,
      resolvedAt: status === 'resolvido' ? now.toISOString() : ticket.resolvedAt,
      archivedAt: status === 'arquivado' ? now.toISOString() : ticket.archivedAt,
      updatedAt: now.toISOString(),
      history: [
        {
          id: `hist-${nanoid(6)}`,
          type: 'moved',
          description: `Ticket movido para ${status}.`,
          createdAt: now.toISOString(),
          author: ticket.assigneeId ? { id: ticket.assigneeId, name: ticket.assigneeName ?? 'Responsável' } : undefined
        },
        ...ticket.history
      ]
    });

    ticketsStore[index] = updated;
    syncTaskFromTicket(updated);
    syncCalendarFromTicket(updated);
    return cloneTicket(updated);
  });

export const resolveTicket = async (ticketId: string): Promise<Ticket> =>
  moveTicketStatus(ticketId, 'resolvido');

export const archiveTicket = async (ticketId: string): Promise<Ticket> =>
  moveTicketStatus(ticketId, 'arquivado');

export const reopenTicket = async (ticketId: string): Promise<Ticket> =>
  moveTicketStatus(ticketId, 'pendente');

export const addTicketComment = async (
  ticketId: string,
  payload: Omit<Comment, 'id' | 'createdAt'>
): Promise<Ticket> =>
  withLatency(() => {
    const index = getTicketIndex(ticketId);
    if (index === -1) {
      throw new Error('Ticket não encontrado.');
    }

    const now = new Date();
    const comment: Comment = {
      ...payload,
      id: `comment-${nanoid(6)}`,
      createdAt: now.toISOString()
    };

    const ticket = ticketsStore[index];
    const updated: Ticket = ensureTicketDates({
      ...ticket,
      comments: [comment, ...ticket.comments],
      updatedAt: now.toISOString(),
      history: [
        {
          id: `hist-${nanoid(6)}`,
          type: 'comment',
          description: 'Comentário adicionado.',
          createdAt: now.toISOString(),
          author: payload.author
        },
        ...ticket.history
      ]
    });

    ticketsStore[index] = updated;
    syncTaskFromTicket(updated, { comment: payload.message });
    return cloneTicket(updated);
  });

export const uploadTicketAttachment = async (ticketId: string, files: File[]): Promise<Attachment[]> =>
  withLatency(() => {
    const index = getTicketIndex(ticketId);
    if (index === -1) {
      throw new Error('Ticket não encontrado.');
    }

    const now = new Date();
    const attachments: Attachment[] = files.map(file => ({
      id: `att-${nanoid(6)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: now.toISOString()
    }));

    const ticket = ticketsStore[index];
    const updated: Ticket = ensureTicketDates({
      ...ticket,
      attachments: [...attachments, ...ticket.attachments],
      updatedAt: now.toISOString(),
      history: [
        {
          id: `hist-${nanoid(6)}`,
          type: 'attachment',
          description: 'Anexos adicionados.',
          createdAt: now.toISOString(),
          author: ticket.assigneeId ? { id: ticket.assigneeId, name: ticket.assigneeName ?? 'Responsável' } : undefined
        },
        ...ticket.history
      ]
    });

    ticketsStore[index] = updated;
    syncTaskFromTicket(updated, { attachment: attachments[0]?.name });
    return attachments.map(attachment => ({ ...attachment }));
  });

export const reprocessSync = async (ticketId: string) =>
  withLatency(() => {
    const ticket = ticketsStore.find(item => item.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket não encontrado para sincronização.');
    }
    syncTaskFromTicket(ticket);
    syncCalendarFromTicket(ticket);
    return true;
  });

export const getSlaDeadline = (ticket: Ticket): Date => new Date(getTicketDueAt(ticket));
