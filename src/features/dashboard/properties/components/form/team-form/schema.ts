import z from 'zod';

const teamSchema = z.object({
  name: z.string(),
  branch: z.string(),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  complement: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  notes: z.string(),
});

type TeamFormData = z.input<typeof teamSchema>;

export { teamSchema, type TeamFormData };
