import type {
  AutomationToggle,
  AutomationTogglePill,
  AutomationEnforcementReason,
  AuditEventType,
  CheckPointUpdateInput,
  HealthSegment,
  RoletaoHealthMetrics,
  RoletaoKPIs,
  UserAutomationsSnapshot,
  UserCheckpointSettings,
  UserHealthSnapshot,
} from '@/features/users/types';
import type { Lead } from '@/types/lead';
import { MOCK_LEADS } from '@/mocks/leads';
import { MOCK_PROPERTIES } from '@/mocks/properties';
import { USERS } from '@/mocks/users';
import {
  appendAuditLog,
  createAuditEventId,
} from '@/mocks/auditLog';
import {
  getUserState,
  mapEnforcementsToSnapshot,
  saveAutoFlags as persistAutoFlags,
  updateUserState,
  type AutomationEnforcementState,
  type AutomationFlagsUpdate,
  type UserStateRecord,
} from '@/mocks/userState';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const DATE_LIKE_KEYS = [
  'at',
  'date',
  'data',
  'day',
  'dia',
  'timestamp',
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  'last_contact_at',
  'lastContactAt',
  'last_interaction_at',
  'lastInteractionAt',
  'last_activity_at',
  'lastActivityAt',
  'performed_at',
  'performedAt',
  'finished_at',
  'finishedAt',
  'concluded_at',
  'concludedAt',
  'due_at',
  'dueAt',
  'scheduled_for',
  'scheduledFor',
  'occurred_at',
  'occurredAt',
  'executed_at',
  'executedAt',
  'interaction_at',
  'interactionAt',
  'contact_at',
  'contactAt',
];

const HUMAN_INTERACTION_LIST_KEYS = [
  'interactions',
  'activities',
  'activity',
  'contacts',
  'contactHistory',
  'contact_history',
  'engagements',
  'timeline',
  'history',
  'events',
  'notes',
  'tasks',
  'updates',
];

const PROPERTY_UPDATE_LIST_KEYS = ['imovel_updates', 'imovelUpdates', 'updates', 'history', 'timeline'];

const AUTOMATION_KEYWORDS = ['automation', 'automação', 'automacao', 'automatic', 'automated', 'workflow', 'journey', 'playbook', 'bot', 'sistema'];

interface RecomputeOptions {
  reason?: 'manual' | 'cron';
  actorUserId?: string;
}

function normaliseUserId(userId: string): string[] {
  const trimmed = String(userId ?? '').trim();
  if (!trimmed) return [];
  const list = new Set<string>([trimmed]);
  if (!trimmed.startsWith('user')) {
    list.add(`user${trimmed}`);
  }
  if (!trimmed.startsWith('u')) {
    list.add(`u${trimmed}`);
  }
  if (trimmed === '1' || trimmed === 'current-user') {
    list.add('current-user');
  }
  return Array.from(list);
}

function parseDate(value?: string | null | Date | number): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isNaN(time) ? null : value;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sanitizeIsoDate(value?: string | null): string | null {
  const parsed = parseDate(value);
  if (!parsed) return null;
  return parsed.toISOString();
}

function sanitizeFutureIsoDate(value?: string | null, reference = new Date()): string | null {
  const iso = sanitizeIsoDate(value);
  if (!iso) return null;
  const parsed = new Date(iso);
  return parsed.getTime() > reference.getTime() ? iso : null;
}

interface SuspensionOverlayResult {
  canReceiveNewLeads: boolean;
  canClaimRoletao: boolean;
  suspendLeadsUntil: string | null;
  suspendRoletaoUntil: string | null;
  leadSuspensionActive: boolean;
  roletaoSuspensionActive: boolean;
}

function applySuspensionOverlay(
  state: Pick<UserStateRecord, 'suspend_leads_until' | 'suspend_roletao_until'>,
  flags: { canReceiveNewLeads: boolean; canClaimRoletao: boolean },
  reference = new Date(),
): SuspensionOverlayResult {
  const suspendLeadsUntil = sanitizeFutureIsoDate(state.suspend_leads_until, reference);
  const suspendRoletaoUntil = sanitizeFutureIsoDate(state.suspend_roletao_until, reference);

  return {
    canReceiveNewLeads: suspendLeadsUntil ? false : flags.canReceiveNewLeads,
    canClaimRoletao: suspendRoletaoUntil ? false : flags.canClaimRoletao,
    suspendLeadsUntil,
    suspendRoletaoUntil,
    leadSuspensionActive: Boolean(suspendLeadsUntil),
    roletaoSuspensionActive: Boolean(suspendRoletaoUntil),
  };
}

function formatSuspensionUntil(value: string | null): string | null {
  if (!value) return null;
  const parsed = parseDate(value);
  if (!parsed) return null;
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(parsed);
  } catch (error) {
    return parsed.toLocaleString('pt-BR');
  }
}

function daysDiff(reference: Date, value?: string | null): number | null {
  const date = parseDate(value);
  if (!date) return null;
  return Math.floor((reference.getTime() - date.getTime()) / DAY_IN_MS);
}

function diffInDays(reference: Date, date: Date | null): number | null {
  if (!date) return null;
  const diff = Math.floor((reference.getTime() - date.getTime()) / DAY_IN_MS);
  return diff < 0 ? 0 : diff;
}

function normalizeBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'sim'].includes(normalised)) return true;
    if (['false', '0', 'no', 'nao', 'não'].includes(normalised)) return false;
  }
  if (typeof value === 'number') {
    if (value === 0) return false;
    if (value === 1) return true;
  }
  return null;
}

