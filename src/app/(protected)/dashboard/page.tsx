'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, ChartLine, House } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useSearchParams } from '@/shims/next-navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { withPermission } from '@/shared/hoc/with-permission';

import { useIsMobile } from '@/shared/hooks/use-mobile';
import { useAuth } from '@/shared/hooks/use-auth';

import { getProperties } from '@/features/dashboard/properties/api/properties';

import {
  getPropertyMetrics,
  getQualificationUpdateMetrics,
} from '@/features/dashboard/properties/api/manage-properties';
import { getQualificationTimeMetrics } from '@/features/dashboard/sales/api/lead-manage';
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from '@/features/dashboard/notification/api/notifications';
import { getTasks } from '@/features/dashboard/calendar/api/tasks';
import { getCheckins } from '@/features/dashboard/distribution/api/checkin';

import { PropertyStatus } from '@/shared/types';

import { ContactTimeQualification } from '@/features/dashboard/sales/components/manage-tab/contact-time-qualification';
import { UpdateTimeQualification } from '@/features/dashboard/properties/components/charts/update-time-qualification';
import { CapEvolutionChart } from '@/features/dashboard/properties/components/charts/cap-evolution';
import { MakeProposalModal } from '@/features/dashboard/sales/components/modal/make-proposal-modal';
import { PropertyHighlightCard } from '@/features/dashboard/components/property-highlight-card';
import { NotificationCard } from '@/features/dashboard/notification/components/notification-card';
import { CheckinHighlightCard } from '@/features/dashboard/components/checkin-highlight-card';
import { SaveLeadModal } from '@/features/dashboard/sales/components/modal/save-lead-modal';
import { TaskHighlightCard } from '@/features/dashboard/components/task-highlight-card';
import { FunnelCrm } from '@/features/dashboard/sales/components/funnel-crm';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import { NoContentCard } from '@/shared/components/no-content-card';
import { useSidebar } from '@/shared/components/ui/sidebar';
import { Loading } from '@/shared/components/loading';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  const maxWidth = isMobile ? '100%' : open ? 'calc(100vw - 19.8rem)' : 'calc(100vw - 6.5rem)';

  const [isMakeProposalModalOpen, setIsMakeProposalModalOpen] = useState(false);
  const [isSaveLeadModalOpen, setIsSaveLeadModalOpen] = useState(false);

  const { data: properties = { content: [] }, isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties', 0, undefined],
    queryFn: () =>
      getProperties({
        pagination: { pageIndex: 0, pageSize: 10 },
        filters: {
          status: `!${PropertyStatus.PENDING_TO_APPROVE}`,
        },
      }),
  });

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ pageIndex: 0, pageSize: 20 }),
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['calendar-tasks'],
    queryFn: () => getTasks({}),
  });

  const { data: checkins = [], isLoading: isLoadingCheckins } = useQuery({
    queryKey: ['checkins'],
    queryFn: getCheckins,
  });

  const { data: propertyMetrics } = useQuery({
    queryKey: ['property-manage', format(subDays(new Date(), 30), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')],
    queryFn: () => getPropertyMetrics(format(subDays(new Date(), 30), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')),
  });

  const { data: qualificationData = [], isLoading: isLoadingQualification } = useQuery({
    queryKey: ['qualification-metrics', new Date().getMonth() + 1, new Date().getFullYear()],
    queryFn: () => getQualificationTimeMetrics(new Date().getMonth() + 1, new Date().getFullYear()),
  });

  const { data: propertyQualificationData = [], isLoading: isLoadingPropertyQualification } = useQuery({
    queryKey: [
      'property-qualification-metrics',
      format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      format(new Date(), 'yyyy-MM-dd'),
    ],
    queryFn: () =>
      getQualificationUpdateMetrics(format(subDays(new Date(), 30), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')),
  });

  const todayTasks = tasks
    .filter((t) => !t.completed)
    .filter((task) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return task.taskDate === today;
    });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificação removida com sucesso');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  useEffect(() => {
    const actionType = searchParams.get('actionType');
    const leadUuid = searchParams.get('leadUuid');
    const leadName = searchParams.get('leadName');
    const propertyCode = searchParams.get('propertyCode');
    if (leadUuid && leadName && propertyCode && actionType === '1') {
      setIsMakeProposalModalOpen(true);
      return;
    }

    if (actionType === '2' && leadUuid) {
      setIsSaveLeadModalOpen(true);
      return;
    }
  }, [searchParams]);

  return (
    <>
      <MakeProposalModal
        open={isMakeProposalModalOpen}
        onClose={() => setIsMakeProposalModalOpen(false)}
        leadUuid={searchParams.get('leadUuid')!}
        leadName={searchParams.get('leadName')!}
        propertyCode={searchParams.get('propertyCode')!}
      />

      <SaveLeadModal
        open={isSaveLeadModalOpen}
        onClose={() => setIsSaveLeadModalOpen(false)}
        uuid={searchParams.get('leadUuid')!}
      />

      <div className="space-y-4">
        {isLoadingCheckins ? (
          <Loading />
        ) : (
          <>
            {checkins.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Filas de Distribuição</h2>
                  <p className="text-muted-foreground">Suas filas de distribuição e status de check-in</p>
                </div>

                <ScrollArea className="w-full whitespace-nowrap rounded-md" style={{ maxWidth }}>
                  <div className="flex gap-4 pb-4 w-max">
                    {checkins.map((checkin) => (
                      <CheckinHighlightCard key={checkin.queueUuid} checkin={checkin} />
                    ))}
                  </div>

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </>
            )}
          </>
        )}

        {isLoadingNotifications ? (
          <Loading />
        ) : (
          <>
            {notifications?.content && notifications.content.length > 0 && (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Notificações Importantes</h2>
                  <p className="text-muted-foreground">Fique atento às suas notificações prioritárias</p>
                </div>

                <ScrollArea className="w-full rounded-md" style={{ maxWidth: maxWidth }}>
                  <div className="flex gap-4 pb-4 w-max">
                    {notifications.content.map((notification) => {
                      return (
                        <NotificationCard
                          key={notification.uuid}
                          notification={notification}
                          onDelete={(uuid) => deleteMutation.mutate(uuid)}
                          onMarkAsRead={(uuid) => markAsReadMutation.mutate([uuid])}
                          className="md:max-w-[465px]"
                        />
                      );
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </>
            )}
          </>
        )}

        {isLoadingProperties ? (
          <Loading />
        ) : (
          <>
            {properties?.content?.length === 0 ? (
              <NoContentCard title="Nenhum imóvel encontrado" icon={House} />
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Novidades</h2>
                  <p className="text-muted-foreground">Imóveis recém-adicionados ao sistema</p>
                </div>

                <ScrollArea className="w-full whitespace-nowrap rounded-md" style={{ maxWidth }}>
                  <div className="flex gap-4 pb-4 w-max">
                    {properties.content.map((property) => (
                      <PropertyHighlightCard key={property.uuid} property={property} />
                    ))}
                  </div>

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </>
            )}
          </>
        )}

        {isLoadingTasks ? (
          <Loading />
        ) : (
          <>
            {todayTasks?.length === 0 ? (
              <NoContentCard title="Nenhuma tarefa para hoje" icon={Calendar} />
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Tarefas de hoje</h2>
                  <p className="text-muted-foreground">Suas tarefas para o dia de hoje</p>
                </div>

                <ScrollArea className="w-full whitespace-nowrap rounded-md" style={{ maxWidth }}>
                  <div className="flex gap-4 pb-4 w-max">
                    {todayTasks.map((task) => (
                      <TaskHighlightCard key={task.uuid} task={task} />
                    ))}
                  </div>

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </>
            )}
          </>
        )}

        {hasFeature(user?.userInfo?.profile?.permissions, '1001') && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {isLoadingQualification ? <Loading /> : <ContactTimeQualification qualifications={qualificationData} />}
              {isLoadingPropertyQualification ? (
                <Loading />
              ) : (
                <UpdateTimeQualification qualifications={propertyQualificationData} />
              )}
            </div>

            <FunnelCrm />

            <div className="grid md:grid-cols-2 gap-4">
              {!propertyMetrics ? (
                <NoContentCard title="Nenhum dado de métricas disponível para o período de 30 dias" icon={ChartLine} />
              ) : (
                <CapEvolutionChart data={propertyMetrics.monthlyCaptationSummary} />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default withPermission(Page, ['1000']);
