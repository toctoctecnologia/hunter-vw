import { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { PieChart, MoreHorizontal } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PeriodSelect } from '@/components/dashboard/PeriodSelect';
import { ChartContainer } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';

import {
  getArquivadosPorCanal,
  ArquivadosPorCanalItem,
} from '@/services/dashboard';

interface CardLeadsArquivadosPorCanalProps {
  orgId?: string;
}

export const CardLeadsArquivadosPorCanal = ({
  orgId,
}: CardLeadsArquivadosPorCanalProps) => {
  const [days, setDays] = useState(7);

  const { data, isLoading, isError } = useQuery<ArquivadosPorCanalItem[]>({
    queryKey: ['arquivados-por-canal', days, orgId],
    queryFn: () => getArquivadosPorCanal(days, orgId),
  });

  const chartData = (data ?? [])
    .map((d) => ({ ...d }))
    .sort((a, b) => b.total - a.total);

  const totalGeral = chartData.reduce((acc, d) => acc + d.total, 0);

  const dataWithPercent = chartData.map((d, idx) => ({
    ...d,
    percent: totalGeral ? Math.round((d.total / totalGeral) * 100) : 0,
    key: `canal-${idx}`,
  }));

  const COLORS = [
    '#ea580c',
    'hsl(var(--accentSoft))',
    '#fb923c',
    '#fdba74',
    '#fed7aa',
    '#ffedd5',
    '#fff7ed',
    '#c2410c',
    '#9a3412',
    '#7c2d12',
  ];

  const chartConfig = dataWithPercent.reduce(
    (acc, curr, idx) => ({
      ...acc,
      [curr.key]: { label: curr.canal, color: COLORS[idx % COLORS.length] },
    }),
    {}
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { canal, total, percent } = payload[0].payload as any;
      return (
        <div className="rounded-md border bg-background p-2 text-xs shadow-sm">
          {`${canal}: ${total} (${percent}%)`}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Leads Arquivados por Canal
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <PeriodSelect value={days} onChange={setDays} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Abrir menu de opções"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" aria-label="Opções">
              <DropdownMenuItem>Detalhes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-80">
          {isLoading && <Skeleton className="h-full w-full" />}
          {isError && (
            <Alert
              variant="destructive"
              className="h-full w-full flex items-center justify-center"
            >
              Não foi possível carregar os dados. Tentar novamente
            </Alert>
          )}
          {!isLoading && !isError && dataWithPercent.length === 0 && (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Sem dados no período selecionado
            </div>
          )}
          {!isLoading && !isError && dataWithPercent.length > 0 && (
            <>
              <ChartContainer
                config={chartConfig}
                className="h-full flex-1"
              >
                <RechartsPieChart>
                  <Pie
                    data={dataWithPercent}
                    dataKey="total"
                    nameKey="canal"
                    innerRadius={60}
                    labelLine={false}
                    label={({ payload }) => `${payload.percent}%`}
                  >
                    {dataWithPercent.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={`var(--color-${entry.key})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPieChart>
              </ChartContainer>
              <div className="ml-4 flex flex-col justify-center text-xs">
                {dataWithPercent.map((entry) => (
                  <div key={entry.key} className="mb-1 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: `var(--color-${entry.key})` }}
                    />
                    <span className="text-muted-foreground">{entry.canal}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Leads arquivados</p>
      </CardContent>
    </Card>
  );
};

