import type { PropertySummary } from '@/features/properties/types';

export type PeriodKey = 'today' | '7d' | '15d' | '30d' | '90d' | 'custom';

export type RoletaoPresetPeriod = '7d' | '15d' | '30d';

export interface PeriodRange {
  start: string; // ISO
  end: string; // ISO
}

export type Period =
  | { type: RoletaoPresetPeriod }
  | { type: 'custom'; range: PeriodRange };

export interface UserKPIInput {
  period: PeriodKey;
  start?: string; // ISO
  end?: string; // ISO
}

export interface KpiResumo {
  captacoes: number;
  vendasQtd: number;
  vendasValorTotal: number;
  leadsRecebidos: number;
  visitas: number;
  propostas: number;
  vendas: number;
  ticketMedio: number;
  tempoMedioFechamentoDias: number;
  taxaFollowUp: number;
  agendaCumprida: number;
  tempoMedioRespostaMin: number;
  usoFerramentasScore: number;
  nps: number;
  indicacoes: number;
  retencoes: number;
}

export interface VacanciaMensal {
  mes: string; // '2025-01'
  vendeu: boolean;
  vendasQtd: number;
}

export interface UserSaleItem {
  saleId: string;
  propertyId: string;
  soldAt: string; // ISO date
  soldPrice: number;
}

export interface PropertySaleSummary extends PropertySummary {
  saleId: string;
}

export type UserSaleDetail = Record<string, PropertySummary>;

export interface KpiDetalhado {
  resumo: KpiResumo;
  vacancia: VacanciaMensal[];
  funilConversao: {
    leads: number;
    visitas: number;
    propostas: number;
    vendas: number;
  };
  ultimasVendas: UserSaleItem[];
  ultimasIndicacoes: Array<{ nome: string; origem: string; data: string }>;
  ultimosFeedbacks: Array<{ cliente: string; imovel: string; data: string; estrelas: number; comentario: string }>;
}

export interface HealthSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  description?: string;
  /**
   * Optional base path or URL to use when creating a deep link for the segment.
   * When provided, the `range` parameter will be appended automatically.
   */
  href?: string;
  /**
   * Overrides the generated deep-link id when the chart `id` needs to differ
   * from the range value used in the destination page.
   */
  deepLinkId?: string;
  /**
   * Custom range parameter to append to the destination URL. Falls back to the
   * segment `id` when omitted.
   */
  range?: string;
}

export interface RoletaoBannerMetrics {
  claimed: number;
  awaitingToday: number;
}

export interface RoletaoHealthMetrics {
  banner: RoletaoBannerMetrics;
  avgAdvanceTime: number;
  convRate: number;
  activeParticipation: number;
  claimsPerDay: number;
}

export interface RoletaoKPIs {
  defaultPeriod: RoletaoPresetPeriod;
  periods: Record<RoletaoPresetPeriod, RoletaoHealthMetrics>;
  custom?: {
    range: PeriodRange | null;
    metrics: RoletaoHealthMetrics | null;
  };
}

export type AutomationPillVariant = 'default' | 'success' | 'danger' | 'warning' | 'primary';

export interface AutomationTogglePill {
  id: string;
  message: string;
  variant: AutomationPillVariant;
  reason?: string;
}

export interface AutomationToggle {
  id: string;
  title: string;
  description: string;
  href: string;
  enabled: boolean;
}

export interface AutomationEnforcementReason {
  id: string;
  enforced: boolean;
  targetValue: boolean | null;
  reasons: string[];
}

export interface UserAutomationsSnapshot {
  autoEnforceHealthLeads: boolean;
  autoEnforceRoletao: boolean;
  canReceiveNewLeads: boolean;
  canClaimRoletao: boolean;
  toggles: AutomationToggle[];
  pills: AutomationTogglePill[];
  enforcementReasons: AutomationEnforcementReason[];
}

export interface UserCheckpointSettings {
  nextCheckpointAt: string | null;
  suspendLeadsUntil: string | null;
  suspendRoletaoUntil: string | null;
  reason: string | null;
}

export interface CheckPointUpdateInput {
  nextCheckpointAt: string | null;
  suspendLeadsUntil: string | null;
  suspendRoletaoUntil: string | null;
  reason: string | null;
}

