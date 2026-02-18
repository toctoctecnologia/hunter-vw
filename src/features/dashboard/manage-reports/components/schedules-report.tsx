'use client';

import { useState } from 'react';
import { FileDown } from 'lucide-react';

import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { ScheduleReportFilters } from '@/shared/types';

import ScheduleReportFiltersSheet from '@/features/dashboard/manage-reports/components/sheet/schedule-report-filters-sheet';
import { ScheduleReportClient } from '@/features/dashboard/manage-reports/components/tables/schedule-report-table/client';
import { ExportModal } from '@/features/dashboard/manage-reports/components/modal/export-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

export function SchedulesReport() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ScheduleReportFilters>({ isCompleted: '' });
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
          { label: 'TÍTULO', value: 'title' },
          { label: 'DATA', value: 'date' },
          { label: 'CLIENTE', value: 'clientName' },
          { label: 'CONCLUÍDA', value: 'isCompleted' },
        ]}
        reportType="APPOINTMENTS"
      />

      <ScheduleReportFiltersSheet
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
              <FileDown className="h-4 w-4" />
            </Button>
          )}
        </Filter>

        <ScheduleReportClient filters={filters} searchTerm={searchTerm} />
      </div>
    </>
  );
}
