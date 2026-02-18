import type { DataScope } from '@/data/accessControl/permissions';

export type UserRole = "admin" | "gestor" | "backoffice" | "corretor";
export type VisibilityScope = DataScope;

export interface UserInput {
  nome: string;
  email: string;
  telefone?: string;
  role: UserRole;
  filial: string;
  scope: VisibilityScope;
  permissions: string[];
  ativo: boolean;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
}

export interface RolePreset {
  role: UserRole;
  permissions: string[];
  defaultScope: VisibilityScope;
}