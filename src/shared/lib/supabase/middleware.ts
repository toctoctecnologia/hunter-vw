import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { api } from '@/shared/lib/api';

function handleError(error: any, request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/auth/error';
  url.searchParams.set('error', JSON.stringify(error.response?.data, null, 2));
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const user = claimsData?.claims;
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/auth/register',
    '/auth/forgot-password',
    '/auth/error',
    '/auth/finish-register',
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

  if (!user && !publicRoutes.some((route) => pathname.startsWith(route)) && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (accessToken) {
      try {
        const inviteId = user?.user_metadata?.inviteId as string | undefined;
        if (pathname.startsWith('/auth/confirm-informations') && inviteId) {
          return supabaseResponse;
        }

        if (inviteId && !pathname.startsWith('/auth/confirm-informations')) {
          try {
            await api.get(`user/invite?inviteId=${inviteId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            const url = request.nextUrl.clone();
            url.pathname = '/auth/confirm-informations';
            url.searchParams.set('inviteId', inviteId);

            return NextResponse.redirect(url);
          } catch (error) {
            console.error('Error validating invite:', error);
          }
        }

        const { data } = await api.get('account/user/information', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!data.signUpCompleted && !pathname.startsWith('/auth/finish-register') && pathname !== '/') {
          const url = request.nextUrl.clone();
          url.pathname = '/auth/finish-register';
          return NextResponse.redirect(url);
        }

        if (data.signUpCompleted) {
          const isSuperAdmin = data.signatureInfo.status === 'SUPER_ADMIN';
          const url = request.nextUrl.clone();

          const accountStatus = data.signatureInfo.status;

          if (
            !['ACTIVE', 'TEST_PERIOD_ACTIVE', 'OVERDUE'].includes(accountStatus) &&
            !pathname.startsWith('/payment/confirm') &&
            !isSuperAdmin
          ) {
            const url = request.nextUrl.clone();
            url.pathname = '/payment/confirm';
            return NextResponse.redirect(url);
          }

          if (pathname.startsWith('/dashboard') && isSuperAdmin) {
            url.pathname = '/sadm-dashboard';
            return NextResponse.redirect(url);
          }

          // Redirect completed users away from finish-register to dashboard
          if (pathname.startsWith('/auth/finish-register')) {
            url.pathname = isSuperAdmin ? '/sadm-dashboard' : '/dashboard';
            return NextResponse.redirect(url);
          }
        }
      } catch (error: any) {
        if (pathname !== '/auth/error') {
          return handleError(error, request);
        } else {
          return supabaseResponse;
        }
      }
    } else {
      if (pathname === '/auth/finish-register') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  } catch (error: any) {
    return handleError(error, request);
  }

  return supabaseResponse;
}
