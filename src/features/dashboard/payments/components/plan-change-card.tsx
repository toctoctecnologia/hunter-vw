'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Calendar, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { PlanStatus } from '@/shared/types';
import { formatDate, formatValue } from '@/shared/lib/utils';

import { getPlanChange, cancelPlanChange } from '@/features/dashboard/payments/api/subscription';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Loading } from '@/shared/components/loading';

interface PlanChangeCardProps {
  onRequestChange: () => void;
}

function getStatusBadge(status: PlanStatus) {
  const statusConfig: Record<PlanStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    [PlanStatus.PENDING]: { label: 'Pendente', variant: 'secondary' },
    [PlanStatus.AWAITING_PAYMENT]: { label: 'Aguardando pagamento', variant: 'outline' },
    [PlanStatus.PROCESSED]: { label: 'Processado', variant: 'default' },
    [PlanStatus.CANCELLED]: { label: 'Cancelado', variant: 'destructive' },
    [PlanStatus.EXPIRED]: { label: 'Expirado', variant: 'destructive' },
  };

  const config = statusConfig[status] || { label: status, variant: 'secondary' as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getStatusIcon(status: PlanStatus) {
  switch (status) {
    case PlanStatus.PROCESSED:
      return <CheckCircle className="size-5 text-green-500" />;
    case PlanStatus.CANCELLED:
    case PlanStatus.EXPIRED:
      return <XCircle className="size-5 text-destructive" />;
    case PlanStatus.AWAITING_PAYMENT:
      return <CreditCard className="size-5 text-orange-500" />;
    default:
      return <Clock className="size-5 text-muted-foreground" />;
  }
}

export function PlanChangeCard({ onRequestChange }: PlanChangeCardProps) {
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: planChange, isLoading } = useQuery({
    queryKey: ['plan-change'],
    queryFn: getPlanChange,
  });

  const { mutate: handleCancelPlanChange, isPending: isCancelling } = useMutation({
    mutationFn: cancelPlanChange,
    onSuccess: () => {
      toast.success('Mudança de plano cancelada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plan-change'] });
      setShowCancelModal(false);
    },
    onError: () => {
      toast.error('Erro ao cancelar mudança de plano. Tente novamente.');
    },
  });

  const canCancel = planChange && (planChange.status === PlanStatus.PENDING || planChange.status === PlanStatus.AWAITING_PAYMENT);

  return (
    <>
      <AlertModal
        title="Cancelar mudança de plano"
        description="Tem certeza que deseja cancelar esta mudança de plano? O seu plano atual permanecerá inalterado."
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => handleCancelPlanChange()}
        loading={isCancelling}
        isDestructive={true}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mudança de plano</CardTitle>
              <CardDescription>Gerencie alterações no seu plano atual</CardDescription>
            </div>
            {!planChange && !isLoading && <Button onClick={onRequestChange}>Alterar plano</Button>}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Loading />
          ) : !planChange ? (
            <TypographyMuted>Nenhuma mudança de plano pendente.</TypographyMuted>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b bg-muted/50">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(planChange.status)}
                    <span className="font-semibold">Mudança solicitada</span>
                  </div>
                  {getStatusBadge(planChange.status)}
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 rounded-md bg-secondary border">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Plano atual</p>
                      <p className="font-medium truncate">{planChange.currentPlanName}</p>
                      <p className="text-sm text-muted-foreground">
                        {planChange.currentPaymentPeriod === 'MONTHLY' ? 'Mensal' : 'Anual'}
                      </p>
                    </div>
                    <ArrowRight className="size-5 text-primary shrink-0 rotate-90 sm:rotate-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Novo plano</p>
                      <p className="font-medium text-primary truncate">{planChange.newPlanName}</p>
                      <p className="text-sm text-muted-foreground">
                        {planChange.newPaymentPeriod === 'MONTHLY' ? 'Mensal' : 'Anual'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-3 p-3 rounded-md bg-secondary border">
                      <CreditCard className="size-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Novo valor</p>
                        <p className="font-semibold">{formatValue(planChange.newSignaturePrice)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-secondary border">
                      <Calendar className="size-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Data de vigência</p>
                        <p className="font-semibold">{formatDate(planChange.effectiveDate)}</p>
                      </div>
                    </div>
                  </div>

                  {planChange.isUpgrade && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                      <CheckCircle className="size-4 shrink-0" />
                      <span>Este é um upgrade de plano</span>
                    </div>
                  )}

                  {planChange.paymentLink && planChange.status === PlanStatus.AWAITING_PAYMENT && (
                    <div className="p-3 rounded-md bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                      <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">
                        Complete o pagamento para ativar seu novo plano.
                      </p>
                      <Button variant="default" size="sm" asChild>
                        <a href={planChange.paymentLink} target="_blank" rel="noopener noreferrer">
                          <CreditCard className="size-4 mr-2" />
                          Ir para pagamento
                        </a>
                      </Button>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t">
                    {canCancel && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowCancelModal(true)}
                        className="w-full sm:w-auto"
                      >
                        Cancelar mudança
                      </Button>
                    )}
                    {planChange.status !== PlanStatus.PENDING && planChange.status !== PlanStatus.AWAITING_PAYMENT && (
                      <Button onClick={onRequestChange} size="sm" className="w-full sm:w-auto">
                        Solicitar nova mudança
                      </Button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-muted/50 border-t">
                  <p className="text-xs text-muted-foreground">Solicitado em {formatDate(planChange.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
