import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

import { cn, formatValue } from '@/shared/lib/utils';

import { getPlans } from '@/shared/api/get-plans';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';

import { CouponCodeField } from '@/shared/components/coupon-code-field';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { CardContent, CardDescription, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';

interface PlanFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
  billingCycle: 'monthly' | 'yearly';
  setBillingCycle: Dispatch<SetStateAction<'monthly' | 'yearly'>>;
  setPlanName: Dispatch<SetStateAction<string>>;
}

export function PlanForm({ form, billingCycle, setBillingCycle, setPlanName }: PlanFormProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['saas-plans'],
    queryFn: () => getPlans(),
  });

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Escolha o plano ideal</h2>
        <p className="text-sm text-muted-foreground">
          Você pode alterar o plano a qualquer momento. A cobrança só será ativada após a conclusão do onboarding e
          confirmação pela nossa equipe.
        </p>
      </div>

      <Alert className="border-l-4 border-l-blue-500 not-dark:bg-blue-50">
        <AlertTitle>Pagando anualmente você economiza 15%</AlertTitle>
        <AlertDescription>
          Altere o ciclo de cobrança para anual e aproveite condições diferenciadas durante o lançamento do Hunter.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col items-center space-y-4">
        <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Ciclo de cobrança
        </Label>

        <ToggleGroup
          type="single"
          value={billingCycle}
          onValueChange={(value) => value && setBillingCycle(value as 'monthly' | 'yearly')}
          className="bg-muted p-1 rounded-lg"
        >
          <ToggleGroupItem
            value="monthly"
            className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-6 py-2"
          >
            Mensal
          </ToggleGroupItem>
          <ToggleGroupItem value="yearly" className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-6 py-2">
            Anual
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {data && !isLoading && (
        <FormField
          control={form.control}
          name="companyAccountInfo.planUuid"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedPlan = data.find((plan) => plan.uuid === value);
                    if (selectedPlan) {
                      setPlanName(selectedPlan.name);
                    }
                  }}
                  defaultValue={field.value}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {data.map((plan, index) => (
                    <FormItem key={plan.uuid}>
                      <FormLabel
                        htmlFor={plan.uuid}
                        className={cn(
                          'group relative flex h-full cursor-pointer flex-col rounded-2xl border-2 bg-card py-4 px-2 text-left shadow-sm transition-all duration-200',
                          'hover:border-orange-300 hover:shadow-xl',
                          field.value === plan.uuid
                            ? 'border-orange-500 shadow-lg ring-2 ring-transparent'
                            : 'border-border',
                        )}
                      >
                        {index === 1 && (
                          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg px-4 py-1">
                            Mais popular
                          </Badge>
                        )}

                        <div className="flex-1 flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg font-bold text-foreground mb-2">{plan.name}</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                              {plan.description}
                            </CardDescription>
                          </div>

                          <RadioGroupItem id={plan.uuid} value={plan.uuid} className="hidden" />
                        </div>

                        {plan.annualPrice && plan.monthlyPrice && (
                          <div>
                            <p className="text-lg font-bold text-foreground">
                              {formatValue(billingCycle === 'yearly' ? plan.annualPrice / 12 : plan.monthlyPrice)}
                            </p>

                            {billingCycle === 'yearly' && (
                              <p className="text-sm text-muted-foreground line-through">
                                {formatValue(plan.monthlyPrice)}
                              </p>
                            )}
                          </div>
                        )}

                        {plan.activePropertiesAmount && plan.activeUsersAmount ? (
                          <CardContent className="p-0">
                            <ul className="space-y-1">
                              <li className="flex items-start gap-3">
                                <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="h-2 w-2 text-orange-600" />
                                </div>
                                <span className="text-sm text-muted-foreground leading-relaxed">{`${plan.activePropertiesAmount} propriedades`}</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Check className="h-2 w-2 text-orange-600" />
                                </div>
                                <span className="text-sm text-muted-foreground leading-relaxed">{`${plan.activeUsersAmount} usuários`}</span>
                              </li>
                            </ul>
                          </CardContent>
                        ) : (
                          <CardContent className="flex-1 p-0">
                            <div className="text-lg">Fale com o time</div>
                          </CardContent>
                        )}

                        <div
                          className={cn(
                            'flex items-center gap-2 text-sm font-medium transition-all duration-200',
                            field.value === plan.uuid ? 'text-orange-600 opacity-100' : 'text-transparent opacity-0',
                          )}
                        >
                          <ArrowRight className="h-3 w-3" />
                          Plano selecionado
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      )}

      <CouponCodeField form={form} />
    </>
  );
}
