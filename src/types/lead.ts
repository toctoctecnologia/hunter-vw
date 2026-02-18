import type { LeadStage } from '@/domain/pipeline/stages';

export type { LeadStage };

export interface LeadLite {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  interesse?: string;
  origem?: string | null;
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  stage: LeadStage;
  service?: string;
  requestedDate?: string;
  value?: string;
  summary?: string;
  status?: string;
  createdAt?: string;
  ownerId?: string;
  capturedBy?: number | null;
  firstContact?: string | null;
  firstInteractionAt?: string | null;
  lastContact?: string;
  lastContactAt?: string;
  publishedToRoleta?: boolean;
  leadIntensity?: string;
  updateStatus?: string;
  evaluation?: string;
  qualified?: boolean;
  qualifiedAt?: string;
  archived?: boolean;
  interest?: string;
  origin?: {
    source: string;
    campaign: string;
    propertyType: string;
    connectivity: string;
    firstContact: string;
    evaluation: string;
  };
  propertyCharacteristics?: {
    type: string;
    location: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    parking: string;
    floor: string;
    view: string;
  };
  lastUpdate?: string;
  activities?: any[];
  tasks?: any[];
}

import type { LucideIcon } from 'lucide-react';
import { Activity, User, BarChart3, CheckCircle } from 'lucide-react';

export interface Task {
  id: number;
  client: string;
  action: string;
  description: string;
  phone: string;
  time: string;
  status: string;
  priority: string;
  leadId: number;
  icon: LucideIcon;
  type: string;
}

export type LeadDetailTabId = 'visao-geral' | 'atividades' | 'tarefas' | 'pos-venda';

export interface LeadDetailTab {
  id: LeadDetailTabId;
  label: string;
  icon: LucideIcon;
}

export const LEAD_DETAIL_TABS: LeadDetailTab[] = [
  { id: 'visao-geral', label: 'Visão Geral', icon: User },
  { id: 'atividades', label: 'Atividades', icon: Activity },
  { id: 'tarefas', label: 'Tarefas', icon: BarChart3 },
  { id: 'pos-venda', label: 'Pós-venda', icon: CheckCircle },
];
