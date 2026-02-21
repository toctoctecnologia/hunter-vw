'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@/shared/lib/supabase/client';
import { LoadingFull } from '@/shared/components/loading-full';

/**
 * Client-side auth confirm page.
 * Handles the PKCE callback from Supabase OAuth.
 * Supabase redirects here with ?code=XXX after the user authenticates.
 * We exchange the code for a session using exchangeCodeForSession.
 */
export default function AuthConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleConfirm() {
      const code = searchParams.get('code');
      const next = searchParams.get('next') ?? '/dashboard';
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // If Supabase sent an error directly
      if (errorParam) {
        navigate(`/auth/error?error=${encodeURIComponent(errorDescription || errorParam)}`, { replace: true });
        return;
      }

      // If there's a code, exchange it for a session (PKCE flow)
      if (code) {
        try {
          const supabase = createClient();
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            navigate(`/auth/error?error=${encodeURIComponent(exchangeError.message)}`, { replace: true });
            return;
          }

          // Session created successfully, redirect to dashboard
          navigate(next.startsWith('/') ? next : '/', { replace: true });
        } catch (err: any) {
          navigate(`/auth/error?error=${encodeURIComponent(err?.message || 'Erro inesperado no login')}`, { replace: true });
        }
        return;
      }

      // Check for implicit flow tokens in the hash
      const hash = window.location.hash.substring(1);
      if (hash) {
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          // Supabase client auto-detects hash tokens via onAuthStateChange,
          // just redirect to dashboard
          navigate(next.startsWith('/') ? next : '/', { replace: true });
          return;
        }
      }

      // No code, no hash tokens, no error - invalid state
      navigate('/auth/error?error=' + encodeURIComponent('Parâmetros de autenticação não encontrados'), { replace: true });
    }

    handleConfirm();
  }, [searchParams, navigate]);

  if (error) {
    return null; // Will redirect via navigate
  }

  return <LoadingFull title="Confirmando autenticação..." />;
}
