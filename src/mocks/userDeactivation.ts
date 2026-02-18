import { addDays, subDays } from 'date-fns';

import type {
  DeactivationBanner,
  DeactivationHistoryEntry,
  DeactivationJob,
  DeactivationPayload,
  DeactivationStatus,
  DeactivationStrategy,
  ReactivateUserPayload,
  RedistributionFilters,
  RedistributionPreview,
  WalletSummary,
} from '@/features/users/types';
import { safeGetJSON, safeSetJSON } from '@/utils/storage';

type BaseStatus = Omit<DeactivationStatus, 'jobs' | 'history' | 'banners' | 'summary'>;

interface PersistedUserState {
  summary: WalletSummary;
  status: BaseStatus;
  jobs: DeactivationJob[];
  history: DeactivationHistoryEntry[];
  banners: DeactivationBanner[];
}

type PersistedSnapshot = Record<string, PersistedUserState>;

const STORAGE_KEY = 'novo-hunter:user-deactivation-state';
const memoryStore = new Map<string, PersistedUserState>();
let hydrated = false;
let internalCounter = 0;

const MAX_HISTORY = 30;
const NETWORK_DELAY = {
  status: 320,
  preview: 260,
  mutate: 520,
};

function generateId(prefix: string, userId: string): string {
  internalCounter += 1;
  return `${prefix}_${userId}_${Date.now()}_${internalCounter}`;
}

function seedFromId(userId: string): number {
  return userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function generateSummary(userId: string): WalletSummary {
  const seed = seedFromId(userId);
  const total = 65 + (seed % 40);
  const hot = Math.max(5, Math.round(total * 0.22));
  const warm = Math.max(10, Math.round(total * 0.38));
  const cold = Math.max(8, total - hot - warm);

  return {
    total,
    hot,
    warm,
    cold,
  };
}

function computeSelected(summary: WalletSummary, filters: RedistributionFilters): WalletSummary {
  return {
    hot: filters.includeHot ? summary.hot : 0,
    warm: filters.includeWarm ? summary.warm : 0,
    cold: filters.includeCold ? summary.cold : 0,
    total:
      (filters.includeHot ? summary.hot : 0) +
      (filters.includeWarm ? summary.warm : 0) +
      (filters.includeCold ? summary.cold : 0),
  };
}

function simulateNetwork<T>(payload: T, delay: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(payload), delay);
  });
}

function hydrateFromStorage(): void {
  if (hydrated) return;

  const snapshot = safeGetJSON<PersistedSnapshot>(STORAGE_KEY);
  if (snapshot) {
    for (const [userId, entry] of Object.entries(snapshot)) {
      memoryStore.set(userId, {
        summary: { ...entry.summary },
        status: { ...entry.status },
        jobs: entry.jobs.map(job => ({
          ...job,
          summary: { ...job.summary },
          filters: job.filters ? { ...job.filters } : undefined,
          result: job.result ? { ...job.result } : undefined,
        })),
        history: entry.history.map(record => ({ ...record })),
        banners: entry.banners.map(banner => ({ ...banner })),
      });
    }
  }

  hydrated = true;
}

function persistToStorage(): void {
  if (typeof window === 'undefined') return;

  const snapshot: PersistedSnapshot = {};
  for (const [userId, entry] of memoryStore.entries()) {
    snapshot[userId] = {
      summary: { ...entry.summary },
      status: { ...entry.status },
      jobs: entry.jobs.map(job => ({
        ...job,
        summary: { ...job.summary },
        filters: job.filters ? { ...job.filters } : undefined,
        result: job.result ? { ...job.result } : undefined,
      })),
      history: entry.history.map(record => ({ ...record })),
      banners: entry.banners.map(banner => ({ ...banner })),
    };
  }

  safeSetJSON(STORAGE_KEY, snapshot);
}

