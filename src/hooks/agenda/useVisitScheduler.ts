import { useCallback, useState } from 'react';
import type { VisitTaskInput } from '@/types/agenda';
import { scheduleVisits } from '@/services/visits';

interface VisitItem extends VisitTaskInput {
  id: string;
}

const BUFFER_MINUTES: Record<NonNullable<VisitTaskInput['transport']>, number> = {
  car: 15,
  bus: 30,
  walk: 10,
};

function toDate(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatTime(date: Date): string {
  return date.toISOString().slice(11, 16);
}

function stack(items: VisitItem[]): VisitItem[] {
  if (items.length === 0) return items;
  const first = items[0];
  if (!first.date || !first.time) return items;

  let current = toDate(first.date, first.time);
  const result: VisitItem[] = [first];

  for (let i = 1; i < items.length; i++) {
    const prev = result[i - 1];
    const duration = prev.durationMin ?? 60;
    const buffer = BUFFER_MINUTES[prev.transport ?? 'car'] ?? 0;
    current = new Date(current.getTime() + (duration + buffer) * 60000);
    result.push({
      ...items[i],
      date: formatDate(current),
      time: formatTime(current),
    });
  }

  return result;
}

export function useVisitScheduler() {
  const [cart, setCart] = useState<VisitItem[]>([]);

  const add = useCallback((item: Omit<VisitItem, 'id'>) => {
    setCart(prev => stack([...prev, { ...item, id: crypto.randomUUID() }]));
  }, []);

  const remove = useCallback((id: string) => {
    setCart(prev => stack(prev.filter(item => item.id !== id)));
  }, []);

  const update = useCallback((id: string, data: Partial<Omit<VisitItem, 'id'>>) => {
    setCart(prev => stack(prev.map(item => (item.id === id ? { ...item, ...data } : item))));
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const scheduleAll = useCallback(
    async (leadId?: string | number) => {
      if (!cart.length) return;
      const payload = cart.map(({ id, leadId: itemLeadId, ...rest }) => ({
        leadId: leadId ?? itemLeadId,
        ...rest,
      }));
      try {
        await scheduleVisits(payload);
      } catch {
        /* ignore */
      } finally {
        clear();
      }
    },
    [cart, clear]
  );

  return { cart, add, remove, update, clear, scheduleAll };
}

export type { VisitItem };