function collectDatesFromValue(value: unknown, accumulator: Set<number>, visited = new Set<unknown>()): void {
  if (!value || visited.has(value)) return;
  visited.add(value);

  if (value instanceof Date) {
    const date = parseDate(value);
    if (date) accumulator.add(date.getTime());
    return;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      accumulator.add(date.getTime());
    }
    return;
  }

  if (typeof value === 'string') {
    const date = parseDate(value);
    if (date) accumulator.add(date.getTime());
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectDatesFromValue(item, accumulator, visited);
    }
    return;
  }

  if (typeof value !== 'object') return;

  const record = value as Record<string, unknown>;

  const datePart = record.date ?? record.data ?? record.dia ?? record.day;
  const timePart = record.time ?? record.hora ?? record.hour;
  if (typeof datePart === 'string' && typeof timePart === 'string') {
    const combined = parseDate(`${datePart}T${timePart}`);
    if (combined) {
      accumulator.add(combined.getTime());
    }
  }

  for (const key of DATE_LIKE_KEYS) {
    if (key in record) {
      collectDatesFromValue(record[key], accumulator, visited);
    }
  }
}

function isAutomatedRecord(value: Record<string, unknown>): boolean {
  const explicitAutomationFlags = [
    value.automated,
    value.isAutomated,
    (value as Record<string, unknown>)['is_automated'],
    value.automation,
    value.automatizado,
    value.automatico,
    value.automatic,
  ];
  if (explicitAutomationFlags.some(flag => normalizeBoolean(flag) === true)) {
    return true;
  }

  const actorType =
    typeof value.actorType === 'string'
      ? value.actorType
      : typeof value.actor_type === 'string'
        ? (value.actor_type as string)
        : typeof value.performedByType === 'string'
          ? (value.performedByType as string)
          : typeof value.performed_by_type === 'string'
            ? (value.performed_by_type as string)
            : typeof value.origin_type === 'string'
              ? (value.origin_type as string)
              : typeof value.source_type === 'string'
                ? (value.source_type as string)
                : undefined;

  if (actorType) {
    const normalised = actorType.toLowerCase();
    if (AUTOMATION_KEYWORDS.some(keyword => normalised.includes(keyword))) {
      return true;
    }
  }

  const channel =
    typeof value.channel === 'string'
      ? value.channel
      : typeof value.canal === 'string'
        ? (value.canal as string)
        : typeof value.origin === 'string'
          ? (value.origin as string)
          : typeof value.source === 'string'
            ? (value.source as string)
            : undefined;

  if (channel) {
    const normalised = channel.toLowerCase();
    if (AUTOMATION_KEYWORDS.some(keyword => normalised.includes(keyword))) {
      return true;
    }
  }

  return false;
}

function isHumanInteraction(value: unknown): boolean {
  if (!value || typeof value !== 'object') return true;
  const record = value as Record<string, unknown>;

  const explicitHumanFlags = [record.isHuman, record.is_human, record.humano];
  for (const flag of explicitHumanFlags) {
    const normalised = normalizeBoolean(flag);
    if (normalised !== null) {
      return normalised;
    }
  }

  if (isAutomatedRecord(record)) {
    return false;
  }

  const performer =
    record.performedBy ??
    record.performed_by ??
    record.userId ??
    record.user_id ??
    record.usuario_id ??
    record.ownerId ??
    record.owner_id ??
    record.agentId ??
    record.agent_id ??
    record.actorId ??
    record.actor_id;

  if (typeof performer === 'string' && performer.trim().length > 0) {
    return true;
  }

  if (typeof performer === 'number') {
    return true;
  }

  return true;
}

function getLatestDateFromCandidates(accumulator: Set<number>): Date | null {
  if (!accumulator.size) return null;
  let latest: number | null = null;
  for (const value of accumulator) {
    if (latest === null || value > latest) {
      latest = value;
    }
  }
  return latest !== null ? new Date(latest) : null;
}

function getLeadLastHumanInteractionDate(lead: Lead): Date | null {
  const record = lead as unknown as Record<string, unknown>;
  const timestamps = new Set<number>();

  const directFields = [
    'lastHumanInteractionAt',
    'last_human_interaction_at',
    'lastHumanContactAt',
    'last_human_contact_at',
    'lastManualInteractionAt',
    'last_manual_interaction_at',
    'lastManualContactAt',
    'last_manual_contact_at',
    'lastAgentInteractionAt',
    'last_agent_interaction_at',
    'lastContactAt',
    'last_contact_at',
    'lastInteractionAt',
    'last_interaction_at',
    'lastActivityAt',
    'last_activity_at',
    'lastUpdate',
    'updatedAt',
    'updated_at',
  ];

  for (const field of directFields) {
    if (field in record) {
      collectDatesFromValue(record[field], timestamps);
    }
  }

  const nestedObjects = [record.lastHumanInteraction, record.last_human_interaction];
  for (const value of nestedObjects) {
    collectDatesFromValue(value, timestamps);
  }

  for (const key of HUMAN_INTERACTION_LIST_KEYS) {
    const collection = record[key];
    if (!Array.isArray(collection)) continue;
    for (const item of collection) {
      if (!isHumanInteraction(item)) continue;
      collectDatesFromValue(item, timestamps);
    }
  }

  return getLatestDateFromCandidates(timestamps);
}

