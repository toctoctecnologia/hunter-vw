import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MockProposal } from '@/mocks/propertiesWithProposals';

export interface PropertyProposalBlockProps {
  proposal: MockProposal;
  proposalCount?: number;
  onViewProposal?: () => void;
}

const statusConfig: Record<MockProposal['status'], { label: string; className: string }> = {
  draft: {
    label: 'Rascunho',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  negotiating: {
    label: 'Em negociação',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sent: {
    label: 'Proposta enviada',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Aprovada',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Recusada',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  won: {
    label: 'Negócio ganho',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  lost: {
    label: 'Negócio perdido',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Data não disponível';
  }
}

export function PropertyProposalBlock({
  proposal,
  proposalCount = 1,
  onViewProposal,
}: PropertyProposalBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[proposal.status] ?? statusConfig.sent;
  const descriptionLines = proposal.description.split('\n').filter(Boolean);
  const isLongDescription = proposal.description.length > 150;

  return (
    <div className="mt-4 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Proposta {proposalCount > 1 && `(${proposalCount})`}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn('text-xs', status.className)}>
            {status.label}
          </Badge>
          <span className="text-xs text-gray-500">
            {formatDateTime(proposal.updatedAt)}
          </span>
        </div>
      </div>

      {/* Value */}
      <p className="text-xl font-bold text-gray-900 mb-3">
        {formatCurrency(proposal.amount)}
      </p>

      {/* Description */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 mb-1">Descrição</p>
        <p
          className={cn(
            'text-sm text-gray-700 leading-relaxed whitespace-pre-wrap',
            !expanded && isLongDescription && 'line-clamp-2'
          )}
        >
          {proposal.description}
        </p>
        {isLongDescription && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            {expanded ? (
              <>
                Recolher <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Ver mais <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Commission */}
      {(proposal.commissionPercentage || proposal.commissionBase) && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium">Comissão:</span>{' '}
          {proposal.commissionPercentage
            ? `${proposal.commissionPercentage}%`
            : formatCurrency(proposal.commissionBase!)}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-orange-100">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 border-orange-200 text-orange-700 hover:bg-orange-100"
          onClick={onViewProposal}
        >
          <Eye className="h-3.5 w-3.5" />
          Ver proposta
        </Button>
      </div>
    </div>
  );
}

export default PropertyProposalBlock;
