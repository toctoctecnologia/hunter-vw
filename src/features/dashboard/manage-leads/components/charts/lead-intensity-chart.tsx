'use client';

import { Cell, Pie, PieChart } from 'recharts';

import { LeadsDashboardThermometerItem } from '@/shared/types';

import { intensityConfig } from '@/shared/lib/utils';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface LeadIntensityChartProps {
  data: LeadsDashboardThermometerItem[];
}

export function LeadIntensityChart({ data }: LeadIntensityChartProps) {
  const chartConfig: ChartConfig = data.reduce(
    (acc, metric, index) => ({
      ...acc,
      [index]: { label: intensityConfig[metric.intensityType]?.label || metric.intensityType },
    }),
    {} as ChartConfig,
  );

  const chartData = data.map((metric, index) => ({
    type: index.toString(),
    value: metric.count,
    color: intensityConfig[metric.intensityType]?.color || '#888888',
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Termômetro</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const metric = data[Number(name)];
                    const config = intensityConfig[metric.intensityType];
                    return (
                      <div>
                        <span className="block">{config?.label || metric.intensityType}</span>
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
