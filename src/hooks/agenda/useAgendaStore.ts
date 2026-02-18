import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgendaTask } from '@/types/agenda';
import { agendaMockTasks } from '@/data/agendaTasks';
import {
  USE_MOCK_TASKS,
  agendaTasksMock,
} from '@/data/agendaMockData';

interface AgendaState {
  tasks: AgendaTask[];
  add: (task: AgendaTask) => void;
  byDate: (date: Date | string) => AgendaTask[];
  get: (id: string) => AgendaTask | undefined;
  setDone: (id: string, done: boolean) => void;
}

function ymd(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const useAgendaStore = create<AgendaState>()(
  persist(
    (set, get) => ({
      tasks: USE_MOCK_TASKS ? agendaTasksMock : agendaMockTasks,
      add: task =>
        set(state => ({ tasks: [...state.tasks, task] })),
      byDate: date => {
        const day = typeof date === 'string' ? date : ymd(date);
        return get()
          .tasks
          .filter(t => t.dueAt.split('T')[0] === day)
          .sort(
            (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
          );
      },
      get: id => get().tasks.find(t => t.id === id),
      setDone: (id, done) =>
        set(state => ({
          tasks: state.tasks.map(t => {
            if (t.id !== id) return t;
            const dueDate = new Date(t.dueAt);
            const today = new Date();
            const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const normalizedDue = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            let status = t.status;
            if (!done) {
              if (normalizedDue.getTime() < normalizedToday.getTime()) status = 'overdue';
              else if (normalizedDue.getTime() > normalizedToday.getTime()) status = 'future';
              else status = 'today';
            } else {
              status = 'done';
            }
            return { ...t, done, status };
          }),
        })),
    }),
    {
      name: 'agendaTasks',
      getStorage: () =>
        typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);
