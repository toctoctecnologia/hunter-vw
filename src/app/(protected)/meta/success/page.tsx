'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { saveMetaConnection, MetaConnectionData } from '@/shared/lib/meta-oauth';
import { decodeBase64Url } from '@/shared/lib/base64url';

type MetaAccountInfo = {
  id: string;
  name: string;
  account_id?: string;
};

type MetaPageInfo = {
  id: string;
  name: string;
  access_token?: string;
};

type MetaCallbackData = {
  tokens: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
  userInfo: {
    id: string;
    name: string;
    email?: string;
  };
  adAccounts: MetaAccountInfo[];
  pages: MetaPageInfo[];
};

export default function MetaSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [callbackData, setCallbackData] = useState<MetaCallbackData | null>(null);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('');

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');

      if (dataParam) {
        const data: MetaCallbackData = JSON.parse(decodeBase64Url(dataParam));
        setCallbackData(data);

        // Auto-seleciona primeira conta e página se houver apenas uma
        if (data.adAccounts.length === 1) {
          setSelectedAdAccount(data.adAccounts[0].account_id || data.adAccounts[0].id);
        }
        if (data.pages.length === 1) {
          setSelectedPage(data.pages[0].id);
        }
      } else {
        setError('Dados de conexão não encontrados.');
      }
    } catch (err) {
      console.error('Erro ao processar dados do Meta:', err);
      setError('Erro ao processar dados de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleSaveConnection = async () => {
    if (!callbackData) {
      setError('Dados de conexão inválidos.');
      return;
    }

    if (!selectedAdAccount && callbackData.adAccounts.length > 0) {
      setError('Por favor, selecione uma conta de anúncios.');
      return;
    }

    if (!selectedPage && callbackData.pages.length > 0) {
      setError('Por favor, selecione uma página.');
      return;
    }

    try {
      const connectionData: MetaConnectionData = {
        tokens: callbackData.tokens,
        accountData: {
          meta_user_id: callbackData.userInfo.id,
          ad_account_id: selectedAdAccount,
          page_id: selectedPage,
        },
        connected_at: new Date().toISOString(),
      };

      // Salva no localStorage
      saveMetaConnection(connectionData);

      // Notifica a janela pai (se aberto em popup)
      if (window.opener) {
        window.opener.postMessage({ type: 'META_LEADS_SUCCESS', data: connectionData }, window.location.origin);
        window.close();
      } else {
        router.push('/dashboard/profile');
      }
    } catch (err) {
      console.error('Erro ao salvar conexão:', err);
      setError('Erro ao salvar conexão. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Processando conexão...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
              <AlertCircle className="size-16 text-red-600 dark:text-red-500" />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Erro na Conexão</h1>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => router.push('/dashboard/profile')}>Voltar ao Perfil</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-6 py-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
              <CheckCircle2 className="size-16 text-green-600 dark:text-green-500" />
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Conexão Autorizada!</h1>
              <p className="text-muted-foreground">
                Olá, <strong>{callbackData?.userInfo.name}</strong>! Complete a configuração selecionando suas contas.
              </p>
            </div>
          </div>

          {/* Seleção de Conta de Anúncios */}
          {callbackData && callbackData.adAccounts.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Conta de Anúncios</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedAdAccount}
                onChange={(e) => setSelectedAdAccount(e.target.value)}
              >
                <option value="">Selecione uma conta de anúncios</option>
                {callbackData.adAccounts.map((account) => (
                  <option key={account.id} value={account.account_id || account.id}>
                    {account.name} ({account.account_id || account.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Seleção de Página */}
          {callbackData && callbackData.pages.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Página do Facebook</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                <option value="">Selecione uma página</option>
                {callbackData.pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/dashboard/profile')} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSaveConnection} className="flex-1">
              Salvar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
