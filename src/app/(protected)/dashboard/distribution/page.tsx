'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';

import { withPermission } from '@/shared/hoc/with-permission';

import { useIsMobile } from '@/shared/hooks/use-mobile';
import { QueueFilters } from '@/shared/types';

import { getDistributionHistory } from '@/features/dashboard/distribution/api/queue';

import DistributionFiltersSheet from '@/features/dashboard/distribution/components/sheet/distribution-filters-sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CaptationClient } from '@/features/dashboard/distribution/components/tables/captation-table/client';
import { DISTRIBUTION_EVENTS } from '@/features/dashboard/access-control/constants/distribution-events';
import { RedistributionTab } from '@/features/dashboard/distribution/components/redistribution-tab';
import { SaleActionTab } from '@/features/dashboard/distribution/components/sale-action-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { QueueTab } from '@/features/dashboard/distribution/components/queue-tab';
import { SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { HistoryTabGeneric } from '@/shared/components/history-tab-generic';
import { Filter, FilterSearchInput } from '@/shared/components/filters';

function Page() {
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState('queue');
  const [filters, setFilters] = useState<QueueFilters>({ isActive: '0' });
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const [eventType, setEventType] = useState<string | null>(DISTRIBUTION_EVENTS[0].value);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['user-history', pagination, eventType, startDate, endDate, selectedCatcher],
    queryFn: () => getDistributionHistory(pagination, eventType, startDate, endDate, selectedCatcher),
  });

  const clearFilters = () => {
    setEventType(DISTRIBUTION_EVENTS[0].value);
    setStartDate(null);
    setEndDate(null);
    setSelectedCatcher(null);
  };

  return (
    <>
      <DistributionFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFilter={() => setShowFiltersSheet(true)}
          />
        </Filter>

        {isMobile ? (
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="queue">Filas</SelectItem>
              <SelectItem value="history">Histórico</SelectItem>
              <SelectItem value="captation">Captações</SelectItem>
              <SelectItem value="saleAction">Ação de Vendas</SelectItem>
              <SelectItem value="redistribution">Redistribuição</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-xl p-1">
              <TabsTrigger value="queue">Filas</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="captation">Captações</TabsTrigger>
              <TabsTrigger value="saleAction">Ação de Vendas</TabsTrigger>
              <TabsTrigger value="redistribution">Redistribuição</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="queue">
            <QueueTab filters={filters} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTabGeneric
              availableEvents={DISTRIBUTION_EVENTS}
              isLoading={isLoading}
              selectedCatcher={selectedCatcher}
              setSelectedCatcher={setSelectedCatcher}
              showCatcherFilter
              currentEventType={eventType}
              setEventType={setEventType}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              data={data}
              pagination={pagination}
              setPagination={setPagination}
              canChangeEventType={false}
              clearFilters={clearFilters}
            />
          </TabsContent>

          <TabsContent value="captation">
            <CaptationClient queueFilters={filters} queueSearchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="saleAction">
            <SaleActionTab />
          </TabsContent>

          <TabsContent value="redistribution">
            <RedistributionTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default withPermission(Page, ['1600']);
