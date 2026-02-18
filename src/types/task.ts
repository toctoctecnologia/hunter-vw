import type { LeadLite } from './lead';

export type TaskStatus = 'todo' | 'done' | 'cancelled';

export type TaskType =
  | 'follow-up'
  | 'document'
  | 'appointment'
  | 'message'
  | 'call'
  | 'callback'
  | 'visit'
  | 'email'
  | 'proposta'
  | 'tarefa'
  | 'other';

export interface TaskReminder {
  id: string;
  remindAt: string; // ISO format with timezone
}

export interface TaskProperty {
  id: number;
  codigo: string;
  titulo: string;
  endereco: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  lead?: LeadLite;
  leadId?: string;
  color?: string;
  dueAt: string; // ISO format with timezone
  durationMin?: number;
  location?: string;
  property?: TaskProperty;
  status: TaskStatus;
  reminders: TaskReminder[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

