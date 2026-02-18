'use client';

import { useParams } from '@/shims/next-navigation';
import { PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { USER_HISTORY_EVENTS } from '@/features/dashboard/access-control/constants/user-history-events';

import { getUserHistory } from '@/features/dashboard/access-control/api/user';

import { UserProfileTab } from '@/features/dashboard/access-control/components/user-profile-tab';
import { UserUpdateTab } from '@/features/dashboard/access-control/components/user-update-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { HistoryTabGeneric } from '@/shared/components/history-tab-generic';
import { BackHeader } from '@/features/dashboard/components/back-header';

export default function Page() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const [eventType, setEventType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['user-history', uuid, pagination, eventType, startDate, endDate],
    queryFn: () => getUserHistory(uuid, pagination, eventType, startDate, endDate),
    enabled: !!uuid,
  });

  const clearFilters = () => {
    setEventType(null);
    setStartDate(null);
    setEndDate(null);
  };

  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-4">
      <BackHeader title="Detalhes do Usuário" />

      <div className="space-y-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 gap-1">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="updates">Atualizações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfileTab userUuid={uuid} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTabGeneric
              availableEvents={USER_HISTORY_EVENTS}
              isLoading={isLoading}
              currentEventType={eventType}
              setEventType={setEventType}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              data={data}
              pagination={pagination}
              setPagination={setPagination}
              clearFilters={clearFilters}
            />
          </TabsContent>

          <TabsContent value="updates">
            <UserUpdateTab userUuid={uuid} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
