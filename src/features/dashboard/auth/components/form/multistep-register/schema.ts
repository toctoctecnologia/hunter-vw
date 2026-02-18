import z from 'zod';

const multistepRegisterSchema = z.object({
  accountType: z.string(),
  name: z.string({ error: 'Informe um nome válido' }),
  email: z.email({ error: 'Informe um email válido' }),
  phone: z.string().optional(),
  couponCode: z.string().optional(),
  userInformation: z.object({
    name: z.string({ error: 'Informe um nome válido' }),
    phone: z.string({ error: 'Informe um telefone válido' }).min(11, { error: 'Número de telefone inválido' }),
    ocupation: z.string().min(3, { error: 'Cargo obrigatório' }),
    complianceTermsAccepted: z.boolean().catch(false),
    marketingTermsAccepted: z.boolean().catch(false),
  }),
  personalAccountInfo: z.object({
    federalDocument: z.string({ error: 'Informe um CPF válido' }),
    creci: z.string().catch(''),
  }),
  companyAccountInfo: z.object({
    socialReason: z.string({ error: 'Informe a razão social da empresa' }),
    federalDocument: z.string({ error: 'Informe um CNPJ válido' }),
    stateRegistration: z.string().catch(''),
    municipalRegistration: z.string().catch(''),
    unitAmount: z.string().catch(''),
    website: z.string().catch(''),
    planUuid: z.string().catch(''),
  }),
  addressInfo: z.object({
    zipCode: z.string({ error: 'Informe um CEP válido' }),
    street: z.string({ error: 'Informe um logradouro válido' }),
    number: z.string({ error: 'Informe um número válido' }),
    complement: z.string().catch(''),
    neighborhood: z.string({ error: 'Informe um bairro válido' }),
    city: z.string({ error: 'Informe uma cidade válida' }),
    state: z.string({ error: 'Informe um estado válido' }),
  }),
});

type MultistepRegisterFormData = z.input<typeof multistepRegisterSchema>;

export { multistepRegisterSchema, type MultistepRegisterFormData };
