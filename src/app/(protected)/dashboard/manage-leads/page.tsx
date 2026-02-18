'use client';
import { useState } from 'react';

import { withPermission } from '@/shared/hoc/with-permission';
import { LeadsDashboardFilters } from '@/shared/types';

import { ArchiveReasonsClient } from '@/features/dashboard/manage-leads/components/tables/archive-reason-table/client';
import DashboardFiltersSheet from '@/features/dashboard/manage-leads/components/sheet/dashboard-filters-sheet';
import { LeadsClient } from '@/features/dashboard/manage-leads/components/tables/leads-table/client';
import { AdsMetricsCard } from '@/features/dashboard/manage-api/components/ads-metrics-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Dashboard } from '@/features/dashboard/manage-leads/components/dashboard';
import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { useAuth } from '@/shared/hooks/use-auth';
import { cn, getCalculatedGrid } from '@/shared/lib/utils';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const { user } = useAuth();
  const currentDate = new Date();

  const [filters, setFilters] = useState<LeadsDashboardFilters>({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <DashboardFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFilter={() => setShowFiltersSheet(true)}
          />
        </Filter>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn('grid w-full rounded-xl p-1', getCalculatedGrid(user, ['2400'], 3))}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="leads-list">Lista de Leads</TabsTrigger>
            {hasFeature(user?.userInfo.profile.permissions, '2400') && (
              <TabsTrigger value="archive_types">Tipos de Arquivamento</TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="dashboard">
            <Dashboard filters={filters} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="campaigns">
            <AdsMetricsCard />
          </TabsContent>

          <TabsContent value="leads-list">
            <LeadsClient />
          </TabsContent>

          {hasFeature(user?.userInfo.profile.permissions, '2400') && (
            <TabsContent value="archive_types">
              <ArchiveReasonsClient />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}

export default withPermission(Page, ['1500']);
