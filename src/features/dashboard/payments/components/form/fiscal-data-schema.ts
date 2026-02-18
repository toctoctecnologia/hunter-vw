import z from 'zod';

const fiscalDataSchema = z.object({
  name: z.string().min(1, { error: 'Razão Social é obrigatória' }),
  federalDocument: z.string().min(1, { error: 'CNPJ é obrigatório' }),
  addressInfo: z.object({
    zipCode: z.string().min(1, { error: 'CEP é obrigatório' }),
    street: z.string().min(1, { error: 'Rua é obrigatória' }),
    number: z.string().min(1, { error: 'Número é obrigatório' }),
    complement: z.string(),
    neighborhood: z.string().min(1, { error: 'Bairro é obrigatório' }),
    city: z.string().min(1, { error: 'Cidade é obrigatória' }),
    state: z.string().min(1, { error: 'Estado é obrigatório' }),
  }),
});

type FiscalDataFormData = z.infer<typeof fiscalDataSchema>;

export { fiscalDataSchema, type FiscalDataFormData };
