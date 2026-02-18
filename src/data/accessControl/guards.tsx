import React from 'react';
import { getCurrentUser, hasPermission } from './index';

interface RequirePermissionProps {
  perm: string;
  children: React.ReactNode;
}

export function RequirePermission({ perm, children }: RequirePermissionProps) {
  // Temporary: allow all access without permission checks
  return <>{children}</>;
}

export function withPermission<P>(Component: React.ComponentType<P>, perm: string) {
  return function WithPermissionWrapper(props: P) {
    return (
      <RequirePermission perm={perm}>
        <Component {...props} />
      </RequirePermission>
    );
  };
}
