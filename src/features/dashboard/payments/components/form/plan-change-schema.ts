import z from 'zod';
import { PaymentPeriodType, PaymentBillingType } from '@/shared/types';

const planChangeSchema = z
  .object({
    newPlanUuid: z.string().min(1, { error: 'O plano é obrigatório.' }),
    paymentPeriod: z.nativeEnum(PaymentPeriodType, { error: 'O período de pagamento é obrigatório.' }),
    billingType: z.nativeEnum(PaymentBillingType, { error: 'O tipo de cobrança é obrigatório.' }),
    cardHolderName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiryDate: z.string().optional(),
    cardCvv: z.string().optional(),
    cardHolderCpfCnpj: z.string().optional(),
    couponCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // MONTHLY period always requires CREDIT_CARD
    if (data.paymentPeriod === PaymentPeriodType.MONTHLY && data.billingType !== PaymentBillingType.CREDIT_CARD) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Planos mensais exigem pagamento por cartão de crédito.',
        path: ['billingType'],
      });
    }

    // Credit card requires card fields
    if (data.billingType === PaymentBillingType.CREDIT_CARD) {
      if (!data.cardHolderName || data.cardHolderName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nome no cartão é obrigatório.',
          path: ['cardHolderName'],
        });
      }
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 13) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Número do cartão inválido.',
          path: ['cardNumber'],
        });
      }
      if (!data.cardExpiryDate || !/^\d{2}\/\d{2}$/.test(data.cardExpiryDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Data de validade inválida (MM/AA).',
          path: ['cardExpiryDate'],
        });
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CVV inválido.',
          path: ['cardCvv'],
        });
      }
      if (!data.cardHolderCpfCnpj || data.cardHolderCpfCnpj.replace(/\D/g, '').length < 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CPF/CNPJ do titular é obrigatório.',
          path: ['cardHolderCpfCnpj'],
        });
      }
    }
  });

type PlanChangeFormData = z.infer<typeof planChangeSchema>;

type PlanChangeSubmitData = {
  newPlanUuid: string;
  paymentPeriod: PaymentPeriodType;
  billingType: PaymentBillingType;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    cpfCnpj: string;
  };
  couponCode?: string;
};

export { planChangeSchema, type PlanChangeFormData, type PlanChangeSubmitData };
