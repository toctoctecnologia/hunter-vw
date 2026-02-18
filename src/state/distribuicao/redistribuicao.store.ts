import { create } from 'zustand';
import { httpJSON } from '@/lib/http';
import type {
  ArchivedLead,
  ArchivedLeadsFilters,
  ArchivedLeadsResponse,
  DestinationConfig,
  ImportBatchPayload,
  ImportBatchResponse,
  RedistributionAuditEntry,
  RedistributionExecuteResponse,
  RedistributionJob,
  RedistributionPreview,
  RedistributionSelection,
} from '@/types/redistribution';

export interface RedistribuicaoPeriodo {
  inicio?: string;
  fim?: string;
}

export interface RedistribuicaoFilters {
  status: string;
  motivos: string[];
  owner: string;
  queue: string;
  tag: string;
  periodo: RedistribuicaoPeriodo;
  search: string;
}

export interface RedistribuicaoPagination {
  page: number;
  perPage: number;
  total: number;
}

interface SelectionState {
  selectedIds: Set<string>;
  deselectedIds: Set<string>;
  selectAllMatching: boolean;
}

interface MetadataState {
  reasons: { id: string; label: string; count: number }[];
  owners: string[];
  queues: string[];
  tags: string[];
}

const defaultFilters: RedistribuicaoFilters = {
  status: 'todos',
  motivos: [],
  owner: '',
  queue: '',
  tag: '',
  periodo: { inicio: '', fim: '' },
  search: '',
};

const defaultDestination: DestinationConfig = {
  strategy: 'fila',
  targetId: 'fila-geral',
  targetName: 'Fila Geral',
  priority: 'balanceada',
  preserveOwnership: false,
  notifyOwners: true,
  notes: '',
};

const defaultPagination: RedistribuicaoPagination = {
  page: 1,
  perPage: 10,
  total: 0,
};

const defaultSelection: SelectionState = {
  selectedIds: new Set<string>(),
  deselectedIds: new Set<string>(),
  selectAllMatching: false,
};

interface RedistribuicaoState {
  filters: RedistribuicaoFilters;
  pagination: RedistribuicaoPagination;
  leads: ArchivedLead[];
  metadata: MetadataState;
  loading: boolean;
  error?: string | null;
  destination: DestinationConfig;
  previewData: RedistributionPreview | null;
  previewLoading: boolean;
  executing: boolean;
  batchLoading: boolean;
  lastJob: RedistributionJob | null;
  lastAudit: RedistributionAuditEntry | null;
  jobsHistory: RedistributionJob[];
  auditTrail: RedistributionAuditEntry[];
  selection: SelectionState;
  setFilters: (filters: Partial<RedistribuicaoFilters>) => void;
  resetFilters: () => void;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  loadLeads: () => Promise<void>;
  clearSelection: () => void;
  toggleLeadSelection: (id: string, checked: boolean) => void;
  toggleCurrentPageSelection: (checked: boolean) => void;
  enableSelectAllMatching: () => void;
  isLeadSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  hasSelection: () => boolean;
  setDestination: (destination: DestinationConfig) => void;
  buildFiltersPayload: () => ArchivedLeadsFilters & { search?: string };
  buildSelectionPayload: () => RedistributionSelection | null;
  previewRedistribution: () => Promise<RedistributionPreview | null>;
  executeRedistribution: (requestedBy: string) => Promise<RedistributionExecuteResponse | null>;
  importBatch: (payload: Omit<ImportBatchPayload, 'destination'>) => Promise<ImportBatchResponse | null>;
  registerJob: (job: RedistributionJob) => void;
  registerAudit: (audit: RedistributionAuditEntry) => void;
}

function resetSelection(): SelectionState {
  return {
    selectedIds: new Set<string>(),
    deselectedIds: new Set<string>(),
    selectAllMatching: false,
  };
}