function getPropertyLastRelevantUpdateDate(property: any): Date | null {
  const record = property as Record<string, unknown>;
  const timestamps = new Set<number>();

  const directFields = [
    'updatedAt',
    'updated_at',
    'lastUpdateAt',
    'last_update_at',
    'lastUpdate',
    'last_update',
    'ultimoContatoEm',
    'ultimo_contato_em',
    'lastContactAt',
    'last_contact_at',
    'lastPortalUpdateAt',
    'last_portal_update_at',
    'lastPortalUpdate',
    'last_portal_update',
  ];

  for (const field of directFields) {
    if (field in record) {
      collectDatesFromValue(record[field], timestamps);
    }
  }

  const nestedObjects = [record.imovel, record.metadata, record.portal, record.status];
  for (const value of nestedObjects) {
    collectDatesFromValue(value, timestamps);
  }

  for (const key of PROPERTY_UPDATE_LIST_KEYS) {
    const collection = record[key];
    if (Array.isArray(collection)) {
      for (const item of collection) {
        collectDatesFromValue(item, timestamps);
      }
      continue;
    }
    if (collection && typeof collection === 'object') {
      collectDatesFromValue(collection, timestamps);
    }
  }

  return getLatestDateFromCandidates(timestamps);
}

function leadBelongsToUser(leadOwnerId: string | undefined, userId: string): boolean {
  if (!leadOwnerId) return false;
  const variants = normaliseUserId(userId).map(id => id.toLowerCase());
  const owner = leadOwnerId.toLowerCase();
  return variants.includes(owner);
}

function propertyBelongsToUser(propertyOwnerId: string | undefined, userId: string): boolean {
  if (!propertyOwnerId) return false;
  const variants = normaliseUserId(userId).map(id => id.toLowerCase());
  const owner = propertyOwnerId.toLowerCase();
  return variants.includes(owner);
}

function isClosedLead(status?: string, stage?: string): boolean {
  if (!status && !stage) return false;
  const label = `${status ?? ''} ${stage ?? ''}`.toLowerCase();
  return label.includes('perdido') || label.includes('cancelado') || label.includes('fechado');
}

export function leadsHealth(userId: string, reference = new Date()): HealthSegment[] {
  const leads = MOCK_LEADS.filter(lead => leadBelongsToUser(lead.ownerId, userId));

  let emDia = 0;
  let atencao = 0;
  let critico = 0;

  for (const lead of leads) {
    if (isClosedLead(lead.status, lead.stage)) {
      continue;
    }

    const lastHumanInteraction = getLeadLastHumanInteractionDate(lead);
    const daysSinceLastHumanContact = diffInDays(reference, lastHumanInteraction);

    if (daysSinceLastHumanContact === null) {
      critico += 1;
      continue;
    }

    if (daysSinceLastHumanContact <= 25) {
      emDia += 1;
    } else if (daysSinceLastHumanContact <= 30) {
      atencao += 1;
    } else {
      critico += 1;
    }
  }

  return [
    {
      id: 'leads-em-dia',
      deepLinkId: 'em-dia',
      label: 'Em dia',
      value: emDia,
      color: 'hsl(var(--success))',
      description: 'Contato humano recente (0–25 dias)',
      href: '/vendas',
      range: 'em-dia',
    },
    {
      id: 'leads-atencao',
      deepLinkId: 'atencao',
      label: 'Atenção',
      value: atencao,
      color: 'hsl(var(--warning))',
      description: 'Sem interação humana entre 26 e 30 dias',
      href: '/vendas',
      range: 'atencao',
    },
    {
      id: 'leads-critico',
      deepLinkId: 'critico',
      label: 'Crítico',
      value: critico,
      color: 'hsl(var(--danger))',
      description: 'Sem contato humano há 31 dias ou mais',
      href: '/vendas',
      range: 'critico',
    },
  ];
}

export function propertiesHealth(userId: string, reference = new Date()): HealthSegment[] {
  const properties = MOCK_PROPERTIES.filter(property =>
    propertyBelongsToUser(property.captador?.id, userId),
  );

  let emDia = 0;
  let atencao = 0;
  let ajustar = 0;

  for (const property of properties) {
    const lastRelevantUpdate = getPropertyLastRelevantUpdateDate(property);
    const daysSinceLastUpdate = diffInDays(reference, lastRelevantUpdate);

    if (daysSinceLastUpdate === null) {
      ajustar += 1;
      continue;
    }

    if (daysSinceLastUpdate <= 25) {
      emDia += 1;
    } else if (daysSinceLastUpdate <= 30) {
      atencao += 1;
    } else {
      ajustar += 1;
    }
  }

  return [
    {
      id: 'properties-em-dia',
      label: 'Em dia',
      value: emDia,
      color: 'hsl(var(--success))',
      description: 'Atualizações recentes (0–25 dias)',
      href: '/imoveis',
      range: 'em-dia',
    },
    {
      id: 'properties-atencao',
      label: 'Atenção',
      value: atencao,
      color: 'hsl(var(--warning))',
      description: 'Última atualização entre 26 e 30 dias',
      href: '/imoveis',
      range: 'atencao',
    },
    {
      id: 'properties-ajustar',
      label: 'Ajustar',
      value: ajustar,
      color: 'hsl(var(--danger))',
      description: 'Atualizar imóvel há 31 dias ou mais',
      href: '/imoveis',
      range: 'ajustar',
    },
  ];
}

export function tasksHealth(userId: string, reference = new Date()): HealthSegment[] {
  const leads = MOCK_LEADS.filter(lead => leadBelongsToUser(lead.ownerId, userId));

  let concluido = 0;
  let pendente = 0;
  let atrasado = 0;

  for (const lead of leads) {
    if (isClosedLead(lead.status, lead.stage)) {
      continue;
    }

    const lastHumanInteraction = getLeadLastHumanInteractionDate(lead);
    const daysSinceInteraction = diffInDays(reference, lastHumanInteraction);

    if (daysSinceInteraction === null || daysSinceInteraction > 7) {
      atrasado += 1;
      continue;
    }

    if (daysSinceInteraction <= 2) {
      concluido += 1;
    } else {
      pendente += 1;
    }
  }

  return [
    {
      id: 'tasks-concluido',
      label: 'Concluído',
      value: concluido,
      color: 'hsl(var(--success))',
      description: 'Tarefas executadas no prazo',
      href: '/agenda?tab=tasks',
      range: 'concluido',
    },
    {
      id: 'tasks-pendente',
      label: 'Pendente',
      value: pendente,
      color: 'hsl(var(--warning))',
      description: 'Ações em andamento e dentro do SLA',
      href: '/agenda?tab=tasks',
      range: 'pendente',
    },
    {
      id: 'tasks-atrasado',
      label: 'Atrasado',
      value: atrasado,
      color: 'hsl(var(--danger))',
      description: 'Tarefas sem conclusão há mais de 7 dias',
      href: '/agenda?tab=tasks',
      range: 'atrasado',
    },
  ];
}

