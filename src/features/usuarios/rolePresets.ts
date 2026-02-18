import type { UserRole } from './types';

export const PERMISSIONS = [
  // Usuários
  { id: 'users.view', name: 'Visualizar', module: 'Usuários' },
  { id: 'users.create', name: 'Criar', module: 'Usuários' },
  { id: 'users.edit', name: 'Editar', module: 'Usuários' },
  { id: 'users.delete', name: 'Excluir', module: 'Usuários' },
  
  // Imóveis
  { id: 'properties.view', name: 'Visualizar', module: 'Imóveis' },
  { id: 'properties.create', name: 'Criar', module: 'Imóveis' },
  { id: 'properties.edit', name: 'Editar', module: 'Imóveis' },
  { id: 'properties.delete', name: 'Excluir', module: 'Imóveis' },
  
  // Vendas
  { id: 'sales.view', name: 'Visualizar', module: 'Vendas' },
  { id: 'sales.create', name: 'Criar', module: 'Vendas' },
  { id: 'sales.edit', name: 'Editar', module: 'Vendas' },
  
  // Relatórios
  { id: 'reports.view', name: 'Visualizar', module: 'Relatórios' },
  { id: 'reports.export', name: 'Exportar', module: 'Relatórios' },
  
  // Configurações
  { id: 'settings.view', name: 'Visualizar', module: 'Configurações' },
  { id: 'settings.edit', name: 'Editar', module: 'Configurações' },
];

export const ROLE_PRESETS = {
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'properties.view', 'properties.create', 'properties.edit', 'properties.delete',
    'sales.view', 'sales.create', 'sales.edit',
    'reports.view', 'reports.export',
    'settings.view', 'settings.edit'
  ],
  gestor: [
    'users.view', 'users.create', 'users.edit',
    'properties.view', 'properties.create', 'properties.edit',
    'sales.view', 'sales.create', 'sales.edit',
    'reports.view', 'reports.export'
  ],
  backoffice: [
    'users.view',
    'properties.view', 'properties.create', 'properties.edit',
    'sales.view',
    'reports.view'
  ],
  corretor: [
    'properties.view', 'properties.create', 'properties.edit',
    'sales.view', 'sales.create', 'sales.edit'
  ]
};

export function getPreset(role: UserRole): string[] {
  return ROLE_PRESETS[role] || [];
}

export function getDefaultScope(role: UserRole): 'proprio' | 'equipe' | 'filial' | 'empresa' {
  switch (role) {
    case 'admin':
      return 'empresa';
    case 'gestor':
      return 'filial';
    case 'backoffice':
      return 'filial';
    case 'corretor':
      return 'proprio';
    default:
      return 'proprio';
  }
}