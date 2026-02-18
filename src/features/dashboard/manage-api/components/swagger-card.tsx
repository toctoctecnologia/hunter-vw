'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Copy, ExternalLink, Key, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { API_SWAGGER_URL } from '@/shared/lib/constants';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export function SwaggerCard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAccessToken() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setAccessToken(data.session.access_token);
          setExpiresAt(data.session.expires_at || null);
        }
      } catch {
        toast.error('Erro ao carregar token de acesso');
      } finally {
        setIsLoading(false);
      }
    }

    getAccessToken();
  }, []);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeRemaining('Expirado');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      if (days > 0) {
        setTimeRemaining(`${days} ${days === 1 ? 'dia' : 'dias'}`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}min`);
      } else {
        setTimeRemaining(`${minutes}min`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const formatExpirationDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="size-5" />
            Token de Acesso à API
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-20 bg-muted animate-pulse rounded" />
            </div>
          ) : accessToken ? (
            <>
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Este token é necessário para autenticar suas requisições à API do Hunter CRM. Mantenha-o seguro e
                  nunca o compartilhe publicamente.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <TypographyMuted>Seu Access Token</TypographyMuted>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowToken(!showToken)}>
                      {showToken ? <EyeOff className="size-4 mr-2" /> : <Eye className="size-4 mr-2" />}
                      {showToken ? 'Ocultar' : 'Mostrar'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(accessToken)}>
                      <Copy className="size-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
                    {showToken ? accessToken : '•'.repeat(50)}
                  </pre>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <TypographyMuted className="flex items-center gap-2">
                    <Clock className="size-4" />
                    Tempo restante
                  </TypographyMuted>
                  <TypographySmall className="font-semibold">{timeRemaining}</TypographySmall>
                </div>
                <div className="space-y-1">
                  <TypographyMuted>Expira em</TypographyMuted>
                  <TypographySmall className="font-semibold">
                    {expiresAt ? formatExpirationDate(expiresAt) : 'N/A'}
                  </TypographySmall>
                </div>
              </div>
            </>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                Não foi possível carregar o token de acesso. Tente fazer login novamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Usar a API do Hunter CRM</CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tutorial">
              <AccordionTrigger>Ver guia passo a passo</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-2">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                        1
                      </div>
                      <div className="space-y-2 flex-1">
                        <TypographySmall className="font-semibold">Acesse a Documentação Swagger</TypographySmall>
                        <TypographyMuted>
                          Clique no botão abaixo para acessar a documentação completa da API com todos os endpoints
                          disponíveis.
                        </TypographyMuted>
                        <Button variant="outline" size="sm" asChild>
                          <a href={API_SWAGGER_URL} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4 mr-2" />
                            Abrir Swagger UI
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                        2
                      </div>
                      <div className="space-y-2 flex-1">
                        <TypographySmall className="font-semibold">Configure a Autenticação</TypographySmall>
                        <TypographyMuted>
                          No Swagger UI, clique no botão <strong>&ldquo;Authorize&rdquo;</strong> (cadeado verde no topo
                          da página). Cole seu access token no campo de autenticação Bearer.
                        </TypographyMuted>
                        <div className="bg-muted p-3 rounded-lg space-y-1">
                          <code className="text-xs block">Authorization: Bearer {'{seu-access-token}'}</code>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                        3
                      </div>
                      <div className="space-y-2 flex-1">
                        <TypographySmall className="font-semibold">Escolha um Endpoint</TypographySmall>
                        <TypographyMuted>
                          Navegue pela lista de endpoints organizados por categorias (Leads, Propriedades, Relatórios,
                          etc.). Clique no endpoint desejado para expandir seus detalhes.
                        </TypographyMuted>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                        4
                      </div>
                      <div className="space-y-2 flex-1">
                        <TypographySmall className="font-semibold">Teste a Requisição</TypographySmall>
                        <TypographyMuted>
                          Preencha os parâmetros necessários e clique em <strong>&ldquo;Try it out&rdquo;</strong>{' '}
                          seguido de <strong>&ldquo;Execute&rdquo;</strong> para testar o endpoint diretamente no
                          navegador.
                        </TypographyMuted>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0">
                        5
                      </div>
                      <div className="space-y-2 flex-1">
                        <TypographySmall className="font-semibold">Integre no Seu Sistema</TypographySmall>
                        <TypographyMuted>
                          Use os exemplos de código fornecidos pelo Swagger para integrar os endpoints na sua aplicação.
                          O Swagger gera automaticamente exemplos em várias linguagens.
                        </TypographyMuted>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle2 className="size-4" />
                    <AlertDescription>
                      <strong>Dica:</strong> Todos os endpoints requerem autenticação via Bearer Token. Certifique-se de
                      sempre incluir o header Authorization com seu access token válido.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <TypographySmall className="font-semibold">Exemplo de Requisição via cURL</TypographySmall>
                    <div className="bg-muted p-3 rounded-lg overflow-x-auto">
                      <pre className="text-xs">
                        {`curl -X GET "https://api.huntercrm.com.br/api/endpoint" \\
  -H "Authorization: Bearer ${accessToken ? accessToken.substring(0, 30) + '...' : '{seu-token}'}" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge>REST API</Badge>
                    <Badge variant="secondary">JSON</Badge>
                    <Badge variant="secondary">Bearer Auth</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
