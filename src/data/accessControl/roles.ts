import { PERMISSIONS, DataScope } from './permissions';

// ============================================
// PERFIS DE ACESSO HUNTER
// ============================================
// 4 perfis pré-definidos com permissões e escopos padrão

export interface RolePreset {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  defaultScope: DataScope;
  builtin: boolean;
}

// Admin: Acesso total a tudo
const ADMIN_PERMISSIONS = PERMISSIONS.map(p => p.id);

// Gestor: Visão da filial, gerencia equipe, sem módulos de poder sensíveis
const GESTOR_PERMISSIONS = [
  // Home
  'home.view',
  'home.edit',
  'home.manage',
  'home.export',

  // Fotos
  'photos.view',
  'photos.edit',
  'photos.manage',
  'photos.export',

  // Sincronizações
  'syncs.view',
  'syncs.edit',
  'syncs.manage',
  'syncs.export',

  // Recursos
  'resources.view',
  'resources.edit',
  'resources.manage',
  'resources.export',

  // Notificações
  'notifications.view',
  'notifications.edit',
  'notifications.manage',
  'notifications.export',

  // Perfil
  'profile.view',
  'profile.edit',
  'profile.manage',
  'profile.export',

  // Negociações
  'negotiation.view',
  'negotiation.create',
  'negotiation.edit',
  'negotiation.manage',
  'negotiation.export',
  'negotiation.roletao.view',
  'negotiation.roletao.manage',

  // Agenda
  'agenda.view',
  'agenda.create',
  'agenda.edit',
  'agenda.manage',
  'agenda.export',

  // Imóveis
  'properties.view',
  'properties.create',
  'properties.edit',
  'properties.manage',
  'properties.export',

  // Condomínios
  'condos.view',
  'condos.create',
  'condos.edit',
  'condos.manage',

  // Aluguéis
  'rentals.view',
  'rentals.create',
  'rentals.edit',
  'rentals.manage',
  'rentals.export',
  'rentals.contracts.view',
  'rentals.contracts.create',
  'rentals.contracts.edit',
  'rentals.contracts.manage',
  'rentals.invoices.view',
  'rentals.invoices.create',
  'rentals.invoices.edit',
  'rentals.invoices.manage',
  'rentals.transfers.view',
  'rentals.transfers.create',
  'rentals.transfers.manage',
  'rentals.analytics.view',
  'rentals.analytics.export',
  'rentals.collection.view',

  // Indicadores de Leads
  'lead_indicators.view',
  'lead_indicators.create',
  'lead_indicators.edit',
  'lead_indicators.manage',
  'lead_indicators.export',
  'lead_indicators.campaigns.view',
  'lead_indicators.campaigns.create',
  'lead_indicators.campaigns.edit',
  'lead_indicators.campaigns.manage',

  // Usuários
  'users.view',
  'users.create',
  'users.edit',
  'users.manage',
  'users.export',
  'users.automations.view',
  'users.automations.manage',

  // Equipes
  'teams.view',
  'teams.edit',
  'teams.manage',
  'teams.export',

  // Leads
  'leads.view',
  'leads.edit',
  'leads.manage',
  'leads.export',

  // Distribuição
  'distribution.view',
  'distribution.create',
  'distribution.edit',
  'distribution.manage',
  'distribution.export',

  // Módulos de poder (limitados)
  'access_control.view',
  'access_control.export',
  'roletao_management.view',
  'reports_management.view',
  'reports_management.export',
  'properties_management.view',
  'properties_management.export',
  'condos_management.view',
  'condos_management.edit',
  'condos_management.manage',
  'condos_management.export',
  'leads_management.view',
  'leads_management.export',
];

