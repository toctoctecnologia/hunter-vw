export type AuditEvent = {
  id: number;
  timestamp: string;
  action: string;
  detail: string;
  user: string;
  lead: string;
  result: 'success' | 'error';
  source: string;
};

const ACTIONS = ['Distribuição', 'Check-in', 'Check-out', 'Redistribuição', 'Reordenação'];
const SOURCES = ['Sistema', 'Manual', 'Automático'];
const startDate = new Date('2025-01-01T10:00:00Z').getTime();

export const auditEvents: AuditEvent[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  timestamp: new Date(startDate + i * 3600 * 1000).toISOString(),
  action: ACTIONS[i % ACTIONS.length],
  detail: `Detalhe do evento ${i + 1}`,
  user: `Usuário ${i % 5 + 1}`,
  lead: `Lead ${1000 + i}`,
  result: i % 4 === 0 ? 'error' : 'success',
  source: SOURCES[i % SOURCES.length],
}));

