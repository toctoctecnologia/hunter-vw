import { Share2, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LeadManageConversionMetrics } from '@/shared/types';
import { LeadOriginTypeToLabel } from '@/shared/lib/utils';

interface ConversionChannelsProps {
  channels: LeadManageConversionMetrics[];
}

export function ConversionChannels({ channels }: ConversionChannelsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Canais de Conversão
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {channels.map((channel, index) => {
          return (
            <div key={channel.originType} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/20">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold">{LeadOriginTypeToLabel(channel.originType)}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{channel.conversionRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Total de Leads</p>
                  <p className="text-2xl font-bold">{channel.totalLeads}</p>
                </div>

                <div className="mx-4 h-12 w-px bg-border" />

                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Conversões</p>
                  <p className="text-2xl font-bold text-primary">{channel.convertedLeads}</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${channel.conversionRate}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
