import { useAgendaStore } from './useAgendaStore';
import type { AgendaTask } from '@/types/agenda';

export function useTasks(date: Date) {
  const { byDate } = useAgendaStore();
  
  const data = byDate(date);
  
  return {
    data,
    isLoading: false,
    error: null,
  };
}