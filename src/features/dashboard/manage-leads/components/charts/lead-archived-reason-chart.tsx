'use client';

import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { ChartArea } from 'lucide-react';

import { getGradientColor } from '@/shared/lib/utils';

import { getArchivedByReasonMetrics } from '@/features/dashboard/manage-leads/api/dashboard';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { Loading } from '@/shared/components/loading';

export function LeadArchivedReasonChart() {
  const [daysFilter, setDaysFilter] = useState<string>('7');

  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(subDays(new Date(), parseInt(daysFilter)), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    }),
    [daysFilter],
  );

  const { data, isLoading } = useQuery({
    queryKey: ['archived-by-reason-metrics', startDate, endDate],
    queryFn: () => getArchivedByReasonMetrics(startDate, endDate),
  });

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((item, index) => ({
      type: index.toString(),
      value: item.count,
      color: getGradientColor(item?.percentage || 0),
      percentage: item?.percentage || 0,
    }));
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leads Arquivados por Motivo</CardTitle>
          <Select value={daysFilter} onValueChange={setDaysFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="15">15 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <Loading />
        ) : !data || data.length === 0 ? (
          <NoContentCard title="Nenhum dado disponível para o período selecionado" icon={ChartArea} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px] w-full">
              <PieChart width={300} height={300}>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const metric = data[Number(name)];
                        return (
                          <div>
                            <span className="block font-medium">{metric.reason}</span>
                            <small className="text-muted-foreground">
                              {value} {(value as number) > 1 ? 'leads' : 'lead'} ({metric?.percentage?.toFixed(1)}%)
                            </small>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={60}
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={0}
                >
                  {chartData.map(({ color }, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <div key={item.reasonUuid} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getGradientColor(item.percentage) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.reason}</p>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{item?.percentage?.toFixed()}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
