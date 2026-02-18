import z from 'zod';

const catcherAssignmentSchema = z.object({
  catcherUuid: z.string().optional(),
  percentage: z.string().min(1, { error: 'Porcentagem é obrigatória' }),
  referredBy: z.string().optional(),
  isMain: z.boolean().optional(),
});

type PropertyCatcherAssignmentFormData = z.input<typeof catcherAssignmentSchema>;

export { catcherAssignmentSchema, type PropertyCatcherAssignmentFormData };
