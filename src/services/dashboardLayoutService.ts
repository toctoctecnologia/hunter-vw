import { safeGetJSON, safeSetJSON } from '@/utils/storage';
import type {
  DashboardContext,
  DashboardLayoutPayload,
  DashboardVisibilityPayload,
  DashboardWidgetInstance,
} from '@/types/dashboard';

interface DashboardKeyParams {
  base: 'dashboardLayout' | 'dashboardVisibility';
  context: DashboardContext;
  userId: string;
  unitId?: string;
  role?: string;
}

function buildDashboardKey({ base, context, userId, unitId, role }: DashboardKeyParams) {
  const parts = [base, context, `user:${userId}`];
  if (unitId) parts.push(`unit:${unitId}`);
  if (role) parts.push(`role:${role}`);
  return parts.join(':');
}

async function fetchDashboardLayoutFromApi(payload: DashboardLayoutPayload) {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch('/api/dashboard-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return (await response.json()) as DashboardWidgetInstance[];
  } catch {
    return null;
  }
}

async function saveDashboardLayoutToApi(payload: DashboardLayoutPayload) {
  if (typeof window === 'undefined') return false;
  try {
    const response = await fetch('/api/dashboard-layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function fetchDashboardVisibilityFromApi(payload: DashboardVisibilityPayload) {
  if (typeof window === 'undefined') return null;
  try {
    const response = await fetch('/api/dashboard-visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, boolean>;
  } catch {
    return null;
  }
}

async function saveDashboardVisibilityToApi(payload: DashboardVisibilityPayload) {
  if (typeof window === 'undefined') return false;
  try {
    const response = await fetch('/api/dashboard-visibility', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getDashboardLayout(payload: DashboardLayoutPayload) {
  const stored = await fetchDashboardLayoutFromApi(payload);
  if (stored) return stored;

  const key = buildDashboardKey({
    base: 'dashboardLayout',
    context: payload.context,
    userId: payload.userId,
    unitId: payload.unitId,
    role: payload.role,
  });

  return safeGetJSON<DashboardWidgetInstance[]>(key) ?? null;
}

export async function saveDashboardLayout(payload: DashboardLayoutPayload) {
  const saved = await saveDashboardLayoutToApi(payload);

  const key = buildDashboardKey({
    base: 'dashboardLayout',
    context: payload.context,
    userId: payload.userId,
    unitId: payload.unitId,
    role: payload.role,
  });
  safeSetJSON(key, payload.layout);

  return saved;
}

export async function getDashboardVisibility(payload: DashboardVisibilityPayload) {
  const stored = await fetchDashboardVisibilityFromApi(payload);
  if (stored) return stored;

  const key = buildDashboardKey({
    base: 'dashboardVisibility',
    context: payload.context,
    userId: payload.userId,
    unitId: payload.unitId,
    role: payload.role,
  });

  return safeGetJSON<Record<string, boolean>>(key) ?? null;
}

export async function saveDashboardVisibility(payload: DashboardVisibilityPayload) {
  const saved = await saveDashboardVisibilityToApi(payload);

  const key = buildDashboardKey({
    base: 'dashboardVisibility',
    context: payload.context,
    userId: payload.userId,
    unitId: payload.unitId,
    role: payload.role,
  });
  safeSetJSON(key, payload.visibility);

  return saved;
}
