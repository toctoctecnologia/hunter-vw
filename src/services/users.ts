import type {
  AuditEventType,
  CheckPointUpdateInput,
  DeactivationPayload,
  DeactivationStatus,
  DeactivationStrategy,
  ReactivateUserPayload,
  RedistributionFilters,
  RedistributionPreview,
  UserCheckpointSettings,
  UserHealthSnapshot,
} from '@/features/users/types';
import {
  appendAuditLog,
  createAuditEventId,
  getAuditLog,
} from '@/mocks/auditLog';
import {
  getPersistedSnapshot,
  getUserCheckpoint as fetchUserCheckpoint,
  recomputeAndPersist,
  runCheckpointNow as runCheckpoint,
  saveCheckpointSchedule,
  saveSuspension,
} from '@/services/healthService';
import { updateUserState } from '@/mocks/userState';
import {
  cancelUserDeactivation as cancelDeactivationMock,
  deactivateUserNow as deactivateUserNowMock,
  getRedistributionPreview as getRedistributionPreviewMock,
  getUserDeactivationStatus as fetchDeactivationStatus,
  reactivateUser as reactivateUserMock,
  scheduleUserDeactivation as scheduleDeactivationMock,
} from '@/mocks/userDeactivation';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  appVersion?: string;
  active: boolean;
  roletaoEnabled?: boolean;
  canReceiveNewLeads?: boolean;
  canClaimRoletao?: boolean;
  autoEnforceHealthLeads?: boolean;
  autoEnforceRoletao?: boolean;
  healthSnapshot?: UserHealthSnapshot | null;
  filial?: 'Filial 01' | 'Filial 02' | 'Filial 03';
  nextCheckpointAt?: string | null;
  suspendLeadsUntil?: string | null;
  suspendRoletaoUntil?: string | null;
  checkpointReason?: string | null;
  [key: string]: any;
}

interface ListParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

const ACTION_EVENT_MAP: Record<string, { type: AuditEventType; label: string }> = {
  toggleUserStatus: {
    type: 'user_status_change',
    label: 'Status do usuário alterado',
  },
  bulkToggleUserStatus: {
    type: 'user_status_change',
    label: 'Status do usuário alterado em massa',
  },
  bulkLinkUsers: {
    type: 'custom',
    label: 'Usuários vinculados a empresa',
  },
  bulkExportUsers: {
    type: 'export_csv',
    label: 'Exportação de usuários',
  },
  bulkUpdateRole: {
    type: 'custom',
    label: 'Papéis atualizados em massa',
  },
  bulkResetPassword: {
    type: 'custom',
    label: 'Reinicialização de senha em massa',
  },
  toggleUserRoletao: {
    type: 'roletao_toggle',
    label: 'Disponibilidade no roletão atualizada',
  },
  recomputeHealthSnapshot: {
    type: 'health_snapshot_recomputed',
    label: 'Snapshot de saúde recalculado',
  },
  deactivateUserNow: {
    type: 'custom',
    label: 'Corretor desativado imediatamente',
  },
  scheduleUserDeactivation: {
    type: 'custom',
    label: 'Desativação de corretor agendada',
  },
  cancelUserDeactivation: {
    type: 'custom',
    label: 'Desativação de corretor cancelada',
  },
  reactivateUser: {
    type: 'custom',
    label: 'Corretor reativado',
  },
};

type CheckpointServiceOptions = { actorUserId?: string };

interface DeactivationActionOptions {
  actorUserId?: string;
}

export interface UserCheckpointSummary extends UserCheckpointSettings {
  checkpointRule: string | null;
}

function toCheckpointSummary(settings: UserCheckpointSettings): UserCheckpointSummary {
  return {
    ...settings,
    checkpointRule: settings.reason ?? null,
  };
}

async function logAudit(action: string, payload: any) {
  console.log('Audit log:', { action, ...payload, timestamp: new Date().toISOString() });

  const config = ACTION_EVENT_MAP[action] ?? {
    type: 'custom' as AuditEventType,
    label: action,
  };

  const userIds: string[] = Array.isArray(payload?.userIds)
    ? payload.userIds.map((id: string | number) => String(id))
    : payload?.userId
      ? [String(payload.userId)]
      : [];

  if (userIds.length === 0) {
    return;
  }

  for (const userId of userIds) {
    appendAuditLog(userId, {
      id: createAuditEventId(userId),
      ts: new Date().toISOString(),
      type: config.type,
      label: config.label,
      actorUserId: payload?.actorUserId ?? 'system',
      meta: {
        action,
        payload,
      },
    });
  }
}