function cloneStatus(entry: PersistedUserState): DeactivationStatus {
  return {
    state: entry.status.state,
    scheduledFor: entry.status.scheduledFor,
    lastActionAt: entry.status.lastActionAt,
    strategy: entry.status.strategy,
    notes: entry.status.notes,
    summary: { ...entry.summary },
    jobs: entry.jobs.map(job => ({
      ...job,
      summary: { ...job.summary },
      filters: job.filters ? { ...job.filters } : undefined,
      result: job.result ? { ...job.result } : undefined,
    })),
    history: entry.history.map(record => ({ ...record })),
    banners: entry.banners.map(banner => ({ ...banner })),
  };
}

function createInitialHistory(userId: string, jobs: DeactivationJob[]): DeactivationHistoryEntry[] {
  if (jobs.length === 0) {
    return [];
  }

  const items: DeactivationHistoryEntry[] = [];
  for (const job of jobs) {
    if (job.type === 'deactivation') {
      items.push({
        id: generateId('history', userId),
        action: 'deactivated',
        at: job.updatedAt,
        actor: 'sistema',
        details: 'Carteira processada automaticamente.',
        jobId: job.id,
      });
    } else {
      items.push({
        id: generateId('history', userId),
        action: 'reactivated',
        at: job.updatedAt,
        actor: 'sistema',
        details: 'Corretor reativado após revisão.',
        jobId: job.id,
      });
    }
  }

  return items;
}

function createInitialBanners(userId: string): DeactivationBanner[] {
  const now = new Date();
  return [
    {
      id: generateId('banner', userId),
      message: 'Mantenha a carteira atualizada para evitar redistribuições automáticas.',
      variant: 'info',
      createdAt: subDays(now, 3).toISOString(),
      ctaLabel: 'Ver boas práticas',
      ctaHref: '#',
      tag: 'tip',
    },
  ];
}

function createInitialJobs(userId: string, summary: WalletSummary): DeactivationJob[] {
  const now = new Date();
  const pastDeactivation: DeactivationJob = {
    id: generateId('job', userId),
    userId,
    type: 'deactivation',
    status: 'completed',
    createdAt: subDays(now, 40).toISOString(),
    scheduledFor: subDays(now, 39).toISOString(),
    updatedAt: subDays(now, 39).toISOString(),
    strategy: 'redistribute',
    filters: { includeHot: true, includeWarm: true, includeCold: true },
    notes: 'Fluxo mensal automático concluído.',
    summary: { ...summary },
    result: {
      redistributed: Math.round(summary.total * 0.5),
      archived: Math.round(summary.total * 0.2),
      remaining: Math.max(0, summary.total - Math.round(summary.total * 0.7)),
    },
    error: null,
  };

  const pastReactivation: DeactivationJob = {
    id: generateId('job', userId),
    userId,
    type: 'reactivation',
    status: 'completed',
    createdAt: subDays(now, 32).toISOString(),
    scheduledFor: null,
    updatedAt: subDays(now, 32).toISOString(),
    strategy: 'redistribute',
    filters: { includeHot: true, includeWarm: false, includeCold: false },
    notes: 'Reativação após checagem de compliance.',
    summary: { ...summary },
    result: {
      redistributed: 0,
      archived: 0,
      remaining: summary.total,
    },
    error: null,
  };

  return [pastReactivation, pastDeactivation];
}

function ensureState(userId: string): PersistedUserState {
  hydrateFromStorage();

  const existing = memoryStore.get(userId);
  if (existing) {
    return existing;
  }

  const summary = generateSummary(userId);
  const jobs = createInitialJobs(userId, summary);
  const history = createInitialHistory(userId, jobs);
  const banners = createInitialBanners(userId);

  const state: PersistedUserState = {
    summary,
    jobs,
    history,
    banners,
    status: {
      state: 'idle',
      scheduledFor: null,
      lastActionAt: history[0]?.at ?? null,
      strategy: undefined,
      notes: undefined,
    },
  };

  memoryStore.set(userId, state);
  persistToStorage();
  return state;
}

