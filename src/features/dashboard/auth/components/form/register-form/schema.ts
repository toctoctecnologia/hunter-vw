import z from 'zod';

const registerSchema = z
  .object({
    email: z.email({ message: 'E-mail inválido' }),
    password: z.string().min(3, { message: 'Senha deve ter no mínimo 3 caracteres' }),
    confirmPassword: z.string().min(3, { message: 'Confirmação de senha obrigatória' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não conferem',
  });

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export { registerSchema, type RegisterFormData };
