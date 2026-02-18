'use client';

import { useParams, useRouter } from '@/shims/next-navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { Loading } from '@/shared/components/loading';

import { getLeadById, getLeadHistory } from '@/features/dashboard/sales/api/lead';

import { LEAD_DETAIL_EVENTS } from '@/features/dashboard/access-control/constants/lead-detail-events';

import { GeneralViewTab } from '@/features/dashboard/sales/components/general-view-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { HistoryTabGeneric } from '@/shared/components/history-tab-generic';
import { DealsTab } from '@/features/dashboard/sales/components/deals-tab';
import { TaskTab } from '@/features/dashboard/sales/components/task-tab';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const uuid = params.uuid as string;

  const {
    data: lead,
    isLoading: isLoadingLead,
    isError: isErrorLead,
    error: leadError,
  } = useQuery({
    queryKey: ['lead-detail', uuid],
    queryFn: () => getLeadById(uuid),
    enabled: !!uuid,
  });

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 50 });
  const [eventType, setEventType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['lead-history', uuid, pagination, eventType, startDate, endDate],
    queryFn: () => getLeadHistory(uuid, pagination, eventType, startDate, endDate),
    enabled: !!uuid,
  });

  const clearFilters = () => {
    setEventType(null);
    setStartDate(null);
    setEndDate(null);
  };

  if (isLoadingLead) return <Loading />;
  if (isErrorLead) return <ErrorCard error={leadError} title="Erro ao carregar lead" />;
  if (!lead) return <NoContentCard title="Lead não encontrado" />;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detalhes do Lead</h1>
            <p className="text-sm text-muted-foreground">{lead.name}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
          <TabsTrigger value="deals">Negócios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <GeneralViewTab lead={lead} />
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          <HistoryTabGeneric
            availableEvents={LEAD_DETAIL_EVENTS}
            isLoading={isLoading}
            currentEventType={eventType}
            setEventType={(eventType) => setEventType(eventType)}
            startDate={startDate}
            setStartDate={(date) => setStartDate(date)}
            endDate={endDate}
            setEndDate={(date) => setEndDate(date)}
            data={data}
            pagination={pagination}
            setPagination={setPagination}
            clearFilters={clearFilters}
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <TaskTab lead={lead} />
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          <DealsTab leadUuid={uuid} leadFunnelStage={lead.funnelStep} />
        </TabsContent>
      </Tabs>
    </>
  );
}
