import z from 'zod';

const deactivateUserSchema = z.object({
  userUuid: z.string(),
  shouldRedistributeLeads: z.boolean(),
  scheduledAt: z.string(),
  leadTemperatures: z.array(z.string()),
  queueUuid: z.string(),
});

type DeactivateUserFormData = z.infer<typeof deactivateUserSchema>;

export { deactivateUserSchema, type DeactivateUserFormData };