function roletaoMetricsForPeriod(
  userId: string,
  reference: Date,
  days: number,
): RoletaoHealthMetrics {
  const windowStart = reference.getTime() - days * DAY_IN_MS;

  const claimedLeads = MOCK_LEADS.filter(lead => {
    if (!leadBelongsToUser(lead.ownerId, userId)) return false;

    const source = lead.source?.toLowerCase();
    if (source !== 'roletao') return false;

    const createdAt = parseDate(lead.createdAt);
    if (!createdAt) return false;

    const createdTime = createdAt.getTime();
    return createdTime >= windowStart && createdTime <= reference.getTime();
  });

  let totalAdvanceMinutes = 0;
  let leadsWithAdvance = 0;
  let converted = 0;
  let activeFollowUps = 0;
  let awaitingToday = 0;

  for (const lead of claimedLeads) {
    const createdAt = parseDate(lead.createdAt);
    const firstInteraction = parseDate(lead.firstInteractionAt);
    const lastContactDays = daysDiff(reference, lead.lastContactAt);

    if (createdAt && firstInteraction) {
      const diffMinutes = Math.abs(firstInteraction.getTime() - createdAt.getTime()) / (60 * 1000);
      totalAdvanceMinutes += diffMinutes;
      leadsWithAdvance += 1;
    }

    if (lastContactDays !== null && lastContactDays <= 1) {
      activeFollowUps += 1;
    } else {
      awaitingToday += 1;
    }

    if (isClosedLead(lead.status, lead.stage)) {
      converted += 1;
    }
  }

  const totalLeads = claimedLeads.length;
  const avgAdvanceTime = leadsWithAdvance > 0 ? Math.round(totalAdvanceMinutes / leadsWithAdvance) : 0;
  const convRate = totalLeads > 0 ? Number((converted / totalLeads).toFixed(2)) : 0;
  const activeParticipation = totalLeads > 0 ? Number((activeFollowUps / totalLeads).toFixed(2)) : 0;
  const claimsPerDay = Number((totalLeads / days).toFixed(2));

  return {
    banner: {
      claimed: totalLeads,
      awaitingToday,
    },
    avgAdvanceTime,
    convRate,
    activeParticipation,
    claimsPerDay,
  };
}

export function roletaoPerformance(userId: string, reference = new Date()): RoletaoKPIs {
  return {
    defaultPeriod: '7d',
    periods: {
      '7d': roletaoMetricsForPeriod(userId, reference, 7),
      '15d': roletaoMetricsForPeriod(userId, reference, 15),
      '30d': roletaoMetricsForPeriod(userId, reference, 30),
    },
  };
}

function buildAutomationPill(
  id: string,
  message: string,
  variant: AutomationTogglePill['variant'],
  reason?: string,
): AutomationTogglePill {
  return {
    id,
    message,
    variant,
    reason,
  };
}

function automationToggles(userId: string): UserAutomationsSnapshot {
  const state = getUserState(userId);
  const user = USERS.find(candidate => candidate.id === userId);

  const autoEnforceHealthLeads = state.auto_enforce_health_leads;
  const autoEnforceRoletao = state.auto_enforce_roletao;
  const canReceiveNewLeads = state.can_receive_new_leads;
  const roletaoEnabled = state.roletao_enabled ?? (user?.roletaoEnabled ?? false);
  const canClaimRoletao = state.can_claim_roletao;

  const leadsEnforcement = state.enforcements['auto-receive-leads'];
  const roletaoEnforcement = state.enforcements['roletao-auto-claim'];
  const leadsReasonText = leadsEnforcement
    ? leadsEnforcement.reasons.join(' • ')
    : autoEnforceHealthLeads
      ? 'O sistema mantém o recebimento automático para garantir cobertura.'
      : 'Recebimento automático ativo: novos leads entram direto na carteira assim que chegam.';
  const roletaoReasonText = roletaoEnforcement
    ? roletaoEnforcement.reasons.join(' • ')
    : autoEnforceRoletao
      ? 'Participação exigida automaticamente pelas regras do roletão.'
      : 'Corretor habilitado a disputar leads no roletão automático; se desativar, o lead segue para o próximo da fila.';

  const toggles: AutomationToggle[] = [
    {
      id: 'auto-receive-leads',
      title: 'Receber leads automaticamente',
      description:
        'Ative para que novos leads entrem direto na carteira assim que chegam, conforme os critérios definidos. Desative para pausar o recebimento automático.',
      href: '/distribuicao',
      enabled: canReceiveNewLeads,
    },
    {
      id: 'roletao-auto-claim',
      title: 'Pegar leads no roletão',
      description: 'Ative para disputar leads no roletão; inativo envia o lead para o próximo da fila.',
      href: '/gestao-roletao',
      enabled: canClaimRoletao && roletaoEnabled,
    },
  ];

  const leadsPill = canReceiveNewLeads
    ? buildAutomationPill(
        'auto-receive-leads',
        'Liberado',
        'success',
        leadsReasonText,
      )
    : buildAutomationPill(
        'auto-receive-leads',
        'Bloqueado',
        autoEnforceHealthLeads ? 'warning' : 'danger',
        leadsReasonText,
      );

  let roletaoPill: AutomationTogglePill;
  if (!roletaoEnabled) {
    roletaoPill = buildAutomationPill(
      'roletao-auto-claim',
      'Indisponível',
      'warning',
      'Roletão está desativado para este corretor no momento.',
    );
  } else if (canClaimRoletao) {
    roletaoPill = buildAutomationPill(
      'roletao-auto-claim',
      'Participando',
      'success',
      roletaoReasonText,
    );
  } else {
    roletaoPill = buildAutomationPill(
      'roletao-auto-claim',
      'Bloqueado',
      autoEnforceRoletao ? 'warning' : 'danger',
      roletaoReasonText,
    );
  }

  return {
    autoEnforceHealthLeads,
    autoEnforceRoletao,
    canReceiveNewLeads,
    canClaimRoletao,
    toggles,
    pills: [leadsPill, roletaoPill],
    enforcementReasons: mapEnforcementsToSnapshot(state.enforcements),
  };
}