export async function getUsers(params: ListParams = {}): Promise<{ items: User[]; total: number } | User[]> {
  // Use mock data directly since we don't have API endpoints
  const { searchUsers, USERS } = await import('@/mocks/users');
  const query = params.query || params.q || '';
  const page = params.page || 1;
  const limit = params.limit || 25;
  
  let filtered = query ? searchUsers(query) : USERS;

  // Apply filters
  if (params.role && params.role !== 'todos' && params.role !== '') {
    filtered = filtered.filter(u => u.role === params.role);
  }

  if (params.status === 'active') {
    filtered = filtered.filter(u => u.active !== false);
  } else if (params.status === 'inactive') {
    filtered = filtered.filter(u => u.active === false);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  
  return new Promise(resolve => 
    setTimeout(() => resolve({ items, total }), 300)
  );
}

export async function getUserDetail(id: string): Promise<User> {
  // Use mock data directly
  const { USERS } = await import('@/mocks/users');
  const user = USERS.find(u => u.id === id);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const checkpoint = fetchUserCheckpoint(id);
  const healthSnapshot = getPersistedSnapshot(id);

  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          ...user,
          canReceiveNewLeads: user.canReceiveNewLeads ?? user.active,
          canClaimRoletao: user.canClaimRoletao ?? Boolean(user.roletaoEnabled),
          autoEnforceHealthLeads: user.autoEnforceHealthLeads ?? true,
          autoEnforceRoletao: user.autoEnforceRoletao ?? true,
          nextCheckpointAt: checkpoint.nextCheckpointAt ?? user.nextCheckpointAt ?? null,
          suspendLeadsUntil: checkpoint.suspendLeadsUntil ?? user.suspendLeadsUntil ?? null,
          suspendRoletaoUntil:
            checkpoint.suspendRoletaoUntil ?? user.suspendRoletaoUntil ?? null,
          checkpointReason: checkpoint.reason ?? user.checkpointReason ?? null,
          healthSnapshot,
        }),
      300,
    )
  );
}

