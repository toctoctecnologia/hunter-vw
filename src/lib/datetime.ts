import { startOfDay, endOfDay } from 'date-fns'
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz'

function toDate(date?: Date | string | number): Date {
  if (!date) return new Date()
  return date instanceof Date ? date : new Date(date)
}

export function getLocalDayRange(date?: Date | string | number) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const d = toDate(date)
  const zoned = toZonedTime(d, tz)
  const start = fromZonedTime(startOfDay(zoned), tz)
  const end = fromZonedTime(endOfDay(zoned), tz)
  return { start, end }
}

export function ymdLocal(date?: Date | string | number) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const d = toDate(date)
  return formatInTimeZone(d, tz, 'yyyy-MM-dd')
}

export default { getLocalDayRange, ymdLocal }
