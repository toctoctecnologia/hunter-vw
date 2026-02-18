import type { OnboardingDraft } from '@/components/onboarding';
import { digitsOnly } from '@/lib/validators/doc';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CheckCnpjUniqueResult {
  isUnique: boolean;
  reason?: string;
}

export interface CnpjLookupResult {
  companyName: string;
  tradeName: string;
  stateRegistration: string;
  municipalRegistration: string;
  branchType: 'matriz' | 'filial';
  numberOfUnits: string;
  parentCompanyName?: string;
  parentCompanyDocument?: string;
  website?: string;
}

export interface RegisterResult {
  ok: true;
  protocol: string;
  activationEta: string;
}

export type OnboardingRegistrationErrorCode = 'CNPJ_CONFLICT' | 'EMAIL_CONFLICT';

export class OnboardingRegistrationError extends Error {
  public readonly code: OnboardingRegistrationErrorCode;

  constructor(code: OnboardingRegistrationErrorCode, message: string) {
    super(message);
    this.name = 'OnboardingRegistrationError';
    this.code = code;
  }
}

const BLOCKED_CNPJS = new Map<
  string,
  {
    label: string;
    reason: string;
  }
>([
  [
    '11222333000181',
    {
      label: 'Imobiliária Horizonte LTDA',
      reason: 'Cadastro ativo na TocToc. Fale com nosso time para adicionar novas unidades.'
    }
  ]
]);

const LOOKUP_CNPJ_DATA = new Map<string, CnpjLookupResult>([
  [
    '27865757000102',
    {
      companyName: 'Viva Lar Empreendimentos Imobiliários LTDA',
      tradeName: 'Viva Lar Imóveis',
      stateRegistration: '123.456.789.000',
      municipalRegistration: '987654',
      branchType: 'matriz',
      numberOfUnits: '3',
      website: 'https://vivalarimoveis.com.br'
    }
  ],
  [
    '48799532000144',
    {
      companyName: 'Rede Conecta Patrimônio LTDA',
      tradeName: 'Conecta Patrimônio Filial Paulista',
      stateRegistration: '224.331.900.115',
      municipalRegistration: '445566',
      branchType: 'filial',
      numberOfUnits: '1',
      parentCompanyName: 'Conecta Patrimônio Matriz',
      parentCompanyDocument: '27865757000102',
      website: 'https://conectapatrimonio.com.br'
    }
  ]
]);

const DUPLICATE_EMAILS = new Set<string>(['contato@vivalarimoveis.com.br', 'admin@toctoc.com']);

export async function checkCnpjUnique(cnpj: string): Promise<CheckCnpjUniqueResult> {
  const normalized = digitsOnly(cnpj);
  if (normalized.length !== 14) {
    return { isUnique: true };
  }

  await delay(600);
  const blocked = BLOCKED_CNPJS.get(normalized);
  if (blocked) {
    return { isUnique: false, reason: blocked.reason };
  }
  return { isUnique: true };
}

export async function lookupCnpj(cnpj: string): Promise<CnpjLookupResult | null> {
  const normalized = digitsOnly(cnpj);
  if (normalized.length !== 14) {
    return null;
  }

  await delay(700);
  return LOOKUP_CNPJ_DATA.get(normalized) ?? null;
}

const generateProtocol = () => {
  const now = new Date();
  return `NB-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
    .getDate()
    .toString()
    .padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export async function register(draft: OnboardingDraft): Promise<RegisterResult> {
  const normalizedEmail = draft.admin.email.trim().toLowerCase();
  const normalizedCnpj = digitsOnly(draft.pessoaJuridica.cnpj);

  if (draft.accountType === 'pj' && normalizedCnpj) {
    const blocked = BLOCKED_CNPJS.get(normalizedCnpj);
    if (blocked) {
      throw new OnboardingRegistrationError('CNPJ_CONFLICT', blocked.reason);
    }
  }

  if (DUPLICATE_EMAILS.has(normalizedEmail)) {
    throw new OnboardingRegistrationError(
      'EMAIL_CONFLICT',
      'Este e-mail já está vinculado a um cadastro em andamento na TocToc.'
    );
  }

  await delay(1200);
  console.info('Mock register onboarding payload', draft);

  return {
    ok: true,
    protocol: generateProtocol(),
    activationEta: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  };
}

export const __mockOnboarding = {
  blockedCnpjs: BLOCKED_CNPJS,
  lookupCnpjData: LOOKUP_CNPJ_DATA,
  duplicateEmails: DUPLICATE_EMAILS
};
