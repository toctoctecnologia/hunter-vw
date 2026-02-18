'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, ExternalLink, Info, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import {
  changeIntegrationActive,
  generateNewIntegrationKey,
  getLaisIntegration,
} from '@/features/dashboard/manage-api/api/lais';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const WEBHOOK_URL = 'http://api.huntercrm.com.br/api/webhook/lais/lead';

export function LaisApiCard() {
  const queryClient = useQueryClient();

  const { data: laisConfig, isLoading: isLoadingLais } = useQuery({
    queryKey: ['lais-config'],
    queryFn: () => getLaisIntegration(),
  });

  const { mutate: toggleActive, isPending: isTogglingActive } = useMutation({
    mutationFn: (isActive: boolean) => changeIntegrationActive(isActive),
    onSuccess: (_, isActive) => {
      toast.success(isActive ? 'Integração ativada com sucesso!' : 'Integração desativada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lais-config'] });
    },
  });

  const { mutate: regenerateKey, isPending: isRegeneratingKey } = useMutation({
    mutationFn: () => generateNewIntegrationKey(),
    onSuccess: () => {
      toast.success('Nova chave de integração gerada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lais-config'] });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    toggleActive(checked);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência!`);
  };

  const isActive = laisConfig?.isActive ?? false;
  const integrationKey = laisConfig?.integrationKey ?? '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div>
          <CardTitle>Lais</CardTitle>
          <CardDescription>Integração para recebimento de leads.</CardDescription>
        </div>

        <Switch checked={isActive} onCheckedChange={handleSwitchChange} disabled={isLoadingLais || isTogglingActive} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {isLoadingLais ? (
          <div className="flex items-center justify-center py-4">
            <Loading />
          </div>
        ) : (
          <>
            {isActive && (
              <>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Como configurar a integração</AlertTitle>
                  <AlertDescription className="mt-2 flex flex-col gap-2">
                    <p>Para configurar a integração com a Lais, siga os passos abaixo:</p>
                    <ol className="ml-4 list-decimal space-y-1 text-sm">
                      <li>Acesse o painel administrativo da Lais</li>
                      <li>Vá até as configurações de integração/webhook</li>
                      <li>
                        Copie o <strong>Token</strong> abaixo e cole no campo de autenticação
                      </li>
                      <li>
                        Configure a <strong>URL do Webhook</strong> abaixo como destino dos leads
                      </li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="integration-token">Token de Integração</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input id="integration-token" value={integrationKey} readOnly className="font-mono text-sm" />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(integrationKey, 'Token')}
                        title="Copiar token"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => regenerateKey()}
                        isLoading={isRegeneratingKey}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="webhook-url">URL do Webhook</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input id="webhook-url" value={WEBHOOK_URL} readOnly className="font-mono text-sm" />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(WEBHOOK_URL, 'URL do Webhook')}
                        title="Copiar URL"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!isActive && (
              <p className="text-muted-foreground text-sm">
                Ative a integração para visualizar as configurações e começar a receber leads da Lais.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
