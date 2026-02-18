export type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

export type Status = 'pendente' | 'orcamento' | 'em_andamento' | 'resolvido' | 'arquivado';

export type TaskStatus = 'a_fazer' | 'em_validacao' | 'em_execucao' | 'concluida' | 'arquivada';

export type Origin = 'whatsapp' | 'email' | 'plataforma' | 'telefone' | 'outro';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  author: User;
  message: string;
  createdAt: string;
  internal?: boolean;
}

export interface TicketHistoryEntry {
  id: string;
  type: 'created' | 'updated' | 'moved' | 'comment' | 'attachment' | 'status';
  description: string;
  createdAt: string;
  author?: User;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  category: string;
  origin: Origin;
  clientId?: string;
  clientName?: string;
  assigneeId?: string;
  assigneeName?: string;
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  tags?: string[];
  hasSchedule: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  scheduleLocation?: string;
  scheduleNotes?: string;
  archivedAt?: string;
  resolvedAt?: string;
  hasTask?: boolean;
  taskId?: string;
  calendarEventId?: string;
  comments: Comment[];
  attachments: Attachment[];
  history: TicketHistoryEntry[];
}

export interface TicketFilters {
  search: string;
  periodFrom?: string;
  periodTo?: string;
  responsible?: string;
  priority?: Priority | 'todas';
  category?: string;
  origin?: Origin | 'todas';
  client?: string;
  status?: Status | 'todas';
}

export interface CreateTicketInput {
  title: string;
  description: string;
  clientId?: string;
  clientName?: string;
  category: string;
  priority: Priority;
  assigneeId?: string;
  assigneeName?: string;
  origin: Origin;
  slaHours: number;
  tags?: string[];
  hasSchedule?: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  scheduleLocation?: string;
  scheduleNotes?: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  category?: string;
  priority?: Priority;
  assigneeId?: string | null;
  assigneeName?: string | null;
  origin?: Origin;
  slaHours?: number;
  status?: Status;
  tags?: string[];
  hasSchedule?: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  scheduleLocation?: string;
  scheduleNotes?: string;
}

export interface Task {
  id: string;
  ticketId: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  assigneeName?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
  source: 'servicos';
  metadata: {
    code?: string;
    client?: string;
    lastComment?: string;
    lastAttachment?: string;
  };
}

export interface CalendarEvent {
  id: string;
  ticketId: string;
  taskId?: string;
  title: string;
  startAt: string;
  endAt: string;
  assigneeId?: string;
  clientId?: string;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncAuditRecord {
  id: string;
  ticketId: string;
  type: 'task' | 'calendar';
  status: 'success' | 'error';
  message: string;
  createdAt: string;
}
