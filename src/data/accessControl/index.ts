import type { Permission, DataScope } from './permissions';
import { PERMISSIONS } from './permissions';
import { ROLE_PRESETS, getRolePermissions, getRoleDefaultScope } from './roles';

// Mapear escopo Hunter para escopo legado do sistema
export type RoleScope = 'all' | 'team' | 'self';

function dataScopeToRoleScope(scope: DataScope): RoleScope {
  switch (scope) {
    case 'empresa': return 'all';
    case 'filial':
    case 'equipe': return 'team';
    case 'proprio':
    default: return 'self';
  }
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  builtin: boolean;
  scope: RoleScope;
}

export interface CurrentUser {
  id: string;
  role: string;
  permissions?: string[];
  filial?: 'Filial 01' | 'Filial 02' | 'Filial 03';
}

const ACL_PREFIX = 'acl:';
const PERMISSIONS_KEY = 'acl:permissions';
const ROLES_KEY = 'acl:roles';
const CURRENT_USER_KEY = 'acl:currentUser';

const BUILTIN_ROLE_IDS = new Set(Object.keys(ROLE_PRESETS));
const DEFAULT_ROLE_SCOPES: Record<string, RoleScope> = {
  admin: 'all',
  gestor: 'team',
  backoffice: 'team',
  corretor: 'self',
  // Legacy mappings
  supervisor: 'team',
  operator: 'self',
  support: 'team',
};

function createDefaultRoles(): Role[] {
  return Object.entries(ROLE_PRESETS).map(([id, preset]) => ({
    id,
    name: preset.name,
    description: preset.description,
    permissions: [...preset.permissions],
    builtin: preset.builtin,
    scope: dataScopeToRoleScope(preset.defaultScope),
  }));
}

const DEFAULT_ROLES: Role[] = createDefaultRoles();
const DEFAULT_USER: CurrentUser = {
  id: '1',
  role: 'admin',
  permissions: ROLE_PRESETS.admin?.permissions || [],
  filial: 'Filial 01',
};

let memoryPermissions: Permission[] = PERMISSIONS;
let memoryRoles: Role[] = cloneRoles(DEFAULT_ROLES);
let memoryCurrentUser: CurrentUser | null = cloneCurrentUser(DEFAULT_USER);

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    const storage = window.localStorage;
    const testKey = `${ACL_PREFIX}__test__`;
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

const storage = getStorage();

function storageKeys(): string[] {
  if (!storage) return [];

  try {
    return Object.keys(storage);
  } catch {
    return [];
  }
}

function safeGetItem(key: string): { value: string | null; success: boolean } {
  if (!storage) return { value: null, success: false };

  try {
    return { value: storage.getItem(key), success: true };
  } catch {
    return { value: null, success: false };
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function cloneRole(role: Role): Role {
  return {
    ...role,
    permissions: [...role.permissions],
  };
}

function cloneRoles(roles: Role[]): Role[] {
  return roles.map(cloneRole);
}

function cloneCurrentUser(user: CurrentUser | null): CurrentUser | null {
  if (!user) return null;

  return {
    ...user,
    permissions: user.permissions ? [...user.permissions] : undefined,
  };
}

function resolveScope(value: unknown, fallback: RoleScope): RoleScope {
  return value === 'all' || value === 'team' || value === 'self'
    ? value
    : fallback;
}

function normalizePermissions(perms: unknown, fallback: string[] = []): string[] {
  return Array.isArray(perms)
    ? perms.filter((p): p is string => typeof p === 'string')
    : fallback;
}

function normalizeRoleFromStorage(entry: unknown): Role | null {
  if (!entry || typeof entry !== 'object') return null;

  const role = entry as Record<string, unknown>;
  if (typeof role.id !== 'string' || typeof role.name !== 'string') {
    return null;
  }

  const fallbackScope = DEFAULT_ROLE_SCOPES[role.id] ?? 'self';
  const description = typeof role.description === 'string' ? role.description : undefined;

  return {
    id: role.id,
    name: role.name,
    description,
    permissions: normalizePermissions(role.permissions),
    builtin:
      typeof role.builtin === 'boolean'
        ? role.builtin
        : BUILTIN_ROLE_IDS.has(role.id),
    scope: resolveScope(role.scope, fallbackScope),
  };
}

export function initializeAccessControl(): void {
  if (!storage) {
    memoryPermissions = PERMISSIONS;
    memoryRoles = cloneRoles(DEFAULT_ROLES);
    memoryCurrentUser = cloneCurrentUser(DEFAULT_USER);
    return;
  }

  const hasAclData = storageKeys().some(key => key.startsWith(ACL_PREFIX));

  if (!hasAclData) {
    safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));

    const defaults = cloneRoles(DEFAULT_ROLES);
    safeSetItem(ROLES_KEY, JSON.stringify(defaults));

    const mockUser = cloneCurrentUser(DEFAULT_USER);
    if (mockUser) {
      safeSetItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
    }

    memoryPermissions = PERMISSIONS;
    memoryRoles = defaults;
    memoryCurrentUser = mockUser;
    return;
  }

  // Ensure permissions follow the newest schema when data already exists
  const { value: storedPermissions, success } = safeGetItem(PERMISSIONS_KEY);
  if (success && storedPermissions) {
    try {
      const parsed = JSON.parse(storedPermissions);
      const isLegacyFormat = Array.isArray(parsed)
        && parsed.length > 0
        && typeof parsed[0].module !== 'object';

      if (isLegacyFormat || !Array.isArray(parsed)) {
        safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));
        memoryPermissions = PERMISSIONS;
      } else {
        memoryPermissions = parsed as Permission[];
      }
    } catch {
      safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));
      memoryPermissions = PERMISSIONS;
    }
  } else {
    safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));
    memoryPermissions = PERMISSIONS;
  }
}

