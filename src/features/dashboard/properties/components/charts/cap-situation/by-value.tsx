import { Cell, Pie, PieChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { CardContent, CardFooter } from '@/shared/components/ui/card';

import { formatValue } from '@/shared/lib/utils';

const COLORS = ['#FF6600', '#F97316', '#FACC15', '#6366F1', '#0EA5E9', '#22C55E'];

type ChartType = 'cap' | 'prep' | 'pub' | 'inNeg' | 'sold' | 'wit';

const chartData = [
  { type: 'cap', value: 6009434, color: COLORS[0], perc: '5% do total' },
  { type: 'prep', value: 10661679, color: COLORS[1], perc: '8,9% do total' },
  { type: 'pub', value: 51773014, color: COLORS[2], perc: '43,4% do total' },
  { type: 'inNeg', value: 32425378, color: COLORS[3], perc: '27,2% do total' },
  { type: 'sold', value: 10925784, color: COLORS[4], perc: '9,2% do total' },
  { type: 'wit', value: 7508810, color: COLORS[5], perc: '6,3% do total' },
];

const chartConfig = {
  cap: { label: 'Em captação' },
  prep: { label: 'Em preparação' },
  pub: { label: 'Publicado' },
  inNeg: { label: 'Em negociação' },
  sold: { label: 'Vendido' },
  wit: { label: 'Retirado' },
} satisfies ChartConfig;

export function ByValue() {
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
                      <span className="block">{chartConfig[name as ChartType].label}</span>
                      <small>{formatValue(Number(value))}</small>
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
              <TypographySmall>{formatValue(data.value)}</TypographySmall>
              <TypographyMuted className="text-xs">{data.perc}</TypographyMuted>
            </div>
          </div>
        ))}
      </CardFooter>
    </>
  );
}
