import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

import { LeadStage } from '@/domain/pipeline/stages';
import { toast } from '@/hooks/use-toast';
import { useLeadQualify } from '@/hooks/leads/useLeadQualify';

interface QualifyLeadToggleProps {
  leadId: string;
  initialQualified?: boolean;
  currentStage: LeadStage;
  className?: string;
}

export function QualifyLeadToggle({
  leadId,
  initialQualified = false,
  currentStage,
  className,
}: QualifyLeadToggleProps) {
  const [qualified, setQualified] = useState(initialQualified);
  const { loading, updateQualification } = useLeadQualify();

  const toggleQualified = async (next: boolean) => {
    setQualified(next);
    const success = await updateQualification(leadId, next, currentStage);
    if (!success) {
      setQualified(!next);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o lead.',
      });
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className ?? ''}`}>
        <div className="flex items-center gap-2 text-orange-600">
          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Processando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className ?? ''}`}>
      <span
        className={`inline-flex min-w-[10rem] items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ${qualified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-600 text-white'}`}
      >
        {qualified ? 'Lead qualificado' : 'Lead não qualificado'}
      </span>
      <Switch checked={qualified} onCheckedChange={toggleQualified} />
    </div>
  );
}

export default QualifyLeadToggle;

