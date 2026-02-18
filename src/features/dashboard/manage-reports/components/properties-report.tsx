'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileDown } from 'lucide-react';

import { PropertiesReportFilters } from '@/shared/types';

import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { StatusCard } from '@/shared/components/StatusCard';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

import { getPropertiesReportSummaryData } from '@/features/dashboard/manage-reports/api/report';

import PropertyReportFiltersSheet from '@/features/dashboard/manage-reports/components/sheet/property-report-filters-sheet';
import { PropertyReportClient } from '@/features/dashboard/manage-reports/components/tables/property-report-table/client';
import { ExportModal } from '@/features/dashboard/manage-reports/components/modal/export-modal';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function PropertiesReport() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<PropertiesReportFilters>({});
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['properties-summary-report'],
    queryFn: () => getPropertiesReportSummaryData(filters),
  });

  return (
    <>
      <ExportModal
        open={showExportModal}
        filters={filters}
        onClose={() => setShowExportModal(false)}
        columns={[
          { label: 'CÓDIGO', value: 'code' },
          { label: 'NOME', value: 'name' },
          { label: 'TIPO DE IMÓVEL', value: 'propertyType' },
          { label: 'STATUS', value: 'status' },
          { label: 'INTERESSADOS', value: 'interested' },
          { label: 'VISITAS AGENDADAS', value: 'scheduledVisits' },
          { label: 'VISITAS CONCLUÍDAS', value: 'completedVisits' },
          { label: 'PROPOSTAS', value: 'proposals' },
          { label: 'NEGÓCIOS', value: 'deals' },
          { label: 'LEADS INTERESSADOS', value: 'interestedLeads' },
        ]}
        reportType="PROPERTIES"
      />

      <PropertyReportFiltersSheet
        open={showFiltersSheet}
        onClose={() => setShowFiltersSheet(false)}
        onApplyFilters={setFilters}
      />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFilter={() => setShowFiltersSheet(true)}
          />

          {hasFeature(user?.userInfo.profile.permissions, '2101') && (
            <Button size="icon" variant="outline" onClick={() => setShowExportModal(true)}>
              <FileDown className="size-4" />
            </Button>
          )}
        </Filter>

        <div className="grid sm:grid-cols-3 gap-4">
          {isLoadingSummary ? (
            <Loading />
          ) : (
            <>
              <StatusCard title="Imóveis Ativos" value={String(summaryData?.activeProperties || '0')} />
              <StatusCard title="Imóveis publicados" value={String(summaryData?.publishedProperties || '0')} />
              <StatusCard title="Interessados" value={String(summaryData?.interested || '0')} />
              <StatusCard title="Visitas" value={String(summaryData?.visits || '0')} />
              <StatusCard title="Propostas" value={String(summaryData?.proposals || '0')} />
              <StatusCard title="Negócios" value={String(summaryData?.deals || '0')} />
            </>
          )}
        </div>

        <PropertyReportClient filters={filters} searchTerm={searchTerm} />
      </div>
    </>
  );
}
