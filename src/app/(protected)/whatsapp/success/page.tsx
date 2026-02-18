import { CheckCircle2 } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';

export default async function Page({ searchParams }: { searchParams: Promise<{ data: string }> }) {
  const params = await searchParams;

  let parsedData;
  try {
    parsedData = params?.data ? JSON.parse(params.data) : null;
  } catch {
    parsedData = null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-12">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
            <CheckCircle2 className="size-16 text-green-600 dark:text-green-500" />
          </div>

          <div className="space-y-4 w-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Sincronização Concluída!</h1>
              <p className="text-muted-foreground">
                Seu WhatsApp Business foi sincronizado com sucesso. Agora você pode fechar esta janela.
              </p>
            </div>

            {parsedData && (
              <>
                {/* Avisos de Erro (se houver) */}
                {parsedData.errorDetails && (
                  <div className="w-full text-left space-y-2">
                    <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-4">
                      <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        ⚠️ Atenção: Alguns Dados Não Foram Obtidos
                      </h2>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                        O token foi gerado com sucesso, mas algumas chamadas falharam devido a permissões. Isso pode
                        indicar que você precisa de permissões adicionais no Business Manager.
                      </p>
                      <details className="text-sm">
                        <summary className="cursor-pointer font-semibold text-yellow-800 dark:text-yellow-200">
                          Ver detalhes do erro
                        </summary>
                        <pre className="mt-2 p-2 bg-white dark:bg-gray-900 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(parsedData.errorDetails, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                )}

                {/* Informações do Usuário */}
                {parsedData.userInfo && (
                  <div className="w-full text-left space-y-2">
                    <h2 className="text-lg font-semibold">Informações do Usuário:</h2>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-sm">
                      <p>
                        <strong>ID:</strong> {parsedData.userInfo.id}
                      </p>
                      <p>
                        <strong>Nome:</strong> {parsedData.userInfo.name}
                      </p>
                      {parsedData.userInfo.email && (
                        <p>
                          <strong>Email:</strong> {parsedData.userInfo.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Informações do WABA */}
                {parsedData.wabaInfo && (
                  <div className="w-full text-left space-y-2">
                    <h2 className="text-lg font-semibold">WhatsApp Business Account:</h2>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-sm space-y-3">
                      <div>
                        <p>
                          <strong>WABA ID:</strong> {parsedData.wabaInfo.id}
                        </p>
                        <p>
                          <strong>Nome:</strong> {parsedData.wabaInfo.name}
                        </p>
                        <p>
                          <strong>Status:</strong> {parsedData.wabaInfo.account_review_status}
                        </p>
                      </div>

                      {parsedData.phoneNumbersInfo && parsedData.phoneNumbersInfo.length > 0 && (
                        <div>
                          <p className="font-semibold mb-2">Números de Telefone:</p>
                          {parsedData.phoneNumbersInfo.map(
                            (phone: {
                              id: string;
                              display_phone_number: string;
                              verified_name: string;
                              quality_rating: string;
                              code_verification_status: string;
                            }) => (
                              <div key={phone.id} className="ml-4 mb-2 p-2 bg-white dark:bg-gray-900 rounded">
                                <p>
                                  <strong>ID:</strong> {phone.id}
                                </p>
                                <p>
                                  <strong>Número:</strong> {phone.display_phone_number}
                                </p>
                                <p>
                                  <strong>Nome Verificado:</strong> {phone.verified_name}
                                </p>
                                <p>
                                  <strong>Qualidade:</strong> {phone.quality_rating}
                                </p>
                                <p>
                                  <strong>Status de Verificação de Código:</strong> {phone.code_verification_status}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Informações do Token */}
                {parsedData.tokenInfo && (
                  <div className="w-full text-left space-y-2">
                    <h2 className="text-lg font-semibold">Informações do Token:</h2>
                    <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-sm space-y-2">
                      <div>
                        <p className="font-semibold">Token de Longa Duração:</p>
                        <p className="text-xs break-all font-mono bg-white dark:bg-gray-900 p-2 rounded mt-1">
                          {parsedData.tokenInfo.longLived.access_token}
                        </p>
                        {parsedData.tokenInfo.longLived.expires_in && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Expira em: {parsedData.tokenInfo.longLived.expires_in} segundos (~
                            {Math.round(parsedData.tokenInfo.longLived.expires_in / 86400)} dias)
                          </p>
                        )}
                      </div>

                      {parsedData.tokenInfo.debug && (
                        <div>
                          <p className="font-semibold">Permissões:</p>
                          <div className="text-xs bg-white dark:bg-gray-900 p-2 rounded mt-1">
                            {parsedData.tokenInfo.debug.data?.scopes?.join(', ') || 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Debug Completo */}
                <details className="w-full">
                  <summary className="cursor-pointer text-lg font-semibold mb-2">Debug Completo (JSON)</summary>
                  <pre className="max-h-96 w-full overflow-x-auto overflow-y-auto rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                    {JSON.stringify(parsedData, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