export type SaveAutoFlagsPayload = AutomationFlagsUpdate;

export interface SaveAutoFlagsOptions {
  actorUserId?: string;
}

export async function saveAutoFlags(
  userId: string,
  payload: SaveAutoFlagsPayload,
  options: SaveAutoFlagsOptions = {},
): Promise<UserHealthSnapshot> {
  persistAutoFlags(userId, payload);

  const snapshot = await recomputeAndPersist(userId, {
    reason: 'manual',
    actorUserId: options.actorUserId,
  });

  return snapshot;
}

function sanitizeAutomationToggle(toggle: unknown): AutomationToggle | null {
  if (!toggle || typeof toggle !== 'object') return null;
  const record = toggle as Partial<AutomationToggle> & { id?: unknown };
  if (typeof record.id !== 'string') return null;
  return {
    id: record.id,
    title: typeof record.title === 'string' ? record.title : '',
    description: typeof record.description === 'string' ? record.description : '',
    href: typeof record.href === 'string' ? record.href : '#',
    enabled: typeof record.enabled === 'boolean' ? record.enabled : false,
  };
}

function sanitizeAutomationPill(pill: unknown): AutomationTogglePill | null {
  if (!pill || typeof pill !== 'object') return null;
  const record = pill as Partial<AutomationTogglePill> & { id?: unknown };
  if (typeof record.id !== 'string') return null;
  return {
    id: record.id,
    message: typeof record.message === 'string' ? record.message : '',
    variant: record.variant ?? 'default',
    reason: typeof record.reason === 'string' ? record.reason : undefined,
  };
}

function sanitizeAutomationEnforcementReason(
  entry: unknown,
): AutomationEnforcementReason | null {
  if (!entry || typeof entry !== 'object') return null;
  const record = entry as Partial<AutomationEnforcementReason> & { id?: unknown };
  if (typeof record.id !== 'string') return null;
  return {
    id: record.id,
    enforced: typeof record.enforced === 'boolean' ? record.enforced : false,
    targetValue:
      typeof record.targetValue === 'boolean' || record.targetValue === null
        ? record.targetValue
        : null,
    reasons: Array.isArray(record.reasons)
      ? record.reasons.filter((reason): reason is string => typeof reason === 'string')
      : [],
  };
}

function normalizeAutomationsSnapshot(
  userId: string,
  automations: unknown,
): UserAutomationsSnapshot {
  const getFallback = (() => {
    let fallback: UserAutomationsSnapshot | null = null;
    return () => {
      if (!fallback) {
        fallback = automationToggles(userId);
      }
      return fallback;
    };
  })();

  if (!automations || typeof automations !== 'object' || Array.isArray(automations)) {
    return getFallback();
  }

  const snapshot = automations as Partial<UserAutomationsSnapshot>;
  const toggles = Array.isArray(snapshot.toggles)
    ? snapshot.toggles.map(sanitizeAutomationToggle).filter(Boolean) as AutomationToggle[]
    : [];
  const pills = Array.isArray(snapshot.pills)
    ? snapshot.pills.map(sanitizeAutomationPill).filter(Boolean) as AutomationTogglePill[]
    : [];
  const enforcementReasons = Array.isArray(snapshot.enforcementReasons)
    ? snapshot.enforcementReasons
        .map(sanitizeAutomationEnforcementReason)
        .filter(Boolean) as AutomationEnforcementReason[]
    : [];

  return {
    autoEnforceHealthLeads:
      typeof snapshot.autoEnforceHealthLeads === 'boolean'
        ? snapshot.autoEnforceHealthLeads
        : getFallback().autoEnforceHealthLeads,
    autoEnforceRoletao:
      typeof snapshot.autoEnforceRoletao === 'boolean'
        ? snapshot.autoEnforceRoletao
        : getFallback().autoEnforceRoletao,
    canReceiveNewLeads:
      typeof snapshot.canReceiveNewLeads === 'boolean'
        ? snapshot.canReceiveNewLeads
        : getFallback().canReceiveNewLeads,
    canClaimRoletao:
      typeof snapshot.canClaimRoletao === 'boolean'
        ? snapshot.canClaimRoletao
        : getFallback().canClaimRoletao,
    toggles: toggles.length ? toggles : getFallback().toggles,
    pills: pills.length ? pills : getFallback().pills,
    enforcementReasons:
      enforcementReasons.length ? enforcementReasons : getFallback().enforcementReasons,
  };
}

