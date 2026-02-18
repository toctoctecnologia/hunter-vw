import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, MoreHorizontal } from 'lucide-react';

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

import { getLeadsPorFonte, LeadsPorFonteItem } from '@/services/dashboard';

interface CardLeadsPorFonteProps {
  orgId?: string;
  userScope?: string;
}

export const CardLeadsPorFonte = ({ orgId, userScope }: CardLeadsPorFonteProps) => {
  const [days, setDays] = useState(7);

  const { data, isLoading, isError } = useQuery<LeadsPorFonteItem[]>({
    queryKey: ['leads-por-fonte', days, orgId, userScope],
    queryFn: () => getLeadsPorFonte(days, orgId, userScope),
  });

  const chartData = (data ?? [])
    .map((d) => ({ ...d }))
    .sort((a, b) => b.value - a.value);

  const total = chartData.reduce((acc, d) => acc + d.value, 0);

  const dataWithPercent = chartData.map((d) => ({
    ...d,
    percent: total ? (d.value / total) * 100 : 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { fonte, value, percent } = payload[0].payload as any;
      return (
        <div className="rounded-md border bg-background p-2 text-xs shadow-sm">
          {`${fonte}: ${value} (${percent.toFixed(1)}%)`}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Leads Recebidos por Fonte</CardTitle>
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
        <div className="h-80">
          {isLoading && <Skeleton className="h-full w-full" />}
          {isError && (
            <Alert
              variant="destructive"
              className="h-full flex items-center justify-center"
            >
              Não foi possível carregar os dados. Tentar novamente
            </Alert>
          )}
          {!isLoading && !isError && dataWithPercent.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados no período selecionado
            </div>
          )}
          {!isLoading && !isError && dataWithPercent.length > 0 && (
            <ChartContainer
              config={{ value: { label: 'Leads recebidos', color: 'hsl(var(--primary))' } }}
              className="h-full w-full"
            >
              <BarChart data={dataWithPercent} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="fonte" type="category" width={100} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Leads recebidos</p>
      </CardContent>
    </Card>
  );
};
