import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { leadFunnelStepToLabel } from '@/shared/lib/utils';

import { UserDetails } from '@/features/dashboard/access-control/types';

const chartConfig = {
  value: { label: 'Conversões', color: '#FF6600' },
} satisfies ChartConfig;

interface FunnelChartProps {
  funnel: UserDetails['funnel'];
}

export function FunnelChart({ funnel }: FunnelChartProps) {
  const chartData = funnel.map((item) => ({
    label: leadFunnelStepToLabel(item.name),
    value: item.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart data={chartData} margin={{ bottom: 80 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="block">
                      {chartConfig.value.label}: {value}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="value" fill={chartConfig.value.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
