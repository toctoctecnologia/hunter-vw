/**
 * Contratos de dados centralizados do Hunter V2
 * 
 * Estes tipos são a fonte de verdade para todas as entidades do sistema.
 * Qualquer mudança aqui deve refletir nos mocks e providers.
 */

// ============= User =============
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  teamId?: string;
  active: boolean;
  createdAt: string;
}

export type UserRole = 'user' | 'broker' | 'manager' | 'admin' | 'superadmin';

// ============= Team =============
export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  createdAt: string;
}

// ============= Lead =============
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  stage: LeadStage;
  interest?: string;
  value?: number;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  firstContactAt?: string;
  lastContactAt?: string;
  archived: boolean;
  archivedReason?: string;
}

export type LeadStage =
  | 'novo'
  | 'primeiro_contato'
  | 'qualificado'
  | 'visita_agendada'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido';

// ============= Property =============
export interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  stage: PropertyStage;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  address: Address;
  imageUrl?: string;
  createdAt: string;
}

export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land' | 'other';
export type PropertyStatus = 'active' | 'sold' | 'rented' | 'inactive';
export type PropertyStage = 'captacao' | 'avaliacao' | 'ativo' | 'proposta' | 'vendido' | 'locado';

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

// ============= Task =============
export interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  dueAt: string;
  durationMin?: number;
  location?: string;
  notes?: string;
  leadId?: string;
  propertyId?: string;
  reminders: TaskReminder[];
  createdAt: string;
  completedAt?: string;
}

export type TaskType = 'call' | 'visit' | 'email' | 'whatsapp' | 'follow-up' | 'document' | 'appointment' | 'other';
export type TaskStatus = 'todo' | 'done' | 'cancelled';

export interface TaskReminder {
  id: string;
  remindAt: string;
}

// ============= Proposal =============
export interface Proposal {
  id: string;
  propertyId: string;
  leadId?: string;
  leadName?: string;
  value: number;
  status: ProposalStatus;
  description?: string;
  notes?: string;
  commission?: number;
  negotiationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProposalStatus = 'em_analise' | 'em_negociacao' | 'reservado' | 'aprovada' | 'rejeitada' | 'expirada';

// ============= Negotiation =============
export interface Negotiation {
  id: string;
  leadId: string;
  propertyId: string;
  proposalId: string;
  status: NegotiationStatus;
  value: number;
  commission: CommissionSplit[];
  createdAt: string;
  closedAt?: string;
}

export type NegotiationStatus = 'open' | 'won' | 'lost';

export interface CommissionSplit {
  userId: string;
  percentage: number;
}

// ============= Calendar Event =============
export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  color?: string;
  leadId?: string;
  propertyId?: string;
}