// Backoffice: Operações de suporte, sem gerenciamento de equipe
const BACKOFFICE_PERMISSIONS = [
  // Home
  'home.view',
  'home.edit',

  // Fotos
  'photos.view',
  'photos.edit',

  // Sincronizações
  'syncs.view',
  'syncs.edit',

  // Recursos
  'resources.view',
  'resources.edit',

  // Notificações
  'notifications.view',
  'notifications.edit',

  // Perfil
  'profile.view',
  'profile.edit',

  // Negociações
  'negotiation.view',
  'negotiation.create',
  'negotiation.edit',
  'negotiation.export',
  'negotiation.roletao.view',

  // Agenda
  'agenda.view',
  'agenda.create',
  'agenda.edit',
  'agenda.export',

  // Imóveis
  'properties.view',
  'properties.create',
  'properties.edit',
  'properties.manage',
  'properties.export',

  // Condomínios
  'condos.view',
  'condos.create',
  'condos.edit',
  'condos.manage',

  // Aluguéis
  'rentals.view',
  'rentals.create',
  'rentals.edit',
  'rentals.export',
  'rentals.contracts.view',
  'rentals.contracts.create',
  'rentals.contracts.edit',
  'rentals.invoices.view',
  'rentals.invoices.create',
  'rentals.invoices.edit',
  'rentals.transfers.view',
  'rentals.analytics.view',
  'rentals.analytics.export',
  'rentals.collection.view',

  // Indicadores de Leads
  'lead_indicators.view',
  'lead_indicators.create',
  'lead_indicators.edit',
  'lead_indicators.export',
  'lead_indicators.campaigns.view',
  'lead_indicators.campaigns.create',
  'lead_indicators.campaigns.edit',

  // Usuários
  'users.view',

  // Equipes
  'teams.view',

  // Leads
  'leads.view',
  'leads.edit',

  // Distribuição
  'distribution.view',

  // Relatórios
  'reports_management.view',
  'reports_management.export',
];

// Corretor: Acesso próprio, foco em vendas e imóveis
const CORRETOR_PERMISSIONS = [
  // Home
  'home.view',
  'home.edit',

  // Fotos
  'photos.view',
  'photos.edit',

  // Notificações
  'notifications.view',
  'notifications.edit',

  // Perfil
  'profile.view',
  'profile.edit',

  // Negociações (só próprias)
  'negotiation.view',
  'negotiation.create',
  'negotiation.edit',
  'negotiation.roletao.view',

  // Agenda (só própria)
  'agenda.view',
  'agenda.create',
  'agenda.edit',
  'agenda.export',

  // Imóveis (leitura + cadastro)
  'properties.view',
  'properties.create',
  'properties.edit',

  // Condomínios (leitura)
  'condos.view',

  // Indicadores de Leads (só próprios)
  'lead_indicators.view',

  // Leads (só próprios)
  'leads.view',
  'leads.edit',

  // Distribuição (leitura)
  'distribution.view',
];

export const ROLE_PRESETS: Record<string, RolePreset> = {
  admin: {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso total a todos os módulos, configurações e dados da empresa.',
    permissions: ADMIN_PERMISSIONS,
    defaultScope: 'empresa',
    builtin: true,
  },
  gestor: {
    id: 'gestor',
    name: 'Gestor',
    description: 'Gerencia equipe e operações da filial, com visão ampla mas sem acesso a configurações sensíveis.',
    permissions: GESTOR_PERMISSIONS,
    defaultScope: 'filial',
    builtin: true,
  },
  backoffice: {
    id: 'backoffice',
    name: 'Backoffice',
    description: 'Suporte operacional com acesso a cadastros, contratos e operações do dia a dia.',
    permissions: BACKOFFICE_PERMISSIONS,
    defaultScope: 'filial',
    builtin: true,
  },
  corretor: {
    id: 'corretor',
    name: 'Corretor',
    description: 'Foco em vendas e atendimento, com acesso restrito aos próprios dados e negociações.',
    permissions: CORRETOR_PERMISSIONS,
    defaultScope: 'proprio',
    builtin: true,
  },
};

// Lista de IDs dos perfis
export const ROLE_IDS = Object.keys(ROLE_PRESETS) as Array<keyof typeof ROLE_PRESETS>;

// Helper para obter preset de um perfil
export function getRolePreset(roleId: string): RolePreset | null {
  return ROLE_PRESETS[roleId] || null;
}

// Helper para obter permissões de um perfil
export function getRolePermissions(roleId: string): string[] {
  return ROLE_PRESETS[roleId]?.permissions || [];
}

// Helper para obter escopo padrão de um perfil
export function getRoleDefaultScope(roleId: string): DataScope {
  return ROLE_PRESETS[roleId]?.defaultScope || 'proprio';
}

// Helper para verificar se um perfil tem uma permissão
export function roleHasPermission(roleId: string, permissionId: string): boolean {
  const preset = ROLE_PRESETS[roleId];
  if (!preset) return false;
  return preset.permissions.includes(permissionId);
}

// Exportar permissões legadas para compatibilidade
export const LEGACY_ROLE_PERMISSIONS: Record<string, string[]> = Object.fromEntries(
  Object.entries(ROLE_PRESETS).map(([id, preset]) => [id, preset.permissions])
);
