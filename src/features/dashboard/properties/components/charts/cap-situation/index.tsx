import { useState } from 'react';

import { PropertyMetricCaptationStatusSummaryItem } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { ByVolume } from '@/features/dashboard/properties/components/charts/cap-situation/by-volume';
import { ByValue } from '@/features/dashboard/properties/components/charts/cap-situation/by-value';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface CapSituationChartProps {
  data?: PropertyMetricCaptationStatusSummaryItem[];
}

export function CapSituationChart({ data }: CapSituationChartProps) {
  const [mode, setMode] = useState<'volume' | 'value'>('volume');

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0 flex gap-4 items-center justify-between w-full">
        <CardTitle>Situação das captações</CardTitle>

        <div
          role="group"
          aria-label="Alternar exibição do gráfico de situação"
          className="inline-flex items-center gap-px rounded-full bg-zinc-100 dark:bg-zinc-800 p-1"
        >
          <button
            type="button"
            onClick={() => setMode('volume')}
            className={cn(
              'rounded-full px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              mode === 'volume' && 'bg-white dark:bg-zinc-900 shadow-sm',
            )}
          >
            Volume
          </button>

          <button
            type="button"
            onClick={() => setMode('value')}
            disabled
            className={cn(
              'rounded-full px-2 py-1 opacity-10 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              mode === 'value' && 'bg-white dark:bg-zinc-900 shadow-sm',
            )}
          >
            Valor
          </button>
        </div>
      </CardHeader>

      {mode === 'value' ? <ByValue /> : <ByVolume data={data} />}
    </Card>
  );
}
