import { Cell, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';

const COLORS = ['#FF6600', '#F97316', '#FACC15', '#6366F1', '#0EA5E9'];

type ChartType = 'installed' | 'requested' | 'pending' | 'noAuth' | 'notNecess';

const chartData = [
  { type: 'installed', value: 26, color: COLORS[0], perc: '37,7% da base' },
  { type: 'requested', value: 12, color: COLORS[1], perc: '17,4% da base' },
  { type: 'pending', value: 12, color: COLORS[2], perc: '17,4% da base' },
  { type: 'noAuth', value: 12, color: COLORS[3], perc: '17,4% da base' },
  { type: 'notNecess', value: 7, color: COLORS[4], perc: '10,1% da base' },
];

const chartConfig = {
  installed: { label: 'Instalada' },
  requested: { label: 'Solicitada' },
  pending: { label: 'Pendente' },
  noAuth: { label: 'Sem autorização' },
  notNecess: { label: 'Não necessária' },
} satisfies ChartConfig;

export function InstalledBoardsChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Placas instaladas</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div>
                      <span className="block">{chartConfig[name as ChartType].label}</span>
                      <small>
                        {value} {(value as number) > 1 ? 'Imóveis' : 'Imóvel'}
                      </small>
                    </div>
                  )}
                />
              }
            />
            <Pie data={chartData} dataKey="value" nameKey="type" innerRadius={60} paddingAngle={4}>
              {chartData.map(({ color }, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {chartData.map((data) => (
          <div key={data.type} className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
              <TypographySmall>{chartConfig[data.type as ChartType].label}</TypographySmall>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <TypographySmall>{data.value}</TypographySmall>
              <TypographyMuted className="text-xs">{data.perc}</TypographyMuted>
            </div>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
