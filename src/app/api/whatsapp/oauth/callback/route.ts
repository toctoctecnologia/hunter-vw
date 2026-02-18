import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parâmetros retornados pelo Embedded Signup do WhatsApp
  const code = searchParams.get('code');
  const phoneNumberId = searchParams.get('phone_number_id');
  const wabaId = searchParams.get('waba_id');
  const signupDataStr = searchParams.get('signup_data');
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');

  console.log('🔵 Callback recebido com parâmetros:', {
    code: code ? '✓' : '✗',
    phoneNumberId,
    wabaId,
    signupDataStr: signupDataStr ? '✓' : '✗',
  });

  // Se o usuário cancelou ou ocorreu um erro
  if (error) {
    console.error('WhatsApp Embedded Signup error:', {
      error,
      errorReason,
      errorDescription,
    });

    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', errorDescription || error);
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', 'Nenhum código de autorização recebido do WhatsApp');
    return NextResponse.redirect(errorUrl);
  }

  const clientId = process.env.FACEBOOK_OAUTH_CLIENT_ID;
  const clientSecret = process.env.FACEBOOK_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set('error', 'Facebook OAuth não configurado no servidor');
    return NextResponse.redirect(errorUrl);
  }

  try {
    console.log('🔵 Iniciando troca de código por token');
    console.log('  - Code:', code?.substring(0, 20) + '...');
    console.log('  - WABA ID (da sessão):', wabaId);
    console.log('  - Phone Number ID (da sessão):', phoneNumberId);

    // 1. Trocar o código por um User Access Token (short-lived)
    const tokenResponse = await axios.get('https://graph.facebook.com/v24.0/oauth/access_token', {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
    });

    console.log('🔵 Token Response (short-lived):', tokenResponse.data);

    const shortLivedToken = tokenResponse.data.access_token;

    if (!shortLivedToken) {
      throw new Error('Falha ao obter access token');
    }

    // 2. Trocar por um Long-lived User Access Token (válido por ~60 dias)
    const longLivedResponse = await axios.get('https://graph.facebook.com/v24.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: clientId,
        client_secret: clientSecret,
        fb_exchange_token: shortLivedToken,
      },
    });

    console.log('🔵 Long-lived Token Response:', longLivedResponse.data);

    const userAccessToken = longLivedResponse.data.access_token;

    if (!userAccessToken) {
      throw new Error('Falha ao obter long-lived access token');
    }

    // 3. Debug do token para verificar o tipo e permissões
    const debugResponse = await axios.get('https://graph.facebook.com/v24.0/debug_token', {
      params: {
        input_token: userAccessToken,
        access_token: `${clientId}|${clientSecret}`,
      },
    });

    console.log('🔵 Token Debug:', debugResponse.data);

    // 4. Se temos WABA ID da sessão, obter informações diretamente
    let wabaInfo = null;
    let phoneNumbersInfo = null;

    if (wabaId) {
      console.log('🔵 Obtendo informações do WABA:', wabaId);

      try {
        // Obter detalhes do WABA
        const wabaDetailsResponse = await axios.get(`https://graph.facebook.com/v24.0/${wabaId}`, {
          params: {
            access_token: userAccessToken,
            fields: 'id,name,currency,timezone_id,message_template_namespace,account_review_status',
          },
        });

        console.log('🔵 WABA Details:', wabaDetailsResponse.data);

        // Obter números de telefone do WABA
        const phoneNumbersResponse = await axios.get(`https://graph.facebook.com/v24.0/${wabaId}/phone_numbers`, {
          params: {
            access_token: userAccessToken,
            fields: 'id,display_phone_number,verified_name,quality_rating,code_verification_status',
          },
        });

        console.log('🔵 Phone Numbers:', phoneNumbersResponse.data);

        wabaInfo = wabaDetailsResponse.data;
        phoneNumbersInfo = phoneNumbersResponse.data.data || [];
      } catch (wabaError) {
        console.error('❌ Erro ao obter informações do WABA:', wabaError);
      }
    }

    // TODO: Implementar lógica para:
    // - Salvar o userAccessToken no seu backend (Long-lived User Access Token - válido por ~60 dias)
    // - Associar o WABA ID e Phone Number ID ao usuário logado
    // - Configurar webhook do WhatsApp para este WABA
    // - Registrar o número de telefone para envio de mensagens
    // - Salvar informações no banco de dados
    // - IMPORTANTE: Implementar renovação do token antes de expirar (usar o token para obter um novo)

    const successUrl = request.nextUrl.clone();
    successUrl.pathname = '/whatsapp/success';
    successUrl.searchParams.set(
      'data',
      JSON.stringify(
        {
          accessToken: userAccessToken.substring(0, 20) + '...', // Não expor token completo
          tokenType: 'long-lived-user-token',
          expiresIn: longLivedResponse.data.expires_in || 'unknown',
          wabaId,
          phoneNumberId,
          wabaInfo,
          phoneNumbersInfo,
          signupData: signupDataStr ? JSON.parse(signupDataStr) : null,
          debugInfo: debugResponse.data,
        },
        null,
        2,
      ),
    );
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('❌ Erro fatal no callback:', error);
    const axiosError = error as { response?: { data?: unknown }; message?: string };

    const errorUrl = request.nextUrl.clone();
    errorUrl.pathname = '/auth/error';
    errorUrl.searchParams.set(
      'error',
      JSON.stringify(
        axiosError.response?.data || {
          message: axiosError.message || 'Falha ao processar autenticação do WhatsApp',
        },
        null,
        2,
      ),
    );
    return NextResponse.redirect(errorUrl);
  }
}
