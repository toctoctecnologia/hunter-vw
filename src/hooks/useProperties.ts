import { create } from 'zustand';
import type { PropertyCardProps } from '@/components/imoveis/PropertyCard';
import { MOCK_PROPERTIES } from '@/mocks/properties';

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let searchReject: ((reason?: any) => void) | null = null;
let searchController: AbortController | null = null;

const toNumber = (v: any) =>
  typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d]+/g, ''));

const mockToCardProps = (p: any): PropertyCardProps => ({
  id: p.id,
  code: p.code,
  type: '',
  title: p.title,
  city: p.city,
  price: toNumber(p.price),
  area: 0,
  beds: 0,
  baths: 0,
  parking: 0,
  coverUrl: p.image,
  daysWithoutContact: 0,
});

interface PropertiesState {
  items: PropertyCardProps[];
  loading: boolean;
  search: (q: string) => Promise<PropertyCardProps[]>;
  cancelSearch: () => void;
  loadByIds: (ids: string[]) => Promise<PropertyCardProps[]>;
}

export const useProperties = create<PropertiesState>(set => ({
  items: [],
  loading: false,
  search: (q: string) =>
    new Promise<PropertyCardProps[]>((resolve, reject) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchReject?.(new Error('canceled'));
      }
      if (searchController) {
        searchController.abort();
      }
      if (!q) {
        resolve([]);
        return;
      }
      set({ loading: true });
      searchReject = reject;
      searchController = new AbortController();
      searchTimeout = setTimeout(async () => {
        try {
          const res = await fetch(
            `/imoveis?search=${encodeURIComponent(q)}`,
            {
              cache: 'no-store',
              signal: searchController?.signal,
            },
          );
          if (!res.ok) throw new Error('Failed to search properties');
          resolve((await res.json()) as PropertyCardProps[]);
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            const term = q.toLowerCase();
            resolve(
              (MOCK_PROPERTIES as any[])
                .filter(p => (p.title || (p as any).name || '').toLowerCase().includes(term))
                .map(mockToCardProps),
            );
          }
        } finally {
          set({ loading: false });
          searchTimeout = null;
          searchReject = null;
          searchController = null;
        }
      }, 300);
    }),
  cancelSearch: () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
    if (searchController) {
      searchController.abort();
      searchController = null;
    }
    if (searchReject) {
      searchReject(new Error('canceled'));
      searchReject = null;
    }
    set({ loading: false });
  },
  loadByIds: async (ids: string[]) => {
    set({ loading: true });
    try {
      if (!ids.length) {
        set({ items: [] });
        return [];
      }
      const res = await fetch(`/api/imoveis?ids=${ids.join(',')}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to load properties');
      const data = (await res.json()) as PropertyCardProps[];
      const map = new Map(data.map(p => [String(p.id), p]));
      const ordered = ids.map(id => map.get(id)).filter(Boolean) as PropertyCardProps[];
      set(state => {
        const newItems = [...state.items];
        ordered.forEach(p => {
          const idx = newItems.findIndex(i => i.id === p.id);
          if (idx >= 0) newItems[idx] = p;
          else newItems.push(p);
        });
        return { items: newItems };
      });
      return ordered;
    } catch {
      const fallback = (MOCK_PROPERTIES as any[])
        .filter(p => ids.includes(String(p.id)))
        .map(mockToCardProps);
      set(state => {
        const newItems = [...state.items];
        fallback.forEach(p => {
          const idx = newItems.findIndex(i => i.id === p.id);
          if (idx >= 0) newItems[idx] = p;
          else newItems.push(p);
        });
        return { items: newItems };
      });
      return fallback;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProperties;
