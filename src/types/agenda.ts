export type TaskStatus = 'todo' | 'done' | 'cancelled' | 'today' | 'overdue' | 'future';

export type TaskType =
  | 'follow-up'
  | 'document'
  | 'appointment'
  | 'message'
  | 'call'
  | 'callback'
  | 'visit'
  | 'email'
  | 'other'
  | 'proposta'
  | 'tarefa';

export type TaskStage = 'agendamento' | 'visita' | 'proposta';

export interface TaskReminder {
  id: string;
  remindAt: string; // ISO format with timezone
}

export interface VisitTaskInput {
  leadId: string | number;
  propertyId: string | number;
  date: string;
  time: string;
  durationMin?: number; // default 60
  transport?: 'car' | 'bus' | 'walk';
}

export interface AgendaTask {
  id: string;
  taskId?: string;
  title: string;
  type: TaskType;
  dueAt: string; // ISO date string with time
  done: boolean;
  notes?: string;
  description?: string;
  leadId?: string;
  leadName?: string;
  leadSummary?: string;
  leadSource?: string;
  negotiationId?: string;
  ownerName?: string;
  channel?: string;
  source?: string;
  responsible?: string;
  team?: string;
  origin?: string;
  color?: string;
  isFavorite?: boolean;
  priorityTag?: string;
  priorityColor?: string;
  statusLabel?: string;
  stage?: TaskStage;
  stageDescription?: string;
  qualifications?: string[];
  property?: {
    id: number;
    codigo: string;
    titulo: string;
    endereco: string;
  };
  status?: TaskStatus;
  reminders?: TaskReminder[];
  createdAt?: string;
  updatedAt?: string;
}
