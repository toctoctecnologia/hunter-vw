import { nanoid } from 'nanoid';

const STORAGE_KEY = 'gestao-imoveis.v1';
const DAY_IN_MS = 86400000;

const situacaoDefinitions = [
  { value: 'em_captacao', label: 'Em captação' },
  { value: 'preparacao', label: 'Em preparação' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'vendido', label: 'Vendido' },
  { value: 'retirado', label: 'Retirado' }
] as const;

const disponibilidadeDefinitions = [
  { value: 'disponivel_site', label: 'Disponível no site' },
  { value: 'disponivel_interno', label: 'Disponível interno' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'indisponivel', label: 'Indisponível' }
] as const;

const fotoDefinitions = [
  { value: 'completas', label: 'Biblioteca completa' },
  { value: 'parciais', label: 'Atualizar fotos' },
  { value: 'pendentes', label: 'Aguardando fotos' },
  { value: 'desatualizadas', label: 'Fotos desatualizadas' }
] as const;

const placaDefinitions = [
  { value: 'instalada', label: 'Instalada' },
  { value: 'solicitada', label: 'Solicitada' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'sem_autorizacao', label: 'Sem autorização' },
  { value: 'nao_necessaria', label: 'Não necessária' }
] as const;

export type GestaoSituacao = typeof situacaoDefinitions[number]['value'];
export type GestaoDisponibilidade = typeof disponibilidadeDefinitions[number]['value'];
export type FotoStatus = typeof fotoDefinitions[number]['value'];
export type PlacaStatus = typeof placaDefinitions[number]['value'];
export type GestaoResumoRange = '30d' | '90d' | 'ytd';
type ProposalStage = 'sem_proposta' | 'proposta' | 'em_negociacao' | 'reservado';

export interface GestaoImovel {
  id: string;
  codigo: string;
  titulo: string;
  tipo: PropertyType;
  cidade: string;
  estado: string;
  bairro: string;
  valor: number;
  areaPrivativa: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  origem: OrigemCaptacao;
  equipe: string;
  captador: string;
  captadoEm: string;
  atualizadoEm: string;
  situacao: GestaoSituacao;
  disponibilidade: GestaoDisponibilidade;
  fotosStatus: FotoStatus;
  placaStatus: PlacaStatus;
  vendidoEm?: string;
  valorVendido?: number;
  saiuEm?: string;
  saiuTipo?: 'venda' | 'retirada';
  hasActiveProposal?: boolean;
  activeProposalCount?: number;
  proposalStage?: ProposalStage;
  lastProposalUpdateAt?: string;
  proposalValue?: number;
  reservedFlag?: boolean;
  linkedNegotiationId?: string;
  proposalDescription?: string;
}

export interface KpiItem {
  id: 'captados' | 'volumeCaptado' | 'ativos' | 'vendidos' | 'volumeVendido' | 'ticketMedio' | 'saidas';
  label: string;
  value: number;
  type: 'count' | 'currency';
  variation: number;
}

export interface SituacaoVolumeItem {
  situacao: GestaoSituacao;
  label: string;
  quantidade: number;
  percentual: number;
  variacao: number;
}

export interface SituacaoValorItem {
  situacao: GestaoSituacao;
  label: string;
  quantidade: number;
  valor: number;
  percentual: number;
}

export interface CaptacaoMensalItem {
  mes: string; // YYYY-MM
  captados: number;
  valorCaptado: number;
  vendidos: number;
  valorVendido: number;
}

export interface StatusListItem {
  status: GestaoDisponibilidade;
  label: string;
  quantidade: number;
  valor: number;
  percentual: number;
  variacao: number;
}

export interface FotosResumoItem {
  status: FotoStatus;
  label: string;
  quantidade: number;
  percentual: number;
}

export interface PlacaResumoItem {
  status: PlacaStatus;
  label: string;
  quantidade: number;
  percentual: number;
}

export interface GestaoResumo {
  kpis: KpiItem[];
  situacoesVolume: SituacaoVolumeItem[];
  situacoesValor: SituacaoValorItem[];
  captacaoMensal: CaptacaoMensalItem[];
  fotos: FotosResumoItem[];
  placa: PlacaResumoItem[];
  statusList: StatusListItem[];
}

const PROPERTY_TYPES = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Sala Comercial',
  'Terreno'
] as const;

