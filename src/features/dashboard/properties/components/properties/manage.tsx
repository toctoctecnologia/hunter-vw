import { Building2, ChartColumn, TrendingDown, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { startOfYear, subDays, format } from 'date-fns';

import { getPropertyStatusColors, getPropertyStatusLabel } from '@/shared/lib/property-status';
import { formatValue } from '@/shared/lib/utils';

import {
  getPropertyMetrics,
  getQualificationUpdateMetrics,
} from '@/features/dashboard/properties/api/manage-properties';

import { UpdateTimeQualification } from '@/features/dashboard/properties/components/charts/update-time-qualification';
import { AvailablePropertiesKpi } from '@/features/dashboard/properties/components/kpis/available-properties';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CapSituationChart } from '@/features/dashboard/properties/components/charts/cap-situation';
import { CapEvolutionChart } from '@/features/dashboard/properties/components/charts/cap-evolution';
import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { NoContentCard } from '@/shared/components/no-content-card';
import { StatusCard } from '@/shared/components/StatusCard';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

interface ManagerPropertyProps {
  searchTerm?: string;
}

type PeriodOption = '30_days' | '90_days' | 'current_year';

function getDateRange(period: PeriodOption): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = format(today, 'yyyy-MM-dd');

  let startDate: string;

  switch (period) {
    case '30_days':
      startDate = format(subDays(today, 30), 'yyyy-MM-dd');
      break;
    case '90_days':
      startDate = format(subDays(today, 90), 'yyyy-MM-dd');
      break;
    case 'current_year':
      startDate = format(startOfYear(today), 'yyyy-MM-dd');
      break;
  }

  return { startDate, endDate };
}

export function ManagerProperty({ searchTerm = '' }: ManagerPropertyProps) {
  const [period, setPeriod] = useState<PeriodOption>('current_year');
  const { startDate, endDate } = getDateRange(period);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['property-manage', startDate, endDate],
    queryFn: () => getPropertyMetrics(startDate, endDate),
  });

  const { data: propertyQualificationData = [] } = useQuery({
    queryKey: ['property-qualification-metrics', startDate, endDate],
    queryFn: () => getQualificationUpdateMetrics(startDate, endDate),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar métricas" />;
  if (!data) return <NoContentCard title="Nenhuma métrica no período selecionado" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={(value) => setPeriod(value as PeriodOption)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30_days">Últimos 30 Dias</SelectItem>
            <SelectItem value="90_days">Últimos 90 Dias</SelectItem>
            <SelectItem value="current_year">Ano Atual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatusCard
          title="Novos Imóveis"
          description="Captados no período selecionado"
          value={String(data.newPropertiesCount)}
          icon={TrendingUp}
        />

        <StatusCard
          title="Imóveis Saídos"
          description="Saídas registradas no período"
          value={String(data.exitedPropertiesCount)}
          icon={TrendingDown}
        />

        <StatusCard
          title="Média de Valores"
          description="Ticket médio das captações"
          value={formatValue(data.averagePrice)}
          icon={ChartColumn}
        />
      </div>

      {data.topPropertyStatuses.length <= 0 ? (
        <NoContentCard title="Nenhum status de imóvel disponível" icon={Building2} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Status dos Imóveis</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {data.topPropertyStatuses.map((propertyStatusItem) => {
              const colors = getPropertyStatusColors(propertyStatusItem.status);
              const label = getPropertyStatusLabel(propertyStatusItem.status);

              return (
                <div
                  key={propertyStatusItem.status}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 justify-between w-full px-4 py-2 rounded-lg ${colors.bg} ${colors.bgDark}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`hidden sm:flex w-2 h-2 rounded-full ${colors.light}`} />
                    <div>
                      <TypographySmall>{label}</TypographySmall>
                      <TypographyMuted>{formatValue(propertyStatusItem.totalValue)} em carteira</TypographyMuted>
                    </div>
                  </div>

                  <TypographySmall>{propertyStatusItem.count}</TypographySmall>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <CapSituationChart data={data.captationStatusSummary} />
        <CapEvolutionChart data={data.monthlyCaptationSummary} />
        <AvailablePropertiesKpi
          data={data.topPropertyStatuses}
          totalCount={data.topPropertyStatuses.reduce((acc, item) => acc + item.count, 0)}
        />
        <UpdateTimeQualification qualifications={propertyQualificationData} />
      </div>
    </div>
  );
}
