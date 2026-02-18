import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { getPropertyStatusColors, getPropertyStatusLabel } from '@/shared/lib/property-status';
import { formatValue } from '@/shared/lib/utils';
import { PropertyMetricTopPropertyStatusesItem } from '@/shared/types';

interface AvailablePropertiesKpiProps {
  data: PropertyMetricTopPropertyStatusesItem[];
  totalCount: number;
}

export function AvailablePropertiesKpi({ data, totalCount }: AvailablePropertiesKpiProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0 flex flex-col w-full gap-4">
        <CardTitle>Imóveis disponíveis</CardTitle>

        <div className="space-y-1">
          <p className="text-3xl font-semibold">{totalCount}</p>
          <TypographyMuted>Ativos no período selecionado</TypographyMuted>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4" role="list" aria-label="Distribuição por status de disponibilidade">
          {data.map((propertyStatusItem) => {
            const colors = getPropertyStatusColors(propertyStatusItem.status);
            const label = getPropertyStatusLabel(propertyStatusItem.status);
            const width = Math.max(0, Math.min(100, propertyStatusItem.percentage));

            return (
              <div key={propertyStatusItem.status} role="listitem">
                <div className="flex items-center justify-between text-sm font-medium">
                  <TypographySmall>{label}</TypographySmall>

                  <TypographySmall>
                    {propertyStatusItem.count}
                    <TypographyMuted> ({propertyStatusItem.percentage.toFixed(1)}%)</TypographyMuted>
                  </TypographySmall>
                </div>

                <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className={`h-2 rounded-full ${colors.light}`} style={{ width: `${width}%` }} />
                </div>

                <TypographyMuted className="mt-1">
                  {formatValue(propertyStatusItem.totalValue)} em carteira
                </TypographyMuted>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
