'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CreditCard, Calendar, TrendingUp, XCircle } from 'lucide-react';

import { NewSubscriptionPlanChangeItem } from '@/shared/types';
import { formatDate, translateSignatureStatus } from '@/shared/lib/utils';
import { useAuth } from '@/shared/hooks/use-auth';

import { newPlanChange, cancelMonthlySubscription } from '@/features/dashboard/payments/api/subscription';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PaymentResultModal } from '@/features/dashboard/payments/components/payment-result-modal';
import { PlanChangeModal } from '@/features/dashboard/payments/components/plan-change-modal';
import { PlanChangeCard } from '@/features/dashboard/payments/components/plan-change-card';
import { FiscalData } from '@/features/dashboard/payments/components/fiscal-data';
import { Payments } from '@/features/dashboard/payments/components/payments';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { withPermission } from '@/shared/hoc/with-permission';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const queryClient = useQueryClient();
  const { user, refreshUserInformation } = useAuth();

  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [showPaymentResultModal, setShowPaymentResultModal] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<NewSubscriptionPlanChangeItem | null>(null);

  const { mutate: handleNewPlanChange, isPending: isSubmitting } = useMutation({
    mutationFn: newPlanChange,
    onSuccess: (data) => {
      toast.success(data.message || 'Mudança de plano solicitada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['plan-change'] });
      setShowPlanChangeModal(false);
      setPaymentResult(data);
      setShowPaymentResultModal(true);
    },
  });

  const { mutate: handleCancelSubscription, isPending: isCancelling } = useMutation({
    mutationFn: cancelMonthlySubscription,
    onSuccess: (data) => {
      toast.success(data.message || 'Assinatura cancelada com sucesso!');
      setShowCancelSubscriptionModal(false);
      refreshUserInformation();
    },
    onError: () => {
      toast.error('Erro ao cancelar assinatura. Tente novamente.');
    },
  });

  const handleClosePaymentResult = () => {
    setShowPaymentResultModal(false);
    setPaymentResult(null);
  };

  const signatureStatus = user?.signatureInfo?.status;
  const expirationDate = user?.signatureInfo?.lastExpirationDate;
  const canCancelSubscription =
    signatureStatus === 'ACTIVE' && user?.userInfo?.profile?.name && expirationDate && new Date(expirationDate) > new Date();

  return (
    <>
      <PlanChangeModal
        open={showPlanChangeModal}
        onClose={() => setShowPlanChangeModal(false)}
        onSubmit={(data) => handleNewPlanChange(data)}
        isSubmitting={isSubmitting}
        currentPlanName={user?.userInfo?.profile?.name}
      />

      <PaymentResultModal open={showPaymentResultModal} onClose={handleClosePaymentResult} paymentResult={paymentResult} />

      <AlertModal
        title="Cancelar assinatura"
        description="Tem certeza que deseja cancelar sua assinatura mensal? Sua assinatura permanecerá ativa até a data de expiração atual e não haverá novas cobranças automáticas. Esta ação é irreversível."
        isOpen={showCancelSubscriptionModal}
        onClose={() => setShowCancelSubscriptionModal(false)}
        onConfirm={() => handleCancelSubscription()}
        loading={isCancelling}
        isDestructive={true}
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resumo financeiro</CardTitle>
                <CardDescription>Status atual da assinatura</CardDescription>
              </div>
              {canCancelSubscription && hasFeature(user.userInfo.profile.permissions, '2001') && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowCancelSubscriptionModal(true)}
                >
                  <XCircle className="size-4 mr-2" />
                  Cancelar assinatura
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {user?.signatureInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        signatureStatus === 'ACTIVE' || signatureStatus === 'TEST_PERIOD_ACTIVE'
                          ? 'default'
                          : signatureStatus === 'OVERDUE'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="mt-1"
                    >
                      {translateSignatureStatus(signatureStatus || '')}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo vencimento</p>
                    <p className="font-semibold">{expirationDate ? formatDate(expirationDate) : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Perfil</p>
                    <p className="font-semibold">{user?.userInfo?.profile?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <TypographyMuted>Nenhuma informação disponível.</TypographyMuted>
            )}
          </CardContent>
        </Card>

        {hasFeature(user?.userInfo.profile.permissions, '2001') ? (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <PlanChangeCard onRequestChange={() => setShowPlanChangeModal(true)} />

              <Payments />
            </div>

            <FiscalData />
          </>
        ) : (
          <Payments />
        )}
      </div>
    </>
  );
}

export default withPermission(Page, ['2000']);
