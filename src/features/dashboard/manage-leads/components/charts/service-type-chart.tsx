'use client';

import { Cell, Pie, PieChart } from 'recharts';

import { leadServiceTypeConfig } from '@/shared/lib/utils';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AttendanceType, LeadOriginType } from '@/shared/types';

interface LeadServiceTypeChartProps {
  data: AttendanceType[];
}

export function LeadServiceTypeChart({ data }: LeadServiceTypeChartProps) {
  const groupedData = data.reduce((acc, item) => {
    const serviceType = item.type === LeadOriginType.VITRINE ? 'presencial' : 'online';
    acc[serviceType] = (acc[serviceType] || 0) + item.count;
    return acc;
  }, {} as Record<string, number>);

  const chartConfig: ChartConfig = {
    online: { label: leadServiceTypeConfig.online.label },
    presencial: { label: leadServiceTypeConfig.presencial.label },
  };

  const chartData = Object.entries(groupedData).map(([type, value]) => ({
    type,
    value,
    color: leadServiceTypeConfig[type]?.color || '#888888',
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Tipo de atendimento</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const config = leadServiceTypeConfig[name as string];
                    return (
                      <div>
                        <span className="block">{config?.label || name}</span>
                        <small>
                          {value} {(value as number) > 1 ? 'leads' : 'lead'}
                        </small>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie data={chartData} dataKey="value" nameKey="type" paddingAngle={0}>
              {chartData.map(({ color }, index) => (
                <Cell key={index} fill={color} className="cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
