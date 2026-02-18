import type {
  ArchivedLead,
  ArchivedLeadsFilters,
  ArchivedLeadsResponse,
  DestinationConfig,
  ImportBatchPayload,
  ImportBatchResponse,
  RedistributionAuditEntry,
  RedistributionExecuteResponse,
  RedistributionJob,
  RedistributionPreview,
  RedistributionSelection
} from '@/types/redistribution';

const REASONS = [
  'Sem contato',
  'Dados incompletos',
  'Duplicado',
  'Sem interesse',
  'Tempo expirado',
];

const OWNERS = [
  'Ana Lima',
  'Carlos Silva',
  'Mariana Souza',
  'Equipe Digital',
  'Time Externo',
];

const QUEUES = [
  'Fila Geral',
  'Fila Premium',
  'Campanha Social',
  'Pré-atendimento',
];

const TAGS = ['whatsapp', 'site', 'facebook', 'google', 'manual'];
const ORIGINS = ['Landing Page', 'Portal Parceiro', 'Evento', 'Facebook Ads', 'Indicação'];
const STATUSES = ['em_atendimento', 'convertido', 'arquivado', 'perdido', 'rearquivado'];

const baseDate = Date.now();

export const mockArchivedLeads: ArchivedLead[] = Array.from({ length: 60 }).map((_, index) => {
  const reason = REASONS[index % REASONS.length];
  const owner = OWNERS[index % OWNERS.length];
  const queue = QUEUES[index % QUEUES.length];
  const createdAt = new Date(baseDate - index * 36 * 60 * 60 * 1000);
  const tags = TAGS.filter((_, tagIndex) => (tagIndex + index) % 3 === 0);
  const status = STATUSES[index % STATUSES.length];

  return {
    id: `arch-${index + 1}`,
    nome: `Lead arquivado ${index + 1}`,
    email: `lead${index + 1}@exemplo.com`,
    motivo: reason,
    responsavel: owner,
    origem: ORIGINS[index % ORIGINS.length],
    canal: index % 2 === 0 ? 'Organico' : 'Pago',
    filaAnterior: queue,
    arquivadoEm: createdAt.toISOString(),
    tags,
    score: Math.round(40 + (index % 60)),
    status,
  } satisfies ArchivedLead;
});

export const mockRedistributionJobs: RedistributionJob[] = [];
export const mockRedistributionAudit: RedistributionAuditEntry[] = [];

function normalize(value?: string) {
  return value?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '') ?? '';
}

function matchesSearch(lead: ArchivedLead, search?: string) {
  if (!search) return true;
  const term = normalize(search);
  const fields = [lead.nome, lead.email, lead.origem, lead.responsavel, lead.motivo];
  return fields.some(field => normalize(field).includes(term));
}

function isWithinRange(dateISO: string, start?: string, end?: string) {
  const ts = new Date(dateISO).getTime();
  if (start) {
    const startTs = new Date(start).setHours(0, 0, 0, 0);
    if (ts < startTs) return false;
  }
  if (end) {
    const endTs = new Date(end).setHours(23, 59, 59, 999);
    if (ts > endTs) return false;
  }
  return true;
}

export function filterArchivedLeads(filters: ArchivedLeadsFilters & { search?: string }) {
  return mockArchivedLeads.filter(lead => {
    if (filters.reason && lead.motivo !== filters.reason) return false;
    if (filters.owner && lead.responsavel !== filters.owner) return false;
    if (filters.queue && lead.filaAnterior !== filters.queue) return false;
    if (filters.tag && !(lead.tags ?? []).includes(filters.tag)) return false;
    if (filters.status && lead.status !== filters.status) return false;
    if (!isWithinRange(lead.arquivadoEm, filters.startDate, filters.endDate)) return false;
    if (!matchesSearch(lead, filters.search)) return false;
    return true;
  });
}

function computeReasons(dataset: ArchivedLead[]) {
  const counts = new Map<string, number>();
  dataset.forEach(lead => counts.set(lead.motivo, (counts.get(lead.motivo) ?? 0) + 1));
  return Array.from(counts.entries()).map(([reason, count]) => ({
    id: reason,
    label: reason,
    count,
  }));
}

