import { cn } from '@/lib/utils';
import { ChevronRight, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export interface ProposalSummary {
  hasActiveProposal: boolean;
  activeProposalCount: number;
  proposalStage: 'sem_proposta' | 'proposta' | 'em_negociacao' | 'reservado';
  lastProposalUpdateAt?: string;
  proposalValue?: number;
  reservedFlag: boolean;
  linkedNegotiationId?: string;
  proposalDescription?: string;
}

interface ProposalStatusBadgeProps {
  summary: ProposalSummary;
  onViewProposal?: () => void;
  compact?: boolean;
}

const stageConfig = {
  sem_proposta: {
    label: 'Sem proposta',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
    icon: null
  },
  proposta: {
    label: 'Proposta recebida',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: MessageSquare
  },
  em_negociacao: {
    label: 'Em negociação',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: Clock
  },
  reservado: {
    label: 'Reservado',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: CheckCircle2
  }
};

export function ProposalStatusBadge({ summary, onViewProposal, compact = false }: ProposalStatusBadgeProps) {
  const config = stageConfig[summary.proposalStage];
  const Icon = config.icon;
  const showAction = summary.hasActiveProposal && onViewProposal;

  if (!summary.hasActiveProposal && !summary.reservedFlag) {
    return null;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const lastUpdate = formatDate(summary.lastProposalUpdateAt);

  if (compact) {
    return (
      <button
        type="button"
        onClick={onViewProposal}
        disabled={!showAction}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
          config.bgColor,
          config.textColor,
          config.borderColor,
          'border',
          showAction && 'hover:opacity-80 cursor-pointer'
        )}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span>{config.label}</span>
        {summary.activeProposalCount > 1 && (
          <span className="bg-white/80 px-1.5 py-0.5 rounded-full text-[10px]">
            {summary.activeProposalCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-all',
        config.bgColor,
        config.borderColor,
        showAction && 'hover:shadow-sm cursor-pointer'
      )}
      onClick={showAction ? onViewProposal : undefined}
      role={showAction ? 'button' : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn('h-4 w-4', config.textColor)} />}
          <div>
            <p className={cn('text-sm font-semibold', config.textColor)}>
              {config.label}
              {summary.activeProposalCount > 1 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/80 text-xs font-bold">
                  {summary.activeProposalCount}
                </span>
              )}
            </p>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-0.5">
                Atualizado em {lastUpdate}
              </p>
            )}
          </div>
        </div>
        {showAction && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', config.textColor)}>
            Ver proposta
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProposalStatusBadge;