function appendHistory(
  state: PersistedUserState,
  entry: Omit<DeactivationHistoryEntry, 'id' | 'at'> & { at?: string },
  userId: string,
): void {
  const at = entry.at ?? new Date().toISOString();
  state.history.unshift({
    id: generateId('history', userId),
    at,
    action: entry.action,
    actor: entry.actor,
    details: entry.details,
    jobId: entry.jobId,
  });

  if (state.history.length > MAX_HISTORY) {
    state.history.length = MAX_HISTORY;
  }
}

function pushBanner(state: PersistedUserState, banner: Omit<DeactivationBanner, 'id' | 'createdAt'> & { createdAt?: string }, userId: string): void {
  state.banners = state.banners
    .filter(existing => existing.tag !== banner.tag)
    .concat({
      id: generateId('banner', userId),
      createdAt: banner.createdAt ?? new Date().toISOString(),
      message: banner.message,
      variant: banner.variant,
      expiresAt: banner.expiresAt,
      ctaHref: banner.ctaHref,
      ctaLabel: banner.ctaLabel,
      tag: banner.tag,
    });
}

function removeBannersByTag(state: PersistedUserState, tag: string): void {
  state.banners = state.banners.filter(banner => banner.tag !== tag);
}

export async function getUserDeactivationStatus(userId: string): Promise<DeactivationStatus> {
  const state = ensureState(userId);
  return simulateNetwork(cloneStatus(state), NETWORK_DELAY.status);
}

export async function getRedistributionPreview(
  userId: string,
  strategy: DeactivationStrategy,
  filters: RedistributionFilters,
): Promise<RedistributionPreview> {
  const state = ensureState(userId);
  const selected = computeSelected(state.summary, filters);

  return simulateNetwork(
    {
      selectedTotal: selected.total,
      toRedistribute: strategy === 'redistribute' ? selected.total : 0,
      toArchive: strategy === 'archive' ? selected.total : 0,
      remaining: Math.max(0, state.summary.total - selected.total),
      breakdown: selected,
    },
    NETWORK_DELAY.preview,
  );
}

export async function deactivateUserNow(
  userId: string,
  payload: DeactivationPayload,
): Promise<DeactivationStatus> {
  const state = ensureState(userId);
  const now = new Date();
  const reduction = computeSelected(state.summary, payload.filters);

  state.summary = {
    total: Math.max(0, state.summary.total - reduction.total),
    hot: Math.max(0, state.summary.hot - reduction.hot),
    warm: Math.max(0, state.summary.warm - reduction.warm),
    cold: Math.max(0, state.summary.cold - reduction.cold),
  };

  const job: DeactivationJob = {
    id: generateId('job', userId),
    userId,
    type: 'deactivation',
    status: 'completed',
    createdAt: now.toISOString(),
    scheduledFor: null,
    updatedAt: now.toISOString(),
    strategy: payload.strategy,
    filters: { ...payload.filters },
    notes: payload.notes,
    summary: { ...state.summary },
    result: {
      redistributed: payload.strategy === 'redistribute' ? reduction.total : 0,
      archived: payload.strategy === 'archive' ? reduction.total : 0,
      remaining: state.summary.total,
    },
    error: null,
  };

  state.jobs.unshift(job);
  state.status = {
    state: 'deactivated',
    scheduledFor: null,
    lastActionAt: now.toISOString(),
    strategy: payload.strategy,
    notes: payload.notes,
  };

  appendHistory(state, {
    action: 'deactivated',
    actor: payload.actorUserId ?? 'sistema',
    details: 'Carteira redistribuída imediatamente.',
    jobId: job.id,
  }, userId);

  removeBannersByTag(state, 'scheduled-warning');
  pushBanner(
    state,
    {
      message: 'Corretor desativado. Reveja a carteira quando finalizar os ajustes.',
      variant: 'warning',
      expiresAt: addDays(now, 2).toISOString(),
      tag: 'post-deactivation',
    },
    userId,
  );

  persistToStorage();
  return simulateNetwork(cloneStatus(state), NETWORK_DELAY.mutate);
}

