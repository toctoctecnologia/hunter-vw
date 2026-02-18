import { z } from 'zod';

const timeSchema = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
  second: z.number().min(0).max(59),
});

export const appointmentSchema = z
  .object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().optional(),
    appointmentDate: z.string().min(1, 'Data é obrigatória'),
    startingTime: timeSchema,
    endingTime: timeSchema,
    color: z.string().min(1, 'Selecione uma cor'),
  })
  .refine(
    (data) => {
      const startMinutes = data.startingTime.hour * 60 + data.startingTime.minute;
      const endMinutes = data.endingTime.hour * 60 + data.endingTime.minute;
      return endMinutes > startMinutes;
    },
    {
      message: 'Horário de fim deve ser posterior ao início',
      path: ['endingTime'],
    },
  );

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
