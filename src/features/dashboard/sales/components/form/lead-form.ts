import { z } from 'zod';

import { LeadIntensityType, LeadNegotiationType, LeadOriginType } from '@/shared/types';

export const leadFormSchema = z.object({
  // 1 - Informações Pessoais
  name: z.string().min(1, 'Nome é obrigatório'),
  phone1: z.string().min(1, 'Telefone principal é obrigatório'),
  phone2: z.string().optional(),
  email: z.union([z.email('E-mail inválido'), z.literal('')]).optional(),
  // 2 - Produto (Interesse)
  productTitle: z.string().optional(),
  productPrice: z.string().optional(),
  propertyCode: z.string().optional(),
  negotiationType: z.nativeEnum(LeadNegotiationType, { error: 'Tipo de negociação é obrigatório' }),
  adUrl: z.union([z.string().url('URL inválida'), z.literal('')]).optional(),
  // 3 - Forma de entrada (Fonte)
  originType: z.nativeEnum(LeadOriginType, { error: 'Fonte de entrada é obrigatória' }),
  // 4 - Atribuição e Regras
  catcherUuid: z.string().optional(),
  canModifyQueue: z.boolean(),
  canJoinRoletao: z.boolean(),
  messageToCatcher: z.string().optional(),
  // 5 - Origem do Contato
  contactOriginType: z.enum(['INBOUND', 'OUTBOUND']),
  intensityType: z.nativeEnum(LeadIntensityType).optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const contactOriginOptions = [
  {
    value: 'INBOUND',
    label: 'Inbound – O cliente veio até você',
    description: 'Ex.: portais, site, anúncios, WhatsApp do anúncio',
  },
  {
    value: 'OUTBOUND',
    label: 'Outbound – O corretor foi atrás do cliente',
    description: 'Ex.: lista de contatos, indicações ativas, prospecção manual, follow-ups',
  },
];
