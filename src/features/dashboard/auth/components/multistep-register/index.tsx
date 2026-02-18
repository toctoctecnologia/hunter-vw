'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import { X } from 'lucide-react';

import { createClient } from '@/shared/lib/supabase/client';

import { removeNonNumeric } from '@/shared/lib/masks';
import { clamp, cn } from '@/shared/lib/utils';

import { api } from '@/shared/lib/api';

import { REGISTER_STEPS } from '@/shared/constants/register-steps';
import { RegisterFormType } from '@/shared/types';
import {
  MultistepRegisterFormData,
  multistepRegisterSchema,
} from '@/features/dashboard/auth/components/form/multistep-register/schema';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Header } from '@/features/dashboard/auth/components/multistep-register/header';
import { ErrorModal } from '@/shared/components/modal/error-modal';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import {
  TypeForm,
  AdminForm,
  CompanyForm,
  DataForm,
  PlanForm,
  ResumeForm,
  AddressForm,
} from '@/features/dashboard/auth/components/form/multistep-register';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

export function MultistepRegister() {
  const navigate = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState<RegisterFormType>('TIPO');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [planName, setPlanName] = useState<string>('');
  const [previousAccountType, setPreviousAccountType] = useState<'PF' | 'MATRIZ'>('MATRIZ');
  const [errorModal, setErrorModal] = useState<{ title: string; messages: string[] } | null>(null);

  const form = useForm<MultistepRegisterFormData>({
    resolver: zodResolver(multistepRegisterSchema),
    defaultValues: {
      accountType: 'MATRIZ',
      name: '',
      email: '',
      phone: '',
      userInformation: {
        complianceTermsAccepted: false,
        marketingTermsAccepted: false,
        name: '',
        ocupation: '',
        phone: '',
      },
      personalAccountInfo: {
        creci: '',
        federalDocument: '',
      },
      addressInfo: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      companyAccountInfo: {
        socialReason: '',
        federalDocument: '',
        stateRegistration: '',
        municipalRegistration: '',
        unitAmount: '',
        website: '',
        planUuid: '',
      },
    },
  });

  const accountType = form.watch('accountType');

  const extractErrorMessages = useCallback((errors: FieldErrors<MultistepRegisterFormData>): string[] => {
    const messages: string[] = [];

    const extractFromObject = (obj: Record<string, any>, prefix = '') => {
      for (const key in obj) {
        const value = obj[key];
        if (value?.message && typeof value.message === 'string') {
          messages.push(value.message);
        } else if (typeof value === 'object' && value !== null) {
          extractFromObject(value, `${prefix}${key}.`);
        }
      }
    };

    extractFromObject(errors);
    return [...new Set(messages)];
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStepIdx]);

  useEffect(() => {
    if (accountType !== previousAccountType) {
      if (accountType === 'PF') {
        form.setValue('companyAccountInfo', {
          socialReason: '',
          federalDocument: '',
          stateRegistration: '',
          municipalRegistration: '',
          unitAmount: '',
          website: '',
          planUuid: '',
        });
      } else {
        form.setValue('personalAccountInfo', {
          creci: '',
          federalDocument: '',
        });
      }

      form.setValue('name', '');
      form.setValue('email', '');
      form.setValue('phone', '');
      form.setValue('addressInfo', {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      });

      setPreviousAccountType(accountType as 'PF' | 'MATRIZ');
    }
  }, [accountType, previousAccountType, form]);

  const FILTERED_STEPS = useMemo(() => {
    return accountType === 'PF'
      ? REGISTER_STEPS.filter((rs) => rs.type !== 'EMPRESA' && rs.type !== 'PLANO' && rs.type !== 'ADDRESS')
      : REGISTER_STEPS.filter((rs) => rs.type !== 'DADOS');
  }, [accountType]);

  const handleStepChange = useCallback(
    (stepType: RegisterFormType) => {
      setActiveType(stepType);
      const stepIndex = FILTERED_STEPS.findIndex((step) => step.type === stepType);
      if (stepIndex !== -1) setCurrentStepIdx(stepIndex);
    },
    [FILTERED_STEPS],
  );

  const totalSteps = FILTERED_STEPS.length;

  const progressValue = useMemo(() => {
    if (totalSteps <= 1) return 0;
    const percentage = (currentStepIdx / (totalSteps - 1)) * 100;
    return clamp(percentage, 0, 100);
  }, [currentStepIdx, totalSteps]);

  const stepContent = useMemo(() => {
    switch (activeType) {
      case 'TIPO': {
        return <TypeForm form={form} />;
      }
      case 'ADMIN': {
        return <AdminForm form={form} />;
      }
      case 'DADOS': {
        return <DataForm form={form} />;
      }
      case 'ADDRESS': {
        return <AddressForm form={form} />;
      }
      case 'EMPRESA': {
        return <CompanyForm form={form} />;
      }
      case 'PLANO': {
        return (
          <PlanForm
            form={form}
            billingCycle={billingCycle}
            setBillingCycle={setBillingCycle}
            setPlanName={setPlanName}
          />
        );
      }
      case 'RESUMO': {
        return <ResumeForm form={form} planName={planName} onNavigateToStep={(step) => handleStepChange(step)} />;
      }
    }
  }, [activeType, billingCycle, form, handleStepChange, planName]);

  const handleRegister = async (testPeriodRequested: boolean) => {
    setIsLoading(true);
    try {
      const {
        accountType,
        companyAccountInfo,
        email,
        name,
        personalAccountInfo,
        phone,
        userInformation,
        addressInfo,
        couponCode,
      } = form.getValues();
      const { complianceTermsAccepted, marketingTermsAccepted, ocupation } = userInformation;

      if (!complianceTermsAccepted) {
        return alert('Aceite os termos para concluir o cadastro');
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Session not present.');

      const phoneFormatted = removeNonNumeric(phone || userInformation.phone);
      const trimDigits = phoneFormatted.length > 11 ? phoneFormatted.slice(0, 11) : phoneFormatted;

      await api.post('account/register', {
        accountType,
        name,
        email,
        paymentPeriod: billingCycle === 'monthly' ? 'MONTHLY' : 'ANNUAL',
        testPeriodRequested,
        phone: trimDigits,
        ...(couponCode && { couponCode }),
        ...(personalAccountInfo.federalDocument && {
          personalAccountInfo: {
            federalDocument: removeNonNumeric(personalAccountInfo.federalDocument),
            creci: personalAccountInfo.creci,
            city: addressInfo.city,
          },
        }),
        ...(companyAccountInfo.federalDocument && {
          companyAccountInfo: {
            socialReason: companyAccountInfo.socialReason,
            federalDocument: removeNonNumeric(companyAccountInfo.federalDocument),
            stateRegistration: companyAccountInfo.stateRegistration,
            municipalRegistration: companyAccountInfo.municipalRegistration,
            unitAmount: companyAccountInfo.unitAmount,
            website: companyAccountInfo.website,
            planUuid: companyAccountInfo.planUuid,
          },
        }),
        userInformation: {
          name: userInformation.name,
          email: session.user.email,
          phone: trimDigits,
          ocupation,
          complianceTermsAccepted,
          marketingTermsAccepted,
        },
        addressInfo: {
          zipCode: removeNonNumeric(addressInfo.zipCode),
          street: addressInfo.street,
          number: addressInfo.number,
          complement: addressInfo.complement,
          neighborhood: addressInfo.neighborhood,
          city: addressInfo.city,
          state: addressInfo.state,
        },
      });

      const isEnterprisePlan = companyAccountInfo.planUuid === 'c775246b-c15d-40e1-a5da-b2fcb37a56f2';
      if (testPeriodRequested || isEnterprisePlan) {
        navigate.push('/dashboard');
        return;
      }

      try {
        const { data } = await api.get('account/signature/payment/link');
        window.location.href = data.paymentLink;
      } catch (error: any) {
        setErrorModal({ title: 'Erro no cadastro', messages: error.messages });
      }
    } catch (error: any) {
      setErrorModal({ title: 'Erro no cadastro', messages: error.messages });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: MultistepRegisterFormData) => {
    const isEnterprisePlan = data.companyAccountInfo.planUuid === 'c775246b-c15d-40e1-a5da-b2fcb37a56f2';
    if (isEnterprisePlan) {
      await handleRegister(false);
      return;
    }

    if (data.accountType === 'MATRIZ') {
      setShowPeriodModal(true);
    } else {
      await handleRegister(true);
    }
  };

  return (
    <>
      <AlertDialog defaultOpen={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conclua seu cadastro para continuar</AlertDialogTitle>
            <AlertDialogDescription>
              Para acessar a plataforma, é necessário concluir o seu cadastro. Complete todas as etapas para liberar
              todas as funcionalidades.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showPeriodModal && (
        <AlertDialog open onOpenChange={setShowPeriodModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deseja utilizar o período grátis?</AlertDialogTitle>
              <AlertDialogDescription>
                Você terá 7 dias para testar a plataforma sem custos. Após esse período, será necessário escolher um
                plano para continuar utilizando nossos serviços.
              </AlertDialogDescription>

              <Button
                className="absolute top-2 right-2 w-10 h-10"
                size="sm"
                variant="ghost"
                onClick={() => setShowPeriodModal(false)}
              >
                <X />
              </Button>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPeriodModal(false);
                  handleRegister(true);
                }}
                disabled={isLoading}
              >
                Sim, quero testar grátis
              </Button>

              <Button
                onClick={() => {
                  setShowPeriodModal(false);
                  handleRegister(false);
                }}
                disabled={isLoading}
                size="sm"
              >
                Não, continuar para o pagamento
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {errorModal && (
        <ErrorModal
          open={true}
          title={errorModal.title}
          messages={errorModal.messages}
          onClose={() => setErrorModal(null)}
        />
      )}

      <Header progressValue={progressValue} />

      <div className="grid gap-6 md:grid-cols-[330px_1fr] mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Etapas</CardTitle>
            <CardDescription>Avance no seu ritmo e revise sempre que precisar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {FILTERED_STEPS.map((step, index) => {
                const isActive = activeType === step.type;
                return (
                  <li key={step.type}>
                    <button
                      type="button"
                      onClick={() => handleStepChange(step.type)}
                      className={cn(
                        'group flex w-full relative items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        'border-border bg-muted/40 hover:border-primary hover:bg-muted/60',
                        isActive && 'border-primary bg-muted/60',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full border transition text-xs font-semibold absolute -top-3 -left-3',
                          'border-muted-foreground/30 bg-white dark:bg-secondary text-muted-foreground',
                          'group-hover:border-primary group-hover:text-primary',
                          isActive && 'border-primary bg-primary! text-white group-hover:text-white',
                        )}
                      >
                        {index + 1}
                      </span>

                      <span className="flex flex-col">
                        <span className="text-sm font-semibold leading-tight text-foreground">{step.title}</span>
                        <span className="text-xs text-muted-foreground">{step.description}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card ref={contentRef} className="flex flex-col">
          <CardContent className="flex flex-1 flex-col gap-6">
            <div className="flex-1 space-y-6 flex flex-col">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    const errorMessages = extractErrorMessages(errors);
                    setErrorModal({
                      title: 'Campos obrigatórios',
                      messages:
                        errorMessages.length > 0
                          ? errorMessages
                          : ['Verifique o formulário e preencha os campos obrigatórios.'],
                    });
                  })}
                  className="flex-1 space-y-4"
                >
                  {stepContent}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={async () => {
                        if (currentStepIdx === 0) {
                          const supabase = createClient();
                          await supabase.auth.signOut();
                          navigate.push('/');
                          return;
                        }
                        const newIndex = currentStepIdx - 1;
                        setCurrentStepIdx(newIndex);
                        setActiveType(FILTERED_STEPS[newIndex].type);
                      }}
                    >
                      Voltar
                    </Button>
                    {currentStepIdx === totalSteps - 1 ? (
                      <Button isLoading={isLoading} type="submit">
                        Concluir cadastro
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const newIndex = currentStepIdx + 1;
                          setCurrentStepIdx(newIndex);
                          setActiveType(FILTERED_STEPS[newIndex].type);
                        }}
                      >
                        Continuar
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
