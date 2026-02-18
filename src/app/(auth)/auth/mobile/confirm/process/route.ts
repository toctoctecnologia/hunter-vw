import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const next = '/auth/mobile/success';

  if (accessToken && refreshToken) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent('Tokens ausentes')}`);
}