export interface UserHealthSnapshot {
  updatedAt: string;
  leads: HealthSegment[];
  imoveis: HealthSegment[];
  tarefas: HealthSegment[];
  roletao: RoletaoKPIs;
  automations: UserAutomationsSnapshot;
  nextCheckpointAt: string | null;
  suspendLeadsUntil: string | null;
  suspendRoletaoUntil: string | null;
  checkpointReason: string | null;
  checkpoint: UserCheckpointSettings;
}

export type DeactivationState = 'idle' | 'scheduled' | 'deactivated';

export interface UserReportData {
  personalInfo: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    role?: string | null;
    city?: string | null;
    uf?: string | null;
    admissionDate?: string | null;
  };
  metrics?: {
    resumo?: KpiResumo | null;
    vacancia?: VacanciaMensal[] | null;
  } | null;
  indicators: {
    followUpRate?: number | null;
    vacancia?: VacanciaMensal[] | null;
  };
  roletaoStatus: {
    state: DeactivationState;
    scheduledFor: string | null;
    lastActionAt: string | null;
    canClaimRoletao: boolean;
  };
  observations?: string | null;
}

export interface WalletSummary {
  total: number;
  hot: number;
  warm: number;
  cold: number;
}

export type DeactivationStrategy = 'redistribute' | 'archive';

export interface RedistributionFilters {
  includeHot: boolean;
  includeWarm: boolean;
  includeCold: boolean;
}

export interface RedistributionPreview {
  selectedTotal: number;
  toRedistribute: number;
  toArchive: number;
  remaining: number;
  breakdown: WalletSummary;
}

export interface DeactivationPayload {
  strategy: DeactivationStrategy;
  filters: RedistributionFilters;
  notes?: string;
  scheduleFor?: string | null;
  actorUserId?: string;
}

export interface ReactivateUserPayload {
  notes?: string;
  actorUserId?: string;
}

export type DeactivationJobStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface DeactivationJobResult {
  redistributed: number;
  archived: number;
  remaining: number;
}

export type DeactivationJobType = 'deactivation' | 'reactivation';

export interface DeactivationJob {
  id: string;
  userId: string;
  type: DeactivationJobType;
  status: DeactivationJobStatus;
  createdAt: string;
  scheduledFor: string | null;
  updatedAt: string;
  strategy?: DeactivationStrategy;
  filters?: RedistributionFilters;
  notes?: string;
  summary: WalletSummary;
  result?: DeactivationJobResult;
  error?: string | null;
}

export type DeactivationHistoryAction =
  | 'scheduled'
  | 'cancelled'
  | 'deactivated'
  | 'reactivated';

export interface DeactivationHistoryEntry {
  id: string;
  action: DeactivationHistoryAction;
  at: string;
  actor: string;
  details?: string;
  jobId?: string;
}

export type DeactivationBannerVariant = 'info' | 'warning' | 'success' | 'danger';

export interface DeactivationBanner {
  id: string;
  message: string;
  variant: DeactivationBannerVariant;
  createdAt: string;
  expiresAt?: string | null;
  ctaLabel?: string;
  ctaHref?: string;
  tag?: string;
}

export interface DeactivationStatus {
  state: DeactivationState;
  scheduledFor: string | null;
  lastActionAt: string | null;
  summary: WalletSummary;
  strategy?: DeactivationStrategy;
  notes?: string;
  jobs: DeactivationJob[];
  banners: DeactivationBanner[];
  history: DeactivationHistoryEntry[];
}

export type AuditEventType =
  | 'login'
  | 'view_property'
  | 'view_owner_phone'
  | 'download_photos'
  | 'lead_update'
  | 'schedule_visit'
  | 'upload_photos'
  | 'share_listing'
  | 'export_csv'
  | 'custom'
  | 'user_status_change'
  | 'roletao_toggle'
  | 'health_snapshot_recomputed'
  | 'checkpoint_update'
  | 'temporary_suspension_set'
  | 'temporary_suspension_cleared';

export interface AuditEvent {
  id: string;
  ts: string;
  type: AuditEventType;
  label?: string;
  targetId?: string;
  actorUserId: string;
  meta?: Record<string, unknown>;
  ip?: string;
}
