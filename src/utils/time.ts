// Returns the number of minutes elapsed since the start of the day for the
// provided date. Useful for positioning elements relative to a day's timeline.
export function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}
