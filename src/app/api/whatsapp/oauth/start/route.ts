import { NextResponse } from 'next/server';
import { getURL } from '@/shared/lib/utils';

export async function GET() {
  const appId = process.env.FACEBOOK_OAUTH_CLIENT_ID;
  const configId = process.env.WHATSAPP_EMBEDDED_SIGNUP_CONFIG_ID;

  if (!appId) {
    return NextResponse.json({ error: 'Facebook App ID não configurado' }, { status: 500 });
  }

  if (!configId) {
    return NextResponse.json({ error: 'WhatsApp Config ID não configurado' }, { status: 500 });
  }

  const redirectUri = getURL('api/whatsapp/oauth/callback');

  // URL do Embedded Signup hospedado pela Meta
  const embeddedSignupUrl = new URL('https://business.facebook.com/messaging/whatsapp/onboard/');

  embeddedSignupUrl.searchParams.set('app_id', appId);
  embeddedSignupUrl.searchParams.set('config_id', configId);
  embeddedSignupUrl.searchParams.set('redirect_uri', redirectUri);

  // Extras com informações de sessão (versão 3 do fluxo)
  const extras = {
    sessionInfoVersion: '3',
    version: 'v3',
  };

  embeddedSignupUrl.searchParams.set('extras', JSON.stringify(extras));

  return NextResponse.redirect(embeddedSignupUrl.toString());
}
