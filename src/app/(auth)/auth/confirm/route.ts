import { NextResponse } from 'next/server';
import { createClient } from '@/shared/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') ?? '/dashboard';
  if (!next.startsWith('/')) {
    next = '/';
  }

  if (code) {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`);
      }

      if (!data.session) {
        return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent('Sessão não criada')}`);
      }

      const redirectResponse = NextResponse.redirect(`${origin}${next}`);
      return redirectResponse;
    } catch {
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent('Erro inesperado no login')}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?error=2116`);
}
