import { useState } from 'react';
import { FileDown } from 'lucide-react';

import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { Button } from '@/shared/components/ui/button';
import { CatchersReportFilters } from '@/shared/types';

import CatcherReportFiltersSheet from '@/features/dashboard/manage-reports/components/sheet/catcher-report-filters-sheet';
import { CatcherReportClient } from '@/features/dashboard/manage-reports/components/tables/catcher-report-table/client';
import { ExportModal } from '@/features/dashboard/manage-reports/components/modal/export-modal';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function UsersReport() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<CatchersReportFilters>({ isActive: '' });
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <ExportModal
        open={showExportModal}
        filters={filters}
        onClose={() => setShowExportModal(false)}
        columns={[
          { label: 'NOME', value: 'name' },
          { label: 'EMAIL', value: 'email' },
          { label: 'TELEFONE', value: 'phone' },
          { label: 'ATIVO', value: 'isActive' },
        ]}
        reportType="CATCHERS"
      />

      <CatcherReportFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

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

        <CatcherReportClient filters={filters} searchTerm={searchTerm} />
      </div>
    </>
  );
}
