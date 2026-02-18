import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { digitsOnly, isValidCPF } from '@/lib/validators/doc';

import type { OnboardingPessoaFisica } from './types';

const stepEmpresaPFSchema = z.object({
  fullName: z.string().min(3, 'Informe o nome completo.'),
  cpf: z
    .string()
    .min(1, 'Informe o CPF.')
    .transform(digitsOnly)
    .refine(isValidCPF, {
      message: 'Informe um CPF válido.'
    }),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z
    .string()
    .min(1, 'Informe o telefone.')
    .transform(digitsOnly)
    .refine((value) => value.length >= 10, {
      message: 'O telefone deve conter DDD e número.'
    }),
  creci: z.string().min(3, 'Informe o número do CRECI.'),
  city: z.string().min(2, 'Informe sua cidade de atuação.')
});

export type StepEmpresaPFValues = z.infer<typeof stepEmpresaPFSchema>;

interface StepEmpresaPFProps {
  defaultValues: OnboardingPessoaFisica;
  onBack: () => void;
  onSubmit: (values: StepEmpresaPFValues) => void;
}

export function StepEmpresaPF({ defaultValues, onBack, onSubmit }: StepEmpresaPFProps) {
  const form = useForm<StepEmpresaPFValues>({
    resolver: zodResolver(stepEmpresaPFSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Dados do corretor</h2>
        <p className="text-sm text-muted-foreground">
          Essas informações serão utilizadas para gerar o contrato, liberar o painel e comunicar novidades relevantes.
        </p>
      </div>

      <Alert className="border-l-4 border-l-emerald-500 bg-emerald-50 text-emerald-900">
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          O CPF e o CRECI serão validados automaticamente. Caso identifiquemos alguma divergência, nosso time entrará em contato.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <Input placeholder="Ex: Maria Fernandes" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <Input inputMode="numeric" placeholder="00000000000" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone com DDD</FormLabel>
                  <Input inputMode="tel" placeholder="11999999999" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail profissional</FormLabel>
                  <Input type="email" placeholder="nome@imobiliaria.com" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creci"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRECI</FormLabel>
                  <Input placeholder="XXXXX-F" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade de atuação</FormLabel>
                <Input placeholder="São Paulo / SP" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

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

export default StepEmpresaPF;
