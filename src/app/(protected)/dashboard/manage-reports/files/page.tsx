import { BackHeader } from '@/features/dashboard/components/back-header';

import { ExportHistoryClient } from '@/features/dashboard/manage-reports/components/tables/export-history-table/client';

export default function Page() {
  return (
    <div className="space-y-4">
      <BackHeader title="Histórico de arquivos" />
      <ExportHistoryClient />
    </div>
  );
}