export function getPersistedSnapshot(userId: string): UserHealthSnapshot | null {
  const state = getUserState(userId);
  if (!state.health_snapshot) {
    return null;
  }

  const checkpoint: UserCheckpointSettings = {
    nextCheckpointAt: state.next_checkpoint_at ?? null,
    suspendLeadsUntil: state.suspend_leads_until ?? null,
    suspendRoletaoUntil: state.suspend_roletao_until ?? null,
    reason: state.checkpoint_reason ?? null,
  };

  const normalized: UserHealthSnapshot = {
    ...state.health_snapshot,
    tarefas: Array.isArray(state.health_snapshot.tarefas)
      ? state.health_snapshot.tarefas
      : tasksHealth(userId),
    automations: normalizeAutomationsSnapshot(userId, state.health_snapshot.automations),
    nextCheckpointAt: checkpoint.nextCheckpointAt,
    suspendLeadsUntil: checkpoint.suspendLeadsUntil,
    suspendRoletaoUntil: checkpoint.suspendRoletaoUntil,
    checkpointReason: checkpoint.reason,
    checkpoint,
  };

  updateUserState(userId, { health_snapshot: normalized });

  return normalized;
}

const MIN_ROLETAO_SAMPLE = 5;

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function computeRoletaoBenchmark(reference = new Date()): {
  averageConvRate: number;
  totalLeads: number;
  converted: number;
} {
  const windowStart = reference.getTime() - 7 * DAY_IN_MS;
  let totalLeads = 0;
  let converted = 0;

  for (const lead of MOCK_LEADS) {
    const source = lead.source?.toLowerCase();
    if (source !== 'roletao') continue;

    const createdAt = parseDate(lead.createdAt);
    if (!createdAt) continue;

    const createdTime = createdAt.getTime();
    if (createdTime < windowStart || createdTime > reference.getTime()) continue;

    totalLeads += 1;
    if (isClosedLead(lead.status, lead.stage)) {
      converted += 1;
    }
  }

  const averageConvRate = totalLeads > 0 ? Number((converted / totalLeads).toFixed(2)) : 0;
  return { averageConvRate, totalLeads, converted };
}

