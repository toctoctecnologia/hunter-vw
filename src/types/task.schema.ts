import { z } from 'zod';

export const leadLiteSchema = z.object({
  id: z.string(),
  nome: z.string(),
  telefone: z.string().optional(),
  email: z.string().optional(),
  interesse: z.string().optional(),
  origem: z.string().optional().nullable(),
});

export const taskStatusSchema = z.enum(['todo', 'done', 'cancelled']);

export const taskTypeSchema = z.enum([
  'follow-up',
  'document',
  'appointment',
  'message',
  'call',
  'callback',
  'visit',
  'email',
  'other',
]);

export const taskReminderSchema = z.object({
  id: z.string(),
  remindAt: z.string().datetime({ offset: true }),
});

export const taskPropertySchema = z.object({
  id: z.number(),
  codigo: z.string(),
  titulo: z.string(),
  endereco: z.string(),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: taskTypeSchema,
  lead: leadLiteSchema.optional(),
  leadId: z.string().optional(),
  color: z.string().optional(),
  dueAt: z.string().datetime({ offset: true }),
  durationMin: z.number().int().optional(),
  location: z.string().optional(),
  property: taskPropertySchema.optional(),
  status: taskStatusSchema,
  reminders: z.array(taskReminderSchema),
  notes: z.string().optional(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskType = z.infer<typeof taskTypeSchema>;
export type TaskReminder = z.infer<typeof taskReminderSchema>;
export type TaskProperty = z.infer<typeof taskPropertySchema>;
export type Task = z.infer<typeof taskSchema>;
export type LeadLite = z.infer<typeof leadLiteSchema>;
