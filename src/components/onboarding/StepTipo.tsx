import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

import type { OnboardingAccountType } from './types';

const stepTipoSchema = z.object({
  accountType: z.enum(['pf', 'pj'], {
    errorMap: () => ({ message: 'Selecione o tipo de operação que melhor representa sua imobiliária.' })
  })
});

export type StepTipoValues = z.infer<typeof stepTipoSchema>;

interface StepTipoProps {
  defaultValue: OnboardingAccountType | null;
  onSubmit: (values: StepTipoValues) => void;
}

const options: Array<{
  value: OnboardingAccountType;
  title: string;
  description: string;
  helper: string;
}> = [
  {
    value: 'pf',
    title: 'Pessoa física',
    description: 'Para corretores autônomos que precisam centralizar o funil e os clientes.',
    helper: 'Ideal para quem está começando ou trabalha de forma independente.'
  },
  {
    value: 'pj',
    title: 'Pessoa jurídica',
    description: 'Para imobiliárias estruturadas que possuem equipe, carteira de imóveis e múltiplas operações.',
    helper: 'Permite cadastrar matriz e filiais, controlar equipe e acessar recursos avançados.'
  }
];

export function StepTipo({ defaultValue, onSubmit }: StepTipoProps) {
  const form = useForm<StepTipoValues>({
    resolver: zodResolver(stepTipoSchema),
    defaultValues: {
      accountType: defaultValue ?? undefined
    }
  });

  useEffect(() => {
    if (defaultValue) {
      form.reset({ accountType: defaultValue });
    }
  }, [defaultValue, form]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Qual é o tipo da sua operação?</h2>
        <p className="text-sm text-muted-foreground">
          Conte para a gente como sua imobiliária está estruturada para que possamos configurar as permissões e os recursos corretos.
        </p>
      </div>

      <Alert className="border-l-4 border-l-orange-500 bg-orange-50/70 text-orange-900">
        <AlertTitle>Por que perguntamos isso?</AlertTitle>
        <AlertDescription>
          Utilizamos o tipo de operação para liberar recursos exclusivos. Você pode atualizar essa informação depois nas configurações da conta.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
          })}
        >
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {options.map((option) => {
                    const isSelected = field.value === option.value;

                    return (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={cn(
                          'cursor-pointer rounded-xl border bg-card p-5 text-left shadow-sm transition hover:shadow-md',
                          isSelected ? 'border-orange-500 ring-2 ring-orange-100' : 'border-border'
                        )}
                      >
                        <Card className="border-none shadow-none">
                          <CardHeader className="space-y-1 p-0">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold">{option.title}</CardTitle>
                              <RadioGroupItem value={option.value} id={option.value} className="border-orange-500" />
                            </div>
                            <CardDescription className="text-sm text-muted-foreground">
                              {option.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="mt-4 space-y-2 p-0 text-sm text-muted-foreground">
                            <p>{option.helper}</p>
                            {isSelected && (
                              <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                Selecionado
                              </span>
                            )}
                          </CardContent>
                        </Card>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </FormItem>
            )}
          />

          {form.formState.errors.accountType ? (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.accountType.message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" type="button" disabled>
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

export default StepTipo;
