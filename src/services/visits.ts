import { httpJSON } from '@/lib/http';

export interface VisitSchedulePayload {
  leadId?: string | number;
  propertyId?: string | number | null;
  date: string;
  time: string;
  [key: string]: unknown;
}

/**
 * Schedule one or more visits and update lead stages/activities when possible.
 * When only a single item is provided, the non-bulk endpoint is used.
 */
export async function scheduleVisits(
  payload: VisitSchedulePayload | VisitSchedulePayload[]
): Promise<void> {
  const items = Array.isArray(payload) ? payload : [payload];
  const url = items.length > 1 ? '/api/agenda/visits/bulk' : '/api/agenda/visits';
  await httpJSON<void>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items.length > 1 ? items : items[0]),
  });

  await Promise.all(
    items.map(async ({ leadId, propertyId, date, time }) => {
      if (!leadId) return;
      try {
        await httpJSON<void>(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: 'agendamento' }),
        });

        await httpJSON<void>(`/api/leads/${leadId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'visit_scheduled',
            propertyId,
            date,
            time,
          }),
        });
      } catch {
        // Ignore stage update errors to avoid blocking scheduling
      }
    })
  );
}

export default scheduleVisits;