const ORIGENS = [
  'Prospecção ativa',
  'Indicação',
  'Portal imobiliário',
  'Repasse de cliente',
  'Campanha digital'
] as const;

type PropertyType = typeof PROPERTY_TYPES[number];
type OrigemCaptacao = typeof ORIGENS[number];

const CAPTADORES = [
  'Ana Paula Lima',
  'Diego Gomes',
  'Fernanda Souza',
  'Gabriel Torres',
  'Juliana Duarte',
  'Marcos Albuquerque',
  'Patrícia Vieira',
  'Roberto Carvalho',
  'Sofia Martins',
  'Thiago Batista'
];

const EQUIPES = ['Equipe Centro', 'Equipe Litoral', 'Equipe Premium', 'Equipe Parcerias'];

interface CityData {
  city: string;
  state: string;
  neighborhoods: string[];
}

const CITIES: CityData[] = [
  {
    city: 'Balneário Camboriú',
    state: 'SC',
    neighborhoods: ['Centro', 'Pioneiros', 'Barra Sul', 'Nações', 'Vila Real']
  },
  {
    city: 'Itajaí',
    state: 'SC',
    neighborhoods: ['Fazenda', 'Cabeçudas', 'Praia Brava', 'Dom Bosco', 'Centro']
  },
  {
    city: 'Florianópolis',
    state: 'SC',
    neighborhoods: ['Centro', 'Trindade', 'Campeche', 'Coqueiros', 'Jurerê Internacional']
  },
  {
    city: 'Joinville',
    state: 'SC',
    neighborhoods: ['América', 'Atiradores', 'Costa e Silva', 'Saguaçu', 'Glória']
  }
];

const propertyTypeConfig: Record<PropertyType, {
  valor: [number, number];
  area: [number, number];
  quartos: [number, number];
  suites: [number, number];
  banheiros: [number, number];
  vagas: [number, number];
}> = {
  Apartamento: {
    valor: [320000, 2800000],
    area: [55, 240],
    quartos: [1, 4],
    suites: [0, 3],
    banheiros: [1, 4],
    vagas: [1, 3]
  },
  Casa: {
    valor: [480000, 4500000],
    area: [100, 420],
    quartos: [2, 5],
    suites: [0, 4],
    banheiros: [2, 6],
    vagas: [1, 4]
  },
  Cobertura: {
    valor: [950000, 5200000],
    area: [150, 520],
    quartos: [2, 5],
    suites: [1, 4],
    banheiros: [3, 6],
    vagas: [2, 4]
  },
  'Sala Comercial': {
    valor: [240000, 1650000],
    area: [30, 200],
    quartos: [0, 0],
    suites: [0, 0],
    banheiros: [1, 3],
    vagas: [0, 2]
  },
  Terreno: {
    valor: [180000, 1500000],
    area: [200, 1600],
    quartos: [0, 0],
    suites: [0, 0],
    banheiros: [0, 0],
    vagas: [0, 0]
  }
};

let inMemoryData: GestaoImovel[] | null = null;

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    console.warn('[gestaoMock] localStorage is not available in window context.', error);
    return null;
  }

  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage as Storage;
    }
  } catch (error) {
    console.warn('[gestaoMock] localStorage is not available in global context.', error);
    return null;
  }

  return null;
}

function readData(): GestaoImovel[] {
  if (inMemoryData) return inMemoryData;
  const storage = getStorage();
  if (!storage) return [];
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[gestaoMock] Failed to read from localStorage.', error);
    return [];
  }
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as GestaoImovel[];
    inMemoryData = parsed;
    return parsed;
  } catch (error) {
    console.warn('[gestaoMock] Failed to parse stored data, regenerating seed.', error);
    return [];
  }
}

