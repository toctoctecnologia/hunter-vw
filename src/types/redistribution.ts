export interface ArchivedLead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  motivo: string;
  responsavel: string;
  origem: string;
  canal?: string;
  filaAnterior?: string;
  arquivadoEm: string;
  tags?: string[];
  score?: number;
  status?: string;
}

export interface ArchivedLeadsFilters {
  reason?: string;
  owner?: string;
  queue?: string;
  tag?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ArchivedLeadsResponse {
  items: ArchivedLead[];
  total: number;
  reasons: { id: string; label: string; count: number }[];
  owners: string[];
  queues: string[];
  tags: string[];
}

export type RedistributionPriority = 'balanceada' | 'prioridade_destino';

export interface DestinationConfig {
  strategy: 'fila' | 'usuario';
  targetId: string;
  targetName: string;
  priority: RedistributionPriority;
  preserveOwnership: boolean;
  notifyOwners: boolean;
  notes?: string;
}

export interface RedistributionSelection {
  type: 'ids' | 'all';
  ids?: string[];
  filters?: ArchivedLeadsFilters & { search?: string };
  excludedIds?: string[];
}

export interface RedistributionPreview {
  id: string;
  totalSelecionados: number;
  totalAfetados: number;
  destino: DestinationConfig;
  estimativaConclusao: string;
  duracaoEstimadaMinutos: number;
  distribuicaoPorDestino: { targetId: string; targetName: string; leads: number }[];
  motivos: { motivo: string; quantidade: number }[];
}

export interface RedistributionJob {
  id: string;
  status: 'queued' | 'running' | 'completed';
  createdAt: string;
  totalLeads: number;
  destino: DestinationConfig;
  filtros: ArchivedLeadsFilters & { search?: string };
  solicitadoPor: string;
}

export interface RedistributionAuditEntry {
  id: string;
  jobId: string;
  createdAt: string;
  mensagem: string;
  totalLeads: number;
}

export interface ImportBatchPayload {
  name: string;
  quantity: number;
  source?: string;
  reason?: string;
  destination: DestinationConfig;
}

export interface ImportBatchResponse {
  batchId: string;
  created: number;
  leads: ArchivedLead[];
}

export interface RedistributionExecuteResponse {
  job: RedistributionJob;
  audit: RedistributionAuditEntry;
}
