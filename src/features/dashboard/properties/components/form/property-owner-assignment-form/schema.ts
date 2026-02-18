import z from 'zod';

const ownerAssignmentSchema = z.object({
  name: z.string().optional(),
  cpfCnpj: z.string().optional(),
  percentage: z.string().optional(),
  phone: z.string().optional(),
});

type OwnerAssignmentFormData = z.input<typeof ownerAssignmentSchema>;

export { ownerAssignmentSchema, type OwnerAssignmentFormData };
