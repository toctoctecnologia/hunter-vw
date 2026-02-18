import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { digitsOnly } from '@/lib/validators/doc';

import type { OnboardingAdmin } from './types';

const stepAdminSchema = z
  .object({
    name: z.string().min(3, 'Informe o nome completo.'),
    email: z.string().email('Informe um e-mail corporativo válido.'),
    phone: z
      .string()
      .min(1, 'Informe o telefone de contato.')
      .transform(digitsOnly)
      .refine((value) => value.length >= 10, {
        message: 'O telefone deve conter DDD e número.'
      }),
    role: z.string().min(2, 'Informe o cargo ou função.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .refine((value) => /\d/.test(value) && /[A-Za-z]/.test(value), {
        message: 'Use letras e números para aumentar a segurança.'
      }),
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Você precisa aceitar os termos para continuar.' })
    }),
    marketingOptIn: z.boolean()
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas informadas não conferem.'
  });

export type StepAdminValues = z.infer<typeof stepAdminSchema>;

interface StepAdminProps {
  defaultValues: OnboardingAdmin & { marketingOptIn: boolean };
  onBack: () => void;
  onSubmit: (values: StepAdminValues) => void;
}

export function StepAdmin({ defaultValues, onBack, onSubmit }: StepAdminProps) {
  const form = useForm<StepAdminValues>({
    resolver: zodResolver(stepAdminSchema),
    defaultValues: {
      ...defaultValues,
      confirmPassword: defaultValues.password,
      acceptTerms: defaultValues.acceptTerms as true
    }
  });

  useEffect(() => {
    form.reset({ ...defaultValues, confirmPassword: defaultValues.password, acceptTerms: defaultValues.acceptTerms as true });
  }, [defaultValues, form]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Responsável pela conta</h2>
        <p className="text-sm text-muted-foreground">
          Esses dados serão utilizados para o primeiro acesso e para comunicações importantes do Hunter.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <Input placeholder="Ex: Ana Ribeiro" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail corporativo</FormLabel>
                  <Input type="email" placeholder="ana@imobiliaria.com" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <Input inputMode="tel" placeholder="11999999999" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <Input placeholder="Diretora comercial" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <Input type="password" placeholder="Crie uma senha segura" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a senha</FormLabel>
                  <Input type="password" placeholder="Repita a senha" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-muted/40 p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 text-sm">
                    <FormLabel className="text-sm font-semibold">Aceito os termos de uso e política de privacidade</FormLabel>
                    <FormDescription>
                      Concordo em seguir as diretrizes do Hunter e estou ciente da utilização dos meus dados para fins contratuais.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-lg border border-dashed bg-background p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 text-sm">
                    <FormLabel className="text-sm font-semibold">Quero receber novidades e materiais exclusivos</FormLabel>
                    <FormDescription>
                      Conteúdos sobre marketing imobiliário, performance e melhores práticas enviados quinzenalmente.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" size="lg" className="px-8">
              Continuar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default StepAdmin;
