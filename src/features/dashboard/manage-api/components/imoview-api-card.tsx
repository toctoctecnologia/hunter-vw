import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { IntegrationJobStatus, IntegrationType } from '@/shared/types';

import { ImoviewConfigModal } from '@/features/dashboard/manage-api/components/modal/imoview-config-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { getIntegrations, importIntegration } from '@/features/dashboard/manage-api/api/integration';
import {
  getIntegration as getImoviewConfig,
  updateIntegrationSettings,
} from '@/features/dashboard/manage-api/api/imoview';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

export function ImoviewApiCard() {
  const queryClient = useQueryClient();

  const [configModalOpen, setConfigModalOpen] = useState(false);

  const { data: integrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => getIntegrations(),
  });

  const imoviewJob = integrations?.find((integration) => integration.integrationType === IntegrationType.IMOVIEW);

  const { data: imoviewConfig, isLoading: isLoadingImoview } = useQuery({
    queryKey: ['imoview-config'],
    queryFn: () => getImoviewConfig(),
  });

  const hasActiveJob =
    imoviewJob?.status === 'PROCESSING' || imoviewJob?.status === 'PENDING' || imoviewJob?.status === 'IN_QUEUE';

  const { mutate: startImport, isPending: isImporting } = useMutation({
    mutationFn: () => importIntegration(IntegrationType.IMOVIEW),
    onSuccess: () => {
      toast.success('Importação do Imoview iniciada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });

  const { mutate: deActivateMutation } = useMutation({
    mutationFn: (isActive: boolean) => updateIntegrationSettings({ email: '', password: '', apiKey: '', isActive }),
    onSuccess: () => {
      toast.success('Integração desativada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['imoview-integration'] });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      queryClient.invalidateQueries({ queryKey: ['imoview-config'] });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    if (checked && !imoviewConfig?.isActive) {
      setConfigModalOpen(true);
    } else if (!checked) {
      deActivateMutation(false);
    }
  };

  const handleImportClick = () => {
    if (hasActiveJob) {
      toast.warning('Já existe uma importação em andamento. Aguarde a conclusão.');
      return;
    }

    if (!imoviewConfig?.isActive) {
      toast.error('Configure as credenciais do Imoview antes de importar');
      setConfigModalOpen(true);
      return;
    }

    startImport();
  };

  return (
    <>
      <ImoviewConfigModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        defaultValues={{
          email: imoviewConfig?.email,
          apiKey: imoviewConfig?.apiKey,
        }}
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle>Imoview</CardTitle>
            <CardDescription>Integração com o Imoview CRM.</CardDescription>
          </div>

          <Switch
            checked={!!imoviewConfig?.isActive}
            onCheckedChange={handleSwitchChange}
            disabled={isLoadingImoview || hasActiveJob}
          />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importação em andamento...</span>
            </div>
          )}

          {imoviewConfig?.isActive && !hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Configurado e pronto para uso</span>
            </div>
          )}

          {!imoviewConfig?.isActive && !hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
              <AlertCircle className="h-4 w-4" />
              <span>Configure as credenciais para começar</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setConfigModalOpen(true)}
              variant="outline"
              disabled={isLoadingImoview || hasActiveJob}
            >
              {imoviewConfig?.isActive ? 'Reconfigurar API' : 'Configurar API'}
            </Button>

            {imoviewConfig?.isActive && (
              <Button onClick={handleImportClick} disabled={isLoadingImoview || hasActiveJob || isImporting}>
                {isImporting ? <Loading /> : 'Iniciar Importação'}
              </Button>
            )}
          </div>

          {imoviewJob && (
            <div className="border-t pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      imoviewJob.status === IntegrationJobStatus.COMPLETED
                        ? 'default'
                        : imoviewJob.status === IntegrationJobStatus.FAILED
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {imoviewJob.status === IntegrationJobStatus.PROCESSING && 'Em progresso'}
                    {imoviewJob.status === IntegrationJobStatus.PENDING && 'Pendente'}
                    {imoviewJob.status === IntegrationJobStatus.IN_QUEUE && 'Na fila'}
                    {imoviewJob.status === IntegrationJobStatus.COMPLETED && 'Concluído'}
                    {imoviewJob.status === IntegrationJobStatus.FAILED && 'Falhou'}
                  </Badge>
                </div>

                {imoviewJob.step && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Etapa atual:</span>
                    <p className="text-sm leading-relaxed">{imoviewJob.step}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
