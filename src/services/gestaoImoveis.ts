import { nanoid } from 'nanoid';
import {
  getGestaoImoveis,
  getResumoPeriodo,
  seedIfEmpty,
  type GestaoDisponibilidade,
  type GestaoImovel,
  type GestaoResumo,
  type GestaoResumoRange,
  type GestaoSituacao
} from '@/data/imoveis/gestaoMock';

const GESTAO_STORAGE_KEY = 'gestao-imoveis.v1';
const CONDOMINIOS_STORAGE_KEY = 'gestao-imoveis.condominios.v1';

export const GESTAO_SITUACAO_OPTIONS: Array<{ value: GestaoSituacao; label: string }> = [
  { value: 'em_captacao', label: 'Em captação' },
  { value: 'preparacao', label: 'Em preparação' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'retirado', label: 'Retirado' }
];

export const GESTAO_DISPONIBILIDADE_OPTIONS: Array<{
  value: GestaoDisponibilidade;
  label: string;
}> = [
  { value: 'disponivel_site', label: 'Disponível no site' },
  { value: 'disponivel_interno', label: 'Disponível interno' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'indisponivel', label: 'Indisponível' }
];

export interface GestaoImoveisFilters {
  codigo?: string;
  situacoes: GestaoSituacao[];
  disponibilidades: GestaoDisponibilidade[];
  equipes: string[];
  origens: string[];
}

export interface GestaoCondominio {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  endereco: string;
  responsavel: string;
  contato: string;
  unidades: number;
  status: 'ativo' | 'inativo';
  fotos: string[];
  propertyCodes: string[];
  observacoes?: string;
}

let memoryCondominios: GestaoCondominio[] | null = null;

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage as Storage;
  }
  return null;
}

function ensureGestaoData(): GestaoImovel[] {
  seedIfEmpty();
  return getGestaoImoveis();
}

function persistGestaoData(data: GestaoImovel[]): void {
  const storage = getStorage();
  if (storage) {
    storage.setItem(GESTAO_STORAGE_KEY, JSON.stringify(data));
  }
}

function defaultCondominios(): GestaoCondominio[] {
  const imoveis = ensureGestaoData();
  const sample = imoveis.slice(0, 18);
  const grupos = [
    sample.filter((_, index) => index % 3 === 0).map(item => item.codigo),
    sample.filter((_, index) => index % 3 === 1).map(item => item.codigo),
    sample.filter((_, index) => index % 3 === 2).map(item => item.codigo)
  ];

  return [
    {
      id: nanoid(),
      nome: 'Residencial Atlântico',
      cidade: 'Balneário Camboriú',
      estado: 'SC',
      endereco: 'Av. Atlântica, 1234',
      responsavel: 'Fernanda Souza',
      contato: '(47) 99999-0001',
      unidades: 42,
      status: 'ativo',
      fotos: [
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
      ],
      propertyCodes: grupos[0],
      observacoes: 'Condomínio premium com foco em alto padrão.'
    },
    {
      id: nanoid(),
      nome: 'Condomínio Vista Verde',
      cidade: 'Itajaí',
      estado: 'SC',
      endereco: 'Rua das Palmeiras, 85',
      responsavel: 'Diego Gomes',
      contato: '(47) 98888-1200',
      unidades: 64,
      status: 'ativo',
      fotos: [
        'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80'
      ],
      propertyCodes: grupos[1],
      observacoes: 'Empreendimento com ampla área de lazer e foco familiar.'
    },
    {
      id: nanoid(),
      nome: 'Edifício Horizonte',
      cidade: 'Florianópolis',
      estado: 'SC',
      endereco: 'Av. Beira Mar Norte, 980',
      responsavel: 'Patrícia Vieira',
      contato: '(48) 97777-0505',
      unidades: 28,
      status: 'inativo',
      fotos: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
      ],
      propertyCodes: grupos[2],
      observacoes: 'Fase de retrofit com previsão de conclusão para o próximo trimestre.'
    }
  ];
}

function readCondominios(): GestaoCondominio[] {
  if (memoryCondominios) return memoryCondominios;
  const storage = getStorage();
  if (storage) {
    const raw = storage.getItem(CONDOMINIOS_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as GestaoCondominio[];
        memoryCondominios = parsed;
        return parsed;
      } catch (error) {
        console.warn('[gestaoImoveis] Falha ao ler condomínios do armazenamento. Regenerando seed.', error);
      }
    }
  }
  const seeded = defaultCondominios();
  writeCondominios(seeded);
  return seeded;
}

function writeCondominios(data: GestaoCondominio[]): void {
  memoryCondominios = data;
  const storage = getStorage();
  if (storage) {
    storage.setItem(CONDOMINIOS_STORAGE_KEY, JSON.stringify(data));
  }
}

function delay(ms = 320): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchGestaoImoveis(): Promise<GestaoImovel[]> {
  const data = ensureGestaoData();
  return [...data];
}

export async function fetchGestaoResumo(range: GestaoResumoRange): Promise<GestaoResumo> {
  return getResumoPeriodo(range);
}

export async function searchGestaoImovelByCodigo(codigo: string): Promise<GestaoImovel | undefined> {
  const normalized = codigo.trim().toLowerCase();
  if (!normalized) return undefined;
  const data = ensureGestaoData();
  return data.find(item => item.codigo.toLowerCase() === normalized);
}

export async function updateGestaoImovel(
  id: string,
  changes: Partial<GestaoImovel>
): Promise<GestaoImovel | undefined> {
  const data = ensureGestaoData();
  const target = data.find(item => item.id === id);
  if (!target) return undefined;
  Object.assign(target, changes, { atualizadoEm: new Date().toISOString() });
  persistGestaoData(data);
  await delay();
  return { ...target };
}

