import { useState } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { LineChart, MoreHorizontal } from 'lucide-react';

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

import { getLeadsPorVendedor, LeadsPorVendedorItem } from '@/services/dashboard';

interface CardLeadsPorVendedorProps {
  orgId?: string;
}

export const CardLeadsPorVendedor = ({ orgId }: CardLeadsPorVendedorProps) => {
  const [days, setDays] = useState(7);

  const { data, isLoading, isError } = useQuery<LeadsPorVendedorItem[]>({
    queryKey: ['leads-por-vendedor', days, orgId],
    queryFn: () => getLeadsPorVendedor(days, orgId),
  });

  const chartData = (data ?? [])
    .map((d) => ({ ...d }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { nome, value } = payload[0].payload as any;
      return (
        <div className="rounded-md border bg-background p-2 text-xs shadow-sm">
          {`${nome} — Leads recebidos: ${value}`}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Leads Recebidos por Vendedor</CardTitle>
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
          {!isLoading && !isError && chartData.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Sem dados no período selecionado
            </div>
          )}
          {!isLoading && !isError && chartData.length > 0 && (
            <ChartContainer
              config={{ value: { label: 'Leads recebidos', color: '#ea580c' } }}
              className="h-full w-full"
            >
              <RechartsLineChart data={chartData} margin={{ left: 12, right: 12 }}>
                <XAxis
                  dataKey="nome"
                  tick={{ textAnchor: 'end', fontSize: 12 }}
                  height={60}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Leads recebidos" stroke="var(--color-value)" dot />
              </RechartsLineChart>
            </ChartContainer>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Leads recebidos</p>
      </CardContent>
    </Card>
  );
};

