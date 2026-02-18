'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, TrendingUp, Users, Send, Package } from 'lucide-react';

import { SaleActionDetailParticipantStatus } from '@/shared/types';

import { getSaleAction } from '@/features/dashboard/distribution/api/sale-action';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BackHeader } from '@/features/dashboard/components/back-header';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { StatusCard } from '@/shared/components/StatusCard';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';

export default function Page() {
  const params = useParams();
  const actionId = params.actionId as string;

  const { data: action, isLoading } = useQuery({
    queryKey: ['sale-action', actionId],
    queryFn: () => getSaleAction(actionId),
    enabled: !!actionId,
  });

  if (isLoading) {
    return (
      <>
        <BackHeader title="Detalhes da Ação de Venda" />
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </>
    );
  }

  if (!action) {
    return (
      <>
        <BackHeader title="Detalhes da Ação de Venda" />
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Ação de venda não encontrada</p>
          </CardContent>
        </Card>
      </>
    );
  }

  const engagementRate = action.totalUsers > 0 ? Math.round((action.activeUsers / action.totalUsers) * 100) : 0;

  const activeParticipants = action.participants.filter(
    (p) => p.status === SaleActionDetailParticipantStatus.ACTIVE,
  ).length;

  const inactiveParticipants = action.participants.filter(
    (p) => p.status === SaleActionDetailParticipantStatus.INACTIVE,
  ).length;

  return (
    <>
      <BackHeader title="Detalhes da Ação de Venda" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{action.queueName}</CardTitle>
                <Badge variant={action.inProgress ? 'default' : 'outline'} className="w-fit">
                  {action.inProgress ? 'Em andamento' : 'Finalizado'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{action.queueDescription}</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <TypographyMuted className="text-xs">Data de Início</TypographyMuted>
                <p className="text-lg font-semibold">{format(new Date(action.startDate), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <TypographyMuted className="text-xs">Data de Término</TypographyMuted>
                <p className="text-lg font-semibold">
                  {action.endDate ? format(new Date(action.endDate), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <TypographyMuted className="text-xs">Última Atualização</TypographyMuted>
                <p className="text-lg font-semibold">
                  {action.updatedAt ? format(new Date(action.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </p>
              </div>
              <div>
                <TypographyMuted className="text-xs">UUID da Fila</TypographyMuted>
                <p className="text-sm font-mono text-muted-foreground">{action.queueUuid.slice(0, 8)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="Total de Usuários"
            description="Participantes cadastrados"
            icon={Users}
            value={String(action.totalUsers)}
          />
          <StatusCard
            title="Usuários Ativos"
            description="Participantes engajados"
            icon={CheckCircle2}
            value={String(action.activeUsers)}
          />
          <StatusCard
            title="Ofertas Enviadas"
            description="Total de notificações"
            icon={Send}
            value={String(action.offersSent)}
          />
          <StatusCard
            title="Leads Distribuídos"
            description="Total distribuído"
            icon={Package}
            value={String(action.leadsDistributed)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Análise de Engajamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Taxa de Engajamento dos Usuários</p>
                  <p className="text-xs text-muted-foreground">
                    {action.activeUsers} de {action.totalUsers} usuários ativos
                  </p>
                </div>
                <span className="text-2xl font-bold">{engagementRate}%</span>
              </div>
              <Progress value={engagementRate} className="h-3" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <TypographyMuted className="text-xs">Participantes Ativos</TypographyMuted>
                </div>
                <p className="text-2xl font-bold">{activeParticipants}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <TypographyMuted className="text-xs">Participantes Inativos</TypographyMuted>
                </div>
                <p className="text-2xl font-bold">{inactiveParticipants}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <TypographyMuted className="text-xs">Média de Engajamento</TypographyMuted>
                </div>
                <p className="text-2xl font-bold">
                  {action.participants.length > 0
                    ? Math.round(
                        action.participants.reduce((acc, p) => acc + p.engagementPercent, 0) /
                          action.participants.length,
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participantes da Ação</CardTitle>
          </CardHeader>
          <CardContent>
            {action.participants.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ofertas Recebidas</TableHead>
                      <TableHead className="text-center">Distribuições</TableHead>
                      <TableHead className="text-center">Engajamento</TableHead>
                      <TableHead>Última Atualização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {action.participants.map((participant) => (
                      <TableRow key={participant.userUuid}>
                        <TableCell className="font-medium">{participant.name}</TableCell>
                        <TableCell className="text-muted-foreground">{participant.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              participant.status === SaleActionDetailParticipantStatus.ACTIVE ? 'default' : 'outline'
                            }
                          >
                            {participant.status === SaleActionDetailParticipantStatus.ACTIVE ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{participant.offersReceived}</TableCell>
                        <TableCell className="text-center font-semibold">{participant.distributions}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={participant.engagementPercent} className="h-2 w-16" />
                            <span className="text-sm font-medium">{participant.engagementPercent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {participant.lastUpdate
                            ? format(new Date(participant.lastUpdate), 'dd/MM/yyyy HH:mm')
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum participante encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
