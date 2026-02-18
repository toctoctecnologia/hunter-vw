import z from 'zod';

const profileSchema = z.object({
  name: z.string().min(4, 'Nome muito curto'),
  description: z.string().min(10, 'Descrição muito curta'),
  permissions: z
    .array(
      z.object({
        code: z.string(),
      }),
    )
    .min(1, 'Você precisa selecionar pelo menos uma permissão'),
});

interface ProfileFormData {
  name: string;
  description: string;
  permissions: { code: string }[];
}

export { profileSchema, type ProfileFormData };
