'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileDown } from 'lucide-react';
import { LeadsReportFilters } from '@/shared/types';

import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { StatusCard } from '@/shared/components/StatusCard';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

import { getLeadsReportSummaryData } from '@/features/dashboard/manage-reports/api/report';

import LeadReportFiltersSheet from '@/features/dashboard/manage-reports/components/sheet/lead-report-filters-sheet';
import { LeadReportClient } from '@/features/dashboard/manage-reports/components/tables/lead-report-table/client';
import { ExportModal } from '@/features/dashboard/manage-reports/components/modal/export-modal';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function LeadsReport() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LeadsReportFilters>({});
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['leads-summary-report'],
    queryFn: () => getLeadsReportSummaryData(filters),
  });

  return (
    <>
      <ExportModal
        open={showExportModal}
        filters={filters}
        onClose={() => setShowExportModal(false)}
        columns={[
          { label: 'NOME', value: 'name' },
          { label: 'TELEFONE 1', value: 'phone1' },
          { label: 'EMAIL', value: 'email' },
          { label: 'ORIGEM', value: 'originType' },
          { label: 'CORRETOR RESPONSÁVEL', value: 'catcherName' },
          { label: 'TIME RESPONSÁVEL', value: 'teamName' },
          { label: 'ETAPA DO FUNIL', value: 'funnelStep' },
          { label: 'VALOR DO IMÓVEL', value: 'productPrice' },
          { label: 'CRIADO EM', value: 'createdAt' },
          { label: 'ATUALIZADO EM', value: 'updatedAt' },
          { label: 'ULTIMO CONTATO EM', value: 'lastContactedAt' },
        ]}
        reportType="LEADS"
      />

      <LeadReportFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFilter={() => setShowFiltersSheet(true)}
          />

          {hasFeature(user?.userInfo.profile.permissions, '2101') && (
            <Button size="icon" variant="outline" onClick={() => setShowExportModal(true)}>
              <FileDown className="h-4 w-4" />
            </Button>
          )}
        </Filter>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingSummary ? (
            <Loading />
          ) : (
            <>
              <StatusCard title="Total de Leads" value={String(summaryData?.totalLeads || '0')} />
              <StatusCard title="Leads Ativos" value={String(summaryData?.activeLeads || '0')} />
              <StatusCard title="Leads Arquivados" value={String(summaryData?.archivedLeads || '0')} />
              <StatusCard title="Leads Contatados no Período" value={String(summaryData?.leadsContactedInPeriod || '0')} />
            </>
          )}
        </div>

        <LeadReportClient filters={filters} searchTerm={searchTerm} />
      </div>
    </>
  );
}
