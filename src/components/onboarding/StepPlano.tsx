import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

import type { OnboardingPlan } from './types';

const stepPlanoSchema = z.object({
  plan: z.enum(['starter', 'growth', 'scale'], {
    errorMap: () => ({ message: 'Escolha um plano para continuar.' })
  }),
  billingCycle: z.enum(['monthly', 'yearly'])
});

export type StepPlanoValues = z.infer<typeof stepPlanoSchema>;

interface StepPlanoProps {
  defaultPlan: OnboardingPlan | null;
  defaultBillingCycle: 'monthly' | 'yearly';
  onBack: () => void;
  onSubmit: (values: StepPlanoValues) => void;
}

const plans: Array<{
  value: OnboardingPlan;
  title: string;
  description: string;
  price: string;
  highlight?: string;
  benefits: string[];
}> = [
  {
    value: 'starter',
    title: 'Essencial',
    description: 'Perfeito para validar o processo e iniciar sua operação digital.',
    price: 'R$ 249/mês',
    benefits: [
      'Até 2 usuários',
      'Integração básica com portais',
      'Funil de vendas completo'
    ]
  },
  {
    value: 'growth',
    title: 'Growth',
    description: 'Para equipes que precisam escalar captação e atendimento.',
    price: 'R$ 489/mês',
    highlight: 'Mais popular',
    benefits: [
      'Equipe ilimitada',
      'Automação de leads e SLA',
      'Dashboards gerenciais'
    ]
  },
  {
    value: 'scale',
    title: 'Scale',
    description: 'Indicado para redes com múltiplas filiais e squads especializados.',
    price: 'Fale com o time',
    benefits: [
      'Gerenciamento de filiais',
      'Integração avançada com ERP',
      'Suporte dedicado e onboarding premium'
    ]
  }
];

export function StepPlano({ defaultPlan, defaultBillingCycle, onBack, onSubmit }: StepPlanoProps) {
  const form = useForm<StepPlanoValues>({
    resolver: zodResolver(stepPlanoSchema),
    defaultValues: {
      plan: defaultPlan ?? undefined,
      billingCycle: defaultBillingCycle
    }
  });

  useEffect(() => {
    form.reset({ plan: defaultPlan ?? undefined, billingCycle: defaultBillingCycle });
  }, [defaultPlan, defaultBillingCycle, form]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Escolha o plano ideal</h2>
          <p className="text-sm text-muted-foreground">
            Você pode alterar o plano a qualquer momento. A cobrança só será ativada após a conclusão do onboarding e confirmação pela nossa equipe.
          </p>
        </div>
        <Button variant="ghost" onClick={onBack} className="self-end md:self-auto">
          Voltar para tipo de operação
        </Button>
      </div>

      <Alert className="border-l-4 border-l-blue-500 bg-blue-50 text-blue-900">
        <AlertTitle>Pagando anualmente você economiza 15%</AlertTitle>
        <AlertDescription>
          Altere o ciclo de cobrança para anual e aproveite condições diferenciadas durante o lançamento do Hunter.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values);
          })}
        >
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Ciclo de cobrança</Label>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                  className="mt-2 inline-flex rounded-full border bg-muted/60 p-1 text-sm"
                >
                  <ToggleGroupItem value="monthly" className="rounded-full px-4 py-1">
                    Mensal
                  </ToggleGroupItem>
                  <ToggleGroupItem value="yearly" className="rounded-full px-4 py-1">
                    Anual
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-4 md:grid-cols-3"
                >
                  {plans.map((plan) => {
                    const isSelected = field.value === plan.value;

                    return (
                      <Label
                        key={plan.value}
                        htmlFor={plan.value}
                        className={cn(
                          'group relative flex h-full cursor-pointer flex-col rounded-xl border bg-card p-5 text-left shadow-sm transition hover:border-orange-300 hover:shadow-lg',
                          isSelected ? 'border-orange-500 ring-2 ring-orange-100' : 'border-border'
                        )}
                      >
                        {plan.highlight ? (
                          <Badge className="absolute right-4 top-4 bg-orange-500/10 text-orange-600 ring-1 ring-orange-200">
                            {plan.highlight}
                          </Badge>
                        ) : null}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg font-semibold text-foreground">{plan.title}</CardTitle>
                            <CardDescription className="mt-1 text-sm text-muted-foreground">
                              {plan.description}
                            </CardDescription>
                          </div>
                          <RadioGroupItem id={plan.value} value={plan.value} className="border-orange-500" />
                        </div>
                        <CardContent className="mt-4 flex flex-1 flex-col justify-between gap-4 p-0 text-sm">
                          <p className="text-base font-semibold text-foreground">{plan.price}</p>
                          <ul className="space-y-2 text-muted-foreground">
                            {plan.benefits.map((benefit) => (
                              <li key={benefit} className="flex items-start gap-2">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        {isSelected ? (
                          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600">
                            <ArrowRight className="h-4 w-4" /> Plano selecionado
                          </div>
                        ) : null}
                      </Label>
                    );
                  })}
                </RadioGroup>
              </FormItem>
            )}
          />

          {form.formState.errors.plan ? (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.plan.message}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
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

export default StepPlano;
