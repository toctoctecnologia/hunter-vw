import type { Event } from '@/types/event';

const STORAGE_KEY = 'tocToc:agendaEvents';

const hydrate = (event: Event): Event => ({
  ...event,
  start: event.start instanceof Date ? event.start : new Date(event.start),
  end: event.end instanceof Date ? event.end : new Date(event.end)
});

export const getStoredAgendaEvents = () => {
  if (typeof window === 'undefined') return [] as Event[];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [] as Event[];
  try {
    const parsed = JSON.parse(stored) as Event[];
    return parsed.map(hydrate);
  } catch (error) {
    console.error('Erro ao ler eventos da agenda:', error);
    return [] as Event[];
  }
};

export const mergeAgendaEvents = (events: Event[]) => {
  const map = new Map<string, Event>();
  events.forEach(event => {
    const existing = map.get(event.id);
    map.set(event.id, existing ? { ...existing, ...event } : event);
  });
  return Array.from(map.values());
};
