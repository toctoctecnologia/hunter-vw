import { create } from 'zustand';
import type { MockProperty } from '@/mocks/properties';
import searchMockProperties from '@/lib/search/properties-local';

interface VisitPickState {
  query: string;
  results: MockProperty[];
  selected: MockProperty | null;
  setQuery: (q: string) => void;
  pick: (property: MockProperty | null) => void;
  clear: () => void;
}

export const useVisitPick = create<VisitPickState>(set => ({
  query: '',
  results: [],
  selected: null,
  setQuery: q => set({ query: q, results: searchMockProperties(q) }),
  pick: property => set({ selected: property }),
  clear: () => set({ query: '', results: [], selected: null }),
}));

export default useVisitPick;
