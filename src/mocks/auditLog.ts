import type { AuditEvent } from '@/features/users/types';
import { mockUserAudit } from '@/features/users/mocks/userDetail.mock';

const auditStore = new Map<string, AuditEvent[]>();

function cloneEvent(event: AuditEvent): AuditEvent {
  return {
    ...event,
    meta: event.meta ? { ...event.meta } : undefined,
  };
}

function ensureSeeded() {
  if (!auditStore.has('1')) {
    auditStore.set('1', mockUserAudit.map(cloneEvent));
  }
}

ensureSeeded();

export function getAuditLog(userId: string): AuditEvent[] {
  const existing = auditStore.get(userId);
  if (!existing) return [];
  return existing.map(cloneEvent);
}

export function appendAuditLog(userId: string, event: AuditEvent): void {
  const existing = auditStore.get(userId) ?? [];
  existing.push(cloneEvent(event));
  auditStore.set(userId, existing);
}

export function seedAuditLog(userId: string, events: AuditEvent[]): void {
  auditStore.set(userId, events.map(cloneEvent));
}

export function createAuditEventId(userId?: string): string {
  const random = Math.random().toString(16).slice(2, 8);
  return `${userId ?? 'evt'}-${random}-${Date.now().toString(36)}`;
}

export function listTrackedUsers(): string[] {
  return Array.from(auditStore.keys());
}

