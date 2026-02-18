import { Suspense, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  StepAdmin,
  StepEmpresaPF,
  StepEmpresaPJ,
  StepPlano,
  StepResumo,
  StepTipo,
  type OnboardingAccountType,
  type OnboardingDraft,
  type OnboardingPessoaFisica,
  type OnboardingPessoaJuridica,
  type OnboardingPlan,
  type WizardStepDescriptor
} from '@/components/onboarding';
import { useToast } from '@/components/ui/use-toast';
import { CreateAccountWizardContainer } from '@/features/onboarding/create-account';
import { OnboardingRegistrationError, register } from '@/api/onboarding';

const STORAGE_KEY = 'onboardingDraft';

const DEFAULT_PF: OnboardingPessoaFisica = {
  fullName: '',
  cpf: '',
  email: '',
  phone: '',
  creci: '',
  city: ''
};

const DEFAULT_PJ: OnboardingPessoaJuridica = {
  companyName: '',
  tradeName: '',
  cnpj: '',
  stateRegistration: '',
  municipalRegistration: '',
  branchType: 'matriz',
  parentCompanyName: '',
  parentCompanyDocument: '',
  numberOfUnits: '',
  website: ''
};

const DEFAULT_DRAFT: OnboardingDraft = {
  accountType: null,
  plan: null,
  billingCycle: 'monthly',
  pessoaFisica: DEFAULT_PF,
  pessoaJuridica: DEFAULT_PJ,
  admin: {
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    acceptTerms: false
  },
  marketingOptIn: false
};

const STEP_SLUGS = ['tipo', 'plano', 'dados', 'empresa', 'admin', 'resumo'] as const;

type StepId = (typeof STEP_SLUGS)[number];

interface WizardState {
  currentStepIndex: number;
  draft: OnboardingDraft;
  completedSteps: StepId[];
}

const DEFAULT_WIZARD_STATE: WizardState = {
  currentStepIndex: 0,
  draft: DEFAULT_DRAFT,
  completedSteps: []
};

interface SubmitTipoAction {
  type: 'SUBMIT_TIPO';
  payload: { accountType: OnboardingAccountType };
}

interface SubmitPlanoAction {
  type: 'SUBMIT_PLANO';
  payload: { plan: OnboardingPlan; billingCycle: 'monthly' | 'yearly' };
}

interface SubmitPFAction {
  type: 'SUBMIT_PF';
  payload: OnboardingPessoaFisica;
}

interface SubmitPJAction {
  type: 'SUBMIT_PJ';
  payload: OnboardingPessoaJuridica;
}

interface SubmitAdminAction {
  type: 'SUBMIT_ADMIN';
  payload: {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
    acceptTerms: boolean;
    marketingOptIn: boolean;
  };
}

interface SetStepAction {
  type: 'SET_STEP';
  payload: number;
}

interface HydrateAction {
  type: 'HYDRATE';
  payload: WizardState;
}

type WizardAction =
  | SubmitTipoAction
  | SubmitPlanoAction
  | SubmitPFAction
  | SubmitPJAction
  | SubmitAdminAction
  | SetStepAction
  | HydrateAction;

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const isStepId = (value: string): value is StepId =>
  (STEP_SLUGS as readonly string[]).includes(value);

const ensureStepId = (stepIds: StepId[], nextId: StepId) => {
  if (stepIds.includes(nextId)) return stepIds;
  return [...stepIds, nextId];
};

const withoutStepIds = (stepIds: StepId[], idsToRemove: StepId[]) =>
  stepIds.filter((id) => !idsToRemove.includes(id));

