import { getGoogleTokens, isTokenExpired } from '@/shared/lib/google-oauth';

export function isGoogleCalendarAvailable(): boolean {
  const tokens = getGoogleTokens('calendar');
  if (!tokens) return false;
  if (isTokenExpired('calendar')) return false;
  return true;
}

export function getGoogleCalendarToken(): string | null {
  if (!isGoogleCalendarAvailable()) return null;
  const tokens = getGoogleTokens('calendar')!;
  return tokens.access_token;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  colorId?: string;
  status: string;
}
