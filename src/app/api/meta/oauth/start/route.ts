import { getURL } from '@/shared/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { encodeBase64Url } from '@/shared/lib/base64url';

export async function GET(req: NextRequest) {
  const appId = process.env.FACEBOOK_OAUTH_CLIENT_ID;

  if (!appId) {
    return NextResponse.json({ error: 'Meta OAuth is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const returnTo = searchParams.get('returnTo') ?? '/dashboard/profile';

  // State para segurança OAuth
  const statePayload = {
    r: returnTo,
    ts: Date.now(),
  };
  const state = encodeBase64Url(JSON.stringify(statePayload));

  // Permissões necessárias para Lead Ads
  const scopes = [
    'ads_read', // Ler informações de anúncios
    'leads_retrieval', // Recuperar leads
    'pages_read_engagement', // Ler engajamento de páginas
    'pages_manage_metadata', // Gerenciar metadados de páginas
  ];

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: getURL('api/meta/oauth/callback'),
    scope: scopes.join(','),
    response_type: 'code',
    state,
  });

  const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;

  const res = NextResponse.redirect(authUrl);
  res.cookies.set('meta_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutos
  });

  return res;
}
