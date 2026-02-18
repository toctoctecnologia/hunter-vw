import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CurrentUser, Role, RoleScope } from './index';
import { PERMISSIONS } from './permissions';
import { ROLE_PRESETS } from './roles';

const DEFAULT_ROLE_SCOPES: Record<string, RoleScope> = {
  admin: 'all',
  gestor: 'team',
  backoffice: 'team',
  corretor: 'self',
};

const DEFAULT_USER: CurrentUser = {
  id: '1',
  role: 'admin',
  permissions: ROLE_PRESETS.admin?.permissions || [],
  filial: 'Filial 01',
};

class MockStorage implements Storage {
  private store = new Map<string, string>();
  public throwOnAccess = false;

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.ensureAccess();
    this.store.clear();
    for (const key of Object.keys(this)) {
      if (typeof (this as Record<string, unknown>)[key] === 'function') continue;
      delete (this as Record<string, unknown>)[key];
    }
  }

  key(index: number): string | null {
    this.ensureAccess();
    return Array.from(this.store.keys())[index] ?? null;
  }

  getItem(key: string): string | null {
    this.ensureAccess();
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.ensureAccess();
    this.store.set(key, value);
    (this as unknown as Record<string, string>)[key] = value;
  }

  removeItem(key: string): void {
    this.ensureAccess();
    this.store.delete(key);
    delete (this as Record<string, unknown>)[key];
  }

  private ensureAccess(): void {
    if (this.throwOnAccess) {
      throw new Error('blocked');
    }
  }
}

function buildDefaultRoles(): Role[] {
  return Object.entries(ROLE_PRESETS).map(([id, preset]) => {
    const scopeMap: Record<string, RoleScope> = {
      empresa: 'all',
      filial: 'team',
      equipe: 'team',
      proprio: 'self',
    };
    return {
      id,
      name: preset.name,
      description: preset.description,
      permissions: [...preset.permissions],
      builtin: preset.builtin,
      scope: scopeMap[preset.defaultScope] ?? DEFAULT_ROLE_SCOPES[id] ?? 'self',
    };
  });
}

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  delete (globalThis as { window?: unknown }).window;
});

describe('access control storage resilience', () => {
  it('uses in-memory defaults when storage is unavailable', async () => {
    const accessControl = await import('./index');

    accessControl.initializeAccessControl();

    expect(accessControl.fetchPermissions()).toEqual(PERMISSIONS);
    expect(accessControl.fetchRoles()).toEqual(buildDefaultRoles());
    expect(accessControl.getCurrentUser()).toEqual(DEFAULT_USER);

    const customRole: Role = {
      id: 'custom-role',
      name: 'Custom role',
      description: 'A role created without storage',
      permissions: ['home.view'],
      builtin: false,
      scope: 'self',
    };

    const created = accessControl.createRole(customRole);
    expect(created).toContainEqual(expect.objectContaining({ id: customRole.id }));
    expect(accessControl.fetchRoles()).toHaveLength(created.length);
  });

  it('prefers storage when available and falls back gracefully on failure', async () => {
    const storage = new MockStorage();
    vi.stubGlobal('window', { localStorage: storage } as unknown as Window & typeof globalThis);

    const accessControl = await import('./index');

    accessControl.initializeAccessControl();

    const seededRoles = JSON.parse(storage.getItem('acl:roles') ?? '[]') as Role[];
    expect(accessControl.fetchRoles()).toEqual(seededRoles);
    expect(accessControl.getCurrentUser()).toEqual(DEFAULT_USER);

    const qaRole: Role = {
      id: 'qa-role',
      name: 'QA',
      permissions: ['home.view'],
      description: 'Quality assurance',
      builtin: false,
      scope: 'team',
    };

    const updated = accessControl.createRole(qaRole);
    expect(JSON.parse(storage.getItem('acl:roles') ?? '[]')).toEqual(updated);

    storage.throwOnAccess = true;

    expect(accessControl.fetchPermissions()).toEqual(PERMISSIONS);
    expect(accessControl.fetchRoles()).toEqual(updated);
    expect(accessControl.getCurrentUser()).toEqual(DEFAULT_USER);

    const blockedRole: Role = {
      id: 'blocked-role',
      name: 'Blocked',
      description: 'Created while storage is blocked',
      permissions: ['home.view'],
      builtin: false,
      scope: 'self',
    };

    const blockedUpdate = accessControl.createRole(blockedRole);
    expect(blockedUpdate).toContainEqual(expect.objectContaining({ id: blockedRole.id }));
    expect(accessControl.fetchRoles()).toEqual(blockedUpdate);
  });
});
