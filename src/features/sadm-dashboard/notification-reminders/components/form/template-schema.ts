import z from 'zod';
import { NotificationType } from '@/shared/types';

const templateSchema = z.object({
  name: z.string().min(1, { error: 'Nome é obrigatório' }),
  messageText: z.string().min(1, { error: 'Mensagem é obrigatória' }),
  notificationType: z.nativeEnum(NotificationType, { error: 'Tipo é obrigatório' }),
  isActive: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export { templateSchema, type TemplateFormData };
