import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Navigate, useLocation } from 'react-router-dom';

import { api } from '@/shared/lib/api';
import { createClient } from '@/shared/lib/supabase/client';
import { resolveNavigationRedirect } from '@/shared/lib/auth/navigation-guards';
import type { UserInformation } from '@/shared/types';

import { LoadingFull } from '@/shared/components/loading-full';

interface NavigationGuardProps {
  children: React.ReactNode;
}

export function NavigationGuard({ children }: NavigationGuardProps) {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);

  useEffect(() => {
    const supabase = createClient();

    let isMounted = true;

    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      setSession(authSession);
      if (!authSession) {
        setUserInfo(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadUserInfo() {
      if (!session) {
        setUserInfo(null);
        return;
      }

      try {
        const response = await api.get<UserInformation>('account/user/information');
        if (!isMounted) {
          return;
        }

        setUserInfo(response.data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error('Error loading user information for route guard:', error);
      }
    }

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const redirectTo = useMemo(
    () =>
      resolveNavigationRedirect({
        pathname,
        session,
        userInfo,
      }),
    [pathname, session, userInfo],
  );

  if (isLoading) {
    return <LoadingFull title="Carregando..." />;
  }

  if (redirectTo && redirectTo !== pathname) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
