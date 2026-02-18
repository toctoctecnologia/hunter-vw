import type { LucideIcon } from 'lucide-react';
import { Calendar, Briefcase, Cake, UserPlus, Building2 } from 'lucide-react';

export type ActionModalId = 'agenda' | 'servico' | 'aniversario' | 'lead' | 'imovel';

export interface ActionModalConfig {
  id: ActionModalId;
  title: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

const ACTION_COLOR = 'bg-orange-100 text-orange-600';

export const ACTION_MODAL_CONFIG: Record<ActionModalId, ActionModalConfig> = {
  agenda: {
    id: 'agenda',
    title: 'Agendar na Agenda',
    icon: Calendar,
    path: '/agenda/novo',
    color: ACTION_COLOR
  },
  servico: {
    id: 'servico',
    title: 'Agendar Serviço',
    icon: Briefcase,
    path: '/agendar-servicos',
    color: ACTION_COLOR
  },
  aniversario: {
    id: 'aniversario',
    title: 'Agendar Aniversário',
    icon: Cake,
    path: '/agendar-aniversario',
    color: ACTION_COLOR
  },
  lead: {
    id: 'lead',
    title: 'Adicionar Lead',
    icon: UserPlus,
    path: '/leads/novo',
    color: ACTION_COLOR
  },
  imovel: {
    id: 'imovel',
    title: 'Adicionar Imóvel',
    icon: Building2,
    path: '/imoveis/novo',
    color: ACTION_COLOR
  }
};

export const MOBILE_ACTION_ORDER: ActionModalId[] = ['agenda', 'lead', 'imovel'];

export const DESKTOP_ACTION_ORDER: ActionModalId[] = [
  'agenda',
  'servico',
  'aniversario',
  'lead',
  'imovel'
];

export const MOBILE_ACTIONS = MOBILE_ACTION_ORDER.map(
  id => ACTION_MODAL_CONFIG[id]
);

export const DESKTOP_ACTIONS = DESKTOP_ACTION_ORDER.map(
  id => ACTION_MODAL_CONFIG[id]
);