const stepDescriptors: Record<StepId, WizardStepDescriptor> = {
  tipo: {
    id: 'tipo',
    title: 'Tipo de operação',
    description: 'Defina se sua operação é pessoa física ou jurídica.',
    summary:
      'Escolher o tipo de operação nos ajuda a configurar automaticamente os recursos e permissões da plataforma Hunter.'
  },
  plano: {
    id: 'plano',
    title: 'Plano Hunter',
    description: 'Selecione o plano que melhor atende a sua operação.',
    summary: 'Compare os planos disponíveis e escolha o ciclo de cobrança ideal para sua imobiliária.'
  },
  dados: {
    id: 'dados',
    title: 'Dados do corretor',
    description: 'Informe os dados da pessoa física responsável pelo cadastro.',
    summary: 'Precisamos validar seus dados para preparar o contrato e habilitar o painel.'
  },
  empresa: {
    id: 'empresa',
    title: 'Dados da empresa',
    description: 'Compartilhe as informações da empresa para gerar o contrato.',
    summary: 'Os dados da sua imobiliária garantem o enquadramento fiscal correto e a gestão de filiais.'
  },
  admin: {
    id: 'admin',
    title: 'Administrador da conta',
    description: 'Defina quem será o responsável pelo painel Hunter.',
    summary: 'O administrador será o primeiro usuário com acesso total ao Hunter e poderá convidar a equipe.'
  },
  resumo: {
    id: 'resumo',
    title: 'Resumo e confirmação',
    description: 'Revise todas as informações antes de finalizar.',
    summary: 'Confira os dados, ajuste o que for necessário e finalize o onboarding com segurança.'
  }
};

const sanitizeCompleted = (steps: StepId[]) => steps.filter((step, index, array) => array.indexOf(step) === index);

const mergeDraft = (incoming?: Partial<OnboardingDraft>): OnboardingDraft => ({
  accountType: incoming?.accountType ?? DEFAULT_DRAFT.accountType,
  plan: incoming?.plan ?? DEFAULT_DRAFT.plan,
  billingCycle: incoming?.billingCycle ?? DEFAULT_DRAFT.billingCycle,
  pessoaFisica: {
    fullName: incoming?.pessoaFisica?.fullName ?? DEFAULT_DRAFT.pessoaFisica.fullName,
    cpf: incoming?.pessoaFisica?.cpf ?? DEFAULT_DRAFT.pessoaFisica.cpf,
    email: incoming?.pessoaFisica?.email ?? DEFAULT_DRAFT.pessoaFisica.email,
    phone: incoming?.pessoaFisica?.phone ?? DEFAULT_DRAFT.pessoaFisica.phone,
    creci: incoming?.pessoaFisica?.creci ?? DEFAULT_DRAFT.pessoaFisica.creci,
    city: incoming?.pessoaFisica?.city ?? DEFAULT_DRAFT.pessoaFisica.city
  },
  pessoaJuridica: {
    companyName: incoming?.pessoaJuridica?.companyName ?? DEFAULT_DRAFT.pessoaJuridica.companyName,
    tradeName: incoming?.pessoaJuridica?.tradeName ?? DEFAULT_DRAFT.pessoaJuridica.tradeName,
    cnpj: incoming?.pessoaJuridica?.cnpj ?? DEFAULT_DRAFT.pessoaJuridica.cnpj,
    stateRegistration: incoming?.pessoaJuridica?.stateRegistration ?? DEFAULT_DRAFT.pessoaJuridica.stateRegistration,
    municipalRegistration:
      incoming?.pessoaJuridica?.municipalRegistration ?? DEFAULT_DRAFT.pessoaJuridica.municipalRegistration,
    branchType: incoming?.pessoaJuridica?.branchType ?? DEFAULT_DRAFT.pessoaJuridica.branchType,
    parentCompanyName: incoming?.pessoaJuridica?.parentCompanyName ?? DEFAULT_DRAFT.pessoaJuridica.parentCompanyName,
    parentCompanyDocument:
      incoming?.pessoaJuridica?.parentCompanyDocument ?? DEFAULT_DRAFT.pessoaJuridica.parentCompanyDocument,
    numberOfUnits: incoming?.pessoaJuridica?.numberOfUnits ?? DEFAULT_DRAFT.pessoaJuridica.numberOfUnits,
    website: incoming?.pessoaJuridica?.website ?? DEFAULT_DRAFT.pessoaJuridica.website
  },
  admin: {
    name: incoming?.admin?.name ?? DEFAULT_DRAFT.admin.name,
    email: incoming?.admin?.email ?? DEFAULT_DRAFT.admin.email,
    phone: incoming?.admin?.phone ?? DEFAULT_DRAFT.admin.phone,
    role: incoming?.admin?.role ?? DEFAULT_DRAFT.admin.role,
    password: incoming?.admin?.password ?? DEFAULT_DRAFT.admin.password,
    acceptTerms: incoming?.admin?.acceptTerms ?? DEFAULT_DRAFT.admin.acceptTerms
  },
  marketingOptIn: incoming?.marketingOptIn ?? DEFAULT_DRAFT.marketingOptIn
});

