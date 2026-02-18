import { format } from 'date-fns';
import { fromZonedTime, formatInTimeZone } from 'date-fns-tz';

/**
 * Converts a given date and time in a specific timezone to an ISO string with timezone offset.
 *
 * @param date - Either a Date object or a string in 'yyyy-MM-dd' format representing the date.
 * @param time - Time string in 'HH:mm' format.
 * @param timeZone - IANA timezone name (e.g., 'America/Sao_Paulo').
 * @returns ISO string with timezone offset representing the given date and time in the specified timezone.
 */
export function toISOWithTZ(
  date: Date | string,
  time: string,
  timeZone: string
): string {
  const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
  const utcDate = fromZonedTime(`${dateStr}T${time}:00`, timeZone);
  return formatInTimeZone(utcDate, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

export function formatDate(date?: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const defaultLocaleOptions: Intl.DateTimeFormatOptions = { dateStyle: 'short' };

export function formatDateWithFallback(
  value?: string | Date,
  options: Intl.DateTimeFormatOptions = defaultLocaleOptions,
  locale = 'pt-BR'
): string {
  if (!value) return '-';

  const date = typeof value === 'string' ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString(locale, options);
}