export async function scheduleUserDeactivation(
  userId: string,
  payload: DeactivationPayload,
): Promise<DeactivationStatus> {
  const state = ensureState(userId);
  const now = new Date();
  const scheduledFor = payload.scheduleFor ? new Date(payload.scheduleFor) : addDays(now, 1);

  const job: DeactivationJob = {
    id: generateId('job', userId),
    userId,
    type: 'deactivation',
    status: 'pending',
    createdAt: now.toISOString(),
    scheduledFor: scheduledFor.toISOString(),
    updatedAt: now.toISOString(),
    strategy: payload.strategy,
    filters: { ...payload.filters },
    notes: payload.notes,
    summary: { ...state.summary },
    result: undefined,
    error: null,
  };

  state.jobs.unshift(job);
  state.status = {
    state: 'scheduled',
    scheduledFor: job.scheduledFor,
    lastActionAt: null,
    strategy: payload.strategy,
    notes: payload.notes,
  };

  appendHistory(state, {
    action: 'scheduled',
    actor: payload.actorUserId ?? 'sistema',
    details: `Desativação programada para ${scheduledFor.toLocaleString('pt-BR')}.`,
    jobId: job.id,
  }, userId);

  pushBanner(
    state,
    {
      message: 'Existe uma desativação programada para este corretor.',
      variant: 'warning',
      expiresAt: job.scheduledFor,
      tag: 'scheduled-warning',
    },
    userId,
  );

  persistToStorage();
  return simulateNetwork(cloneStatus(state), NETWORK_DELAY.mutate);
}

export async function cancelUserDeactivation(userId: string, actorUserId?: string): Promise<DeactivationStatus> {
  const state = ensureState(userId);
  const now = new Date();

  const pendingJob = state.jobs.find(job => job.status === 'pending' && job.type === 'deactivation');
  if (pendingJob) {
    pendingJob.status = 'cancelled';
    pendingJob.updatedAt = now.toISOString();
    pendingJob.error = 'Cancelado pelo usuário.';
  }

  state.status = {
    state: 'idle',
    scheduledFor: null,
    lastActionAt: now.toISOString(),
    strategy: undefined,
    notes: undefined,
  };

  appendHistory(state, {
    action: 'cancelled',
    actor: actorUserId ?? 'sistema',
    details: 'Agendamento de desativação cancelado.',
    jobId: pendingJob?.id,
  }, userId);

  removeBannersByTag(state, 'scheduled-warning');

  persistToStorage();
  return simulateNetwork(cloneStatus(state), NETWORK_DELAY.mutate);
}

export async function reactivateUser(
  userId: string,
  payload: ReactivateUserPayload = {},
): Promise<DeactivationStatus> {
  const state = ensureState(userId);
  const now = new Date();

  const job: DeactivationJob = {
    id: generateId('job', userId),
    userId,
    type: 'reactivation',
    status: 'completed',
    createdAt: now.toISOString(),
    scheduledFor: null,
    updatedAt: now.toISOString(),
    strategy: state.status.strategy,
    filters: { includeHot: true, includeWarm: true, includeCold: true },
    notes: payload.notes,
    summary: { ...state.summary },
    result: {
      redistributed: 0,
      archived: 0,
      remaining: state.summary.total,
    },
    error: null,
  };

  state.jobs.unshift(job);
  state.status = {
    state: 'idle',
    scheduledFor: null,
    lastActionAt: now.toISOString(),
    strategy: undefined,
    notes: undefined,
  };

  appendHistory(state, {
    action: 'reactivated',
    actor: payload.actorUserId ?? 'sistema',
    details: 'Corretor reativado manualmente.',
    jobId: job.id,
  }, userId);

  removeBannersByTag(state, 'post-deactivation');
  removeBannersByTag(state, 'scheduled-warning');

  pushBanner(
    state,
    {
      message: 'Corretor reativado. Monitore os próximos checkpoints.',
      variant: 'success',
      expiresAt: addDays(now, 7).toISOString(),
      tag: 'reactivated',
    },
    userId,
  );

  persistToStorage();
  return simulateNetwork(cloneStatus(state), NETWORK_DELAY.mutate);
}
