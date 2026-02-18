'use client';

import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Card, CardContent } from '@/shared/components/ui/card';
import { saveGoogleTokens, GoogleOAuthTokens } from '@/shared/lib/google-oauth';
import { decodeBase64Url } from '@/shared/lib/base64url';

export default function Page() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tokensParam = searchParams.get('tokens');

      if (tokensParam) {
        // Decodifica os tokens
        const tokens: GoogleOAuthTokens = JSON.parse(decodeBase64Url(tokensParam));

        // Salva no localStorage usando helper
        saveGoogleTokens('ads', tokens);

        // Notifica a janela pai (se aberto em popup)
        if (window.opener) {
          window.opener.postMessage({ type: 'GOOGLE_ADS_SUCCESS', tokens }, window.location.origin);
        }
      }
    } catch (err) {
      console.error('Erro ao processar tokens:', err);
      setError('Erro ao salvar credenciais. Tente novamente.');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
          {error ? (
            <>
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                <CheckCircle2 className="size-16 text-red-600 dark:text-red-500" />
              </div>
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Erro na Sincronização</h1>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
                <CheckCircle2 className="size-16 text-green-600 dark:text-green-500" />
              </div>

              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold">Sincronização Concluída!</h1>
                <p className="text-muted-foreground">
                  Sua conta do Google Ads foi sincronizada com sucesso. Agora você pode fechar esta janela.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
