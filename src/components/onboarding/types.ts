export type OnboardingAccountType = 'pf' | 'pj';

export type OnboardingPlan = 'starter' | 'growth' | 'scale';

export type BranchType = 'matriz' | 'filial';

export interface OnboardingPessoaFisica {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  creci: string;
  city: string;
}

export interface OnboardingPessoaJuridica {
  companyName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  branchType: BranchType;
  parentCompanyName?: string;
  parentCompanyDocument?: string;
  numberOfUnits: string;
  website?: string;
}

export interface OnboardingAdmin {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  acceptTerms: boolean;
}

export interface OnboardingDraft {
  accountType: OnboardingAccountType | null;
  plan: OnboardingPlan | null;
  billingCycle: 'monthly' | 'yearly';
  pessoaFisica: OnboardingPessoaFisica;
  pessoaJuridica: OnboardingPessoaJuridica;
  admin: OnboardingAdmin;
  marketingOptIn: boolean;
}

export interface WizardStepDescriptor {
  id: string;
  title: string;
  description: string;
  summary: string;
}
