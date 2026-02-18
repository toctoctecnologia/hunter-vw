import z from 'zod';

const loginSchema = z.object({
  email: z.email({ error: 'E-mail inválido' }),
  password: z.string().min(3, { error: 'Senha incorreta' }),
});

interface LoginFormData {
  email: string;
  password: string;
}

export { loginSchema, type LoginFormData };