const loadInitialState = (): WizardState => {
  if (typeof window === 'undefined') return DEFAULT_WIZARD_STATE;

  const stored = window.sessionStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_WIZARD_STATE;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<WizardState>;
    return {
      currentStepIndex: typeof parsed.currentStepIndex === 'number' ? parsed.currentStepIndex : 0,
      draft: mergeDraft(parsed.draft),
      completedSteps: parsed.completedSteps ? sanitizeCompleted(parsed.completedSteps as StepId[]) : []
    };
  } catch (error) {
    console.error('Erro ao recuperar rascunho do onboarding', error);
    return DEFAULT_WIZARD_STATE;
  }
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        currentStepIndex: action.payload.currentStepIndex,
        draft: mergeDraft(action.payload.draft),
        completedSteps: sanitizeCompleted(action.payload.completedSteps)
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStepIndex: action.payload
      };
    case 'SUBMIT_TIPO': {
      const nextDraft: OnboardingDraft = {
        ...state.draft,
        accountType: action.payload.accountType,
        pessoaFisica:
          action.payload.accountType === 'pj' ? DEFAULT_PF : state.draft.pessoaFisica,
        pessoaJuridica:
          action.payload.accountType === 'pf' ? DEFAULT_PJ : state.draft.pessoaJuridica
      };
      const cleanedCompleted = withoutStepIds(state.completedSteps, ['dados', 'empresa']);
      return {
        ...state,
        draft: nextDraft,
        completedSteps: ensureStepId(cleanedCompleted, 'tipo')
      };
    }
    case 'SUBMIT_PLANO': {
      const nextDraft: OnboardingDraft = {
        ...state.draft,
        plan: action.payload.plan,
        billingCycle: action.payload.billingCycle
      };
      return {
        ...state,
        draft: nextDraft,
        completedSteps: ensureStepId(state.completedSteps, 'plano')
      };
    }
    case 'SUBMIT_PF': {
      const nextDraft: OnboardingDraft = {
        ...state.draft,
        pessoaFisica: {
          ...state.draft.pessoaFisica,
          ...action.payload
        }
      };
      const cleanedCompleted = withoutStepIds(state.completedSteps, ['empresa']);
      return {
        ...state,
        draft: nextDraft,
        completedSteps: ensureStepId(cleanedCompleted, 'dados')
      };
    }
    case 'SUBMIT_PJ': {
      const nextDraft: OnboardingDraft = {
        ...state.draft,
        pessoaJuridica: {
          ...state.draft.pessoaJuridica,
          ...action.payload
        }
      };
      const cleanedCompleted = withoutStepIds(state.completedSteps, ['dados']);
      return {
        ...state,
        draft: nextDraft,
        completedSteps: ensureStepId(cleanedCompleted, 'empresa')
      };
    }
    case 'SUBMIT_ADMIN': {
      const nextDraft: OnboardingDraft = {
        ...state.draft,
        admin: {
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          role: action.payload.role,
          password: action.payload.password,
          acceptTerms: action.payload.acceptTerms
        },
        marketingOptIn: action.payload.marketingOptIn
      };
      return {
        ...state,
        draft: nextDraft,
        completedSteps: ensureStepId(state.completedSteps, 'admin')
      };
    }
    default:
      return state;
  }
}

const parseStepParam = (param: string | null, steps: WizardStepDescriptor[]) => {
  if (!param) return 0;
  if (!isStepId(param)) return 0;

  const index = steps.findIndex((step) => step.id === param);
  if (index === -1) return 0;

  return clamp(index, 0, Math.max(steps.length - 1, 0));
};

