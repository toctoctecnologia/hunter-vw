import { describe, it, expect, beforeEach } from 'vitest';
import { initializeAccessControl, fetchRoles, type RoleScope } from '@/data/accessControl';
import { PERMISSIONS } from '@/data/accessControl/permissions';
import { ROLE_PRESETS } from '@/data/accessControl/roles';

describe('initializeAccessControl', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('seeds permissions and roles when no acl data exists', () => {
    initializeAccessControl();
    expect(localStorage.getItem('acl:permissions')).toBe(JSON.stringify(PERMISSIONS));
    const rolesRaw = localStorage.getItem('acl:roles');
    expect(rolesRaw).not.toBeNull();
    const roles = JSON.parse(rolesRaw!);
    expect(roles.length).toBe(Object.keys(ROLE_PRESETS).length);

    const expectedScopes: Record<string, RoleScope> = {
      admin: 'all',
      supervisor: 'team',
      operator: 'self',
      support: 'team',
    };

    Object.entries(ROLE_PRESETS).forEach(([id]) => {
      const role = roles.find((item: { id: string }) => item.id === id);
      expect(role).toBeDefined();
      expect(role!.builtin).toBe(true);
      expect(role!.scope).toBe(expectedScopes[id]);
    });
  });

  it('updates legacy permission format without touching custom roles', () => {
    const legacyPermissions = JSON.stringify([
      { id: 'view_dashboard', name: 'Visualizar Dashboard', description: '', module: 'Dashboard' },
    ]);
    localStorage.setItem('acl:permissions', legacyPermissions);

    initializeAccessControl();

    expect(localStorage.getItem('acl:permissions')).toBe(JSON.stringify(PERMISSIONS));
    expect(localStorage.getItem('acl:roles')).toBeNull();
  });

  it('normalizes existing roles adding builtin flag and scope', () => {
    const legacyRoles = [
      { id: 'admin', name: 'admin', description: '', permissions: ROLE_PRESETS.admin },
      { id: 'custom', name: 'Custom', description: '', permissions: [], scope: 'team', builtin: false },
    ];
    localStorage.setItem('acl:roles', JSON.stringify(legacyRoles));

    const roles = fetchRoles();

    const adminRole = roles.find(role => role.id === 'admin');
    expect(adminRole).toBeDefined();
    expect(adminRole?.builtin).toBe(true);
    expect(adminRole?.scope).toBe('all');

    const customRole = roles.find(role => role.id === 'custom');
    expect(customRole).toBeDefined();
    expect(customRole?.builtin).toBe(false);
    expect(customRole?.scope).toBe('team');
  });
});
