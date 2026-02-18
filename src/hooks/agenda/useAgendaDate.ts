import { useState, useEffect } from 'react';

const STORAGE_KEY = 'agendaDate';

export function useAgendaDate(initial?: Date) {
  const [date, setDate] = useState<Date>(initial || new Date());

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!initial && stored) {
      const parsed = new Date(stored);
      if (!isNaN(parsed.getTime())) setDate(parsed);
    }
  }, [initial]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, date.toISOString());
  }, [date]);

  return { date, setDate } as const;
}

export type UseAgendaDateReturn = ReturnType<typeof useAgendaDate>;
