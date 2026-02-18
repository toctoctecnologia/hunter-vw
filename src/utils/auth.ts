import {
  getCurrentUser as aclGetCurrentUser,
  hasPermission,
  type CurrentUser,
} from '@/data/accessControl';

export type Role = 'admin' | 'gestor' | 'corretor';

export type AuthUser = CurrentUser;

/**
 * Retrieves the current authenticated user using the access control module.
 */
export function getCurrentUser(): AuthUser | null {
  return aclGetCurrentUser();
}

/**
 * Checks if the provided user has one of the required roles.
 */
export function hasRole(
  user: { role?: string } | null | undefined,
  roles: Role | Role[]
): boolean {
  const role = user?.role;
  if (!role) return false;
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(role as Role);
}

export function canAccessBilling(user: AuthUser | null): boolean {
  if (!user) return false;

  if (user.role === 'owner' || user.role === 'admin') {
    return true;
  }

  const userPermissions = user.permissions ?? [];
  const hasBillingView = userPermissions.includes('billing:view') || hasPermission(user, 'billing:view');
  const hasBillingManage = userPermissions.includes('billing:manage') || hasPermission(user, 'billing:manage');

  return hasBillingView && hasBillingManage;
}

export { hasPermission };
