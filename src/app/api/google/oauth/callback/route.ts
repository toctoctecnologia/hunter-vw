import { NextRequest, NextResponse } from 'next/server';

import { decodeBase64Url, encodeBase64Url } from '@/shared/lib/base64url';
import { getURL } from '@/shared/lib/utils';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', JSON.stringify(error, null, 2));
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  const savedState = request.cookies.get('google_oauth_state')?.value;

  console.log({ savedState });

  if (!savedState || savedState !== state) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  let statePayload: { r: string; ts: number; scope: string };
  try {
    statePayload = JSON.parse(decodeBase64Url(state));
  } catch {
    return NextResponse.json({ error: 'Invalid state format' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID!;

  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
  }

  // Troca o code por tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      redirect_uri: getURL('api/google/oauth/callback'),
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok) {
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', JSON.stringify(tokens, null, 2));
    return NextResponse.redirect(errorUrl);
  }

  // Redireciona para a página de sucesso apropriada com os tokens via query params
  // O frontend irá salvá-los no localStorage
  const successUrl = request.nextUrl.clone();
  const scopeType = statePayload.scope || 'calendar';

  if (scopeType === 'ads') {
    successUrl.pathname = '/google-ads/success';
  } else {
    successUrl.pathname = '/calendar/success';
  }

  // Passa os tokens via query params (serão salvos no localStorage pelo frontend)
  successUrl.searchParams.set('tokens', encodeBase64Url(JSON.stringify(tokens)));
  successUrl.searchParams.set('scope', scopeType);

  return NextResponse.redirect(successUrl);
}
