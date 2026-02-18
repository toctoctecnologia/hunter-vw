import React, { createContext, useContext } from 'react';
import { useCalendarSync } from '@/hooks/agenda/useCalendarSync';

const CalendarContext = createContext<ReturnType<typeof useCalendarSync> | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const calendar = useCalendarSync();
  return <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>;
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
