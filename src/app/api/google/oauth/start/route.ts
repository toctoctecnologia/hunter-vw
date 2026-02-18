import { NextRequest, NextResponse } from 'next/server';

import { encodeBase64Url } from '@/shared/lib/base64url';
import { getURL } from '@/shared/lib/utils';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get('returnTo') ?? '/dashboard/profile';
  const scopeType = searchParams.get('scope') ?? 'calendar'; // 'calendar' | 'ads'

  const scopeMap: Record<string, string[]> = {
    calendar: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar.events'],
    ads: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/adwords'],
  };

  const scopes = scopeMap[scopeType] || scopeMap.calendar;

  const statePayload = {
    r: returnTo,
    ts: Date.now(),
    scope: scopeType,
  };
  const state = encodeBase64Url(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getURL('api/google/oauth/callback'),
    response_type: 'code',
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    scope: scopes.join(' '),
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const res = NextResponse.redirect(authUrl);
  res.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60,
  });
  return res;
}
