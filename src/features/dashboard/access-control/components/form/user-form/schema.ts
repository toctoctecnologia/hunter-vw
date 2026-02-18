import z from 'zod';

const userSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.email({ message: 'E-mail inválido' }),
  phone: z.string().min(10, { message: 'Telefone inválido' }),
  profileCode: z.string().min(1, { message: 'Selecione um perfil' }),
});

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  profileCode: string;
}

export { userSchema, type UserFormData };
