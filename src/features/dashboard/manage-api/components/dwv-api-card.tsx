import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { getDwvIntegration, updateDwvIntegrationToken } from '@/features/dashboard/manage-api/api/dwv';
import { getIntegrations, importIntegration } from '@/features/dashboard/manage-api/api/integration';
import { DwvConfigModal } from '@/features/dashboard/manage-api/components/modal/dwv-config-modal';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import { Loading } from '@/shared/components/loading';
import { IntegrationJobStatus, IntegrationType } from '@/shared/types';

export function DwvApiCard() {
  const queryClient = useQueryClient();
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const { data: integrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: () => getIntegrations(),
  });

  const dwvJob = integrations?.find((integration) => integration.integrationType === IntegrationType.DWV);

  const { data: dwvIntegration, isLoading } = useQuery({
    queryKey: ['dwv-integration'],
    queryFn: getDwvIntegration,
  });

  const hasActiveJob = dwvJob?.status === 'PROCESSING' || dwvJob?.status === 'PENDING' || dwvJob?.status === 'IN_QUEUE';

  const { mutate: startImport, isPending: isImporting } = useMutation({
    mutationFn: () => importIntegration(IntegrationType.DWV),
    onSuccess: () => {
      toast.success('Importação do DWV iniciada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });

  const { mutate: deActivateMutation } = useMutation({
    mutationFn: (isActive: boolean) => updateDwvIntegrationToken(isActive),
    onSuccess: () => {
      toast.success('Integração desativada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['dwv-integration'] });
    },
  });

  const handleSwitchChange = (checked: boolean) => {
    if (checked && !dwvIntegration?.isActive) {
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

    if (!dwvIntegration?.isActive) {
      toast.error('Configure o token do DWV antes de importar');
      setConfigModalOpen(true);
      return;
    }

    startImport();
  };

  return (
    <>
      <DwvConfigModal open={configModalOpen} onOpenChange={setConfigModalOpen} token={dwvIntegration?.token} />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle>DWV</CardTitle>
            <CardDescription>Integração com a plataforma DWV para sincronização de imóveis.</CardDescription>
          </div>

          <Switch
            checked={dwvIntegration?.isActive}
            onCheckedChange={handleSwitchChange}
            disabled={isLoading || hasActiveJob}
          />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importação em andamento...</span>
            </div>
          )}

          {dwvIntegration?.isActive && !hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Configurado e pronto para uso</span>
            </div>
          )}

          {!dwvIntegration?.isActive && !hasActiveJob && (
            <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
              <AlertCircle className="h-4 w-4" />
              <span>Configure o token para começar</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={() => setConfigModalOpen(true)} variant="outline" disabled={isLoading || hasActiveJob}>
              {dwvIntegration?.isActive ? 'Gerenciar Token' : 'Configurar Token'}
            </Button>

            {dwvIntegration?.isActive && (
              <Button onClick={handleImportClick} disabled={isLoading || hasActiveJob || isImporting}>
                {isImporting ? <Loading /> : 'Iniciar Importação'}
              </Button>
            )}
          </div>

          {dwvJob && (
            <div className="border-t pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      dwvJob.status === IntegrationJobStatus.COMPLETED
                        ? 'default'
                        : dwvJob.status === IntegrationJobStatus.FAILED
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {dwvJob.status === IntegrationJobStatus.PROCESSING && 'Em progresso'}
                    {dwvJob.status === IntegrationJobStatus.PENDING && 'Pendente'}
                    {dwvJob.status === IntegrationJobStatus.IN_QUEUE && 'Na fila'}
                    {dwvJob.status === IntegrationJobStatus.COMPLETED && 'Concluído'}
                    {dwvJob.status === IntegrationJobStatus.FAILED && 'Falhou'}
                  </Badge>
                </div>

                {dwvJob.step && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Etapa atual:</span>
                    <p className="text-sm leading-relaxed">{dwvJob.step}</p>
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
