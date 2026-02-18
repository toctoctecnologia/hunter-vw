import type { Session } from '@supabase/supabase-js';

import type { UserInformation } from '@/shared/types';

export const PUBLIC_ROUTE_PREFIXES = [
  '/auth/register',
  '/auth/forgot-password',
  '/auth/error',
  '/auth/reset-password',
  '/auth/confirm',
  '/auth/confirm-informations',
  '/auth/mobile/success',
  '/auth/mobile/confirm',
  '/auth/mobile/confirm/process',
  '/auth/sign-up-success',
  '/public',
  '/privacy-policy',
  '/terms-of-service',
];

const AUTHENTICATED_ACCOUNT_ALLOWED_STATUSES = ['ACTIVE', 'TEST_PERIOD_ACTIVE', 'OVERDUE'];

export function isPublicPath(pathname: string) {
  return pathname === '/' || PUBLIC_ROUTE_PREFIXES.some((route) => pathname.startsWith(route));
}

interface ResolveNavigationRedirectParams {
  pathname: string;
  session: Session | null;
  userInfo: UserInformation | null;
}

export function resolveNavigationRedirect({ pathname, session, userInfo }: ResolveNavigationRedirectParams): string | null {
  if (!session) {
    if (!isPublicPath(pathname)) {
      return '/';
    }
    return null;
  }

  const inviteId = session.user.user_metadata?.inviteId as string | undefined;
  if (inviteId) {
    const confirmInformationsPath = '/auth/confirm-informations';
    if (!pathname.startsWith(confirmInformationsPath)) {
      return `${confirmInformationsPath}?inviteId=${inviteId}`;
    }

    return null;
  }

  if (!userInfo || !userInfo.userInfo || !userInfo.signatureInfo) {
    return null;
  }

  const isSuperAdmin = userInfo.userInfo.isSuperAdmin ?? false;

  if (!userInfo.signUpCompleted && pathname !== '/' && !pathname.startsWith('/auth/finish-register')) {
    return '/auth/finish-register';
  }

  if (userInfo.signUpCompleted && pathname.startsWith('/auth/finish-register')) {
    return isSuperAdmin ? '/sadm-dashboard' : '/dashboard';
  }

  if (!isSuperAdmin && pathname.startsWith('/sadm-dashboard')) {
    return '/dashboard';
  }

  if (isSuperAdmin && pathname.startsWith('/dashboard')) {
    return '/sadm-dashboard';
  }

  if (
    !isSuperAdmin &&
    !AUTHENTICATED_ACCOUNT_ALLOWED_STATUSES.includes(userInfo.signatureInfo?.status ?? '') &&
    !pathname.startsWith('/payment/confirm')
  ) {
    return '/payment/confirm';
  }

  if (isPublicPath(pathname) && pathname !== '/privacy-policy') {
    return isSuperAdmin ? '/sadm-dashboard' : '/dashboard';
  }

  return null;
}
