import { z } from 'zod';
import { QueueRuleOperationTypes } from '@/shared/types';

export const taskSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  nextUserEnabled: z.boolean().optional(),
  timeLimitMinutes: z.number().optional(),
  color: z.string().min(1, 'Selecione uma cor'),
  checkinConfig: z.object({
    checkInRequired: z.boolean().optional(),
    timeWindowEnabled: z.boolean().optional(),
    startingTime: z.string(),
    endingTime: z.string(),
    daysOfWeek: z.string(),
    qrCodeEnabled: z.boolean().optional(),
  }),
  rules: z.array(
    z.object({
      ruleUuid: z.string(),
      value: z.string(),
      operation: z.enum(QueueRuleOperationTypes),
    }),
  ),
});

export type QueueFormData = z.infer<typeof taskSchema>;
