import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

import { Record, SaleActionItem } from '@/shared/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { NoContentCard } from '@/shared/components/no-content-card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Progress } from '@/shared/components/ui/progress';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';

interface ActionsListProps {
  isLoading: boolean;
  actionsData: Record<SaleActionItem>;
}

export function ActionsList({ isLoading, actionsData }: ActionsListProps) {
  const router = useRouter();

  const handleViewDetails = (actionUuid: string) => {
    router.push(`/dashboard/distribution/sale-action/${actionUuid}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ações de Vendas</h3>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {actionsData?.content && actionsData.content.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {actionsData.content.map((action) => (
                <Card key={action.uuid}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{action.queueName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={action.inProgress ? 'default' : 'outline'}>
                            {action.inProgress ? 'Em andamento' : 'Finalizado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{action.queueDescription}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TypographyMuted className="text-xs">Data de Início</TypographyMuted>
                        <p className="text-sm font-medium">{format(new Date(action.startDate), 'dd/MM/yyyy')}</p>
                      </div>
                      <div>
                        <TypographyMuted className="text-xs">Data de Fim</TypographyMuted>
                        <p className="text-sm font-medium">
                          {action.endDate ? format(new Date(action.endDate), 'dd/MM/yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <TypographyMuted className="text-xs">Usuários Ativos</TypographyMuted>
                        <p className="text-2xl font-bold">
                          {action.activeUsers}/{action.totalUsers}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <TypographyMuted className="text-xs">Ofertas Enviadas</TypographyMuted>
                        <p className="text-2xl font-bold">{action.offersSent}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <TypographyMuted className="text-xs">Leads Distribuídos</TypographyMuted>
                        <p className="text-2xl font-bold">{action.leadsDistributed}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <TypographyMuted className="text-xs">Última Atualização</TypographyMuted>
                        <p className="text-sm font-bold">{format(new Date(action.updatedAt), 'dd/MM/yyyy')}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <TypographyMuted className="text-sm">Engajamento dos Usuários</TypographyMuted>
                        <span className="text-sm font-semibold">
                          {action.totalUsers > 0 ? Math.round((action.activeUsers / action.totalUsers) * 100) : 0}%
                        </span>
                      </div>
                      <Progress
                        value={action.totalUsers > 0 ? (action.activeUsers / action.totalUsers) * 100 : 0}
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(action.uuid)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <NoContentCard title="Nenhuma ação de vendas encontrada" />
          )}
        </>
      )}
    </div>
  );
}
