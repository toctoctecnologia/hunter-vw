'use client';
import React, { ComponentType } from 'react';
import { useRouter } from 'next/navigation';

import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

export function withPermission<T extends object>(WrappedComponent: ComponentType<T>, requiredFeatureCodes: string[]) {
  const HOC = (props: T) => {
    const router = useRouter();
    const { user } = useAuth();

    const userPermissions = user?.userInfo.profile.permissions || [];

    if (!userPermissions.length) {
      router.push('/unauthorized');
      return null;
    }

    const hasAccess = user && requiredFeatureCodes.some((code) => hasFeature(userPermissions, code));

    if (!hasAccess) {
      router.push('/unauthorized');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  HOC.displayName = `WithPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
}