export function getArchivedLeadsMock(
  filters: ArchivedLeadsFilters & { search?: string; page?: number; perPage?: number }
): ArchivedLeadsResponse {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 10;
  const filtered = filterArchivedLeads(filters);
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const owners = Array.from(new Set(mockArchivedLeads.map(lead => lead.responsavel)));
  const queues = Array.from(new Set(mockArchivedLeads.map(lead => lead.filaAnterior).filter(Boolean))) as string[];
  const tags = Array.from(new Set(mockArchivedLeads.flatMap(lead => lead.tags ?? [])));

  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    reasons: computeReasons(mockArchivedLeads),
    owners,
    queues,
    tags,
  };
}

function resolveSelection(selection: RedistributionSelection) {
  if (selection.type === 'ids') {
    const ids = new Set(selection.ids ?? []);
    return mockArchivedLeads.filter(lead => ids.has(lead.id));
  }
  const filtered = filterArchivedLeads(selection.filters ?? {});
  const excluded = new Set(selection.excludedIds ?? []);
  return filtered.filter(lead => !excluded.has(lead.id));
}

export function createRedistributionPreview(
  selection: RedistributionSelection,
  destino: DestinationConfig
): { preview: RedistributionPreview; leads: ArchivedLead[] } {
  const leads = resolveSelection(selection);
  const motivosMap = new Map<string, number>();
  leads.forEach(lead => motivosMap.set(lead.motivo, (motivosMap.get(lead.motivo) ?? 0) + 1));

  const total = leads.length;
  const duracao = Math.max(5, Math.round(total * 1.5));
  const estimativa = new Date(Date.now() + duracao * 60 * 1000).toISOString();

  const preview: RedistributionPreview = {
    id: `preview-${Date.now()}`,
    totalSelecionados: total,
    totalAfetados: total,
    destino,
    estimativaConclusao: estimativa,
    duracaoEstimadaMinutos: duracao,
    distribuicaoPorDestino: [
      {
        targetId: destino.targetId,
        targetName: destino.targetName,
        leads: total,
      },
    ],
    motivos: Array.from(motivosMap.entries()).map(([motivo, quantidade]) => ({ motivo, quantidade })),
  };

  return { preview, leads };
}

export function executeRedistributionMock(
  selection: RedistributionSelection,
  destino: DestinationConfig,
  solicitadoPor: string,
  filtros: ArchivedLeadsFilters & { search?: string }
): RedistributionExecuteResponse {
  const { preview, leads } = createRedistributionPreview(selection, destino);
  const idsToRemove = new Set(leads.map(lead => lead.id));

  for (let i = mockArchivedLeads.length - 1; i >= 0; i--) {
    if (idsToRemove.has(mockArchivedLeads[i]?.id)) {
      mockArchivedLeads.splice(i, 1);
    }
  }

  const job: RedistributionJob = {
    id: `job-${Date.now()}`,
    status: 'queued',
    createdAt: new Date().toISOString(),
    totalLeads: leads.length,
    destino,
    filtros,
    solicitadoPor,
  };

  const audit: RedistributionAuditEntry = {
    id: `audit-${Date.now()}`,
    jobId: job.id,
    createdAt: job.createdAt,
    mensagem: `Redistribuição iniciada para ${destino.targetName}`,
    totalLeads: leads.length,
  };

  mockRedistributionJobs.unshift(job);
  mockRedistributionAudit.unshift(audit);

  return { job, audit };
}

export function importLeadsMock(payload: ImportBatchPayload): ImportBatchResponse {
  const quantity = Math.max(1, Math.min(200, Math.round(payload.quantity)));
  const created: ArchivedLead[] = [];
  for (let i = 0; i < quantity; i++) {
    const id = `import-${Date.now()}-${i}`;
    const lead: ArchivedLead = {
      id,
      nome: `${payload.name || 'Lote'} #${i + 1}`,
      email: `novo-${id}@exemplo.com`,
      motivo: payload.reason ?? 'Novo lote',
      responsavel: 'Processo de Importação',
      origem: payload.source ?? 'Importação',
      canal: 'Importado',
      filaAnterior: payload.destination.targetName,
      arquivadoEm: new Date().toISOString(),
      tags: ['importado'],
      score: 50 + (i % 25),
    };
    mockArchivedLeads.unshift(lead);
    created.push(lead);
  }

  return {
    batchId: `batch-${Date.now()}`,
    created: created.length,
    leads: created,
  };
}
