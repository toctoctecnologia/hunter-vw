import { beforeEach, describe, expect, it } from 'vitest';
import {
  createRole,
  updateRole,
  deleteRole,
  fetchRoles,
  type Role,
} from '@/data/accessControl';

describe('access control role mutations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ensures created roles always have a valid scope', () => {
    const baseRole: Role = {
      id: 'custom',
      name: 'Custom',
      description: '',
      permissions: [],
      builtin: false,
      scope: 'team',
    };

    createRole(baseRole);
    let roles = fetchRoles();
    expect(roles.find(role => role.id === 'custom')?.scope).toBe('team');

    const invalidScopeRole: Role = {
      ...baseRole,
      id: 'custom-invalid',
      scope: 'invalid' as Role['scope'],
    };

    createRole(invalidScopeRole);
    roles = fetchRoles();
    expect(roles.find(role => role.id === 'custom-invalid')?.scope).toBe('self');
  });

  it('preserves scope for builtin roles when updating', () => {
    const builtinRole: Role = {
      id: 'admin',
      name: 'admin',
      description: '',
      permissions: [],
      builtin: true,
      scope: 'all',
    };

    localStorage.setItem('acl:roles', JSON.stringify([builtinRole]));

    const roles = updateRole('admin', { scope: 'team', permissions: ['users.view'] });
    const stored = roles.find(role => role.id === 'admin');
    expect(stored?.scope).toBe('all');
    expect(stored?.permissions).toEqual(['users.view']);
    expect(stored?.builtin).toBe(true);
  });

  it('prevents deletion of builtin roles', () => {
    const builtinRole: Role = {
      id: 'admin',
      name: 'admin',
      description: '',
      permissions: [],
      builtin: true,
      scope: 'all',
    };
    const customRole: Role = {
      id: 'custom',
      name: 'Custom',
      description: '',
      permissions: [],
      builtin: false,
      scope: 'team',
    };

    localStorage.setItem('acl:roles', JSON.stringify([builtinRole, customRole]));

    const afterBuiltinDelete = deleteRole('admin');
    expect(afterBuiltinDelete).toHaveLength(2);
    expect(fetchRoles()).toHaveLength(2);

    const afterCustomDelete = deleteRole('custom');
    expect(afterCustomDelete).toHaveLength(1);
    expect(afterCustomDelete[0].id).toBe('admin');
  });
});
