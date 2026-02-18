export type ContractPatternType = 'locacao' | 'venda';

export interface ContractPattern {
  id: string;
  nome: string;
  tipoContrato: ContractPatternType;
  duracao?: string;
  indiceReajuste?: string;
  taxaAdm?: string;
  garantia?: string;
  indiceCorrecao?: string;
  ativo: boolean;
  corpoTemplate: string;
  atualizadoEm?: string;
}

const STORAGE_KEY = 'hunter:gestao-locacao:padroes-contrato';

export const DEFAULT_CONTRACT_PATTERNS: ContractPattern[] = [
  {
    id: '1',
    nome: 'Residencial Padrão',
    tipoContrato: 'locacao',
    duracao: '30 meses',
    indiceReajuste: 'IGP-M',
    taxaAdm: '10%',
    garantia: 'Fiador',
    ativo: true,
    corpoTemplate: '',
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Comercial Premium',
    tipoContrato: 'locacao',
    duracao: '60 meses',
    indiceReajuste: 'IPCA',
    taxaAdm: '8%',
    garantia: 'Seguro Fiança',
    ativo: true,
    corpoTemplate: '',
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Venda padrão',
    tipoContrato: 'venda',
    indiceCorrecao: 'IPCA',
    ativo: false,
    corpoTemplate: '',
  },
];

const hasWindow = () => typeof window !== 'undefined';

export const listContractPatterns = (): ContractPattern[] => {
  if (!hasWindow()) return DEFAULT_CONTRACT_PATTERNS;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTRACT_PATTERNS));
    return DEFAULT_CONTRACT_PATTERNS;
  }

  try {
    const parsed = JSON.parse(raw) as ContractPattern[];
    return parsed.length ? parsed : DEFAULT_CONTRACT_PATTERNS;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTRACT_PATTERNS));
    return DEFAULT_CONTRACT_PATTERNS;
  }
};

export const saveContractPatterns = (patterns: ContractPattern[]) => {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
};

export const getContractPatternById = (id: string) =>
  listContractPatterns().find((pattern) => pattern.id === id) ?? null;

export const upsertContractPattern = (pattern: ContractPattern) => {
  const current = listContractPatterns();
  const index = current.findIndex((item) => item.id === pattern.id);

  if (index >= 0) {
    current[index] = pattern;
  } else {
    current.unshift(pattern);
  }

  saveContractPatterns(current);
};
