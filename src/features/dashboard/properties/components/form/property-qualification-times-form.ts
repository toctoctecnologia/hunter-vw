import { z } from 'zod';

const propertyQualificationTimesFormSchema = z.object({
  recentMaxDays: z.string().min(1, { error: 'Valor obrigatório' }),
  attentionMinDays: z.string().min(1, { error: 'Valor obrigatório' }),
  attentionMaxDays: z.string().min(1, { error: 'Valor obrigatório' }),
  urgentMinDays: z.string().min(1, { error: 'Valor obrigatório' }),
});

type PropertyQualificationTimesFormData = z.infer<typeof propertyQualificationTimesFormSchema>;

export { propertyQualificationTimesFormSchema, type PropertyQualificationTimesFormData };
