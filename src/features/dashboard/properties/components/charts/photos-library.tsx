import { Cell, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';

const COLORS = ['#FF6600', '#F97316', '#FACC15', '#6366F1'];

type ChartType = 'pCompleted' | 'pToUpdate' | 'pWaiting' | 'pUnUpdated';

const chartData = [
  { type: 'pCompleted', value: 33, color: COLORS[0], perc: '47,8% da base' },
  { type: 'pToUpdate', value: 17, color: COLORS[1], perc: '24,6% da base' },
  { type: 'pWaiting', value: 11, color: COLORS[2], perc: '15,9% da base' },
  { type: 'pUnUpdated', value: 8, color: COLORS[3], perc: '11,6% da base' },
];

const chartConfig = {
  pCompleted: { label: 'Biblioteca completa' },
  pToUpdate: { label: 'Atualizar fotos' },
  pWaiting: { label: 'Aguardando fotos' },
  pUnUpdated: { label: 'Fotos desatualizadas' },
} satisfies ChartConfig;

export function PhotosLibraryChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Biblioteca de fotos</CardTitle>
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
