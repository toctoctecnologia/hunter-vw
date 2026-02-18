'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

import { ModalProps, PaymentBillingType, PaymentPeriodType, Plan } from '@/shared/types';
import { BILLING_OPTIONS } from '@/shared/lib/constants';
import { cn, formatValue } from '@/shared/lib/utils';

import { getPlans } from '@/shared/api/get-plans';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CreditCardForm } from '@/features/dashboard/payments/components/credit-card-form';
import { CardContent, CardDescription, CardTitle } from '@/shared/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { CouponCodeField } from '@/shared/components/coupon-code-field';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  planChangeSchema,
  PlanChangeFormData,
  PlanChangeSubmitData,
} from '@/features/dashboard/payments/components/form/plan-change-schema';
import { WHATSAPP_CONTACT } from '@/shared/constants';

interface PlanChangeModalProps extends Omit<ModalProps, 'title'> {
  onSubmit: (data: PlanChangeSubmitData) => void;
  isSubmitting: boolean;
  currentPlanName?: string;
}

export function PlanChangeModal({ onSubmit, isSubmitting, currentPlanName, ...rest }: PlanChangeModalProps) {
  const [step, setStep] = useState<'plan' | 'payment'>('plan');

  const form = useForm<PlanChangeFormData>({
    resolver: zodResolver(planChangeSchema),
    defaultValues: {
      newPlanUuid: '',
      paymentPeriod: PaymentPeriodType.MONTHLY,
      billingType: PaymentBillingType.CREDIT_CARD, // Default to credit card since MONTHLY requires it
      cardHolderName: '',
      cardNumber: '',
      cardExpiryDate: '',
      cardCvv: '',
      cardHolderCpfCnpj: '',
      couponCode: '',
    },
  });

  const { data: plans, isLoading } = useQuery({
    queryKey: ['saas-plans'],
    queryFn: getPlans,
  });

  const selectedPlanUuid = form.watch('newPlanUuid');
  const paymentPeriod = form.watch('paymentPeriod');
  const billingType = form.watch('billingType');

  const selectedPlan = plans?.find((p) => p.uuid === selectedPlanUuid);

  const handlePaymentPeriodChange = (value: string) => {
    if (value === PaymentPeriodType.MONTHLY) {
      form.setValue('billingType', PaymentBillingType.CREDIT_CARD);
    }
    form.setValue('paymentPeriod', value as PaymentPeriodType);
  };

  const handleNextStep = () => {
    if (!selectedPlanUuid) {
      form.setError('newPlanUuid', { message: 'Selecione um plano' });
      return;
    }
    setStep('payment');
  };

  const handleSubmit = async (data: PlanChangeFormData) => {
    if (data.billingType === PaymentBillingType.CREDIT_CARD) {
      // Send card data to backend for tokenization
      const [expiryMonth, expiryYear] = (data.cardExpiryDate || '').split('/');
      onSubmit({
        newPlanUuid: data.newPlanUuid,
        paymentPeriod: data.paymentPeriod,
        billingType: data.billingType,
        couponCode: data.couponCode,
        creditCard: {
          holderName: data.cardHolderName || '',
          number: (data.cardNumber || '').replace(/\s/g, ''),
          expiryMonth: expiryMonth || '',
          expiryYear: expiryYear?.length === 2 ? `20${expiryYear}` : expiryYear || '',
          ccv: data.cardCvv || '',
        },
        creditCardHolderInfo: {
          name: data.cardHolderName || '',
          cpfCnpj: (data.cardHolderCpfCnpj || '').replace(/\D/g, ''),
        },
      });
    } else {
      // PIX or BOLETO - submit directly
      onSubmit({
        newPlanUuid: data.newPlanUuid,
        paymentPeriod: data.paymentPeriod,
        billingType: data.billingType,
        couponCode: data.couponCode,
      });
    }
  };

  const handleClose = () => {
    setStep('plan');
    form.reset();
    rest.onClose();
  };

  const getPrice = (plan: Plan) => {
    return paymentPeriod === PaymentPeriodType.ANNUAL ? plan.annualPrice / 12 : plan.monthlyPrice;
  };

  const handleWhatsAppMessage = () => {
    const message = 'Olá, desejo alterar meu plano para o Enterprise.';
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Modal
      {...rest}
      onClose={handleClose}
      className="sm:max-w-2xl"
      title="Alterar plano"
      description="Selecione um novo plano e forma de pagamento"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {step === 'plan' ? (
            <>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Ciclo de cobrança
                  </Label>

                  <FormField
                    control={form.control}
                    name="paymentPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            value={field.value}
                            onValueChange={(value) => value && handlePaymentPeriodChange(value)}
                            className="bg-muted p-1 rounded-lg"
                          >
                            <ToggleGroupItem
                              value={PaymentPeriodType.MONTHLY}
                              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-6 py-2"
                            >
                              Mensal
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value={PaymentPeriodType.ANNUAL}
                              className="data-[state=on]:bg-background data-[state=on]:shadow-sm px-6 py-2"
                            >
                              Anual
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ScrollArea className="h-[40vh] sm:pr-4">
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <FormField
                      control={form.control}
                      name="newPlanUuid"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="gap-4">
                              {plans?.map((plan, index) => {
                                const isCurrentPlan = plan.name === currentPlanName;

                                return (
                                  <Label
                                    key={plan.uuid}
                                    htmlFor={plan.uuid}
                                    className={cn(
                                      'group relative flex h-full cursor-pointer flex-col rounded-2xl border-2 bg-card py-4 px-4 text-left shadow-sm transition-all duration-200',
                                      'hover:border-orange-300 hover:shadow-xl',
                                      field.value === plan.uuid
                                        ? 'border-orange-500 shadow-lg ring-2 ring-transparent'
                                        : 'border-border',
                                      isCurrentPlan && 'opacity-50 cursor-not-allowed hover:border-border hover:shadow-sm',
                                    )}
                                  >
                                    {index === 1 && (
                                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg px-4 py-1">
                                        Mais popular
                                      </Badge>
                                    )}

                                    {isCurrentPlan && (
                                      <Badge variant="secondary" className="absolute -top-3 right-4">
                                        Plano atual
                                      </Badge>
                                    )}

                                    <div className="flex-1 flex items-start justify-between gap-2">
                                      <div>
                                        <CardTitle className="text-lg font-bold text-foreground mb-2">{plan.name}</CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                          {plan.description}
                                        </CardDescription>
                                      </div>

                                      <RadioGroupItem
                                        id={plan.uuid}
                                        value={plan.uuid}
                                        className="hidden"
                                        disabled={isCurrentPlan}
                                      />
                                    </div>

                                    {plan.annualPrice && plan.monthlyPrice && (
                                      <div className="mt-3">
                                        <p className="text-lg font-bold text-foreground">
                                          {formatValue(getPrice(plan))}
                                          <span className="text-sm font-normal text-muted-foreground">/mês</span>
                                        </p>

                                        {paymentPeriod === PaymentPeriodType.ANNUAL && (
                                          <p className="text-sm text-muted-foreground line-through">
                                            {formatValue(plan.monthlyPrice)}/mês
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {plan.activePropertiesAmount && plan.activeUsersAmount ? (
                                      <CardContent className="p-0 mt-3">
                                        <ul className="space-y-1">
                                          <li className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <Check className="h-2 w-2 text-orange-600" />
                                            </div>
                                            <span className="text-sm text-muted-foreground leading-relaxed">
                                              {plan.activePropertiesAmount} propriedades
                                            </span>
                                          </li>
                                          <li className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                              <Check className="h-2 w-2 text-orange-600" />
                                            </div>
                                            <span className="text-sm text-muted-foreground leading-relaxed">
                                              {plan.activeUsersAmount} usuários
                                            </span>
                                          </li>
                                        </ul>
                                      </CardContent>
                                    ) : (
                                      <CardContent className="flex-1 p-0 mt-3">
                                        <div className="text-lg">Fale com o time</div>
                                      </CardContent>
                                    )}

                                    <div
                                      className={cn(
                                        'flex items-center gap-2 text-sm font-medium transition-all duration-200 mt-2',
                                        field.value === plan.uuid ? 'text-orange-600 opacity-100' : 'text-transparent opacity-0',
                                      )}
                                    >
                                      <ArrowRight className="h-3 w-3" />
                                      Plano selecionado
                                    </div>
                                  </Label>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </ScrollArea>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                {selectedPlanUuid === 'c775246b-c15d-40e1-a5da-b2fcb37a56f2' ? (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleWhatsAppMessage();
                    }}
                    disabled={!selectedPlanUuid}
                  >
                    Falar com o time
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextStep();
                    }}
                    disabled={!selectedPlanUuid}
                  >
                    Continuar
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                {selectedPlan && (
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Plano selecionado</p>
                        <p className="font-semibold text-lg">{selectedPlan.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {paymentPeriod === PaymentPeriodType.ANNUAL ? 'Anual' : 'Mensal'}
                        </p>
                        <p className="font-semibold text-lg text-primary">{formatValue(getPrice(selectedPlan))}/mês</p>
                      </div>
                    </div>
                  </div>
                )}

                <CouponCodeField form={form} />

                <FormField
                  control={form.control}
                  name="billingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma de pagamento</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3">
                          {BILLING_OPTIONS.map((option) => {
                            const Icon = option.icon;
                            // MONTHLY period only allows CREDIT_CARD
                            const isDisabledByPeriod =
                              paymentPeriod === PaymentPeriodType.MONTHLY && option.value !== PaymentBillingType.CREDIT_CARD;
                            const isDisabled = isDisabledByPeriod;

                            return (
                              <Label
                                key={option.value}
                                htmlFor={`billing-${option.value}`}
                                className={cn(
                                  'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                                  field.value === option.value
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50',
                                  isDisabled && 'opacity-50 cursor-not-allowed hover:border-border',
                                )}
                              >
                                <RadioGroupItem id={`billing-${option.value}`} value={option.value} disabled={isDisabled} />
                                <Icon className="size-5 text-muted-foreground" />
                                <div className="flex-1">
                                  <p className="font-medium">{option.label}</p>
                                  <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                                {isDisabledByPeriod && <Badge variant="secondary">Apenas para planos anuais</Badge>}
                              </Label>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {paymentPeriod === PaymentPeriodType.MONTHLY && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm flex items-start gap-2">
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <p>
                      Planos mensais exigem pagamento recorrente via cartão de crédito. Para outras formas de pagamento, selecione
                      o ciclo anual.
                    </p>
                  </div>
                )}

                {billingType === PaymentBillingType.CREDIT_CARD && <CreditCardForm form={form} />}

                {billingType === PaymentBillingType.PIX && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm">
                    <p>
                      Após confirmar, você receberá um QR Code para realizar o pagamento via PIX. O pagamento é processado
                      instantaneamente.
                    </p>
                  </div>
                )}

                {billingType === PaymentBillingType.BOLETO && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm">
                    <p>Após confirmar, você receberá um boleto para pagamento. O prazo de vencimento é de 3 dias úteis.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                <Button type="button" variant="outline" onClick={() => setStep('plan')}>
                  Voltar
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Confirmar mudança
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </Modal>
  );
}
