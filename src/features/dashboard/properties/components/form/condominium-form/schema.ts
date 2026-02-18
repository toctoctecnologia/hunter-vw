import z from 'zod';

const condominiumSchema = z.object({
  name: z.string().min(1, 'Nome do condomínio é obrigatório'),
  price: z.string().min(1, 'Valor do condomínio é obrigatório'),
  builderUuid: z.string(),
  // edificeName: z.string().min(1, 'Nome do edifício é obrigatório'),
  description: z.string().optional(),
  years: z.string().min(1, 'Ano de construção é obrigatório'),
  manager: z.string().catch(''),
  featureUuids: z.array(z.string()).min(1, 'Selecione ao menos uma característica'),
});

type CondominiumFormData = z.input<typeof condominiumSchema>;

export { condominiumSchema, type CondominiumFormData };