export function fetchPermissions(): Permission[] {
  if (!storage) {
    return memoryPermissions;
  }

  const { value: raw, success } = safeGetItem(PERMISSIONS_KEY);
  if (!success) {
    return memoryPermissions;
  }

  if (!raw) {
    memoryPermissions = PERMISSIONS;
    return PERMISSIONS;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some(p => typeof p.module !== 'object')) {
      safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));
      memoryPermissions = PERMISSIONS;
      return PERMISSIONS;
    }
    memoryPermissions = parsed as Permission[];
    return parsed as Permission[];
  } catch {
    safeSetItem(PERMISSIONS_KEY, JSON.stringify(PERMISSIONS));
    memoryPermissions = PERMISSIONS;
    return PERMISSIONS;
  }
}

export function fetchRoles(): Role[] {
  if (!storage) {
    return cloneRoles(memoryRoles);
  }

  const { value: raw, success } = safeGetItem(ROLES_KEY);
  if (!success) {
    return cloneRoles(memoryRoles);
  }

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const normalized = parsed
      .map(normalizeRoleFromStorage)
      .filter((role): role is Role => Boolean(role));

    safeSetItem(ROLES_KEY, JSON.stringify(normalized));
    memoryRoles = cloneRoles(normalized);
    return cloneRoles(memoryRoles);
  } catch {
    memoryRoles = cloneRoles(DEFAULT_ROLES);
    return cloneRoles(memoryRoles);
  }
}

function sanitizeRoleInput(role: Role): Role {
  const fallbackScope = DEFAULT_ROLE_SCOPES[role.id] ?? 'self';
  return {
    ...role,
    permissions: normalizePermissions(role.permissions),
    builtin: Boolean(role.builtin),
    scope: resolveScope(role.scope, fallbackScope),
  };
}

export function createRole(role: Role): Role[] {
  const roles = fetchRoles();
  const sanitized = sanitizeRoleInput(role);
  const updated = [...roles, sanitized];
  safeSetItem(ROLES_KEY, JSON.stringify(updated));
  memoryRoles = cloneRoles(updated);
  return cloneRoles(updated);
}

export function updateRole(roleId: string, updates: Partial<Role>): Role[] {
  const roles = fetchRoles().map(role => {
    if (role.id !== roleId) return role;

    const permissions =
      updates.permissions !== undefined
        ? normalizePermissions(updates.permissions, role.permissions)
        : role.permissions;

    const nextScope = role.builtin
      ? role.scope
      : resolveScope(updates.scope, role.scope);

    return {
      ...role,
      ...updates,
      permissions,
      scope: nextScope,
      builtin: role.builtin,
    };
  });

  safeSetItem(ROLES_KEY, JSON.stringify(roles));
  memoryRoles = cloneRoles(roles);
  return cloneRoles(roles);
}

export function deleteRole(roleId: string): Role[] {
  const roles = fetchRoles();
  const target = roles.find(role => role.id === roleId);

  if (!target || target.builtin) {
    return cloneRoles(roles);
  }

  const filtered = roles.filter(role => role.id !== roleId);
  safeSetItem(ROLES_KEY, JSON.stringify(filtered));
  memoryRoles = cloneRoles(filtered);
  return cloneRoles(filtered);
}

export function getCurrentUser(): CurrentUser | null {
  if (!storage) {
    return cloneCurrentUser(memoryCurrentUser);
  }

  const { value: raw, success } = safeGetItem(CURRENT_USER_KEY);
  if (!success) {
    return cloneCurrentUser(memoryCurrentUser);
  }

  if (!raw) {
    memoryCurrentUser = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      memoryCurrentUser = cloneCurrentUser(DEFAULT_USER);
      return cloneCurrentUser(memoryCurrentUser);
    }

    memoryCurrentUser = parsed as CurrentUser;
    return cloneCurrentUser(memoryCurrentUser);
  } catch {
    memoryCurrentUser = cloneCurrentUser(DEFAULT_USER);
    return cloneCurrentUser(memoryCurrentUser);
  }
}

export function hasPermission(
  user: CurrentUser | null,
  permissionId: string
): boolean {
  // Temporary: allow all access without permission checks
  return true;
}