export async function recomputeAndPersist(
  userId: string,
  options: RecomputeOptions = {},
): Promise<UserHealthSnapshot> {
  const timestamp = new Date();
  const leads = leadsHealth(userId, timestamp);
  const imoveis = propertiesHealth(userId, timestamp);
  const tarefas = tasksHealth(userId, timestamp);
  const roletao = roletaoPerformance(userId, timestamp);
  const stateBefore = getUserState(userId);
  const timestampIso = timestamp.toISOString();
  const enforcements: Record<string, AutomationEnforcementState> = {};
  const changes: Array<{
    field: 'can_receive_new_leads' | 'can_claim_roletao';
    from: boolean;
    to: boolean;
    reasons: string[];
  }> = [];

  const criticalLeads = leads.find(segment => segment.id === 'leads-critico')?.value ?? 0;
  const criticalProperties = imoveis.find(segment => segment.id === 'properties-ajustar')?.value ?? 0;
  const criticalTasks = tarefas.find(segment => segment.id === 'tasks-atrasado')?.value ?? 0;

  let canReceiveNewLeads = stateBefore.can_receive_new_leads;
  let leadsReasons: string[] = [];
  if (stateBefore.auto_enforce_health_leads) {
    const hasCritical = criticalLeads > 0 || criticalProperties > 0 || criticalTasks > 0;
    const reasons: string[] = [];
    if (criticalLeads > 0) {
      reasons.push(
        `${criticalLeads} lead(s) críticos sem contato humano há 31 dias ou mais.`,
      );
    }
    if (criticalProperties > 0) {
      reasons.push(
        `${criticalProperties} imóvel(is) sem atualização relevante há 31 dias ou mais.`,
      );
    }
    if (criticalTasks > 0) {
      reasons.push(
        `${criticalTasks} tarefa(s) atrasada(s) há mais de 7 dias.`,
      );
    }
    if (!hasCritical) {
      reasons.push('Sem alertas críticos encontrados; recebimento liberado automaticamente.');
    }

    canReceiveNewLeads = !hasCritical;
    enforcements['auto-receive-leads'] = {
      enforced: true,
      targetValue: canReceiveNewLeads,
      reasons,
    };
    leadsReasons = [...reasons];
  }

  const benchmark = computeRoletaoBenchmark(timestamp);
  const roletao7d = roletao.periods['7d'];
  let canClaimRoletao = stateBefore.can_claim_roletao;
  let roletaoReasons: string[] = [];
  if (stateBefore.auto_enforce_roletao) {
    const sample = roletao7d.banner.claimed;
    if (sample >= MIN_ROLETAO_SAMPLE && benchmark.totalLeads >= MIN_ROLETAO_SAMPLE) {
      const meetsAverage = roletao7d.convRate >= benchmark.averageConvRate;
      const comparison = meetsAverage ? 'acima ou igual à' : 'abaixo da';
      const reasons = [
        `Taxa de conversão ${formatPercent(roletao7d.convRate)} ${comparison} média ${formatPercent(benchmark.averageConvRate)} no período.`,
        `Amostra do corretor: ${sample} lead(s) do roletão; benchmark global: ${benchmark.totalLeads} lead(s).`,
      ];
      canClaimRoletao = meetsAverage;
      enforcements['roletao-auto-claim'] = {
        enforced: true,
        targetValue: canClaimRoletao,
        reasons,
      };
      roletaoReasons = [...reasons];
    } else {
      enforcements['roletao-auto-claim'] = {
        enforced: false,
        targetValue: null,
        reasons: [
          `Amostra insuficiente (${sample} lead(s) pessoais, ${benchmark.totalLeads} no benchmark) para ajuste automático.`,
        ],
      };
      roletaoReasons = [...enforcements['roletao-auto-claim'].reasons];
    }
  }
  const overlay = applySuspensionOverlay(
    stateBefore,
    { canReceiveNewLeads, canClaimRoletao },
    timestamp,
  );

  if (overlay.leadSuspensionActive) {
    const description = formatSuspensionUntil(overlay.suspendLeadsUntil);
    const message = description
      ? `Recebimento de novos leads suspenso até ${description}.`
      : 'Recebimento de novos leads temporariamente suspenso.';
    if (enforcements['auto-receive-leads']) {
      enforcements['auto-receive-leads'] = {
        ...enforcements['auto-receive-leads'],
        targetValue: false,
        reasons: [...enforcements['auto-receive-leads'].reasons, message],
      };
    } else {
      enforcements['auto-receive-leads'] = {
        enforced: true,
        targetValue: false,
        reasons: [message],
      };
    }
    leadsReasons = [...leadsReasons, message];
  }

  if (overlay.roletaoSuspensionActive) {
    const description = formatSuspensionUntil(overlay.suspendRoletaoUntil);
    const message = description
      ? `Participação no roletão suspensa até ${description}.`
      : 'Participação no roletão temporariamente suspensa.';
    if (enforcements['roletao-auto-claim']) {
      enforcements['roletao-auto-claim'] = {
        ...enforcements['roletao-auto-claim'],
        targetValue: false,
        reasons: [...enforcements['roletao-auto-claim'].reasons, message],
      };
    } else {
      enforcements['roletao-auto-claim'] = {
        enforced: true,
        targetValue: false,
        reasons: [message],
      };
    }
    roletaoReasons = [...roletaoReasons, message];
  }

  canReceiveNewLeads = overlay.canReceiveNewLeads;
  canClaimRoletao = overlay.canClaimRoletao;

  if (canReceiveNewLeads !== stateBefore.can_receive_new_leads) {
    changes.push({
      field: 'can_receive_new_leads',
      from: stateBefore.can_receive_new_leads,
      to: canReceiveNewLeads,
      reasons: leadsReasons,
    });
  }

  if (canClaimRoletao !== stateBefore.can_claim_roletao) {
    changes.push({
      field: 'can_claim_roletao',
      from: stateBefore.can_claim_roletao,
      to: canClaimRoletao,
      reasons: roletaoReasons,
    });
  }

  const checkpoint: UserCheckpointSettings = {
    nextCheckpointAt: sanitizeIsoDate(stateBefore.next_checkpoint_at),
    suspendLeadsUntil: overlay.suspendLeadsUntil,
    suspendRoletaoUntil: overlay.suspendRoletaoUntil,
    reason: stateBefore.checkpoint_reason ?? null,
  };

  updateUserState(userId, {
    can_receive_new_leads: canReceiveNewLeads,
    can_claim_roletao: canClaimRoletao,
    enforcements,
    health_snapshot_updated_at: timestampIso,
    next_checkpoint_at: checkpoint.nextCheckpointAt,
    suspend_leads_until: checkpoint.suspendLeadsUntil,
    suspend_roletao_until: checkpoint.suspendRoletaoUntil,
    checkpoint_reason: checkpoint.reason,
  });

  const automations = automationToggles(userId);

  const snapshot: UserHealthSnapshot = {
    updatedAt: timestampIso,
    leads,
    imoveis,
    tarefas,
    roletao,
    automations,
    nextCheckpointAt: checkpoint.nextCheckpointAt,
    suspendLeadsUntil: checkpoint.suspendLeadsUntil,
    suspendRoletaoUntil: checkpoint.suspendRoletaoUntil,
    checkpointReason: checkpoint.reason,
    checkpoint,
  };

  updateUserState(userId, {
    health_snapshot: snapshot,
  });

  appendAuditLog(userId, {
    id: createAuditEventId(userId),
    ts: snapshot.updatedAt,
    type: 'health_snapshot_recomputed',
    label: options.reason === 'cron' ? 'Snapshot diário recalculado' : 'Snapshot atualizado manualmente',
    actorUserId: options.actorUserId ?? 'system',
    meta: {
      reason: options.reason ?? 'manual',
      changes,
      enforcement: mapEnforcementsToSnapshot(enforcements),
      benchmarks: {
        roletao: {
          userConvRate: roletao7d.convRate,
          benchmarkConvRate: benchmark.averageConvRate,
          userSample: roletao7d.banner.claimed,
          benchmarkSample: benchmark.totalLeads,
        },
        criticalLeads,
        criticalProperties,
        criticalTasks,
      },
    },
  });

  return new Promise(resolve => setTimeout(() => resolve(snapshot), 200));
}

interface CheckPointOptions {
  actorUserId?: string;
}

export function getUserCheckpoint(userId: string): UserCheckpointSettings {
  const state = getUserState(userId);
  const overlay = applySuspensionOverlay(
    state,
    {
      canReceiveNewLeads: state.can_receive_new_leads,
      canClaimRoletao: state.can_claim_roletao,
    },
  );

  const checkpoint: UserCheckpointSettings = {
    nextCheckpointAt: sanitizeIsoDate(state.next_checkpoint_at),
    suspendLeadsUntil: overlay.suspendLeadsUntil,
    suspendRoletaoUntil: overlay.suspendRoletaoUntil,
    reason: state.checkpoint_reason ?? null,
  };

  updateUserState(userId, {
    can_receive_new_leads: overlay.canReceiveNewLeads,
    can_claim_roletao: overlay.canClaimRoletao,
    next_checkpoint_at: checkpoint.nextCheckpointAt,
    suspend_leads_until: checkpoint.suspendLeadsUntil,
    suspend_roletao_until: checkpoint.suspendRoletaoUntil,
    checkpoint_reason: checkpoint.reason,
  });

  return checkpoint;
}

