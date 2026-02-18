import { TrendingUp, Clock, Zap } from 'lucide-react';
import { formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { LeadManagePerformanceMetrics } from '@/shared/types';

interface MetricsProps {
  data: LeadManagePerformanceMetrics;
}

export function Metrics({ data }: MetricsProps) {
  const conversionTimeDiff = data.averageTimeToClose * 1000;
  const avgConversionTime = formatDistanceStrict(0, conversionTimeDiff, {
    locale: ptBR,
    addSuffix: false,
  });

  const firstInteractionTimeDiff = data.firstInteractionTime * 1000;
  const avgFirstInteractionTime = formatDistanceStrict(0, firstInteractionTimeDiff, {
    locale: ptBR,
    addSuffix: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Métricas de Performance
        </CardTitle>
      </CardHeader>

      <CardContent className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold">Taxa de Conversão</h3>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-primary">{data.conversionRate.toFixed(2)}%</p>
            <p className="mb-2 text-sm text-muted-foreground">dos leads</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Leads convertidos em vendas no período</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-base font-semibold">Tempo Médio de Conversão</h3>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-blue-500">{avgConversionTime}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tempo médio do primeiro contato até o fechamento</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500/20">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-base font-semibold">Tempo de Primeira Interação</h3>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-green-500">{avgFirstInteractionTime}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tempo médio para o primeiro contato após receber o lead</p>
        </div>
      </CardContent>
    </Card>
  );
}
