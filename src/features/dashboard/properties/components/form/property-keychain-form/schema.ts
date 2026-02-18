import z from 'zod';

import { PropertyKeychainStatus } from '@/shared/types';

const propertyKeychainSchema = z.object({
  status: z.nativeEnum(PropertyKeychainStatus),
  unit: z.string().optional(),
  board: z.string().optional(),
  boardPosition: z.string().optional(),
  sealNumber: z.string().optional(),
  keyQuantity: z.string().min(1, 'Quantidade de chaves é obrigatória'),
  observation: z.string().optional(),
});

type PropertyKeychainFormData = z.input<typeof propertyKeychainSchema>;

export { propertyKeychainSchema, type PropertyKeychainFormData };
