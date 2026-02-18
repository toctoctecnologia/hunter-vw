import type {
  AutomationEnforcementReason,
  RoletaoHealthMetrics,
  RoletaoKPIs,
  UserHealthSnapshot,
} from '@/features/users/types';
import { USERS, type User } from '@/mocks/users';

export interface AutomationEnforcementState {
  enforced: boolean;
  targetValue: boolean | null;
  reasons: string[];
}

export interface UserStateRecord {
  id: string;
  can_receive_new_leads: boolean;
  can_claim_roletao: boolean;
  roletao_enabled: boolean;
  auto_enforce_health_leads: boolean;
  auto_enforce_roletao: boolean;
  health_snapshot: UserHealthSnapshot | null;
  health_snapshot_updated_at: string | null;
  enforcements: Record<string, AutomationEnforcementState>;
  next_checkpoint_at: string | null;
  suspend_leads_until: string | null;
  suspend_roletao_until: string | null;
  checkpoint_reason: string | null;
}

export interface AutomationFlagsUpdate {
  canReceiveNewLeads?: boolean;
  canClaimRoletao?: boolean;
  autoEnforceHealthLeads?: boolean;
  autoEnforceRoletao?: boolean;
}

function cloneAutomationEnforcement(
  value: AutomationEnforcementState,
): AutomationEnforcementState {
  return {
    enforced: value.enforced,
    targetValue: value.targetValue,
    reasons: [...value.reasons],
  };
}

function cloneRoletaoMetrics(metrics: RoletaoHealthMetrics): RoletaoHealthMetrics {
  return {
    banner: { ...metrics.banner },
    avgAdvanceTime: metrics.avgAdvanceTime,
    convRate: metrics.convRate,
    activeParticipation: metrics.activeParticipation,
    claimsPerDay: metrics.claimsPerDay,
  };
}

function cloneRoletao(snapshot: RoletaoKPIs): RoletaoKPIs {
  const periods: RoletaoKPIs['periods'] = {
    '7d': cloneRoletaoMetrics(snapshot.periods['7d']),
    '15d': cloneRoletaoMetrics(snapshot.periods['15d']),
    '30d': cloneRoletaoMetrics(snapshot.periods['30d']),
  };

  const custom = snapshot.custom
    ? {
        range: snapshot.custom.range
          ? { start: snapshot.custom.range.start, end: snapshot.custom.range.end }
          : null,
        metrics: snapshot.custom.metrics ? cloneRoletaoMetrics(snapshot.custom.metrics) : null,
      }
    : undefined;

  return {
    defaultPeriod: snapshot.defaultPeriod,
    periods,
    custom,
  };
}

function cloneSnapshot(snapshot: UserHealthSnapshot | null): UserHealthSnapshot | null {
  if (!snapshot) return null;
  return {
    updatedAt: snapshot.updatedAt,
    nextCheckpointAt: snapshot.nextCheckpointAt,
    suspendLeadsUntil: snapshot.suspendLeadsUntil,
    suspendRoletaoUntil: snapshot.suspendRoletaoUntil,
    checkpointReason: snapshot.checkpointReason,
    checkpoint: {
      nextCheckpointAt: snapshot.checkpoint.nextCheckpointAt,
      suspendLeadsUntil: snapshot.checkpoint.suspendLeadsUntil,
      suspendRoletaoUntil: snapshot.checkpoint.suspendRoletaoUntil,
      reason: snapshot.checkpoint.reason,
    },
    leads: snapshot.leads.map(segment => ({ ...segment })),
    imoveis: snapshot.imoveis.map(segment => ({ ...segment })),
    roletao: cloneRoletao(snapshot.roletao),
    automations: {
      autoEnforceHealthLeads: snapshot.automations.autoEnforceHealthLeads,
      autoEnforceRoletao: snapshot.automations.autoEnforceRoletao,
      canReceiveNewLeads: snapshot.automations.canReceiveNewLeads,
      canClaimRoletao: snapshot.automations.canClaimRoletao,
      toggles: snapshot.automations.toggles.map(toggle => ({ ...toggle })),
      pills: snapshot.automations.pills.map(pill => ({ ...pill })),
      enforcementReasons: snapshot.automations.enforcementReasons.map(reason => ({
        id: reason.id,
        enforced: reason.enforced,
        targetValue: reason.targetValue,
        reasons: [...reason.reasons],
      })),
    },
  };
}

function cloneEnforcements(
  enforcements: Record<string, AutomationEnforcementState>,
): Record<string, AutomationEnforcementState> {
  const cloned: Record<string, AutomationEnforcementState> = {};
  for (const [key, value] of Object.entries(enforcements)) {
    cloned[key] = cloneAutomationEnforcement(value);
  }
  return cloned;
}

function cloneState(state: UserStateRecord): UserStateRecord {
  return {
    ...state,
    enforcements: cloneEnforcements(state.enforcements),
    health_snapshot: cloneSnapshot(state.health_snapshot),
    next_checkpoint_at: state.next_checkpoint_at,
    suspend_leads_until: state.suspend_leads_until,
    suspend_roletao_until: state.suspend_roletao_until,
    checkpoint_reason: state.checkpoint_reason,
  };
}

const userStateStore = new Map<string, UserStateRecord>();

function findBaseUser(id: string): User | undefined {
  return USERS.find(candidate => candidate.id === id);
}

