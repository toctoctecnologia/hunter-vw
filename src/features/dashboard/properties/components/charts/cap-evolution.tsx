import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';

import type { PropertyMetricCaptationSummaryItem } from '@/shared/types';
import { MONTH_NAMES } from '@/shared/constants';

type ChartType = 'captatedCount' | 'soldCount';

interface CapEvolutionChartProps {
  data: PropertyMetricCaptationSummaryItem[];
}

const chartConfig = { captatedCount: { label: 'Captados' }, soldCount: { label: 'Vendidos' } } satisfies ChartConfig;

export function CapEvolutionChart({ data }: CapEvolutionChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((item) => ({
        month: MONTH_NAMES[item.month - 1],
        captatedCount: item.captatedCount,
        soldCount: item.soldCount,
      }))
      .sort((a, b) => {
        const aIndex = MONTH_NAMES.indexOf(a.month);
        const bIndex = MONTH_NAMES.indexOf(b.month);
        return aIndex - bIndex;
      });
  }, [data]);

  const { domainMax, absoluteTicks } = useMemo(() => {
    const allValues = chartData.flatMap((item) => [item.captatedCount, item.soldCount]);
    const max = Math.max(...allValues);
    const nonNegativeMax = Math.max(0, max);
    const magnitude = nonNegativeMax > 0 ? Math.pow(10, Math.floor(Math.log10(nonNegativeMax))) : 1;
    const step = magnitude;
    const lastTick = nonNegativeMax > 0 ? Math.ceil(nonNegativeMax / step) * step : step;
    const ticks: number[] = Array.from({ length: Math.floor(lastTick / step) + 1 }, (_, i) => i * step);

    return { domainMax: lastTick, absoluteTicks: ticks };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-0 flex gap-4 items-center justify-between w-full">
          <CardTitle>Evolução das captações</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 min-h-[300px] flex items-center justify-center">
          <TypographyMuted>Nenhum dado disponível para o período selecionado</TypographyMuted>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0 flex gap-4 items-center justify-between w-full">
        <CardTitle>Evolução das captações</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0 max-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-[300px] aspect-auto">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis type="number" tickLine={false} domain={[0, domainMax]} ticks={absoluteTicks} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    return (
                      <span className="block">
                        {chartConfig[name as ChartType].label}: {value}
                      </span>
                    );
                  }}
                />
              }
            />
            <Bar dataKey="captatedCount" fill="#FF6600" radius={4} />
            <Bar dataKey="soldCount" fill="#6366F1" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6600' }} />

          <div>
            <TypographySmall>Captados</TypographySmall>
            <TypographyMuted>
              Total de imóveis captados no mês. Valores exibidos representam quantidade de unidades.
            </TypographyMuted>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />

          <div>
            <TypographySmall>Vendidos</TypographySmall>
            <TypographyMuted>
              Quantidade de imóveis vendidos no período. Inclui todas as vendas finalizadas.
            </TypographyMuted>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
