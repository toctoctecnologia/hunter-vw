'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar, Phone } from 'lucide-react';
import { useMemo } from 'react';

import { LeadsDashboardFilters } from '@/shared/types';

import { getPerformanceMetrics, getQualificationTimeMetrics } from '@/features/dashboard/sales/api/lead-manage';
import { getMetrics } from '@/features/dashboard/manage-leads/api/dashboard';

import { LeadArchivedReasonChart } from '@/features/dashboard/manage-leads/components/charts/lead-archived-reason-chart';
import { ContactTimeQualification } from '@/features/dashboard/sales/components/manage-tab/contact-time-qualification';
import { LeadsReceivedChart } from '@/features/dashboard/manage-leads/components/charts/leads-received-chart';
import { LeadIntensityChart } from '@/features/dashboard/manage-leads/components/charts/lead-intensity-chart';
import { LeadServiceTypeChart } from '@/features/dashboard/manage-leads/components/charts/service-type-chart';
import { LeadArchivedChart } from '@/features/dashboard/manage-leads/components/charts/lead-archived-chart';
import { FunnelByWeekCard } from '@/features/dashboard/manage-leads/components/funnel-by-week-card';
import { TopPropertiesCard } from '@/features/dashboard/manage-leads/components/top-properties-card';
import { Metrics } from '@/features/dashboard/sales/components/manage-tab/metrics';
import { FunnelCrm } from '@/features/dashboard/sales/components/funnel-crm';
import { NoContentCard } from '@/shared/components/no-content-card';
import { StatusCard } from '@/shared/components/StatusCard';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

interface DashboardProps {
  filters: LeadsDashboardFilters;
  searchTerm: string;
}

export function Dashboard({ filters, searchTerm }: DashboardProps) {
  const { data: performanceData } = useQuery({
    queryKey: ['performance-metrics', filters.month, filters.year],
    queryFn: () => getPerformanceMetrics(filters.month, filters.year),
  });

  const { data: qualificationData = [] } = useQuery({
    queryKey: ['qualification-metrics', filters.month, filters.year],
    queryFn: () => getQualificationTimeMetrics(filters.month, filters.year),
  });

  const {
    data: metrics,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['lead-dashboard', filters],
    queryFn: () => getMetrics(filters),
  });

  const visitsWithoutFollowUpCount = useMemo(() => {
    if (!metrics?.visitsWithoutFollowUp) return 0;
    return metrics.visitsWithoutFollowUp.reduce((acc, visit) => acc + visit.count, 0);
  }, [metrics?.visitsWithoutFollowUp]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar métricas" />;
  if (!metrics) return <NoContentCard title="Métricas não encontradas" />;

  return (
    <div className="space-y-4">
      {performanceData && <Metrics data={performanceData} />}

      <div className="grid md:grid-cols-2 gap-4">
        <StatusCard
          title="Atendimentos ativos"
          description="Clique para ver todos os atendimentos ativos"
          icon={Phone}
          value={String(metrics.activeAttendances.count)}
        />

        <StatusCard title="Visitas sem parecer" icon={Calendar} value={String(visitsWithoutFollowUpCount)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FunnelByWeekCard data={metrics.sixWeekSalesFunnel} />
        <FunnelCrm showFilters={false} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <LeadServiceTypeChart data={metrics.attendanceType} />
        <LeadIntensityChart data={metrics.thermometer} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ContactTimeQualification qualifications={qualificationData} />
        <LeadArchivedChart />
        <LeadArchivedReasonChart />
      </div>

      <LeadsReceivedChart
        bySource={metrics.leadsReceivedBySource}
        bySeller={metrics.leadsReceivedBySeller}
        byDay={metrics.leadsReceivedByDayOfWeek}
      />

      <TopPropertiesCard data={metrics.topProperties} />
    </div>
  );
}