export async function toggleUserStatus(id: string, active: boolean): Promise<any> {
  // Mock implementation
  await logAudit('toggleUserStatus', { userId: id, active });
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function updateUserRoletaoParticipation(
  id: string,
  canClaimRoletao: boolean,
): Promise<any> {
  await logAudit('toggleUserRoletao', { userId: id, enabled: canClaimRoletao });
  updateUserState(id, { can_claim_roletao: canClaimRoletao });

  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function getUserMetrics(id: string, params: Record<string, any> = {}): Promise<any> {
  // Mock data for now - replace with real API call later
  const { mockUserMetrics } = await import('@/features/users/mocks/userDetail.mock');
  return new Promise(resolve => setTimeout(() => resolve(mockUserMetrics), 500));
}

export async function getUserServices(id: string, params: Record<string, any> = {}): Promise<any[]> {
  // Mock implementation
  return new Promise(resolve => 
    setTimeout(() => resolve([]), 300)
  );
}

export async function getUserEvaluations(id: string, params: Record<string, any> = {}): Promise<any[]> {
  // Mock implementation
  return new Promise(resolve => 
    setTimeout(() => resolve([]), 300)
  );
}

export async function getUserAudit(id: string, params: Record<string, any> = {}): Promise<any[]> {
  // Mock data for now - replace with real API call later
  const data = getAuditLog(id);
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
}

interface HealthSnapshotParams {
  reason?: 'manual' | 'cron';
  actorUserId?: string;
  force?: boolean;
}

export async function getUserHealthSnapshot(
  id: string,
  params: HealthSnapshotParams = {},
): Promise<UserHealthSnapshot> {
  const reason = params.reason ?? 'manual';
  if (!params.force) {
    const cached = getPersistedSnapshot(id);
    if (cached && reason !== 'manual') {
      return new Promise(resolve => setTimeout(() => resolve(cached), 200));
    }
  }

  const snapshot = await recomputeAndPersist(id, {
    reason,
    actorUserId: params.actorUserId,
  });

  return snapshot;
}

export function getUserCheckpoint(id: string): UserCheckpointSummary {
  const settings = fetchUserCheckpoint(id);
  return toCheckpointSummary(settings);
}

export async function saveUserCheckpoint(
  id: string,
  payload: CheckPointUpdateInput,
  options: CheckpointServiceOptions = {},
): Promise<UserCheckpointSummary> {
  const schedule = saveCheckpointSchedule(id, payload, options);
  const snapshot = await saveSuspension(id, payload, options);

  const settings: UserCheckpointSettings = {
    nextCheckpointAt:
      snapshot.checkpoint?.nextCheckpointAt ??
      snapshot.nextCheckpointAt ??
      schedule.nextCheckpointAt ??
      null,
    suspendLeadsUntil:
      snapshot.checkpoint?.suspendLeadsUntil ??
      snapshot.suspendLeadsUntil ??
      schedule.suspendLeadsUntil ??
      null,
    suspendRoletaoUntil:
      snapshot.checkpoint?.suspendRoletaoUntil ??
      snapshot.suspendRoletaoUntil ??
      schedule.suspendRoletaoUntil ??
      null,
    reason:
      snapshot.checkpoint?.reason ??
      snapshot.checkpointReason ??
      schedule.reason ??
      null,
  };

  return toCheckpointSummary(settings);
}

export async function runCheckpointNow(
  id: string,
  options: CheckpointServiceOptions = {},
): Promise<UserCheckpointSummary> {
  const snapshot = await runCheckpoint(id, options);

  const settings: UserCheckpointSettings = {
    nextCheckpointAt: snapshot.checkpoint?.nextCheckpointAt ?? snapshot.nextCheckpointAt ?? null,
    suspendLeadsUntil:
      snapshot.checkpoint?.suspendLeadsUntil ?? snapshot.suspendLeadsUntil ?? null,
    suspendRoletaoUntil:
      snapshot.checkpoint?.suspendRoletaoUntil ?? snapshot.suspendRoletaoUntil ?? null,
    reason: snapshot.checkpoint?.reason ?? snapshot.checkpointReason ?? null,
  };

  return toCheckpointSummary(settings);
}

export async function getUserDeactivationStatus(id: string): Promise<DeactivationStatus> {
  return fetchDeactivationStatus(id);
}

export async function getRedistributionPreview(
  id: string,
  strategy: DeactivationStrategy,
  filters: RedistributionFilters,
): Promise<RedistributionPreview> {
  return getRedistributionPreviewMock(id, strategy, filters);
}

export async function deactivateUserNow(
  id: string,
  payload: DeactivationPayload,
  options: DeactivationActionOptions = {},
): Promise<DeactivationStatus> {
  const mergedPayload: DeactivationPayload = {
    ...payload,
    actorUserId: payload.actorUserId ?? options.actorUserId,
  };

  const status = await deactivateUserNowMock(id, mergedPayload);

  logAudit('deactivateUserNow', {
    userId: id,
    actorUserId: mergedPayload.actorUserId,
    strategy: mergedPayload.strategy,
    filters: mergedPayload.filters,
    scheduleFor: mergedPayload.scheduleFor ?? null,
  });

  updateUserState(id, {
    can_claim_roletao: false,
    can_receive_new_leads: false,
  });

  return status;
}

export async function scheduleUserDeactivation(
  id: string,
  payload: DeactivationPayload,
  options: DeactivationActionOptions = {},
): Promise<DeactivationStatus> {
  const mergedPayload: DeactivationPayload = {
    ...payload,
    actorUserId: payload.actorUserId ?? options.actorUserId,
  };

  const status = await scheduleDeactivationMock(id, mergedPayload);

  logAudit('scheduleUserDeactivation', {
    userId: id,
    actorUserId: mergedPayload.actorUserId,
    strategy: mergedPayload.strategy,
    filters: mergedPayload.filters,
    scheduleFor: status.scheduledFor,
  });

  return status;
}

export async function cancelUserDeactivation(
  id: string,
  options: DeactivationActionOptions = {},
): Promise<DeactivationStatus> {
  const status = await cancelDeactivationMock(id, options.actorUserId);

  logAudit('cancelUserDeactivation', {
    userId: id,
    actorUserId: options.actorUserId,
  });

  return status;
}

export async function reactivateUser(
  id: string,
  payload: ReactivateUserPayload = {},
): Promise<DeactivationStatus> {
  const mergedPayload: ReactivateUserPayload = {
    ...payload,
  };

  const status = await reactivateUserMock(id, mergedPayload);

  logAudit('reactivateUser', {
    userId: id,
    actorUserId: mergedPayload.actorUserId,
  });

  updateUserState(id, {
    can_claim_roletao: true,
    can_receive_new_leads: true,
  });

  return status;
}

export async function bulkToggleUserStatus(userIds: string[], active: boolean): Promise<any> {
  // Mock implementation
  await logAudit('bulkToggleUserStatus', { userIds, active });
  return new Promise(resolve => 
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function bulkLinkUsers(userIds: string[], companyId: string): Promise<any> {
  // Mock implementation
  await logAudit('bulkLinkUsers', { userIds, companyId });
  return new Promise(resolve => 
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function bulkExportUsers(userIds: string[]): Promise<Blob> {
  // Mock implementation
  await logAudit('bulkExportUsers', { userIds });
  const csvContent = 'id,name,email\n' + userIds.map(id => `${id},User ${id},user${id}@example.com`).join('\n');
  return new Promise(resolve => 
    setTimeout(() => resolve(new Blob([csvContent], { type: 'text/csv' })), 300)
  );
}

export async function bulkUpdateRole(
  userIds: string[],
  role: string,
): Promise<any> {
  // Mock implementation
  await logAudit('bulkUpdateRole', { userIds, role });
  return new Promise(resolve => 
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function bulkResetPassword(userIds: string[]): Promise<any> {
  // Mock implementation
  await logAudit('bulkResetPassword', { userIds });
  return new Promise(resolve => 
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export async function toggleUserRoletao(id: string, enabled: boolean): Promise<any> {
  // Mock implementation
  await logAudit('toggleUserRoletao', { userId: id, enabled });
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 300)
  );
}

export type {
  DeactivationPayload,
  DeactivationStatus,
  DeactivationStrategy,
  ReactivateUserPayload,
  RedistributionFilters,
  RedistributionPreview,
} from '@/features/users/types';

