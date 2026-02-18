'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (params: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            code?: string;
            accessToken?: string;
          };
          status: string;
        }) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras: {
            version: string;
          };
        },
      ) => void;
    };
  }
}

/**
 * Página intermediária para o fluxo de Cadastro Incorporado do WhatsApp.
 *
 * Esta página:
 * 1. Carrega o SDK do Facebook
 * 2. Inicia o fluxo de Embedded Signup via FB.login()
 * 3. Recebe o código de autorização e informações da sessão
 * 4. Envia para o backend para trocar por token e completar integração
 */
export default function WhatsAppSetupPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listener para receber informações de sessão do Embedded Signup
    const handleWhatsAppMessage = (event: MessageEvent) => {
      // Verificar origem
      if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') {
        return;
      }

      try {
        const data = JSON.parse(event.data);

        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data;
            console.log('✅ WhatsApp Embedded Signup concluído:', { phone_number_id, waba_id });

            // Armazenar informações da sessão localmente
            sessionStorage.setItem('whatsapp_phone_number_id', phone_number_id);
            sessionStorage.setItem('whatsapp_waba_id', waba_id);
            sessionStorage.setItem('whatsapp_signup_data', JSON.stringify(data.data));

            // Notificar janela que abriu este popup
            if (window.opener) {
              window.opener.postMessage(data, '*');
            }
          } else if (data.event === 'CANCEL') {
            const { current_step } = data.data;
            console.warn('⚠️ Cadastro cancelado em:', current_step);
            setError(`Cadastro cancelado na etapa: ${current_step}`);
          } else if (data.event === 'ERROR') {
            const { error_message } = data.data;
            console.error('❌ Erro no cadastro:', error_message);
            setError(error_message);
          }
        }
      } catch {
        console.log('Resposta não-JSON do Facebook:', event.data);
      }
    };

    window.addEventListener('message', handleWhatsAppMessage);

    // Carregar o SDK do Facebook
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        // SDK já carregado, iniciar flow
        if (window.FB) {
          launchWhatsAppSignup();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';

      document.body.appendChild(script);
    };

    // Inicializar o SDK do Facebook
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v24.0',
      });

      // Iniciar o fluxo de embedded signup automaticamente
      launchWhatsAppSignup();
    };

    loadFacebookSDK();

    return () => window.removeEventListener('message', handleWhatsAppMessage);
  }, []);

  const launchWhatsAppSignup = () => {
    const configId = process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID;

    if (!configId) {
      setError('WhatsApp Config ID não configurado');
      return;
    }

    console.log('🔵 Iniciando fluxo de Cadastro Incorporado do WhatsApp');
    console.log('  - Config ID:', configId);

    // Callback para quando o usuário completar o flow usando Login do Facebook
    const fbLoginCallback = (response: { authResponse?: { code?: string; accessToken?: string }; status: string }) => {
      console.log('🔵 Resposta do FB.login:', response);

      if (response.authResponse?.code) {
        const code = response.authResponse.code;
        console.log('✅ Código de autorização recebido:', code);

        // Obter informações armazenadas da sessão
        const phoneNumberId = sessionStorage.getItem('whatsapp_phone_number_id');
        const wabaId = sessionStorage.getItem('whatsapp_waba_id');
        const signupData = sessionStorage.getItem('whatsapp_signup_data');

        // Enviar código e informações para o backend
        const params = new URLSearchParams({
          code,
          ...(phoneNumberId && { phone_number_id: phoneNumberId }),
          ...(wabaId && { waba_id: wabaId }),
          ...(signupData && { signup_data: signupData }),
        });

        window.location.href = `/api/whatsapp/oauth/callback?${params.toString()}`;
      } else {
        console.warn('⚠️ Nenhum código de autorização recebido');
        setError('Autenticação cancelada ou falhou');
      }
    };

    // Iniciar login do Facebook com Embedded Signup
    window.FB.login(fbLoginCallback, {
      config_id: configId,
      response_type: 'code', // necessário para System User access token
      override_default_response_type: true,
      extras: {
        version: 'v3',
      },
    });
  };

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Erro na Configuração</CardTitle>
            <CardDescription>Não foi possível configurar o WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurando WhatsApp</CardTitle>
          <CardDescription>Aguarde enquanto preparamos a integração...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Abrindo o assessor de configuração do WhatsApp</p>
        </CardContent>
      </Card>
    </div>
  );
}
