import { Thermometer } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getIntensityColor, getIntensityText } from '@/shared/lib/utils';
import { LeadDetail, LeadIntensityType } from '@/shared/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { updateLead } from '@/features/dashboard/sales/api/lead';

interface IntensityLeadProps {
  lead: LeadDetail;
}

export function IntensityLead({ lead }: IntensityLeadProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (intensity: LeadIntensityType) => updateLead(lead.uuid, { intensityType: intensity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      toast.success('Intensidade do lead atualizada com sucesso!');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intensidade do Lead</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          {Object.values(LeadIntensityType).map((intensity) => (
            <button
              key={intensity}
              onClick={() => mutate(intensity)}
              disabled={isPending || lead.intensityType === intensity}
              className="size-8 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: getIntensityColor(intensity),
                borderWidth: 2,
                borderColor: lead.intensityType === intensity ? '#3b82f6' : 'transparent',
              }}
            >
              <Thermometer className="size-4 text-white" />
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border p-3">
          <p className="text-center text-sm">
            Lead classificado como{' '}
            <span className="font-bold text-primary">{getIntensityText(lead.intensityType)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
