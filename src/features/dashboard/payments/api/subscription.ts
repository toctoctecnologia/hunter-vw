import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { NewSubscriptionPlanChangeItem, PaymentItem, SubscriptionPlanChangeItem } from '@/shared/types';

import { PlanChangeSubmitData } from '@/features/dashboard/payments/components/form/plan-change-schema';

export async function getPayments(pagination: PaginationState) {
  const { data } = await api.get<{ payments: PaymentItem[]; hasMore: boolean; totalCount: number }>(
    'subscription/payments',
    {
      params: {
        offset: pagination.pageIndex,
        limit: pagination.pageSize,
      },
    },
  );
  return data;
}

// Retorna informações sobre uma mudança de plano pendente, se houver.
// Retorno:
//    Informações da mudança pendente (plano atual, novo plano, data de vigência, etc.)
//    null se não houver mudança pendente
export async function getPlanChange() {
  const { data } = await api.get<SubscriptionPlanChangeItem | null>('subscription/plan-change');
  return data;
}

// Agenda uma mudança de plano (upgrade ou downgrade) para a conta do usuário autenticado. Utiliza checkout transparente para processar o pagamento sem redirecionamento. A mudança entrará em vigor na data de expiração da assinatura atual.

// Regras de negócio:

// A assinatura deve estar ativa (data de expiração no futuro)
// O novo plano deve ser diferente do plano atual
// Se houver mudança pendente anterior, ela será automaticamente cancelada
// Para CREDIT_CARD: o creditCardToken é obrigatório
// Comportamento por tipo de pagamento (billingType):

// CREDIT_CARD: Processa o pagamento imediatamente. Requer creditCardToken obtido via tokenização no frontend.
// PIX: Retorna QR Code (pixQrCodeBase64) e payload (pixPayload) para pagamento. O cliente deve pagar dentro do prazo de expiração.
// BOLETO: Retorna URL do boleto (boletoUrl) e código de barras (boletoBarCode). O cliente deve pagar até a data de vencimento.
// Segurança:

// Para CREDIT_CARD, o token deve ser obtido via tokenização do Asaas no frontend
// Dados sensíveis do cartão NUNCA trafegam pelo backend
// O IP do cliente é capturado automaticamente para validação antifraude
export async function newPlanChange(formData: PlanChangeSubmitData) {
  const { data } = await api.post<NewSubscriptionPlanChangeItem>('subscription/plan-change', formData);
  return data;
}

// Cancela uma mudança de plano pendente para a conta do usuário autenticado.
// Regras de negócio:
// Deve existir uma mudança de plano pendente ou aguardando pagamento
// Comportamento:
// A mudança pendente é marcada como cancelada
// O plano atual permanece inalterado
export async function cancelPlanChange() {
  await api.delete('subscription/plan-change');
}

// Cancela a assinatura de pagamento recorrente mensal da conta do usuário autenticado.

// Regras de negócio:

// Apenas assinaturas com período MONTHLY podem ser canceladas
// Assinaturas anuais são cobranças únicas sem recorrência, não aplicável
// A assinatura deve estar ativa (data de expiração no futuro)
// Deve existir um ID de assinatura do Asaas associado
// Comportamento após cancelamento:

// A assinatura permanece ativa até a data de expiração atual
// Não haverá novas cobranças automáticas
// O cancelamento é irreversível no Asaas
export async function cancelMonthlySubscription() {
  const { data } = await api.delete<{ message: string; asaasSubscriptionId: string; cancelled: boolean }>(
    'subscription/cancel',
  );
  return data;
}
