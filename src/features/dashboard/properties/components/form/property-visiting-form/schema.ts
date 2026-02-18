import { DayOfWeek } from '@/shared/types';
import z from 'zod';

const propertyVisitingSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek, { error: 'Dia da semana é obrigatório' }),
  startTime: z.string().min(1, 'Hora de início é obrigatória'),
  endTime: z.string().min(1, 'Hora de término é obrigatória'),
});

type PropertyVisitingFormData = z.input<typeof propertyVisitingSchema>;

export { propertyVisitingSchema, type PropertyVisitingFormData };
