import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  useRedistribuicaoStore,
  type RedistribuicaoFilters,
  type RedistribuicaoPagination,
} from '@/state/distribuicao/redistribuicao.store';
import type {
  ArchivedLead,
  DestinationConfig,
  RedistributionAuditEntry,
  RedistributionJob,
  RedistributionPreview,
} from '@/types/redistribution';

export function useRedistribuicaoFilters() {
  const { filters, pagination, setFilters, resetFilters, setSearch, setPage, setPerPage } = useRedistribuicaoStore(
    useShallow(state => ({
      filters: state.filters,
      pagination: state.pagination,
      setFilters: state.setFilters,
      resetFilters: state.resetFilters,
      setSearch: state.setSearch,
      setPage: state.setPage,
      setPerPage: state.setPerPage,
    }))
  );

  const updateFilters = useCallback((partial: Partial<RedistribuicaoFilters>) => {
    setFilters(partial);
  }, [setFilters]);

  const updatePage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return {
    filters,
    pagination: pagination as RedistribuicaoPagination,
    setFilters: updateFilters,
    resetFilters,
    setSearch,
    setPage: updatePage,
    setPerPage,
  };
}

export function useRedistribuicaoLeads() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      leads: state.leads as ArchivedLead[],
      metadata: state.metadata,
      loading: state.loading,
      error: state.error,
      loadLeads: state.loadLeads,
      pagination: state.pagination,
    }))
  );
}

export function useRedistribuicaoSelection() {
  const {
    leads,
    total,
    selectAllMatching,
    deselectedIds,
    toggleLeadSelection,
    toggleCurrentPageSelection,
    enableSelectAllMatching,
    clearSelection,
    isLeadSelected,
    getSelectedCount,
    hasSelection,
  } = useRedistribuicaoStore(
    useShallow(state => ({
      leads: state.leads as ArchivedLead[],
      total: state.pagination.total,
      selectAllMatching: state.selection.selectAllMatching,
      deselectedIds: state.selection.deselectedIds,
      toggleLeadSelection: state.toggleLeadSelection,
      toggleCurrentPageSelection: state.toggleCurrentPageSelection,
      enableSelectAllMatching: state.enableSelectAllMatching,
      clearSelection: state.clearSelection,
      isLeadSelected: state.isLeadSelected,
      getSelectedCount: state.getSelectedCount,
      hasSelection: state.hasSelection,
    }))
  );

  const toggleRow = useCallback((id: string, checked: boolean) => {
    toggleLeadSelection(id, checked);
  }, [toggleLeadSelection]);

  const toggleCurrentPage = useCallback((checked: boolean) => {
    toggleCurrentPageSelection(checked);
  }, [toggleCurrentPageSelection]);

  const selectAll = useCallback(() => {
    enableSelectAllMatching();
  }, [enableSelectAllMatching]);

  return {
    leads,
    selectAllMatching,
    deselectedIds,
    isLeadSelected,
    toggleRow,
    toggleCurrentPage,
    enableSelectAllMatching: selectAll,
    clearSelection,
    selectedCount: getSelectedCount(),
    hasSelection: hasSelection(),
    total,
  };
}

export function useRedistribuicaoDestination() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      destination: state.destination as DestinationConfig,
      setDestination: state.setDestination,
    }))
  );
}

export function useRedistribuicaoPreview() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      previewData: state.previewData as RedistributionPreview | null,
      previewLoading: state.previewLoading,
      previewRedistribution: state.previewRedistribution,
    }))
  );
}

export function useRedistribuicaoExecution() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      executeRedistribution: state.executeRedistribution,
      executing: state.executing,
      lastJob: state.lastJob as RedistributionJob | null,
      lastAudit: state.lastAudit as RedistributionAuditEntry | null,
      registerJob: state.registerJob,
      registerAudit: state.registerAudit,
    }))
  );
}

export function useRedistribuicaoImport() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      importBatch: state.importBatch,
      batchLoading: state.batchLoading,
    }))
  );
}

export function useRedistribuicaoJobs() {
  return useRedistribuicaoStore(
    useShallow(state => ({
      jobsHistory: state.jobsHistory as RedistributionJob[],
      auditTrail: state.auditTrail as RedistributionAuditEntry[],
    }))
  );
}
