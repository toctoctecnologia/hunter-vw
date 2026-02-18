import { toast } from 'sonner';

import { updateLeadFunnelStep } from '@/features/dashboard/sales/api/lead';

import { LeadFunnelStages } from '@/shared/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/shared/components/ui/switch';

interface LeadQualifiedProps {
  leadUuid: string;
  funnelStep: LeadFunnelStages;
}

export function LeadQualified({ leadUuid, funnelStep }: LeadQualifiedProps) {
  const queryClient = useQueryClient();

  const isLeadQualified = funnelStep !== LeadFunnelStages.PRE_ATENDIMENTO;

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateLeadFunnelStep(
        leadUuid,
        isLeadQualified ? LeadFunnelStages.PRE_ATENDIMENTO : LeadFunnelStages.EM_ATENDIMENTO,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Status de qualificação do lead atualizado com sucesso!');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qualificação do Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-base font-semibold">{isLeadQualified ? 'Lead Qualificado' : 'Lead Não Qualificado'}</p>
            <p className="text-sm opacity-60 mt-1">
              {isLeadQualified
                ? 'Este lead atende aos critérios de qualificação'
                : 'Este lead ainda não foi qualificado'}
            </p>
          </div>
          <Switch checked={isLeadQualified} onCheckedChange={() => mutate()} disabled={isPending} />
        </div>
      </CardContent>
    </Card>
  );
}
