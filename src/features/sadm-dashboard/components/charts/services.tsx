import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { formatValue } from '@/shared/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { ArrowUp } from 'lucide-react';

type ChartType = 'curr' | 'before';

const chartData = [
  { month: 'Janeiro', curr: 150000, before: 120000 },
  { month: 'Fevereiro', curr: 170000, before: 180000 },
  { month: 'Março', curr: 190000, before: 150000 },
  { month: 'Abril', curr: 200000, before: 120000 },
  { month: 'Maio', curr: 210000, before: 110000 },
  { month: 'Junho', curr: 230000, before: 100000 },
  { month: 'Julho', curr: 180000, before: 170000 },
  { month: 'Agosto', curr: 250000, before: 240000 },
  { month: 'Setembro', curr: 150000, before: 170000 },
  { month: 'Outubro', curr: 320000, before: 220000 },
  { month: 'Novembro', curr: 270000, before: 230000 },
  { month: 'Dezembro', curr: 180000, before: 240000 },
];

const chartConfig = {
  curr: { label: 'Atual' },
  before: { label: 'Anterior' },
} satisfies ChartConfig;

const formatYAxisValue = (value: number): string => {
  if (value === 0) return 'R$ 0k';

  if (value <= 100000) {
    const kValue = Math.round(value / 1000);
    return `R$ ${kValue}k`;
  }

  if (value <= 1000000) {
    if (value < 1000000) {
      const kValue = Math.round(value / 1000);
      return `R$ ${kValue}k`;
    } else {
      return 'R$ 1kk';
    }
  }

  const kkValue = Math.round(value / 1000000);
  return `R$ ${kkValue}kk`;
};

export function ServicesChart() {
  const allValues = chartData.flatMap((item) => [item.curr, item.before]);
  const domainMax = Math.max(...allValues);
  const nonNegativeMax = Math.max(0, domainMax);
  const magnitude = nonNegativeMax > 0 ? Math.pow(10, Math.floor(Math.log10(nonNegativeMax))) : 1;
  const step = magnitude;
  const lastTick = nonNegativeMax > 0 ? Math.ceil(nonNegativeMax / step) * step : step;
  const absoluteTicks: number[] = Array.from({ length: Math.floor(lastTick / step) + 1 }, (_, i) => i * step);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0 flex flex-col gap-4 w-full">
        <CardTitle>Venda de serviços</CardTitle>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
          <div className="flex flex-col gap-1">
            <TypographyMuted>Vendas totais</TypographyMuted>
            <strong className="md:text-2xl lg:text-3xl">{formatValue(421421421)}</strong>
            <div className="flex items-center gap-1">
              <ArrowUp className="size-3 text-green-700" />
              <TypographySmall className="text-green-700">+10.50% comparado ao último ano</TypographySmall>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF6600' }} />
              <TypographySmall>Ano atual</TypographySmall>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />
              <TypographySmall>Ano passado</TypographySmall>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0 max-h-[300px]">
        <ChartContainer config={chartConfig} className="w-full h-[300px] aspect-auto">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              type="number"
              tickLine={false}
              domain={[0, lastTick]}
              ticks={absoluteTicks}
              tickFormatter={formatYAxisValue}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="block">
                          {formatValue(Number(value))} | {chartConfig[name as ChartType].label}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Line dataKey="curr" stroke="#FF6600" strokeWidth={2} />
            <Line dataKey="before" stroke="#6366F1" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
