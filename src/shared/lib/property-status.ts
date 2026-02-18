import { PropertyStatus, PropertyType } from '@/shared/types';

interface StatusColors {
  light: string;
  dark: string;
  bg: string;
  bgDark: string;
}

export const propertyStatusColors: Record<PropertyStatus, StatusColors> = {
  [PropertyStatus.DISPONIVEL_NO_SITE]: {
    light: 'bg-green-600',
    dark: 'bg-green-400',
    bg: 'bg-green-50',
    bgDark: 'dark:bg-green-900',
  },
  [PropertyStatus.DISPONIVEL_INTERNO]: {
    light: 'bg-orange-600',
    dark: 'bg-orange-400',
    bg: 'bg-orange-50',
    bgDark: 'dark:bg-orange-900',
  },
  [PropertyStatus.RESERVADO]: {
    light: 'bg-amber-600',
    dark: 'bg-amber-400',
    bg: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900',
  },
  [PropertyStatus.INDISPONIVEL]: {
    light: 'bg-red-600',
    dark: 'bg-red-400',
    bg: 'bg-red-50',
    bgDark: 'dark:bg-red-900',
  },
  [PropertyStatus.EM_CAPTACAO]: {
    light: 'bg-blue-600',
    dark: 'bg-blue-400',
    bg: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900',
  },
  [PropertyStatus.EM_PREPARACAO]: {
    light: 'bg-cyan-600',
    dark: 'bg-cyan-400',
    bg: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-900',
  },
  [PropertyStatus.VENDIDO]: {
    light: 'bg-emerald-600',
    dark: 'bg-emerald-400',
    bg: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900',
  },
  [PropertyStatus.PUBLICADO]: {
    light: 'bg-teal-600',
    dark: 'bg-teal-400',
    bg: 'bg-teal-50',
    bgDark: 'dark:bg-teal-900',
  },
  [PropertyStatus.EM_NEGOCIACAO]: {
    light: 'bg-yellow-600',
    dark: 'bg-yellow-400',
    bg: 'bg-yellow-50',
    bgDark: 'dark:bg-yellow-900',
  },
  [PropertyStatus.RETIRADO]: {
    light: 'bg-gray-600',
    dark: 'bg-gray-400',
    bg: 'bg-gray-50',
    bgDark: 'dark:bg-gray-900',
  },
  [PropertyStatus.PENDING_TO_APPROVE]: {
    light: 'bg-purple-600',
    dark: 'bg-purple-400',
    bg: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900',
  },
  [PropertyStatus.ARQUIVADO]: {
    light: 'bg-slate-600',
    dark: 'bg-slate-400',
    bg: 'bg-slate-50',
    bgDark: 'dark:bg-slate-900',
  },
  [PropertyStatus.ALUGADO]: {
    light: 'bg-lime-600',
    dark: 'bg-lime-400',
    bg: 'bg-lime-50',
    bgDark: 'dark:bg-lime-900',
  },
};

export const propertyStatusLabels: Record<PropertyStatus, string> = {
  [PropertyStatus.DISPONIVEL_NO_SITE]: 'Disponível no site',
  [PropertyStatus.DISPONIVEL_INTERNO]: 'Disponível interno',
  [PropertyStatus.INDISPONIVEL]: 'Indisponível',
  [PropertyStatus.EM_CAPTACAO]: 'Em captação',
  [PropertyStatus.EM_PREPARACAO]: 'Em preparação',
  [PropertyStatus.VENDIDO]: 'Vendido',
  [PropertyStatus.PUBLICADO]: 'Publicado',
  [PropertyStatus.EM_NEGOCIACAO]: 'Em negociação',
  [PropertyStatus.RESERVADO]: 'Reservado',
  [PropertyStatus.RETIRADO]: 'Retirado',
  [PropertyStatus.PENDING_TO_APPROVE]: 'Pendente aprovação',
  [PropertyStatus.ARQUIVADO]: 'Arquivado',
  [PropertyStatus.ALUGADO]: 'Alugado',
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.CASA]: 'Casa',
  [PropertyType.CASA_EM_CONDOMINIO]: 'Casa em Condomínio',
  [PropertyType.TERRENO_EM_CONDOMINIO]: 'Terreno em Condomínio',
  [PropertyType.TERRENO]: 'Terreno',
  [PropertyType.APARTAMENTO]: 'Apartamento',
  [PropertyType.APARTAMENTO_DIFERENCIADO]: 'Apartamento Diferenciado',
  [PropertyType.COBERTURA]: 'Cobertura',
  [PropertyType.PREDIO_INTEIRO]: 'Prédio Inteiro',
  [PropertyType.LOFT_STUDIO_KITNET]: 'Loft/Studio/Kitnet',
};

export function getPropertyStatusColors(status: PropertyStatus): StatusColors {
  return (
    propertyStatusColors[status] || {
      light: 'bg-gray-600',
      dark: 'bg-gray-400',
      bg: 'bg-gray-50',
      bgDark: 'dark:bg-gray-900',
    }
  );
}

export function getPropertyStatusLabel(status: PropertyStatus): string {
  return propertyStatusLabels[status] || 'Status Desconhecido';
}