function writeData(data: GestaoImovel[]): void {
  inMemoryData = data;
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('[gestaoMock] Failed to persist data to localStorage.', error);
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRandom<T>(entries: Array<[T, number]>): T {
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = Math.random() * totalWeight;
  for (const [value, weight] of entries) {
    threshold -= weight;
    if (threshold <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

function randomChoice<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function biasedDaysBack(maxDays: number): number {
  const bias = 2.2; // favors recent dates while keeping older records
  const ratio = Math.pow(Math.random(), bias);
  return Math.floor(ratio * maxDays);
}

function randomPastDate(maxDays: number): Date {
  const daysBack = biasedDaysBack(maxDays);
  const offsetMs = Math.floor(Math.random() * DAY_IN_MS);
  return new Date(Date.now() - daysBack * DAY_IN_MS - offsetMs);
}

function randomDateBetween(start: Date | number, end: Date | number): Date {
  const startTime = start instanceof Date ? start.getTime() : start;
  const endTime = end instanceof Date ? end.getTime() : end;
  if (endTime <= startTime) return new Date(startTime);
  const time = startTime + Math.random() * (endTime - startTime);
  return new Date(time);
}

function deriveDisponibilidade(situacao: GestaoSituacao): GestaoDisponibilidade {
  switch (situacao) {
    case 'publicado':
      return Math.random() < 0.7 ? 'disponivel_site' : 'disponivel_interno';
    case 'proposta':
      return Math.random() < 0.65 ? 'reservado' : 'disponivel_interno';
    case 'em_negociacao':
      return Math.random() < 0.6 ? 'reservado' : 'disponivel_interno';
    case 'vendido':
    case 'retirado':
      return 'indisponivel';
    default:
      return 'disponivel_interno';
  }
}

function randomFotosStatus(situacao: GestaoSituacao): FotoStatus {
  if (situacao === 'publicado' || situacao === 'em_negociacao' || situacao === 'proposta') {
    return weightedRandom<FotoStatus>([
      ['completas', 7],
      ['parciais', 2],
      ['pendentes', 1],
      ['desatualizadas', 1]
    ]);
  }
  if (situacao === 'em_captacao' || situacao === 'preparacao') {
    return weightedRandom<FotoStatus>([
      ['pendentes', 5],
      ['parciais', 3],
      ['completas', 1],
      ['desatualizadas', 1]
    ]);
  }
  return weightedRandom<FotoStatus>([
    ['completas', 3],
    ['parciais', 2],
    ['pendentes', 1],
    ['desatualizadas', 3]
  ]);
}

function randomPlacaStatus(situacao: GestaoSituacao): PlacaStatus {
  if (situacao === 'vendido' || situacao === 'retirado') {
    return weightedRandom<PlacaStatus>([
      ['instalada', 4],
      ['sem_autorizacao', 3],
      ['nao_necessaria', 3],
      ['solicitada', 1],
      ['pendente', 1]
    ]);
  }
  if (situacao === 'em_captacao') {
    return weightedRandom<PlacaStatus>([
      ['pendente', 4],
      ['solicitada', 3],
      ['sem_autorizacao', 2],
      ['nao_necessaria', 1],
      ['instalada', 1]
    ]);
  }
  return weightedRandom<PlacaStatus>([
    ['instalada', 5],
    ['solicitada', 3],
    ['pendente', 2],
    ['sem_autorizacao', 2],
    ['nao_necessaria', 1]
  ]);
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
}

function generateProposalDescription(tipo: string, bairro: string, valorImovel: number, valorProposta: number): string {
  const entrada = Math.round(valorProposta * (0.25 + Math.random() * 0.25));
  const saldo = valorProposta - entrada;
  const parcelas = randomInt(12, 36);
  const valorParcela = Math.round(saldo / parcelas);
  
  return `PROPOSTA DE COMPRA Imóvel: ${tipo} ${bairro} Valor de venda do imóvel: ${formatCurrency(valorImovel)} Valor total ofertado: ${formatCurrency(valorProposta)}. Condições de pagamento Entrada no valor total de ${formatCurrency(entrada)}, composta por: Valor em dinheiro no montante de ${formatCurrency(entrada * 0.8)}. O saldo remanescente no valor de ${formatCurrency(saldo)} será pago por meio de ${parcelas} parcelas mensais de ${formatCurrency(valorParcela)}, totalizando o valor acordado.`;
}

function createMockImovel(index: number): GestaoImovel {
  const tipo = randomChoice(PROPERTY_TYPES);
  const config = propertyTypeConfig[tipo];
  const cidade = randomChoice(CITIES);
  const bairro = randomChoice(cidade.neighborhoods);
  const valor = randomInt(config.valor[0], config.valor[1]);
  const area = randomInt(config.area[0], config.area[1]);
  const quartos = config.quartos[1] === 0 ? 0 : randomInt(config.quartos[0], config.quartos[1]);
  const suites = config.suites[1] === 0 ? 0 : randomInt(Math.min(config.suites[0], quartos), Math.min(config.suites[1], quartos));
  const banheiros = config.banheiros[1] === 0 ? 0 : randomInt(Math.max(config.banheiros[0], suites), config.banheiros[1]);
  const vagas = config.vagas[1] === 0 ? 0 : randomInt(config.vagas[0], config.vagas[1]);
  const captadoEm = randomPastDate(365);
  const situacao = weightedRandom<GestaoSituacao>([
    ['publicado', 45],
    ['em_negociacao', 16],
    ['proposta', 8],
    ['vendido', 12],
    ['retirado', 8],
    ['em_captacao', 7],
    ['preparacao', 4]
  ]);
  const disponibilidade = deriveDisponibilidade(situacao);
  const fotosStatus = randomFotosStatus(situacao);
  const placaStatus = randomPlacaStatus(situacao);
  const captador = randomChoice(CAPTADORES);
  const equipe = randomChoice(EQUIPES);
  const origem = randomChoice(ORIGENS);
  const atualizadoEm = randomDateBetween(captadoEm, Date.now()).toISOString();

  let vendidoEm: string | undefined;
  let valorVendido: number | undefined;
  let saiuEm: string | undefined;
  let saiuTipo: 'venda' | 'retirada' | undefined;

  const hasActiveProposal = ['proposta', 'em_negociacao'].includes(situacao) || disponibilidade === 'reservado';
  const proposalStage: ProposalStage = disponibilidade === 'reservado'
    ? 'reservado'
    : situacao === 'em_negociacao'
      ? 'em_negociacao'
      : situacao === 'proposta'
        ? 'proposta'
        : 'sem_proposta';
  const activeProposalCount = hasActiveProposal ? randomInt(1, 3) : 0;
  const proposalValue = hasActiveProposal ? Math.round(valor * (0.92 + Math.random() * 0.08)) : undefined;
  const lastProposalUpdateAt = hasActiveProposal ? atualizadoEm : undefined;
  const reservedFlag = disponibilidade === 'reservado';
  const linkedNegotiationId = hasActiveProposal ? nanoid() : undefined;
  const proposalDescription = hasActiveProposal 
    ? generateProposalDescription(tipo, bairro, valor, proposalValue ?? valor)
    : undefined;

  if (situacao === 'vendido') {
    const dataVenda = randomDateBetween(captadoEm, Date.now());
    vendidoEm = dataVenda.toISOString();
    valorVendido = Math.round(valor * (0.93 + Math.random() * 0.12));
    saiuEm = vendidoEm;
    saiuTipo = 'venda';
  } else if (situacao === 'retirado') {
    const dataSaida = randomDateBetween(captadoEm, Date.now());
    saiuEm = dataSaida.toISOString();
    saiuTipo = 'retirada';
  }

  return {
    id: nanoid(),
    codigo: `IMV-${String(1000 + index).padStart(4, '0')}`,
    titulo: `${tipo} ${bairro}`,
    tipo,
    cidade: cidade.city,
    estado: cidade.state,
    bairro,
    valor,
    areaPrivativa: area,
    quartos,
    suites,
    banheiros,
    vagas,
    origem,
    equipe,
    captador,
    captadoEm: captadoEm.toISOString(),
    atualizadoEm,
    situacao,
    disponibilidade,
    fotosStatus,
    placaStatus,
    vendidoEm,
    valorVendido,
    saiuEm,
    saiuTipo,
    hasActiveProposal,
    activeProposalCount,
    proposalStage,
    lastProposalUpdateAt,
    proposalValue,
    reservedFlag,
    linkedNegotiationId,
    proposalDescription
  };
}

function ensureData(): GestaoImovel[] {
  const existing = readData();
  if (existing.length) return existing;
  const total = 180 + randomInt(0, 40); // ~200 registros
  const generated = Array.from({ length: total }, (_, index) => createMockImovel(index));
  writeData(generated);
  return generated;
}

function sumBy<T>(items: T[], selector: (item: T) => number): number {
  return items.reduce((total, item) => {
    const value = Number(selector(item) ?? 0);
    return Number.isFinite(value) ? total + value : total;
  }, 0);
}

function countBy<TItem, TKey extends string | number>(items: readonly TItem[], selector: (item: TItem) => TKey): Record<TKey, number> {
  return items.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<TKey, number>);
}

function isWithinRange(value: string | undefined, start: Date, end: Date): boolean {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date >= start && date <= end;
}

function calcPercent(total: number, value: number): number {
  if (total <= 0) return 0;
  return (value / total) * 100;
}

function calcVariation(current: number, previous: number): number {
  if (!previous) {
    return current ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function isSameMonth(value: string | undefined, target: Date): boolean {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === target.getFullYear() && date.getMonth() === target.getMonth();
}

function getRangeStart(range: GestaoResumoRange, now: Date): Date {
  switch (range) {
    case '30d':
      return new Date(now.getTime() - 30 * DAY_IN_MS);
    case '90d':
      return new Date(now.getTime() - 90 * DAY_IN_MS);
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1);
    default:
      return new Date(now.getTime() - 30 * DAY_IN_MS);
  }
}

function getPreviousRange(start: Date, end: Date): { previousStart: Date; previousEnd: Date } {
  const duration = end.getTime() - start.getTime();
  const previousEnd = new Date(start.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - duration);
  return { previousStart, previousEnd };
}

export function seedIfEmpty(): void {
  ensureData();
}

export function getGestaoImoveis(): GestaoImovel[] {
  return ensureData();
}

export function getResumoPeriodo(range: GestaoResumoRange): GestaoResumo {
  const data = ensureData();
  const now = new Date();
  const start = getRangeStart(range, now);
  const { previousStart, previousEnd } = getPreviousRange(start, now);

  const currentCaptados = data.filter(item => isWithinRange(item.captadoEm, start, now));
  const previousCaptados = data.filter(item => isWithinRange(item.captadoEm, previousStart, previousEnd));
  const currentVendidos = data.filter(item => item.vendidoEm && isWithinRange(item.vendidoEm, start, now));
  const previousVendidos = data.filter(item => item.vendidoEm && isWithinRange(item.vendidoEm, previousStart, previousEnd));
  const currentSaidas = data.filter(item => item.saiuEm && isWithinRange(item.saiuEm, start, now));
  const previousSaidas = data.filter(item => item.saiuEm && isWithinRange(item.saiuEm, previousStart, previousEnd));

  const valorCaptadoAtual = sumBy(currentCaptados, item => item.valor);
  const valorCaptadoAnterior = sumBy(previousCaptados, item => item.valor);
  const valorVendidoAtual = sumBy(currentVendidos, item => item.valorVendido ?? item.valor);
  const valorVendidoAnterior = sumBy(previousVendidos, item => item.valorVendido ?? item.valor);

  const ticketMedioAtual = currentCaptados.length ? valorCaptadoAtual / currentCaptados.length : 0;
  const ticketMedioAnterior = previousCaptados.length ? valorCaptadoAnterior / previousCaptados.length : 0;

  const ativosSet: ReadonlySet<GestaoDisponibilidade> = new Set([
    'disponivel_site',
    'disponivel_interno',
    'reservado'
  ]);

  const ativosAtual = currentCaptados.filter(item => ativosSet.has(item.disponibilidade)).length;
  const ativosAnterior = previousCaptados.filter(item => ativosSet.has(item.disponibilidade)).length;

  const kpis: KpiItem[] = [
    {
      id: 'captados',
      label: 'Imóveis captados',
      value: currentCaptados.length,
      type: 'count',
      variation: round(calcVariation(currentCaptados.length, previousCaptados.length), 1)
    },
    {
      id: 'volumeCaptado',
      label: 'Volume captado',
      value: valorCaptadoAtual,
      type: 'currency',
      variation: round(calcVariation(valorCaptadoAtual, valorCaptadoAnterior), 1)
    },
    {
      id: 'ativos',
      label: 'Imóveis ativos',
      value: ativosAtual,
      type: 'count',
      variation: round(calcVariation(ativosAtual, ativosAnterior), 1)
    },
    {
      id: 'vendidos',
      label: 'Imóveis vendidos',
      value: currentVendidos.length,
      type: 'count',
      variation: round(calcVariation(currentVendidos.length, previousVendidos.length), 1)
    },
    {
      id: 'volumeVendido',
      label: 'Volume vendido',
      value: valorVendidoAtual,
      type: 'currency',
      variation: round(calcVariation(valorVendidoAtual, valorVendidoAnterior), 1)
    },
    {
      id: 'ticketMedio',
      label: 'Ticket médio',
      value: ticketMedioAtual,
      type: 'currency',
      variation: round(calcVariation(ticketMedioAtual, ticketMedioAnterior), 1)
    },
    {
      id: 'saidas',
      label: 'Saídas',
      value: currentSaidas.length,
      type: 'count',
      variation: round(calcVariation(currentSaidas.length, previousSaidas.length), 1)
    }
  ];

  const currentSituacaoCount = countBy(currentCaptados, item => item.situacao);
  const previousSituacaoCount = countBy(previousCaptados, item => item.situacao);
  const situacoesVolume: SituacaoVolumeItem[] = situacaoDefinitions.map(def => {
    const quantidadeAtual = currentSituacaoCount[def.value] || 0;
    const quantidadeAnterior = previousSituacaoCount[def.value] || 0;
    return {
      situacao: def.value,
      label: def.label,
      quantidade: quantidadeAtual,
      percentual: round(calcPercent(currentCaptados.length, quantidadeAtual), 1),
      variacao: round(calcVariation(quantidadeAtual, quantidadeAnterior), 1)
    };
  });

  const totalValorSituacoes = sumBy(currentCaptados, item => (item.situacao === 'vendido' && item.valorVendido ? item.valorVendido : item.valor));
  const situacoesValor: SituacaoValorItem[] = situacaoDefinitions.map(def => {
    const itens = currentCaptados.filter(item => item.situacao === def.value);
    const valorTotal = sumBy(itens, item => (item.situacao === 'vendido' && item.valorVendido ? item.valorVendido : item.valor));
    return {
      situacao: def.value,
      label: def.label,
      quantidade: itens.length,
      valor: valorTotal,
      percentual: round(calcPercent(totalValorSituacoes, valorTotal), 1)
    };
  });

  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const captacaoMensal: CaptacaoMensalItem[] = [];
  for (
    let cursor = new Date(startMonth);
    cursor <= endMonth;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  ) {
    const captadosMes = currentCaptados.filter(item => isSameMonth(item.captadoEm, cursor));
    const vendidosMes = currentVendidos.filter(item => isSameMonth(item.vendidoEm, cursor));
    captacaoMensal.push({
      mes: formatMonth(cursor),
      captados: captadosMes.length,
      valorCaptado: sumBy(captadosMes, item => item.valor),
      vendidos: vendidosMes.length,
      valorVendido: sumBy(vendidosMes, item => item.valorVendido ?? item.valor)
    });
  }

  const fotosCount = countBy(currentCaptados, item => item.fotosStatus);
  const fotos: FotosResumoItem[] = fotoDefinitions.map(def => ({
    status: def.value,
    label: def.label,
    quantidade: fotosCount[def.value] || 0,
    percentual: round(calcPercent(currentCaptados.length, fotosCount[def.value] || 0), 1)
  }));

  const placaCount = countBy(currentCaptados, item => item.placaStatus);
  const placa: PlacaResumoItem[] = placaDefinitions.map(def => ({
    status: def.value,
    label: def.label,
    quantidade: placaCount[def.value] || 0,
    percentual: round(calcPercent(currentCaptados.length, placaCount[def.value] || 0), 1)
  }));

  const currentStatusCount = countBy(currentCaptados, item => item.disponibilidade);
  const previousStatusCount = countBy(previousCaptados, item => item.disponibilidade);
  const totalValorStatus = sumBy(currentCaptados, item => item.valor);
  const statusList: StatusListItem[] = disponibilidadeDefinitions.map(def => {
    const itens = currentCaptados.filter(item => item.disponibilidade === def.value);
    const quantidadeAtual = currentStatusCount[def.value] || 0;
    const quantidadeAnterior = previousStatusCount[def.value] || 0;
    const valor = sumBy(itens, item => item.valor);
    return {
      status: def.value,
      label: def.label,
      quantidade: quantidadeAtual,
      valor,
      percentual: round(calcPercent(totalValorStatus, valor), 1),
      variacao: round(calcVariation(quantidadeAtual, quantidadeAnterior), 1)
    };
  });

  return {
    kpis,
    situacoesVolume,
    situacoesValor,
    captacaoMensal,
    fotos,
    placa,
    statusList
  };
}