export function saveCheckpointSchedule(
  userId: string,
  payload: Pick<CheckPointUpdateInput, 'nextCheckpointAt' | 'reason'>,
  options: CheckPointOptions = {},
): UserCheckpointSettings {
  const state = getUserState(userId);
  const previous = {
    nextCheckpointAt: sanitizeIsoDate(state.next_checkpoint_at),
    reason: state.checkpoint_reason ?? null,
  };

  const nextCheckpointAt = sanitizeIsoDate(payload.nextCheckpointAt);
  const reason = payload.reason?.trim() ? payload.reason.trim() : null;

  updateUserState(userId, {
    next_checkpoint_at: nextCheckpointAt,
    checkpoint_reason: reason,
  });

  appendAuditLog(userId, {
    id: createAuditEventId(userId),
    ts: new Date().toISOString(),
    type: 'checkpoint_update',
    label: 'Agendamento de checkpoint atualizado',
    actorUserId: options.actorUserId ?? 'system',
    meta: {
      action: 'schedule_update',
      previous,
      next: { nextCheckpointAt, reason },
    },
  });

  return getUserCheckpoint(userId);
}

export async function saveSuspension(
  userId: string,
  payload: Pick<CheckPointUpdateInput, 'suspendLeadsUntil' | 'suspendRoletaoUntil'>,
  options: CheckPointOptions = {},
): Promise<UserHealthSnapshot> {
  const timestamp = new Date();
  const stateBefore = getUserState(userId);
  const previousLeads = sanitizeFutureIsoDate(stateBefore.suspend_leads_until, timestamp);
  const previousRoletao = sanitizeFutureIsoDate(stateBefore.suspend_roletao_until, timestamp);

  const nextLeads = sanitizeFutureIsoDate(payload.suspendLeadsUntil, timestamp);
  const nextRoletao = sanitizeFutureIsoDate(payload.suspendRoletaoUntil, timestamp);

  const interim = updateUserState(userId, {
    suspend_leads_until: nextLeads,
    suspend_roletao_until: nextRoletao,
  });

  const overlay = applySuspensionOverlay(
    interim,
    {
      canReceiveNewLeads: interim.can_receive_new_leads,
      canClaimRoletao: interim.can_claim_roletao,
    },
    timestamp,
  );

  updateUserState(userId, {
    can_receive_new_leads: overlay.canReceiveNewLeads,
    can_claim_roletao: overlay.canClaimRoletao,
    suspend_leads_until: overlay.suspendLeadsUntil,
    suspend_roletao_until: overlay.suspendRoletaoUntil,
  });

  const actorUserId = options.actorUserId ?? 'system';
  const timestampIso = timestamp.toISOString();

  const leadsChanged = previousLeads !== overlay.suspendLeadsUntil;
  if (leadsChanged) {
    const type: AuditEventType = overlay.leadSuspensionActive
      ? 'temporary_suspension_set'
      : 'temporary_suspension_cleared';
    appendAuditLog(userId, {
      id: createAuditEventId(userId),
      ts: timestampIso,
      type,
      label: overlay.leadSuspensionActive
        ? 'Suspensão temporária de leads definida'
        : 'Suspensão temporária de leads encerrada',
      actorUserId,
      meta: {
        scope: 'leads',
        previousUntil: previousLeads,
        nextUntil: overlay.suspendLeadsUntil,
      },
    });
  }

  const roletaoChanged = previousRoletao !== overlay.suspendRoletaoUntil;
  if (roletaoChanged) {
    const type: AuditEventType = overlay.roletaoSuspensionActive
      ? 'temporary_suspension_set'
      : 'temporary_suspension_cleared';
    appendAuditLog(userId, {
      id: createAuditEventId(userId),
      ts: timestampIso,
      type,
      label: overlay.roletaoSuspensionActive
        ? 'Suspensão temporária do roletão definida'
        : 'Suspensão temporária do roletão encerrada',
      actorUserId,
      meta: {
        scope: 'roletao',
        previousUntil: previousRoletao,
        nextUntil: overlay.suspendRoletaoUntil,
      },
    });
  }

  const snapshot = await recomputeAndPersist(userId, {
    reason: 'manual',
    actorUserId: options.actorUserId,
  });

  return snapshot;
}

export async function runCheckpointNow(
  userId: string,
  options: CheckPointOptions = {},
): Promise<UserHealthSnapshot> {
  const state = getUserState(userId);
  const nextCheckpointAt = sanitizeIsoDate(state.next_checkpoint_at);

  updateUserState(userId, {
    next_checkpoint_at: nextCheckpointAt,
  });

  appendAuditLog(userId, {
    id: createAuditEventId(userId),
    ts: new Date().toISOString(),
    type: 'checkpoint_update',
    label: 'Checkpoint executado manualmente',
    actorUserId: options.actorUserId ?? 'system',
    meta: {
      action: 'run_now',
      nextCheckpointAt,
    },
  });

  const snapshot = await recomputeAndPersist(userId, {
    reason: 'manual',
    actorUserId: options.actorUserId,
  });

  return snapshot;
}

let cronInitialized = false;

function getKnownUserIds(): string[] {
  return USERS.map(user => user.id);
}

export function scheduleDailyRecomputation(): void {
  if (cronInitialized) return;
  cronInitialized = true;

  const run = () => {
    for (const userId of getKnownUserIds()) {
      void recomputeAndPersist(userId, { reason: 'cron' });
    }
  };

  run();

  const interval = typeof window !== 'undefined' ? window.setInterval : setInterval;
  interval(run, DAY_IN_MS);
}
