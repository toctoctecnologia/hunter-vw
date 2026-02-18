import { create } from 'zustand';
import { scheduleVisits } from '@/services/visits';

interface VisitQuickState {
  query: string;
  selected: number | null;
  date: string;
  time: string;
  setQuery: (query: string) => void;
  setSelected: (id: number | null) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  /** Schedule visit and return success flag. */
  schedule: () => Promise<{ success: boolean; error?: Error }>;
  /** Reset form fields */
  clear: () => void;
}

export const useVisitQuick = create<VisitQuickState>((set, get) => ({
  query: '',
  selected: null,
  date: '',
  time: '',
  setQuery: query => set({ query }),
  setSelected: id => set({ selected: id }),
  setDate: date => set({ date }),
  setTime: time => set({ time }),
  clear: () => set({ query: '', selected: null, date: '', time: '' }),
  schedule: async () => {
    const { selected, date, time } = get();
    try {
      await scheduleVisits({ propertyId: selected, date, time });
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },
}));

export default useVisitQuick;
