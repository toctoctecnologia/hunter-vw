import z from 'zod';

const planSchema = z.object({
  description: z.string().min(10, { error: 'Descrição muito curta' }),
  monthlyPrice: z.string(),
  annualPrice: z.string(),
  activeUsersAmount: z.string(),
  activePropertiesAmount: z.string(),
});

interface PlanFormData {
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  activeUsersAmount: string;
  activePropertiesAmount: string;
}

export { planSchema, type PlanFormData };
