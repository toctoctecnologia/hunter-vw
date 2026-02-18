'use client';

import { ThumbsUp } from 'lucide-react';

import type { RoulleteRankingUserItem } from '@/shared/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Loading } from '@/shared/components/loading';

interface RotaryRankingAssumedProps {
  brokers: RoulleteRankingUserItem[];
  isLoading: boolean;
}

export function RotaryRankingAssumed({ brokers, isLoading }: RotaryRankingAssumedProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 text-green-600" />
          Leads Assumidos (Roletão / Próximo da Fila)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        ) : brokers.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum dado disponível para o período selecionado
          </div>
        ) : (
          <div className="space-y-3">
            {brokers.map((broker, index) => (
              <div
                key={broker.userUuid}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                        {getInitials(broker.userName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{broker.userName}</span>
                    <span className="text-sm text-muted-foreground">{broker.catchCount} leads assumidos</span>
                  </div>
                </div>
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewLeads(broker)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ver Leads
                </Button> */}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
