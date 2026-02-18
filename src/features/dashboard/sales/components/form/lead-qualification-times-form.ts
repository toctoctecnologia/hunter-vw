import { z } from 'zod';

const leadQualificationTimesFormSchema = z.object({
  recentMaxDays: z.string().min(1, { error: 'Valor obrigatório' }),
  attentionMinDays: z.string().min(1, { error: 'Valor obrigatório' }),
  attentionMaxDays: z.string().min(1, { error: 'Valor obrigatório' }),
  urgentMinDays: z.string().min(1, { error: 'Valor obrigatório' }),
});

type LeadQualificationTimesFormData = z.infer<typeof leadQualificationTimesFormSchema>;

export { leadQualificationTimesFormSchema, type LeadQualificationTimesFormData };
