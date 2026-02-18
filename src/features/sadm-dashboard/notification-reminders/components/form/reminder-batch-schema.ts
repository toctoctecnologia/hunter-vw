import z from 'zod';
import { DayOfWeek, NotificationFrequency, NotificationType } from '@/shared/types';

const reminderBatchSchema = z.object({
  userUuid: z.string().optional(),
  reminderUuid: z.string().optional(),
  templateUuid: z.string().optional(),
  notificationType: z.nativeEnum(NotificationType, { error: 'Tipo do lembrete é obrigatório' }),
  frequency: z.nativeEnum(NotificationFrequency, { error: 'Frequência do lembrete é obrigatória' }),
  dayOfWeek: z.nativeEnum(DayOfWeek).nullish(),
  dayOfMonth: z.string().nullish(),
  reminderTime: z.string().min(1, { error: 'Horário do lembrete é obrigatório' }),
  isEnabled: z.boolean(),
});

type ReminderBatchFormData = z.infer<typeof reminderBatchSchema>;

export { reminderBatchSchema, type ReminderBatchFormData };
