import { toast } from 'sonner';

import { updateLeadAssistantReaderAvailable } from '@/features/dashboard/sales/api/lead';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/shared/components/ui/switch';

interface LeadAssistantReaderAvailableProps {
  leadUuid: string;
  isAvailable: boolean;
}

export function LeadAssistantReaderAvailable({ leadUuid, isAvailable }: LeadAssistantReaderAvailableProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateLeadAssistantReaderAvailable(leadUuid, !isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Leitura do Assessor Hunter atualizada com sucesso!');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leitura do Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-base font-semibold">
              {isAvailable ? 'Assessor Hunter Ativo' : 'Assessor Hunter Inativo'}
            </p>
            <p className="text-sm opacity-60 mt-1">
              {isAvailable
                ? 'Assessor Hunter está atualizando dados automaticamente para este lead'
                : 'Assessor Hunter não está atualizando dados para este lead'}
            </p>
          </div>
          <Switch checked={isAvailable} onCheckedChange={() => mutate()} disabled={isPending} />
        </div>
      </CardContent>
    </Card>
  );
}
