import z from 'zod';

const unitSchema = z.object({
  socialReason: z.string().catch(''),
  federalDocument: z.string().catch(''),
  stateRegistration: z.string().catch(''),
  municipalRegistration: z.string().catch(''),
  website: z.string().catch(''),
});

type UnitFormData = z.input<typeof unitSchema>;

export { unitSchema, type UnitFormData };
