import type { NavigateFunction } from 'react-router-dom';

export type AgendaView = 'day' | 'week' | 'month';

const VIEW_PREFERENCE_KEY = 'hunter:agenda:viewPreference';
const EVENT_OPEN_KEY = 'hunter:agenda:openEvent';

export const getAgendaUserPreference = (userId: string): AgendaView | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(VIEW_PREFERENCE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Record<string, AgendaView>;
    return parsed[userId] ?? null;
  } catch (error) {
    console.error('Erro ao carregar preferência da agenda:', error);
    return null;
  }
};

export const setAgendaUserPreference = (userId: string, view: AgendaView) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(VIEW_PREFERENCE_KEY);
  try {
    const parsed = stored ? (JSON.parse(stored) as Record<string, AgendaView>) : {};
    const next = { ...parsed, [userId]: view };
    localStorage.setItem(VIEW_PREFERENCE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error('Erro ao salvar preferência da agenda:', error);
  }
};

interface NavigateAgendaOptions {
  date?: Date;
  view?: AgendaView;
  sourceType?: string;
  contractId?: string;
  invoiceId?: string;
  eventId?: string;
  startAt?: string;
  tab?: 'agenda' | 'tasks';
}

export const navigateAgendaToDate = (navigate: NavigateFunction, options: NavigateAgendaOptions) => {
  const params = new URLSearchParams();
  if (options.date) params.set('date', options.date.toISOString());
  if (options.view) params.set('view', options.view);
  if (options.sourceType) params.set('sourceType', options.sourceType);
  if (options.contractId) params.set('contractId', options.contractId);
  if (options.invoiceId) params.set('invoiceId', options.invoiceId);
  if (options.eventId) params.set('eventId', options.eventId);
  if (options.startAt) params.set('startAt', options.startAt);
  if (options.tab) params.set('tab', options.tab);

  navigate({
    pathname: '/agenda',
    search: params.toString()
  });
};

export const openEventDrawerById = (eventId: string) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_OPEN_KEY, { detail: { eventId } }));
};

export const onAgendaOpenEvent = (handler: (eventId: string) => void) => {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (event: Event) => {
    const custom = event as CustomEvent<{ eventId?: string }>;
    if (custom.detail?.eventId) {
      handler(custom.detail.eventId);
    }
  };
  window.addEventListener(EVENT_OPEN_KEY, listener);
  return () => window.removeEventListener(EVENT_OPEN_KEY, listener);
};
