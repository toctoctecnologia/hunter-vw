import { useState } from 'react';
import { FileDown } from 'lucide-react';

import { DistributionReportFilters } from '@/shared/types';

import DistributionReportFiltersSheet from '@/features/dashboard/manage-reports/components/sheet/distribution-report-filters-sheet';
import { DistributionReportClient } from '@/features/dashboard/manage-reports/components/tables/distribution-report-table/client';
import { ExportModal } from '@/features/dashboard/manage-reports/components/modal/export-modal';
import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function DistributionReport() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<DistributionReportFilters>({});
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <ExportModal
        open={showExportModal}
        filters={filters}
        onClose={() => setShowExportModal(false)}
        columns={[
          { label: 'NOME DO LEAD', value: 'leadName' },
          { label: 'TELEFONE DO LEAD', value: 'leadPhone' },
          { label: 'EMAIL DO LEAD', value: 'leadEmail' },
          { label: 'CORRETOR RESPONSÁVEL', value: 'userName' },
          { label: 'STATUS', value: 'status' },
          { label: 'CRIADO EM', value: 'createdAt' },
          { label: 'OFERECIDO EM', value: 'offeredAt' },
          { label: 'EXPIRA EM', value: 'expiresAt' },
        ]}
        reportType="DISTRIBUTION"
      />

      <DistributionReportFiltersSheet
        open={showFiltersSheet}
        onClose={() => setShowFiltersSheet(false)}
        onApplyFilters={setFilters}
      />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput onFilter={() => setShowFiltersSheet(true)} />

          {hasFeature(user?.userInfo.profile.permissions, '2101') && (
            <Button size="icon" variant="outline" onClick={() => setShowExportModal(true)}>
              <FileDown className="h-4 w-4" />
            </Button>
          )}
        </Filter>

        <DistributionReportClient filters={filters} />
      </div>
    </>
  );
}
