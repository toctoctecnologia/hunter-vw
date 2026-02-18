import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  exchangeTypeLabels,
  formatDate,
  formatValue,
  priceIndexLabels,
  proposalStatusColors,
  proposalStatusLabels,
} from '@/shared/lib/utils';
import { LeadPaymentConditionTypes, LeadProposalStatus } from '@/shared/types';

import { getLeadProposal, updateLeadProposalStatus } from '@/features/dashboard/sales/api/lead-proposal';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface LeadProposalProps {
  leadUuid: string;
}

export function LeadProposal({ leadUuid }: LeadProposalProps) {
  const queryClient = useQueryClient();

  const { data: proposal, isLoading: isLoadingProposal } = useQuery({
    queryKey: ['lead-proposal', leadUuid],
    queryFn: () => getLeadProposal(leadUuid),
    enabled: !!leadUuid,
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: LeadProposalStatus) => updateLeadProposalStatus(leadUuid, status),
    onSuccess: (_, status) => {
      toast.success(
        status === LeadProposalStatus.ACCEPTED ? 'Proposta marcada como aceita!' : 'Proposta marcada como recusada.',
      );
      queryClient.invalidateQueries({ queryKey: ['lead-proposal', leadUuid] });
      queryClient.invalidateQueries({ queryKey: ['lead-detail', leadUuid] });
    },
  });

  const handleAcceptProposal = () => {
    updateStatus(LeadProposalStatus.ACCEPTED);
  };

  const handleRejectProposal = () => {
    updateStatus(LeadProposalStatus.REJECTED);
  };

  if (isLoadingProposal) return <Loading />;
  if (!proposal) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposta Ativa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status e Dados Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold opacity-60 mb-1">Status da Proposta</p>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: proposalStatusColors[proposal.status] }}
              />
              <p className="text-sm font-semibold">{proposalStatusLabels[proposal.status]}</p>
            </div>
          </div>

          {proposal.propertyCode && (
            <div>
              <p className="text-xs font-semibold opacity-60 mb-1">Código do Imóvel</p>
              <p className="text-sm font-semibold">{proposal.propertyCode}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold opacity-60 mb-1">Valor Total</p>
            <p className="text-base font-bold text-primary">{formatValue(proposal.proposalTotalValue)}</p>
          </div>

          <div>
            <p className="text-xs font-semibold opacity-60 mb-1">Validade</p>
            <p className="text-sm">{formatDate(proposal.validity)}</p>
          </div>
        </div>

        {/* Condições de Pagamento */}
        <div className="space-y-2">
          <p className="text-xs font-semibold opacity-60">Condições de Pagamento</p>
          <div className="space-y-2">
            {proposal.ownResources &&
              proposal.paymentConditionTypes.includes(LeadPaymentConditionTypes.OWN_RESOURCES) && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold mb-2">Recursos Próprios</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p>
                      Entrada:{' '}
                      <span className="font-semibold">{formatValue(proposal.ownResources.resourcesAmount)}</span>
                    </p>
                    <p>
                      Saldo: <span className="font-semibold">{formatValue(proposal.ownResources.balance)}</span>
                    </p>
                  </div>
                </div>
              )}

            {proposal.financing && proposal.paymentConditionTypes.includes(LeadPaymentConditionTypes.FINANCING) && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Financiamento</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>
                    Banco: <span className="font-semibold">{proposal.financing.bankName}</span>
                  </p>
                  <p>
                    Financiado: <span className="font-semibold">{proposal.financing.financingPercent}%</span>
                  </p>
                  <p>
                    Entrada: <span className="font-semibold">{formatValue(proposal.financing.signalValue)}</span>
                  </p>
                  <p>
                    Prazo: <span className="font-semibold">{proposal.financing.term} meses</span>
                  </p>
                  <p>
                    Taxa: <span className="font-semibold">{proposal.financing.taxRate}% a.a.</span>
                  </p>
                  {proposal.financing.fgtsValue > 0 && (
                    <p>
                      FGTS: <span className="font-semibold">{formatValue(proposal.financing.fgtsValue)}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {proposal.consortium && proposal.paymentConditionTypes.includes(LeadPaymentConditionTypes.CONSORTIUM) && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Consórcio</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>
                    Valor: <span className="font-semibold">{formatValue(proposal.consortium.value)}</span>
                  </p>
                  <p>
                    Contemplada:{' '}
                    <span className="font-semibold">{proposal.consortium.consortiumContemplated ? 'Sim' : 'Não'}</span>
                  </p>
                </div>
              </div>
            )}

            {proposal.exchange && proposal.paymentConditionTypes.includes(LeadPaymentConditionTypes.EXCHANGE) && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Permuta</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>
                    Tipo: <span className="font-semibold">{exchangeTypeLabels[proposal.exchange.exchangeType]}</span>
                  </p>
                  <p>
                    Valor: <span className="font-semibold">{formatValue(proposal.exchange.exchangeValue)}</span>
                  </p>
                </div>
                {proposal.exchange.observations && (
                  <p className="text-xs mt-2">
                    <span className="font-semibold">Observações:</span> {proposal.exchange.observations}
                  </p>
                )}
              </div>
            )}

            {proposal.otherPayment && proposal.paymentConditionTypes.includes(LeadPaymentConditionTypes.OTHER) && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-semibold mb-2">Outros</p>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="font-semibold">Descrição:</span> {proposal.otherPayment.description}
                  </p>
                  <p>
                    <span className="font-semibold">Valor:</span> {formatValue(proposal.otherPayment.amount)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sinal */}
        {proposal.signal && (
          <div>
            <p className="text-xs font-semibold opacity-60 mb-2">Sinal / Condições Comerciais</p>
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <p>
                  Valor do Sinal:{' '}
                  <span className="font-semibold">
                    {proposal.signal.signalValue ? formatValue(proposal.signal.signalValue) : 'N/A'}
                  </span>
                </p>
                <p>
                  Data do Sinal:{' '}
                  <span className="font-semibold">
                    {proposal.signal.signalDate ? formatDate(proposal.signal.signalDate) : 'N/A'}
                  </span>
                </p>
                <p>
                  Índice de Correção:{' '}
                  <span className="font-semibold">{priceIndexLabels[proposal.signal.priceIndex]}</span>
                </p>
              </div>
              {proposal.signal.observations && (
                <p className="text-xs pt-2 border-t border-border">
                  <span className="font-semibold">Observações:</span> {proposal.signal.observations}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botões de Ação - Aceitar/Recusar Proposta */}
        {proposal.status === LeadProposalStatus.PENDING && (
          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold text-sm mb-3">Ações da Proposta</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="default"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleAcceptProposal}
                disabled={isPending}
              >
                <Check className="h-4 w-4 mr-2" />
                Proposta Aceita
              </Button>

              <Button variant="destructive" className="w-full" onClick={handleRejectProposal} disabled={isPending}>
                <X className="h-4 w-4 mr-2" />
                Proposta Recusada
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