export function CreateAccountPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSearchParamsRef = useRef<{ search: string; stepsKey: string } | null>(null);
  const pendingStateFromSearchParamsRef = useRef(false);

  const [state, dispatch] = useReducer(wizardReducer, undefined, loadInitialState);

  const steps = useMemo(() => {
    const tipo = stepDescriptors.tipo;
    const plano = stepDescriptors.plano;
    const companyStep =
      state.draft.accountType === 'pj' ? stepDescriptors.empresa : stepDescriptors.dados;
    const admin = stepDescriptors.admin;
    const resumo = stepDescriptors.resumo;
    return [tipo, plano, companyStep, admin, resumo];
  }, [state.draft.accountType]);

  const totalSteps = steps.length;
  const currentStep = steps[state.currentStepIndex] ?? steps[0];

  const progressValue = useMemo(() => {
    if (totalSteps <= 1) return 0;
    const percentage = (state.currentStepIndex / (totalSteps - 1)) * 100;
    return clamp(percentage, 0, 100);
  }, [state.currentStepIndex, totalSteps]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = window.setTimeout(() => {
      const payload: WizardState = {
        currentStepIndex: state.currentStepIndex,
        draft: state.draft,
        completedSteps: state.completedSteps
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state]);

  useEffect(() => {
    const currentSearch = searchParams.toString();
    const currentStepsKey = steps.map((step) => step.id).join(',');
    const last = lastSearchParamsRef.current;
    if (last && last.search === currentSearch && last.stepsKey === currentStepsKey) {
      return;
    }
    lastSearchParamsRef.current = { search: currentSearch, stepsKey: currentStepsKey };

    const stepParam = searchParams.get('step');
    const desiredIndex = parseStepParam(stepParam, steps);
    if (desiredIndex !== state.currentStepIndex) {
      pendingStateFromSearchParamsRef.current = true;
      dispatch({ type: 'SET_STEP', payload: desiredIndex });
    }
  }, [dispatch, searchParams, state.currentStepIndex, steps]);

  useEffect(() => {
    if (state.currentStepIndex > totalSteps - 1) {
      dispatch({ type: 'SET_STEP', payload: totalSteps - 1 });
    }
  }, [state.currentStepIndex, totalSteps]);

  useEffect(() => {
    if (pendingStateFromSearchParamsRef.current) {
      pendingStateFromSearchParamsRef.current = false;
      return;
    }

    const nextStepParam = currentStep.id;
    const existingStepParam = searchParams.get('step');
    if (existingStepParam === nextStepParam) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('step', nextStepParam);
    setSearchParams(nextParams, { replace: true });
  }, [currentStep.id, searchParams, setSearchParams, state.currentStepIndex]);

  const goToStep = useCallback(
    (nextIndex: number) => {
      const maxIndex = totalSteps - 1;
      const normalizedIndex = clamp(nextIndex, 0, maxIndex);
      dispatch({ type: 'SET_STEP', payload: normalizedIndex });
    },
    [totalSteps]
  );

  const goToStepById = useCallback(
    (stepId: StepId) => {
      const index = steps.findIndex((step) => step.id === stepId);
      if (index >= 0) {
        goToStep(index);
      }
    },
    [goToStep, steps]
  );

  const handleTipoSubmit = useCallback(
    (values: { accountType: OnboardingAccountType }) => {
      dispatch({ type: 'SUBMIT_TIPO', payload: values });
      goToStep(state.currentStepIndex + 1);
    },
    [goToStep, state.currentStepIndex]
  );

  const handlePlanoSubmit = useCallback(
    (values: { plan: OnboardingPlan; billingCycle: 'monthly' | 'yearly' }) => {
      dispatch({ type: 'SUBMIT_PLANO', payload: values });
      goToStep(state.currentStepIndex + 1);
    },
    [goToStep, state.currentStepIndex]
  );

  const handlePFSubmit = useCallback(
    (values: OnboardingPessoaFisica) => {
      dispatch({ type: 'SUBMIT_PF', payload: values });
      goToStep(state.currentStepIndex + 1);
    },
    [goToStep, state.currentStepIndex]
  );

  const handlePJSubmit = useCallback(
    (values: OnboardingPessoaJuridica) => {
      dispatch({ type: 'SUBMIT_PJ', payload: values });
      goToStep(state.currentStepIndex + 1);
    },
    [goToStep, state.currentStepIndex]
  );

  const handleAdminSubmit = useCallback(
    (values: {
      name?: string;
      role?: string;
      email?: string;
      password?: string;
      phone?: string;
      confirmPassword?: string;
      acceptTerms?: true;
      marketingOptIn?: boolean;
    }) => {
      const payload = {
        name: values.name || '',
        email: values.email || '',
        phone: values.phone || '',
        role: values.role || '',
        password: values.password || '',
        acceptTerms: values.acceptTerms === true,
        marketingOptIn: values.marketingOptIn || false,
      };
      dispatch({ type: 'SUBMIT_ADMIN', payload });
      goToStep(state.currentStepIndex + 1);
    },
    [goToStep, state.currentStepIndex]
  );

  const handleFinish = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await register(state.draft);
      toast({
        title: 'Cadastro enviado com sucesso! 🎉',
        description: `Protocolo ${result.protocol} criado. Em instantes você receberá um e-mail com as instruções para acessar o painel Hunter.`
      });
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
      navigate('/auth?from=onboarding=1');
    } catch (error) {
      if (error instanceof OnboardingRegistrationError) {
        toast({
          variant: 'destructive',
          title: 'Não foi possível concluir o cadastro',
          description: error.message
        });
      } else {
        console.error('Erro ao concluir onboarding', error);
        toast({
          variant: 'destructive',
          title: 'Não foi possível concluir o cadastro',
          description: 'Tente novamente em instantes ou fale com o nosso time pelo chat.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, state.draft, toast]);

  const stepContent = useMemo(() => {
    switch (currentStep.id as StepId) {
      case 'tipo':
        return <StepTipo defaultValue={state.draft.accountType} onSubmit={handleTipoSubmit} />;
      case 'plano':
        return (
          <StepPlano
            defaultPlan={state.draft.plan}
            defaultBillingCycle={state.draft.billingCycle}
            onBack={() => goToStepById('tipo')}
            onSubmit={handlePlanoSubmit}
          />
        );
      case 'dados':
        return (
          <StepEmpresaPF
            defaultValues={state.draft.pessoaFisica}
            onBack={() => goToStepById('plano')}
            onSubmit={handlePFSubmit}
          />
        );
      case 'empresa':
        return (
          <StepEmpresaPJ
            defaultValues={state.draft.pessoaJuridica}
            onBack={() => goToStepById('plano')}
            onSubmit={handlePJSubmit}
          />
        );
      case 'admin':
        return (
          <StepAdmin
            defaultValues={{ ...state.draft.admin, marketingOptIn: state.draft.marketingOptIn }}
            onBack={() => goToStep(state.currentStepIndex - 1)}
            onSubmit={handleAdminSubmit}
          />
        );
      case 'resumo':
        return (
          <StepResumo
            draft={state.draft}
            isSubmitting={isSubmitting}
            onBack={() => goToStep(state.currentStepIndex - 1)}
            onEdit={goToStepById}
            onSubmit={handleFinish}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep.id,
    state.draft,
    handleTipoSubmit,
    handlePlanoSubmit,
    handlePFSubmit,
    handlePJSubmit,
    handleAdminSubmit,
    handleFinish,
    goToStep,
    goToStepById,
    isSubmitting,
    state.currentStepIndex
  ]);

  const headerAside = (
    <div className="hidden rounded-xl border border-dashed bg-muted/40 p-4 text-left text-sm text-muted-foreground md:block">
      <p className="font-semibold text-foreground">Precisa de ajuda?</p>
      <p>Nosso time está pronto no chat dentro do painel ou pelo e-mail onboarding@hunter.com.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/40 py-6">
        <div className="mx-auto w-full max-w-5xl px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Criar cadastro</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="mt-2 text-sm text-muted-foreground">
            Etapa {state.currentStepIndex + 1} de {totalSteps} — {currentStep.title}
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Carregando assistente...</div>}>
        <CreateAccountWizardContainer
          steps={steps}
          currentStepIndex={state.currentStepIndex}
          completedStepIds={state.completedSteps}
          onStepChange={goToStep}
          progressValue={progressValue}
          headerAside={headerAside}
        >
          {stepContent}
        </CreateAccountWizardContainer>
      </Suspense>
    </div>
  );
}

export default CreateAccountPage;
