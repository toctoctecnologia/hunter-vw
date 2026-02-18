'use client';
import React, { ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

export function withPermission<T extends object>(WrappedComponent: ComponentType<T>, requiredFeatureCodes: string[]) {
  const HOC = (props: T) => {
    const { pathname } = useLocation();
    const { user } = useAuth();

    const userPermissions = user?.userInfo?.profile?.permissions ?? [];

    if (!userPermissions.length || !requiredFeatureCodes.length) {
      return <Navigate to="/unauthorized" replace state={{ from: pathname }} />;
    }

    const hasAccess = user && requiredFeatureCodes.some((code) => hasFeature(userPermissions, code));

    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace state={{ from: pathname }} />;
    }

    return <WrappedComponent {...props} />;
  };

  HOC.displayName = `WithPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
}
