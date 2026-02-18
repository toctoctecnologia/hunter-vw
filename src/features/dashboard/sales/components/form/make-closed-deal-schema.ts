import z from 'zod';
import { CommissionAgentType, LeadNegotiationType } from '@/shared/types';

const makeClosedDealSchema = z.object({
  propertyCode: z.number().min(1, 'Código do imóvel é obrigatório'),
  closedDate: z.string().min(1, 'Data de fechamento é obrigatória'),
  totalValue: z.number().positive('Valor total deve ser maior que zero'),
  totalCommission: z.string().min(1, { error: 'Comissão obrigatória' }),
  negotiationType: z.nativeEnum(LeadNegotiationType, {
    error: 'Tipo de negociação inválido',
  }),
  additionalInfo: z.string().optional(),
  commissions: z
    .array(
      z.object({
        agentUuid: z.string().optional(),
        agentType: z.nativeEnum(CommissionAgentType, {
          error: 'Tipo de agente inválido',
        }),
        agentName: z.string().optional(),
        agentEmail: z.email({ error: 'E-mail inválido' }).optional().or(z.literal('')),
        federalDocument: z.string().optional(),
        commissionPercentage: z.string().min(1, { error: 'Porcentagem obrigatória' }),
        mainResponsible: z.boolean(),
      }),
    )
    .min(1, 'Pelo menos uma comissão deve ser adicionada'),
});

type MakeClosedDealFormData = z.infer<typeof makeClosedDealSchema>;

export { makeClosedDealSchema, type MakeClosedDealFormData };
