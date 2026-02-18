import { useCallback } from 'react';

interface CreateVisitParams {
  leadId: number | string;
  propertyId?: number | string;
  date: string;
  time: string;
}

export function useAgendaCreate() {
  const createVisit = useCallback(
    async ({ leadId, propertyId, date, time }: CreateVisitParams) => {
      const fallback = { id: Date.now().toString() };
      try {
        const res = await fetch('/api/agenda/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId, propertyId, date, time }),
        });

        if (!res.ok) return fallback;
        const data = await res.json().catch(() => null);
        return { id: data?.id ?? fallback.id };
      } catch {
        return fallback;
      }
    },
    []
  );

  const markVisitDone = useCallback(async (taskId: string | number, liked: boolean) => {
    try {
      await fetch(`/api/agenda/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done', meta: { liked } }),
      });
    } catch {
      // ignore network errors
    }
  }, []);

  return { createVisit, markVisitDone };
}

