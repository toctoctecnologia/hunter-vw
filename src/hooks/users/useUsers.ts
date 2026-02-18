import { create } from 'zustand';
import {
  getUserDetail,
  toggleUserStatus,
  getUserMetrics,
  getUserServices,
  getUserEvaluations,
  bulkToggleUserStatus,
  bulkLinkUsers,
  toggleUserRoletao,
  type User,
} from '@/services/users';
import { fetchUsers } from '@/hooks/users/fetchUsers';
import { differenceInDays } from 'date-fns';

interface UsersFilters {
  role?: string;
  status?: string;
  period?: string;
  imobiliariaId?: string;
  city?: string;
  state?: string;
  from?: string;
  to?: string;
  order?: string;
}

interface UsersState {
  items: User[];
  total: number;
  loading: boolean;
  error: string | null;
  source: string;
  current: User | null;
  metrics: any;
  services: any[];
  evaluations: any[];
  filters: UsersFilters;
  page: number;
  pageSize: number;
  query: string;
  load: () => Promise<void>;
  setFilters: (filters: UsersFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setQuery: (query: string) => void;
  loadDetail: (id: string) => Promise<void>;
  toggleStatus: (id: string, active: boolean) => Promise<void>;
  loadMetrics: (id: string, params?: Record<string, any>) => Promise<void>;
  loadServices: (id: string, params?: Record<string, any>) => Promise<void>;
  loadEvaluations: (id: string, params?: Record<string, any>) => Promise<void>;
  bulkUpdateStatus: (ids: string[], active: boolean) => Promise<void>;
  bulkLink: (ids: string[], companyId: string) => Promise<void>;
  toggleRoletao: (id: string, enabled: boolean) => Promise<void>;
}

export const useUsers = create<UsersState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  source: 'api',
  current: null,
  metrics: null,
  services: [],
  evaluations: [],
  filters: { period: '30d', role: 'todos' },
  page: 1,
  pageSize: 25,
  query: '',
  load: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, page, pageSize, query } = get();
      const { users, source } = await fetchUsers({
        page,
        pageSize,
        query,
        filters,
      });
      const processed = users.map(u => ({
        ...u,
        timeOnPlatform: u.timeOnPlatform ?? (u.dataEntradaISO
          ? differenceInDays(new Date(), new Date(u.dataEntradaISO))
          : Math.floor(Math.random() * 365) + 1)
      }));
      set({ items: processed, total: users.length, source });
    } catch (err: any) {
      console.error('Error loading users:', err);
      set({ items: [], error: err?.message ?? 'Erro ao carregar usuários' });
    } finally {
      set({ loading: false });
    }
  },
  setFilters: filters => {
    set({ filters, page: 1, error: null });
    void get().load();
  },
  setPage: page => {
    set({ page, error: null });
    void get().load();
  },
  setPageSize: size => {
    set({ pageSize: size, page: 1, error: null });
    void get().load();
  },
  setQuery: query => {
    set({ query, page: 1, error: null });
    void get().load();
  },
  loadDetail: async (id: string) => {
    set({ loading: true });
    try {
      const user = await getUserDetail(id);
      set({ current: user });
    } finally {
      set({ loading: false });
    }
  },
  toggleStatus: async (id: string, active: boolean) => {
    await toggleUserStatus(id, active);
    set(state => ({
      items: state.items.map(u => (u.id === id ? { ...u, active } : u)),
      current: state.current && state.current.id === id ? { ...state.current, active } : state.current,
    }));
  },
  loadMetrics: async (id: string, params = {}) => {
    const data = await getUserMetrics(id, params);
    set({ metrics: data });
  },
  loadServices: async (id: string, params = {}) => {
    const data = await getUserServices(id, params);
    set({ services: data });
  },
  loadEvaluations: async (id: string, params = {}) => {
    const data = await getUserEvaluations(id, params);
    set({ evaluations: data });
  },
  bulkUpdateStatus: async (ids: string[], active: boolean) => {
    await bulkToggleUserStatus(ids, active);
    set(state => ({
      items: state.items.map(u => (ids.includes(u.id) ? { ...u, active } : u)),
      current:
        state.current && ids.includes(state.current.id)
          ? { ...state.current, active }
          : state.current,
    }));
  },
  bulkLink: async (ids: string[], companyId: string) => {
    await bulkLinkUsers(ids, companyId);
  },
  toggleRoletao: async (id: string, enabled: boolean) => {
    await toggleUserRoletao(id, enabled);
    set(state => ({
      items: state.items.map(u => (u.id === id ? { ...u, roletaoEnabled: enabled } : u)),
      current: state.current && state.current.id === id ? { ...state.current, roletaoEnabled: enabled } : state.current,
    }));
  },
}));

export default useUsers;

