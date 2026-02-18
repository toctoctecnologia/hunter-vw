import { useState, useEffect } from 'react';
import type { Event } from '@/types/event';
import { formattedMockEvents } from '@/data/mockEvents';
import { getLocalDayRange } from '@/lib/datetime';

interface UseCalendarSyncOptions {
  autoSync?: boolean;
  syncInterval?: number; // in minutes
}

export const useCalendarSync = (options: UseCalendarSyncOptions = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);


  useEffect(() => {
    const stored = localStorage.getItem('tocToc:agendaEvents');
    if (stored) {
      try {
        setEvents(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored events', e);
      }
    } else if (import.meta.env.DEV) {
      setEvents(formattedMockEvents);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tocToc:agendaEvents', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to store events', e);
    }
  }, [events]);

  // Google Calendar Integration
  const initGoogleCalendar = async () => {
    try {
      // Load Google API
      if (typeof window !== 'undefined' && !window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        document.head.appendChild(script);
        
        return new Promise((resolve, reject) => {
          script.onload = () => {
            if (window.gapi) {
              window.gapi.load('client:auth2', () => resolve(undefined));
            } else {
              reject(new Error('Google API failed to load'));
            }
          };
          script.onerror = reject;
        });
      }
    } catch (error) {
      console.error('Failed to load Google API:', error);
      setError('Falha ao carregar Google Calendar API');
    }
  };

  const syncGoogleCalendar = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!window.gapi) {
        throw new Error('Google API not loaded');
      }

      // Initialize Google API client
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      });

      // Check if user is signed in
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      // Fetch events
      const { start, end } = getLocalDayRange();
      let response;
      try {
        response = await window.gapi.client.calendar.events.list({
          calendarId: 'primary',
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
          orderBy: 'startTime'
        });
      } catch (apiError) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          await authInstance.signIn();
          response = await window.gapi.client.calendar.events.list({
            calendarId: 'primary',
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 100,
            orderBy: 'startTime'
          });
        } else {
          throw apiError;
        }
      }

      const googleEvents: Event[] = response.result.items?.map((item: any) => ({
        id: item.id,
        sourceId: item.id,
        title: item.summary || 'Sem título',
        start: new Date(item.start.dateTime || item.start.date),
        end: new Date(item.end.dateTime || item.end.date),
        description: item.description,
        organizer: item.organizer?.displayName || item.organizer?.email,
        source: 'Google Calendar',
        location: item.location,
        attendees: item.attendees?.map((attendee: any) => attendee.email) || [],
        calendar: 'google' as const
      })) || [];

      setEvents(prev => [
        ...prev.filter(e => e.calendar !== 'google'),
        ...googleEvents
      ]);

      setLastSync(new Date());
      // Try to get token but handle if auth2 properties are not available
      let token = null;
      try {
        const authInstance = (window.gapi.auth2 as any)?.getAuthInstance();
        if (authInstance && authInstance.currentUser && authInstance.currentUser.get) {
          const user = authInstance.currentUser.get();
          if (user && user.getAuthResponse) {
            token = user.getAuthResponse().access_token;
          }
        }
      } catch (e) {
        console.warn('Could not get auth token:', e);
      }
      return token;
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      setError('Erro ao sincronizar com Google Calendar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Apple Calendar Integration (via CalDAV)
  const syncAppleCalendar = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      // This would typically be done through a backend service
      // as CalDAV requires server-side authentication
      const fetchApple = async () => {
        return fetch('/api/calendar/apple/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: import.meta.env.VITE_APPLE_CALENDAR_USERNAME,
            password: import.meta.env.VITE_APPLE_CALENDAR_PASSWORD,
            server: import.meta.env.VITE_APPLE_CALENDAR_SERVER
          })
        });
      };

      let response = await fetchApple();

      if (!response.ok) {
        if (response.status === 401) {
          await fetch('/api/calendar/apple/reauth', { method: 'POST' });
          response = await fetchApple();
        }
        if (!response.ok) {
          throw new Error('Failed to sync with Apple Calendar');
        }
      }

      const { events: appleEvents, token } = await response.json();
      
      const formattedEvents: Event[] = appleEvents.map((event: any) => ({
        id: event.uid,
        sourceId: event.uid,
        title: event.summary || 'Sem título',
        start: new Date(event.dtstart),
        end: new Date(event.dtend),
        description: event.description,
        organizer: event.organizer,
        source: 'Apple Calendar',
        location: event.location,
        calendar: 'apple' as const
      }));

      setEvents(prev => [
        ...prev.filter(e => e.calendar !== 'apple'),
        ...formattedEvents
      ]);

      setLastSync(new Date());
      return token || null;
    } catch (error) {
      console.error('Apple Calendar sync error:', error);
      setError('Erro ao sincronizar com Apple Calendar');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const syncAllCalendars = async () => {
    await Promise.all([
      syncGoogleCalendar(),
      syncAppleCalendar()
    ]);
  };

  const storeGoogleToken = async (token: string) => {
    await fetch('/api/calendar/google/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  };

  const storeAppleToken = async (token: string) => {
    await fetch('/api/calendar/apple/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  };

  const revokeGoogleToken = async () => {
    await fetch('/api/calendar/google/revoke', { method: 'POST' });
    try {
      if (window.gapi && window.gapi.auth2) {
        const authInstance = (window.gapi.auth2 as any).getAuthInstance();
        if (authInstance && typeof authInstance.signOut === 'function') {
          authInstance.signOut();
        }
      }
    } catch (e) {
      console.warn('Could not sign out:', e);
    }
  };

  const revokeAppleToken = async () => {
    await fetch('/api/calendar/apple/revoke', { method: 'POST' });
  };

  const createEvent = async (eventData: Partial<Event>, targetCalendar: 'google' | 'apple' | 'local' = 'local') => {
    try {
      setLoading(true);

      if (targetCalendar === 'google' && window.gapi) {
        // Create event in Google Calendar
        const event = {
          summary: eventData.title,
          start: {
            dateTime: eventData.start?.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: eventData.end?.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          description: eventData.description,
          location: eventData.location,
        };

        await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event
        });
      } else if (targetCalendar === 'apple') {
        // Create event in Apple Calendar via backend
        await fetch('/api/calendar/apple/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });
      }

      // Add to local events
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title || '',
        start: eventData.start || new Date(),
        end: eventData.end || new Date(),
        calendar: targetCalendar === 'local' ? 'personal' : targetCalendar,
        organizer: eventData.organizer || 'Você',
        source: targetCalendar === 'google'
          ? 'Google Calendar'
          : targetCalendar === 'apple'
            ? 'Apple Calendar'
            : 'App',
        ...eventData
      };

      setEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = (id: string, data: Partial<Event>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...data } : ev)));
  };

  const cancelEvent = (id: string, reason: string) => {
    setEvents(prev =>
      prev.map(ev =>
        ev.id === id ? { ...ev, status: 'cancelled', cancelReason: reason } : ev
      )
    );
  };

  // Auto-sync setup
  useEffect(() => {
    if (options.autoSync) {
      const interval = setInterval(() => {
        syncAllCalendars();
      }, (options.syncInterval || 30) * 60 * 1000); // Convert minutes to milliseconds

      return () => clearInterval(interval);
    }
  }, [options.autoSync, options.syncInterval]);

  // Initialize on mount
  useEffect(() => {
    initGoogleCalendar();
  }, []);

  return {
    events,
    loading,
    error,
    lastSync,
    syncGoogleCalendar,
    syncAppleCalendar,
    storeGoogleToken,
    storeAppleToken,
    revokeGoogleToken,
    revokeAppleToken,
    syncAll: syncAllCalendars,
    createEvent,
    updateEvent,
    cancelEvent
  };
};
