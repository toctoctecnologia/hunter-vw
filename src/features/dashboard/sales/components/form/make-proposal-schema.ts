import z from 'zod';

import { LeadPaymentConditionTypes, LeadPaymentExchangeType, LeadPaymentPriceIndex } from '@/shared/types';

const makeProposalSchema = z.object({
  proposalTotalValue: z.string().min(1, 'Valor total da proposta é obrigatório'),
  propertyCode: z.string().min(1, 'Código do imóvel é obrigatório'),
  validity: z.string().datetime({ message: 'Validade inválida' }),
  paymentConditionTypes: z
    .array(z.nativeEnum(LeadPaymentConditionTypes))
    .min(1, 'Selecione pelo menos uma condição de pagamento'),
  ownResources: z
    .object({
      resourcesAmount: z.string().min(1, 'Valor dos recursos próprios inválido'),
      balance: z.string().min(1, 'Saldo inválido'),
    })
    .nullish(),
  financing: z
    .object({
      bankUuid: z.string().min(1, 'Selecione um banco'),
      financingPercent: z.string().min(1, { error: 'Percentual de financiamento inválido' }),
      signalValue: z.string().min(1, 'Valor do sinal inválido'),
      term: z.string().min(1, { error: 'Prazo inválido' }),
      taxRate: z.number().min(0, 'Taxa de juros inválida'),
      fgtsValue: z.string().min(1, 'Valor do FGTS inválido'),
    })
    .nullish(),
  consortium: z
    .object({
      value: z.string().min(1, 'Valor do consórcio inválido'),
      consortiumContemplated: z.boolean(),
    })
    .nullish(),
  exchange: z
    .object({
      exchangeType: z.nativeEnum(LeadPaymentExchangeType),
      exchangeValue: z.string().min(1, 'Valor da permuta inválido'),
      observations: z.string().optional(),
    })
    .nullish(),
  otherPayment: z
    .object({
      description: z.string().min(1, 'Descrição é obrigatória'),
      amount: z.string().min(1, 'Valor inválido'),
    })
    .nullish(),
  signal: z
    .object({
      signalValue: z.string().nullish(),
      signalDate: z.string().nullish(),
      priceIndex: z.nativeEnum(LeadPaymentPriceIndex).nullish(),
      observations: z.string().nullish(),
    })
    .nullish(),
});

type MakeProposalFormData = z.infer<typeof makeProposalSchema>;

export { makeProposalSchema, type MakeProposalFormData };
