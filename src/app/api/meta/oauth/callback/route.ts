import { NextRequest, NextResponse } from 'next/server';
import { decodeBase64Url, encodeBase64Url } from '@/shared/lib/base64url';
import { getURL } from '@/shared/lib/utils';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const errorReason = url.searchParams.get('error_code');
  const errorDescription = url.searchParams.get('error_message');

  // Tratamento de erros do Meta OAuth
  if (errorReason) {
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set(
      'error',
      JSON.stringify({ error_reason: errorReason, error_description: errorDescription }, null, 2),
    );
    return NextResponse.redirect(errorUrl);
  }

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
  }

  // Validação do state
  const savedState = request.cookies.get('meta_oauth_state')?.value;
  if (!savedState || savedState !== state) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  // Decodifica o state (validação apenas, não usado no momento)
  try {
    JSON.parse(decodeBase64Url(state));
  } catch {
    return NextResponse.json({ error: 'Invalid state format' }, { status: 400 });
  }

  const appId = process.env.FACEBOOK_OAUTH_CLIENT_ID;
  const appSecret = process.env.FACEBOOK_OAUTH_CLIENT_SECRET;

  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'Meta OAuth not configured' }, { status: 500 });
  }

  // Troca o code por access token
  const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token');
  tokenUrl.searchParams.set('client_id', appId);
  tokenUrl.searchParams.set('client_secret', appSecret);
  tokenUrl.searchParams.set('redirect_uri', getURL('api/meta/oauth/callback'));
  tokenUrl.searchParams.set('code', code);

  const tokenResponse = await fetch(tokenUrl.toString(), {
    method: 'GET',
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok || tokens.error) {
    console.error('Token exchange failed:', tokens);
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', JSON.stringify(tokens, null, 2));
    return NextResponse.redirect(errorUrl);
  }

  // Obter informações do usuário e suas contas de anúncios
  const userInfoUrl = new URL('https://graph.facebook.com/v21.0/me');
  userInfoUrl.searchParams.set('access_token', tokens.access_token);
  userInfoUrl.searchParams.set('fields', 'id,name,email');

  const userInfoResponse = await fetch(userInfoUrl.toString());
  const userInfo = await userInfoResponse.json();

  if (!userInfoResponse.ok || userInfo.error) {
    console.error('Failed to get user info:', userInfo);
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', JSON.stringify(userInfo, null, 2));
    return NextResponse.redirect(errorUrl);
  }

  // Obter contas de anúncios do usuário
  const adAccountsUrl = new URL('https://graph.facebook.com/v21.0/me/adaccounts');
  adAccountsUrl.searchParams.set('access_token', tokens.access_token);
  adAccountsUrl.searchParams.set('fields', 'id,name,account_id');

  const adAccountsResponse = await fetch(adAccountsUrl.toString());
  const adAccountsData = await adAccountsResponse.json();

  // Obter páginas do usuário
  const pagesUrl = new URL('https://graph.facebook.com/v21.0/me/accounts');
  pagesUrl.searchParams.set('access_token', tokens.access_token);
  pagesUrl.searchParams.set('fields', 'id,name,access_token');

  const pagesResponse = await fetch(pagesUrl.toString());
  const pagesData = await pagesResponse.json();

  // Preparar dados para passar para a página de sucesso
  const connectionData = {
    tokens: {
      access_token: tokens.access_token,
      token_type: tokens.token_type || 'bearer',
      expires_in: tokens.expires_in || 5183944, // ~60 dias (padrão do Meta)
    },
    userInfo: {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    },
    adAccounts: adAccountsData.data || [],
    pages: pagesData.data || [],
  };

  // Redireciona para a página de sucesso com os dados via query params
  const successUrl = request.nextUrl.clone();
  successUrl.pathname = '/meta/success';
  successUrl.searchParams.set('data', encodeBase64Url(JSON.stringify(connectionData)));

  // Remove o cookie de state
  const response = NextResponse.redirect(successUrl);
  response.cookies.delete('meta_oauth_state');

  return response;
}
