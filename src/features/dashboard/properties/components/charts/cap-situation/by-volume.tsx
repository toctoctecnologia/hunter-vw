import { Cell, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { CardContent, CardFooter } from '@/shared/components/ui/card';
import { getCaptationStatusColor, getCaptationStatusLabel } from '@/shared/lib/captation-status';
import { PropertyMetricCaptationStatusSummaryItem } from '@/shared/types';

interface ByVolumeProps {
  data?: PropertyMetricCaptationStatusSummaryItem[];
}

export function ByVolume({ data }: ByVolumeProps) {
  if (!data || data.length === 0) {
    return (
      <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-2">
          <TypographySmall className="text-muted-foreground">Sem dados disponíveis</TypographySmall>
          <TypographyMuted className="text-xs">
            Nenhuma informação de captação foi encontrada para o período selecionado
          </TypographyMuted>
        </div>
      </CardContent>
    );
  }

  const chartData = data.map((item) => ({
    status: item.status,
    count: item.count,
    percentage: item.percentage,
    color: getCaptationStatusColor(item.status),
    label: getCaptationStatusLabel(item.status),
  }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.status] = { label: item.label };
    return acc;
  }, {} as Record<string, { label: string }>) satisfies ChartConfig;

  return (
    <>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div>
                      <span className="block">{chartConfig[name as string]?.label || name}</span>
                      <small>{value}</small>
                    </div>
                  )}
                />
              }
            />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} paddingAngle={4}>
              {chartData.map((item, index) => (
                <Cell key={index} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {chartData.map((item) => (
          <div key={item.status} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <TypographySmall>{item.label}</TypographySmall>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <TypographySmall>{item.count}</TypographySmall>
              <TypographyMuted className="text-xs">{item.percentage.toFixed(1)}% do total</TypographyMuted>
            </div>
          </div>
        ))}
      </CardFooter>
    </>
  );
}