function toFiltersPayload(filters: RedistribuicaoFilters): ArchivedLeadsFilters & { search?: string } {
  const payload: ArchivedLeadsFilters & { search?: string } = {};
  if (filters.motivos.length > 0) payload.reason = filters.motivos[0];
  if (filters.owner) payload.owner = filters.owner;
  if (filters.queue) payload.queue = filters.queue;
  if (filters.tag) payload.tag = filters.tag;
  if (filters.periodo.inicio) payload.startDate = filters.periodo.inicio;
  if (filters.periodo.fim) payload.endDate = filters.periodo.fim;
  if (filters.status && filters.status !== 'todos') payload.status = filters.status;
  if (filters.search) payload.search = filters.search;
  return payload;
}

export const useRedistribuicaoStore = create<RedistribuicaoState>((set, get) => ({
  filters: { ...defaultFilters },
  pagination: { ...defaultPagination },
  leads: [],
  metadata: { reasons: [], owners: [], queues: [], tags: [] },
  loading: false,
  error: null,
  destination: { ...defaultDestination },
  previewData: null,
  previewLoading: false,
  executing: false,
  batchLoading: false,
  lastJob: null,
  lastAudit: null,
  jobsHistory: [],
  auditTrail: [],
  selection: { ...defaultSelection },
  setFilters(filters) {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 },
      selection: resetSelection(),
    }));
  },
  resetFilters() {
    set({ filters: { ...defaultFilters }, pagination: { ...defaultPagination }, selection: resetSelection() });
  },
  setSearch(value) {
    set(state => ({
      filters: { ...state.filters, search: value },
      pagination: { ...state.pagination, page: 1 },
      selection: resetSelection(),
    }));
  },
  setPage(page) {
    set(state => ({ pagination: { ...state.pagination, page: Math.max(1, page) } }));
  },
  setPerPage(perPage) {
    set(state => ({ pagination: { ...state.pagination, perPage: Math.max(1, perPage), page: 1 } }));
  },
  async loadLeads() {
    const { filters, pagination } = get();
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      const payload = toFiltersPayload(filters);
      if (payload.search) params.set('search', payload.search);
      if (payload.reason) params.set('reason', payload.reason);
      if (payload.owner) params.set('owner', payload.owner);
      if (payload.queue) params.set('queue', payload.queue);
      if (payload.tag) params.set('tag', payload.tag);
      if (payload.startDate) params.set('startDate', payload.startDate);
      if (payload.endDate) params.set('endDate', payload.endDate);
      if (payload.status) params.set('status', payload.status);
      params.set('page', String(pagination.page));
      params.set('perPage', String(pagination.perPage));

      const response = await httpJSON<ArchivedLeadsResponse>(`/api/leads/archived?${params.toString()}`);
      set(state => ({
        leads: response?.items ?? [],
        metadata: {
          reasons: response?.reasons ?? [],
          owners: response?.owners ?? [],
          queues: response?.queues ?? [],
          tags: response?.tags ?? [],
        },
        pagination: { ...state.pagination, total: response?.total ?? 0 },
      }));
    } catch (error: any) {
      set({
        error: error?.message ?? 'Erro ao carregar leads arquivados',
        leads: [],
        metadata: { reasons: [], owners: [], queues: [], tags: [] },
        pagination: { ...get().pagination, total: 0 },
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  clearSelection() {
    set({ selection: resetSelection() });
  },
  toggleLeadSelection(id, checked) {
    const { selection } = get();
    if (selection.selectAllMatching) {
      set({
        selection: {
          selectedIds: new Set(selection.selectedIds),
          selectAllMatching: true,
          deselectedIds: (() => {
            const next = new Set(selection.deselectedIds);
            if (checked) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return next;
          })(),
        },
      });
      return;
    }

    set({
      selection: {
        selectAllMatching: false,
        deselectedIds: new Set<string>(),
        selectedIds: (() => {
          const next = new Set(selection.selectedIds);
          if (checked) {
            next.add(id);
          } else {
            next.delete(id);
          }
          return next;
        })(),
      },
    });
  },
  toggleCurrentPageSelection(checked) {
    const { leads, selection } = get();
    if (selection.selectAllMatching) {
      if (!checked) {
        set({ selection: resetSelection() });
      }
      return;
    }

    set({
      selection: {
        selectAllMatching: false,
        deselectedIds: new Set<string>(),
        selectedIds: (() => {
          const next = new Set(selection.selectedIds);
          leads.forEach(lead => {
            if (checked) {
              next.add(lead.id);
            } else {
              next.delete(lead.id);
            }
          });
          return next;
        })(),
      },
    });
  },
  enableSelectAllMatching() {
    set({ selection: { selectAllMatching: true, selectedIds: new Set<string>(), deselectedIds: new Set<string>() } });
  },
  isLeadSelected(id) {
    const { selection } = get();
    return selection.selectAllMatching ? !selection.deselectedIds.has(id) : selection.selectedIds.has(id);
  },
  getSelectedCount() {
    const { selection, pagination } = get();
    return selection.selectAllMatching
      ? Math.max(0, pagination.total - selection.deselectedIds.size)
      : selection.selectedIds.size;
  },
  hasSelection() {
    return get().getSelectedCount() > 0;
  },
  setDestination(destination) {
    set({ destination });
  },
  buildFiltersPayload() {
    return toFiltersPayload(get().filters);
  },
  buildSelectionPayload() {
    const { selection } = get();
    if (selection.selectAllMatching) {
      const filtersPayload = get().buildFiltersPayload();
      if (!filtersPayload) return null;
      return {
        type: 'all',
        filters: filtersPayload,
        excludedIds: selection.deselectedIds.size ? Array.from(selection.deselectedIds) : undefined,
      } satisfies RedistributionSelection;
    }
    const ids = Array.from(selection.selectedIds);
    if (ids.length === 0) return null;
    return { type: 'ids', ids } satisfies RedistributionSelection;
  },
  async previewRedistribution() {
    const selection = get().buildSelectionPayload();
    if (!selection) return null;
    set({ previewLoading: true });
    try {
      const payload = { selection, destination: get().destination };
      const response = await httpJSON<RedistributionPreview>('/api/redistribution/preview', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      set({ previewData: response ?? null });
      return response ?? null;
    } finally {
      set({ previewLoading: false });
    }
  },
  async executeRedistribution(requestedBy) {
    const selection = get().buildSelectionPayload();
    if (!selection) return null;
    set({ executing: true });
    try {
      const payload = {
        selection,
        destination: get().destination,
        requestedBy,
      };
      const response = await httpJSON<RedistributionExecuteResponse>('/api/redistribution/execute', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (response?.job) {
        set(state => ({
          lastJob: response.job,
          jobsHistory: [response.job, ...state.jobsHistory],
        }));
      }
      if (response?.audit) {
        set(state => ({
          lastAudit: response.audit,
          auditTrail: [response.audit, ...state.auditTrail],
        }));
      }
      set({ previewData: null });
      get().clearSelection();
      await get().loadLeads();
      return response ?? null;
    } finally {
      set({ executing: false });
    }
  },
  async importBatch(payload) {
    set({ batchLoading: true });
    try {
      const response = await httpJSON<ImportBatchResponse>('/api/leads/import', {
        method: 'POST',
        body: JSON.stringify({ ...payload, destination: get().destination }),
      });
      await get().loadLeads();
      return response ?? null;
    } finally {
      set({ batchLoading: false });
    }
  },
  registerJob(job) {
    set(state => ({ jobsHistory: [job, ...state.jobsHistory], lastJob: job }));
  },
  registerAudit(audit) {
    set(state => ({ auditTrail: [audit, ...state.auditTrail], lastAudit: audit }));
  },
}));

export default useRedistribuicaoStore;
