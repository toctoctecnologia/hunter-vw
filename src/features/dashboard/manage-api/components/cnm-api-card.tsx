import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getCnmIntegration, toggleCnmIntegrationActive } from '@/features/dashboard/manage-api/api/cnm';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CnmConfigModal } from '@/features/dashboard/manage-api/components/modal/cnm-config-modal';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { toast } from 'sonner';

export function CnmApiCard() {
  const queryClient = useQueryClient();

  const [configModalOpen, setConfigModalOpen] = useState(false);

  const { data: cnmIntegration, isLoading } = useQuery({
    queryKey: ['cnm-integration'],
    queryFn: getCnmIntegration,
  });

  const { mutate: toggleActive } = useMutation({
    mutationFn: (checked: boolean) => toggleCnmIntegrationActive(checked),
    onSuccess: () => {
      toast.success('Integração atualizada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['cnm-integration'] });
    },
  });

  return (
    <>
      <CnmConfigModal open={configModalOpen} onOpenChange={setConfigModalOpen} token={cnmIntegration?.token} />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle>Chaves na Mão (CNM)</CardTitle>
            <CardDescription>Integração com a API externa do Chaves na Mão.</CardDescription>
          </div>

          <Switch checked={cnmIntegration?.isActive} onCheckedChange={toggleActive} disabled={isLoading} />
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Button onClick={() => setConfigModalOpen(true)} variant="outline" disabled={isLoading}>
              {cnmIntegration?.isActive ? 'Ver Instruções e Gerenciar' : 'Configurar Integração'}
            </Button>
          </div>

          {cnmIntegration?.isActive && cnmIntegration && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Token:</span>
                <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                  {cnmIntegration.token.substring(0, 20)}...
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Clique em &quot;Ver Instruções&quot; para acessar o tutorial completo e testar a integração.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
