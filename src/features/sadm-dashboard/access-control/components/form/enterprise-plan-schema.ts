import z from 'zod';

const enterprisePlanSchema = z.object({
  activeUsersAmount: z.string().min(1, 'Informe a quantidade de usuários ativos'),
  activePropertiesAmount: z.string().min(1, 'Informe a quantidade de propriedades ativas'),
  signaturePrice: z.string().min(1, 'Informe o preço da assinatura'),
  paymentPeriodEnum: z.enum(['MONTHLY', 'ANNUAL']).optional(),
});

type EnterprisePlanFormData = z.input<typeof enterprisePlanSchema>;

export { enterprisePlanSchema, type EnterprisePlanFormData };