function ensureState(id: string): UserStateRecord {
  const existing = userStateStore.get(id);
  if (existing) {
    return existing;
  }

  const base = findBaseUser(id);
  const state: UserStateRecord = {
    id,
    can_receive_new_leads: base?.canReceiveNewLeads ?? base?.active ?? false,
    can_claim_roletao: base?.canClaimRoletao ?? Boolean(base?.roletaoEnabled),
    roletao_enabled: Boolean(base?.roletaoEnabled),
    auto_enforce_health_leads: base?.autoEnforceHealthLeads ?? true,
    auto_enforce_roletao: base?.autoEnforceRoletao ?? true,
    health_snapshot: base?.healthSnapshot ?? null,
    health_snapshot_updated_at: null,
    enforcements: {},
    next_checkpoint_at: base?.nextCheckpointAt ?? null,
    suspend_leads_until: base?.suspendLeadsUntil ?? null,
    suspend_roletao_until: base?.suspendRoletaoUntil ?? null,
    checkpoint_reason: base?.checkpointReason ?? null,
  };

  userStateStore.set(id, state);
  return state;
}

function syncBaseUser(state: UserStateRecord): void {
  const base = findBaseUser(state.id);
  if (!base) return;

  base.canReceiveNewLeads = state.can_receive_new_leads;
  base.canClaimRoletao = state.can_claim_roletao;
  base.autoEnforceHealthLeads = state.auto_enforce_health_leads;
  base.autoEnforceRoletao = state.auto_enforce_roletao;
  base.nextCheckpointAt = state.next_checkpoint_at ?? null;
  base.suspendLeadsUntil = state.suspend_leads_until ?? null;
  base.suspendRoletaoUntil = state.suspend_roletao_until ?? null;
  base.checkpointReason = state.checkpoint_reason ?? null;
}

export function getUserState(userId: string): UserStateRecord {
  const state = ensureState(userId);
  return cloneState(state);
}

export function updateUserState(
  userId: string,
  updates: Partial<UserStateRecord>,
): UserStateRecord {
  const state = ensureState(userId);

  if (updates.can_receive_new_leads !== undefined) {
    state.can_receive_new_leads = updates.can_receive_new_leads;
  }
  if (updates.can_claim_roletao !== undefined) {
    state.can_claim_roletao = updates.can_claim_roletao;
  }
  if (updates.auto_enforce_health_leads !== undefined) {
    state.auto_enforce_health_leads = updates.auto_enforce_health_leads;
  }
  if (updates.auto_enforce_roletao !== undefined) {
    state.auto_enforce_roletao = updates.auto_enforce_roletao;
  }
  if (updates.roletao_enabled !== undefined) {
    state.roletao_enabled = updates.roletao_enabled;
  }
  if (updates.health_snapshot !== undefined) {
    state.health_snapshot = cloneSnapshot(updates.health_snapshot);
  }
  if (updates.health_snapshot_updated_at !== undefined) {
    state.health_snapshot_updated_at = updates.health_snapshot_updated_at;
  }
  if (updates.next_checkpoint_at !== undefined) {
    state.next_checkpoint_at = updates.next_checkpoint_at;
  }
  if (updates.suspend_leads_until !== undefined) {
    state.suspend_leads_until = updates.suspend_leads_until;
  }
  if (updates.suspend_roletao_until !== undefined) {
    state.suspend_roletao_until = updates.suspend_roletao_until;
  }
  if (updates.checkpoint_reason !== undefined) {
    state.checkpoint_reason = updates.checkpoint_reason;
  }
  if (updates.enforcements !== undefined) {
    state.enforcements = cloneEnforcements(updates.enforcements);
  }

  syncBaseUser(state);
  return cloneState(state);
}

export function saveAutoFlags(userId: string, updates: AutomationFlagsUpdate): UserStateRecord {
  const normalized: Partial<UserStateRecord> = {};

  if (updates.canReceiveNewLeads !== undefined) {
    normalized.can_receive_new_leads = updates.canReceiveNewLeads;
  }
  if (updates.canClaimRoletao !== undefined) {
    normalized.can_claim_roletao = updates.canClaimRoletao;
  }
  if (updates.autoEnforceHealthLeads !== undefined) {
    normalized.auto_enforce_health_leads = updates.autoEnforceHealthLeads;
  }
  if (updates.autoEnforceRoletao !== undefined) {
    normalized.auto_enforce_roletao = updates.autoEnforceRoletao;
  }

  if (Object.keys(normalized).length === 0) {
    return getUserState(userId);
  }

  return updateUserState(userId, normalized);
}

export function listUserStates(): UserStateRecord[] {
  return Array.from(userStateStore.values()).map(cloneState);
}

export function seedUserState(userId: string, snapshot: UserHealthSnapshot): void {
  updateUserState(userId, {
    health_snapshot: snapshot,
    health_snapshot_updated_at: snapshot.updatedAt,
    next_checkpoint_at: snapshot.nextCheckpointAt,
    suspend_leads_until: snapshot.suspendLeadsUntil ?? snapshot.checkpoint.suspendLeadsUntil,
    suspend_roletao_until:
      snapshot.suspendRoletaoUntil ?? snapshot.checkpoint.suspendRoletaoUntil,
    checkpoint_reason: snapshot.checkpointReason ?? snapshot.checkpoint.reason,
  });
}

export function mapEnforcementsToSnapshot(
  enforcements: Record<string, AutomationEnforcementState>,
): AutomationEnforcementReason[] {
  const result: AutomationEnforcementReason[] = [];
  for (const [id, value] of Object.entries(enforcements)) {
    result.push({
      id,
      enforced: value.enforced,
      targetValue: value.targetValue,
      reasons: [...value.reasons],
    });
  }
  return result;
}
