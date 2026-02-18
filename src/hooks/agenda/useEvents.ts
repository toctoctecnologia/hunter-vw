import { useQuery } from '@tanstack/react-query';
import type { Event } from '@/types/event';
import { mockEvents } from '@/data/mockAgenda';
import { USE_MOCK_TASKS, agendaEventsMock } from '@/data/agendaMockData';
import { getBillingAgendaEvents } from '@/services/billingAgenda';
import { getStoredAgendaEvents, mergeAgendaEvents } from '@/services/agendaEvents';

export function useEvents() {
  const baseData = USE_MOCK_TASKS ? agendaEventsMock : mockEvents;
  const storedEvents = getStoredAgendaEvents();
  const billingEvents = getBillingAgendaEvents();
  const initialData = mergeAgendaEvents([...baseData, ...storedEvents, ...billingEvents]);

  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/agenda/events', { cache: 'no-store' });
      const stored = getStoredAgendaEvents();
      const billing = getBillingAgendaEvents();
      if (!res.ok) {
        return mergeAgendaEvents([...initialData, ...stored, ...billing]);
      }
      const data = (await res.json()) as Event[];
      return mergeAgendaEvents([...data, ...stored, ...billing]);
    },
    initialData,
  });
}

export type UseEventsReturn = ReturnType<typeof useEvents>;
