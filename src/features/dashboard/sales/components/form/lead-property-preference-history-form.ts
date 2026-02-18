import { z } from 'zod';

import { PropertyType } from '@/shared/types';

const leadPropertyPreferenceHistoryFormSchema = z.object({
  area: z.string().optional(),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  garageSpots: z.string().optional(),
  suites: z.string().optional(),
  internalArea: z.string().optional(),
  externalArea: z.string().optional(),
  lotArea: z.string().optional(),
  propertyValue: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType, { error: 'Tipo de imóvel é obrigatório' }),
  city: z.string().optional(),
  state: z.string().optional(),
  neighborhood: z.string().optional(),
});

type LeadPropertyPreferenceHistoryFormData = z.infer<typeof leadPropertyPreferenceHistoryFormSchema>;

export { leadPropertyPreferenceHistoryFormSchema, type LeadPropertyPreferenceHistoryFormData };