export async function bulkAtualizarSituacao(
  ids: string[],
  situacao: GestaoSituacao
): Promise<GestaoImovel[]> {
  const data = ensureGestaoData();
  const now = new Date().toISOString();
  const updated: GestaoImovel[] = [];
  data.forEach(item => {
    if (ids.includes(item.id)) {
      item.situacao = situacao;
      item.atualizadoEm = now;
      updated.push({ ...item });
    }
  });
  persistGestaoData(data);
  await delay();
  return updated;
}

export async function bulkAtualizarDisponibilidade(
  ids: string[],
  disponibilidade: GestaoDisponibilidade
): Promise<GestaoImovel[]> {
  const data = ensureGestaoData();
  const now = new Date().toISOString();
  const updated: GestaoImovel[] = [];
  data.forEach(item => {
    if (ids.includes(item.id)) {
      item.disponibilidade = disponibilidade;
      item.atualizadoEm = now;
      updated.push({ ...item });
    }
  });
  persistGestaoData(data);
  await delay();
  return updated;
}

export async function bulkAtribuirEquipe(ids: string[], equipe: string): Promise<GestaoImovel[]> {
  const data = ensureGestaoData();
  const now = new Date().toISOString();
  const updated: GestaoImovel[] = [];
  data.forEach(item => {
    if (ids.includes(item.id)) {
      item.equipe = equipe;
      item.atualizadoEm = now;
      updated.push({ ...item });
    }
  });
  persistGestaoData(data);
  await delay();
  return updated;
}

export async function listCondominios(): Promise<GestaoCondominio[]> {
  return [...readCondominios()];
}

export async function createCondominio(
  payload: Omit<GestaoCondominio, 'id' | 'fotos' | 'propertyCodes' | 'status'> & {
    status?: GestaoCondominio['status'];
    fotos?: string[];
    propertyCodes?: string[];
  }
): Promise<GestaoCondominio> {
  const data = readCondominios();
  const condo: GestaoCondominio = {
    id: nanoid(),
    nome: payload.nome,
    cidade: payload.cidade,
    estado: payload.estado,
    endereco: payload.endereco,
    responsavel: payload.responsavel,
    contato: payload.contato,
    unidades: payload.unidades,
    status: payload.status ?? 'ativo',
    fotos: payload.fotos ?? [],
    propertyCodes: payload.propertyCodes ?? [],
    observacoes: payload.observacoes
  };
  data.push(condo);
  writeCondominios([...data]);
  await delay();
  return { ...condo };
}

export async function updateCondominio(
  id: string,
  updates: Partial<Omit<GestaoCondominio, 'id'>>
): Promise<GestaoCondominio | undefined> {
  const data = readCondominios();
  const target = data.find(item => item.id === id);
  if (!target) return undefined;
  Object.assign(target, updates);
  writeCondominios([...data]);
  await delay();
  return { ...target };
}

export async function addCondominioPhoto(id: string, url: string): Promise<GestaoCondominio | undefined> {
  if (!url) return updateCondominio(id, {});
  const data = readCondominios();
  const target = data.find(item => item.id === id);
  if (!target) return undefined;
  if (!target.fotos.includes(url)) {
    target.fotos = [...target.fotos, url];
    writeCondominios([...data]);
  }
  await delay();
  return { ...target };
}

export async function removeCondominioPhoto(
  id: string,
  url: string
): Promise<GestaoCondominio | undefined> {
  const data = readCondominios();
  const target = data.find(item => item.id === id);
  if (!target) return undefined;
  target.fotos = target.fotos.filter(item => item !== url);
  writeCondominios([...data]);
  await delay();
  return { ...target };
}

export async function getCondominioProperties(condoId: string): Promise<GestaoImovel[]> {
  const data = readCondominios();
  const condo = data.find(item => item.id === condoId);
  if (!condo) return [];
  const imoveis = ensureGestaoData();
  return imoveis.filter(item => condo.propertyCodes.includes(item.codigo));
}

export async function linkPropertiesToCondominio(
  condoId: string,
  propertyCodes: string[]
): Promise<GestaoCondominio | undefined> {
  const data = readCondominios();
  const condo = data.find(item => item.id === condoId);
  if (!condo) return undefined;
  const normalized = propertyCodes
    .map(code => code.trim())
    .filter(code => Boolean(code));
  const unique = new Set(condo.propertyCodes);
  normalized.forEach(code => unique.add(code));
  condo.propertyCodes = Array.from(unique);
  writeCondominios([...data]);
  await delay();
  return { ...condo };
}

export async function unlinkPropertyFromCondominio(
  condoId: string,
  propertyCode: string
): Promise<GestaoCondominio | undefined> {
  const data = readCondominios();
  const condo = data.find(item => item.id === condoId);
  if (!condo) return undefined;
  condo.propertyCodes = condo.propertyCodes.filter(code => code !== propertyCode);
  writeCondominios([...data]);
  await delay();
  return { ...condo };
}

export function formatSituacaoLabel(value: GestaoSituacao): string {
  const option = GESTAO_SITUACAO_OPTIONS.find(item => item.value === value);
  return option?.label ?? value;
}

export function formatDisponibilidadeLabel(value: GestaoDisponibilidade): string {
  const option = GESTAO_DISPONIBILIDADE_OPTIONS.find(item => item.value === value);
  return option?.label ?? value;
}

export type { GestaoImovel, GestaoResumo, GestaoResumoRange };
