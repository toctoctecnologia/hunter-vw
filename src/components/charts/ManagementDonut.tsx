import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

const numberFormatter = new Intl.NumberFormat('pt-BR');
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

export const MANAGEMENT_DONUT_COLORS = {
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444'
} as const;

export interface ManagementDonutDatum {
  id: string;
  name: string;
  value: number;
  color: string;
  configKey?: string;
  ariaLabel?: string;
  [key: string]: unknown;
}

interface ManagementDonutProps<T extends ManagementDonutDatum> {
  data: T[];
  onSliceClick?: (item: T) => void;
  className?: string;
  tooltipLabelKey?: ComponentProps<typeof ChartTooltipContent>['labelKey'];
  tooltipFormatter?: ComponentProps<typeof ChartTooltip>['formatter'];
}

export function ManagementDonut<T extends ManagementDonutDatum>({
  data,
  onSliceClick,
  className,
  tooltipLabelKey = 'name',
  tooltipFormatter
}: ManagementDonutProps<T>) {
  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data]);

  const chartConfig = useMemo(
    () =>
      data.reduce<Record<string, { label: string; color: string }>>((acc, item) => {
        const key = item.configKey ?? item.id;
        acc[key] = { label: item.name, color: item.color };
        return acc;
      }, {}),
    [data]
  );

  return (
    <ChartContainer config={chartConfig} className={cn('h-[200px] w-[200px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            dataKey="value"
            onClick={entry => {
              if (!onSliceClick) {
                return;
              }

              const payload = entry?.payload as T | undefined;
              if (payload) {
                onSliceClick(payload);
              }
            }}
            className={cn(onSliceClick ? 'cursor-pointer' : undefined)}
          >
            {data.map(item => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const ariaLabel =
                item.ariaLabel ??
                `${item.name}: ${numberFormatter.format(item.value)} (${percentFormatter.format(percentage)}%)`;

              return <Cell key={item.id} fill={item.color} aria-label={ariaLabel} />;
            })}
          </Pie>
          <ChartTooltip
            content={<ChartTooltipContent labelKey={tooltipLabelKey} />}
            formatter={tooltipFormatter}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default ManagementDonut;
