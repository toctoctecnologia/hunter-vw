'use client';

import { Client } from '@/features/sadm-dashboard/access-control/components/tables/clients-table/client';
import { ServicesChart } from '@/features/sadm-dashboard/components/charts/services';

export default function Page() {
  return (
    <div className="space-y-4">
      <ServicesChart />
      <Client />
    </div>
  );
}
