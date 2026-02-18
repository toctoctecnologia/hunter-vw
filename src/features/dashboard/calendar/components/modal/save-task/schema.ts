import { z } from 'zod';

const timeSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  second: z.number().min(0).max(59),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  taskCode: z.string().min(1, 'Tipo de tarefa é obrigatório'),
  taskDate: z.string().min(1, 'Data é obrigatória'),
  taskTime: timeSchema,
  color: z.string().min(1, 'Selecione uma cor'),
  leadUuid: z.string().optional(),
  propertyCode: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
