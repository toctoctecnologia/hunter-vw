'use client';

import { FileText } from 'lucide-react';

import { LeadProposalItem } from '@/shared/types';
import { formatValue, proposalStatusColors, proposalStatusLabels } from '@/shared/lib/utils';

import { Badge } from '@/shared/components/ui/badge';

interface TaskProposalInfoProps {
  proposal: LeadProposalItem;
}

export function TaskProposalInfo({ proposal }: TaskProposalInfoProps) {
  return (
    <div className="mt-2 p-2 bg-muted/50 rounded-md border text-sm space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-muted-foreground" />
        <span className="font-medium">Proposta</span>
        <Badge className="text-xs" style={{ backgroundColor: proposalStatusColors[proposal.status] }}>
          {proposalStatusLabels[proposal.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Valor Total:</span>
          <p className="font-semibold">{formatValue(proposal.proposalTotalValue)}</p>
        </div>
        {proposal.signal && (
          <div>
            <span className="text-muted-foreground">Sinal:</span>
            <p className="font-semibold">{formatValue(proposal.signal.signalValue)}</p>
          </div>
        )}
        {proposal.financing && (
          <div>
            <span className="text-muted-foreground">Financiamento:</span>
            <p className="font-semibold">{proposal.financing.financingPercent}%</p>
          </div>
        )}
        {proposal.ownResources && (
          <div>
            <span className="text-muted-foreground">Recursos Próprios:</span>
            <p className="font-semibold">{formatValue(proposal.ownResources.resourcesAmount)}</p>
          </div>
        )}
      </div>

      {proposal.signal?.observations && (
        <p className="text-muted-foreground text-xs border-t pt-2 line-clamp-2">
          <span className="font-medium text-foreground">Obs:</span> {proposal.signal.observations}
        </p>
      )}
    </div>
  );
}
