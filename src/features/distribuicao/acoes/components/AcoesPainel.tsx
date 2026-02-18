import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, Search, Users, PauseCircle, PlayCircle, AlertTriangle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAcoesPainel } from '../hooks/useAcoesPainel';
import type { AcaoDistribuicao, AcaoStatus } from '../api';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const statusLabel: Record<AcaoStatus, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em andamento',
  pausada: 'Pausada',
  encerrada: 'Encerrada',
};

const statusBadge: Record<AcaoStatus, string> = {
  agendada: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  em_andamento: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  pausada: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  encerrada: 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
};

const tipoLabel: Record<AcaoDistribuicao['tipo'], string> = {
  checkin: 'Check-in',
  notificacao: 'Notificação',
  redistribuicao: 'Redistribuição',
};

interface NotificacaoState {
  aberta: boolean;
  acao?: AcaoDistribuicao;
  mensagem: string;
}

export function AcoesPainel() {
  const {
    acoes,
    metricas,
    filtros,
    carregando,
    carregandoMetricas,
    erro,
    atualizarStatus,
    enviarNotificacao,
    setFiltro,
    resetarFiltros,
    resumoFiltros,
    recarregar,
  } = useAcoesPainel();

  const [notificacao, setNotificacao] = useState<NotificacaoState>({ aberta: false, mensagem: '' });

  const progresso = useMemo(() => (acao: AcaoDistribuicao) => {
    if (!acao.entregasPrevistas) return 0;
    return Math.min(100, Math.round((acao.leadsDistribuidos / acao.entregasPrevistas) * 100));
  }, []);

  const handleStatusAction = (acao: AcaoDistribuicao) => {
    const proximoStatus: Record<AcaoStatus, AcaoStatus> = {
      agendada: 'em_andamento',
      em_andamento: 'pausada',
      pausada: 'em_andamento',
      encerrada: 'encerrada',
    };

    const destino = proximoStatus[acao.status];
    if (destino !== acao.status) {
      atualizarStatus(acao.id, destino);
    }
  };

  const handleEncerrar = (acao: AcaoDistribuicao) => {
    if (acao.status !== 'encerrada') {
      atualizarStatus(acao.id, 'encerrada');
    }
  };

  const abrirNotificacao = (acao: AcaoDistribuicao) => {
    setNotificacao({ aberta: true, acao, mensagem: `Olá! ${acao.titulo} acaba de ser atualizado. Confira o painel.` });
  };

  const enviarNotificacaoDialog = async () => {
    if (!notificacao.acao) return;
    await enviarNotificacao(notificacao.acao.id, notificacao.mensagem);
    setNotificacao({ aberta: false, mensagem: '', acao: undefined });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ações de Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento das rotinas de check-in, notificações e redistribuição para as ações de vendas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={recarregar} disabled={carregando}>
            <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
          </Button>
          <Button asChild>
            <Link to="/distribuicao/acoes/nova">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova ação de vendas
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-sm">
              <Label className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Busca</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filtros.busca}
                  onChange={event => setFiltro('busca', event.target.value)}
                  placeholder="Buscar ação de vendas por nome ou descrição"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Status</Label>
                <Select value={filtros.status} onValueChange={value => setFiltro('status', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="agendada">Agendadas</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="pausada">Pausadas</SelectItem>
                    <SelectItem value="encerrada">Encerradas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">Tipo</Label>
                <Select value={filtros.tipo} onValueChange={value => setFiltro('tipo', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="checkin">Check-in</SelectItem>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                    <SelectItem value="redistribuicao">Redistribuição</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" onClick={resetarFiltros} disabled={!resumoFiltros.ativo} className="w-full">
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>
          {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(carregandoMetricas || !metricas) &&
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}
        {metricas && !carregandoMetricas && (
          <>
            <MetricCard titulo="Ações de vendas monitoradas" valor={metricas.totalAcoes} descricao="Total configurado no período" />
            <MetricCard
              titulo="Ações de vendas em andamento"
              valor={metricas.ativas}
              descricao="Ações de vendas ativas"
              icon={<PlayCircle className="h-5 w-5 text-emerald-500" />}
            />
            <MetricCard
              titulo="Participantes engajados em vendas"
              valor={metricas.participantesEngajados}
              descricao="Usuários ativos hoje nas ações de vendas"
              icon={<Users className="h-5 w-5 text-primary" />}
            />
            <MetricCard
              titulo="Notificações pendentes de vendas"
              valor={metricas.notificacoesPendentes}
              descricao="Mensagens aguardando envio das ações de vendas"
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {carregando
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-64" />)
          : acoes.length === 0
          ? (
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Nenhuma ação de vendas encontrada</CardTitle>
                <CardDescription>Altere os filtros ou cadastre uma nova ação de vendas para acompanhar por aqui.</CardDescription>
              </CardHeader>
            </Card>
          )
          : acoes.map(acao => (
              <Card key={acao.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{acao.titulo}</CardTitle>
                      <CardDescription>{acao.descricao}</CardDescription>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Início: {new Date(acao.inicioPrevisto).toLocaleString('pt-BR')}</span>
                        {acao.terminoPrevisto ? <span>• Fim: {new Date(acao.terminoPrevisto).toLocaleString('pt-BR')}</span> : null}
                        <span>• Tipo: {tipoLabel[acao.tipo]}</span>
                        <span>• Responsável: {acao.responsavel}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusBadge[acao.status]}>{statusLabel[acao.status]}</Badge>
                      <Badge variant="outline">Atualizado {new Date(acao.ultimaAtualizacao).toLocaleTimeString('pt-BR')}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Participantes ativos</p>
                      <p className="text-lg font-semibold">{acao.participantesAtivos} / {acao.totalParticipantes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Notificações enviadas</p>
                      <p className="text-lg font-semibold">{acao.notificacoesEnviadas}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Leads distribuídos</p>
                      <p className="text-lg font-semibold">{acao.leadsDistribuidos}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Meta prevista</p>
                      <p className="text-lg font-semibold">{acao.entregasPrevistas}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Progresso da meta</span>
                      <span>{progresso(acao)}%</span>
                    </div>
                    <Progress value={progresso(acao)} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/distribuicao/acoes/${acao.id}`}>Ver detalhes</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => abrirNotificacao(acao)}>
                      <Bell className="mr-2 h-4 w-4" /> Notificar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm">Ações rápidas</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        {acao.status !== 'encerrada' ? (
                          <DropdownMenuItem onSelect={() => handleStatusAction(acao)}>
                            {acao.status === 'em_andamento' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                            {acao.status === 'em_andamento' ? 'Pausar ação' : 'Retomar ação'}
                          </DropdownMenuItem>
                        ) : null}
                        {acao.status !== 'encerrada' ? (
                          <DropdownMenuItem onSelect={() => handleEncerrar(acao)}>
                            Encerrar ação
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog open={notificacao.aberta} onOpenChange={open => setNotificacao(prev => ({ ...prev, aberta: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar notificação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {notificacao.acao
                ? `A mensagem será enviada para os participantes da ação “${notificacao.acao.titulo}”.`
                : 'Defina uma mensagem para os participantes selecionados.'}
            </p>
            <Textarea
              value={notificacao.mensagem}
              onChange={event => setNotificacao(prev => ({ ...prev, mensagem: event.target.value }))}
              placeholder="Escreva a mensagem da notificação"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificacao({ aberta: false, mensagem: '', acao: undefined })}>
              Cancelar
            </Button>
            <Button onClick={enviarNotificacaoDialog} disabled={!notificacao.mensagem.trim()}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MetricCardProps {
  titulo: string;
  valor: number;
  descricao: string;
  icon?: React.ReactNode;
}

function MetricCard({ titulo, valor, descricao, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        {icon ?? <Users className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        <p className="text-xs text-muted-foreground">{descricao}</p>
      </CardContent>
    </Card>
  );
}
