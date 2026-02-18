'use client';

import { useEffect } from 'react';
import { useRouter } from '@/shims/next-navigation';
import { Loading } from '@/shared/components/loading';

export default function MobileConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    // Captura os parâmetros da hash (#) da URL
    const hash = window.location.hash.substring(1); // Remove o '#'
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const tokenType = params.get('token_type');

    if (accessToken && refreshToken) {
      // Redireciona para a API route com os tokens como query parameters
      const queryParams = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
        ...(expiresIn && { expires_in: expiresIn }),
        ...(tokenType && { token_type: tokenType }),
      });

      router.replace(`/auth/mobile/confirm/process?${queryParams.toString()}`);
    } else {
      // Se não houver tokens, redireciona para página de erro
      router.replace('/auth/error?error=Tokens não encontrados na URL');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading />
    </div>
  );
}
