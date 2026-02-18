import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { acoesApi } from '../api';
import type { AcaoDistribuicao, AcaoHistoricoEvento, AcaoParticipante, AcaoStatus } from '../api';
import { Switch } from '@/components/ui/switch';

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

interface AcaoDetalheViewProps {
  acaoId: string;
  onVoltar: () => void;
}

export function AcaoDetalheView({ acaoId, onVoltar }: AcaoDetalheViewProps) {
  const [acao, setAcao] = useState<AcaoDistribuicao | null>(null);
  const [participantes, setParticipantes] = useState<AcaoParticipante[]>([]);
  const [historico, setHistorico] = useState<AcaoHistoricoEvento[]>([]);
  const [carregandoAcao, setCarregandoAcao] = useState(true);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(true);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dialogoNotificacao, setDialogoNotificacao] = useState(false);
  const [mensagemNotificacao, setMensagemNotificacao] = useState('');
  const [apenasAtivos, setApenasAtivos] = useState(false);

  const carregarAcao = useCallback(async () => {
    try {
      setErro(null);
      setCarregandoAcao(true);
      const dados = await acoesApi.detalhes(acaoId);
      setAcao(dados);
    } catch (error) {
      console.error('Erro ao carregar detalhes da ação', error);
      setErro('Não foi possível carregar a ação.');
    } finally {
      setCarregandoAcao(false);
    }
  }, [acaoId]);

  const carregarParticipantes = useCallback(async () => {
    try {
      setCarregandoParticipantes(true);
      const dados = await acoesApi.participantes(acaoId);
      setParticipantes(dados);
    } catch (error) {
      console.error('Erro ao carregar participantes da ação', error);
      toast.error('Não foi possível carregar os participantes.');
    } finally {
      setCarregandoParticipantes(false);
    }
  }, [acaoId]);

  const carregarHistorico = useCallback(async () => {
    try {
      setCarregandoHistorico(true);
      const dados = await acoesApi.historico(acaoId);
      setHistorico(dados);
    } catch (error) {
      console.error('Erro ao carregar histórico da ação', error);
      toast.error('Não foi possível carregar o histórico.');
    } finally {
      setCarregandoHistorico(false);
    }
  }, [acaoId]);

  useEffect(() => {
    carregarAcao();
    carregarParticipantes();
    carregarHistorico();
    const interval = window.setInterval(() => {
      carregarAcao();
      carregarParticipantes();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [carregarAcao, carregarParticipantes, carregarHistorico]);

  const atualizarStatus = async (status: AcaoStatus) => {
    try {
      const atualizado = await acoesApi.atualizarStatus(acaoId, status);
      setAcao(atualizado);
      toast.success('Status atualizado.');
    } catch (error) {
      console.error('Erro ao atualizar status', error);
      toast.error('Não foi possível atualizar o status.');
    }
  };

  const enviarNotificacao = async () => {
    if (!mensagemNotificacao.trim()) {
      toast.error('Escreva uma mensagem antes de enviar.');
      return;
    }
    try {
      await acoesApi.enviarNotificacao(acaoId, mensagemNotificacao, apenasAtivos ? participantes.filter(p => p.status === 'ativo').map(p => p.id) : undefined);
      toast.success('Notificação enviada.');
      setDialogoNotificacao(false);
      setMensagemNotificacao('');
    } catch (error) {
      console.error('Erro ao enviar notificação', error);
      toast.error('Não foi possível enviar a notificação.');
    }
  };

  const participantesFiltrados = useMemo(() => {
    if (!apenasAtivos) return participantes;
    return participantes.filter(participante => participante.status === 'ativo');
  }, [participantes, apenasAtivos]);

  const progresso = useMemo(() => {
    if (!acao?.entregasPrevistas) return 0;
    return Math.min(100, Math.round((acao.leadsDistribuidos / acao.entregasPrevistas) * 100));
  }, [acao]);

  if (erro) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
          <CardDescription>{erro}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onVoltar}>
            Voltar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onVoltar} className="w-fit">
          Voltar
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDialogoNotificacao(true)}>
            Enviar notificação
          </Button>
          {acao?.status !== 'encerrada' && (
            <Button variant="secondary" onClick={() => atualizarStatus(acao?.status === 'em_andamento' ? 'pausada' : 'em_andamento')}>
              {acao?.status === 'em_andamento' ? 'Pausar ação' : 'Iniciar ação'}
            </Button>
          )}
          {acao?.status !== 'encerrada' && (
            <Button variant="destructive" onClick={() => atualizarStatus('encerrada')}>
              Encerrar ação
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl">{acao?.titulo || 'Ação de distribuição'}</CardTitle>
            <CardDescription>{acao?.descricao}</CardDescription>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Início: {acao ? new Date(acao.inicioPrevisto).toLocaleString('pt-BR') : '--'}</span>
              {acao?.terminoPrevisto ? <span>• Fim: {new Date(acao.terminoPrevisto).toLocaleString('pt-BR')}</span> : null}
              <span>• Tipo: {acao?.tipo}</span>
              {acao?.tipo === 'redistribuicao' && acao.redistribuicaoOrigem && (
                <span>
                  • Origem dos leads:{' '}
                  {acao.redistribuicaoOrigem === 'upload'
                    ? 'Importação de novos leads'
                    : 'Leads já existentes'}
                </span>
              )}
              {acao?.filaNome && <span>• Fila: {acao.filaNome}</span>}
              <span>• Responsável: {acao?.responsavel}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {acao && <Badge className={statusBadge[acao.status]}>{statusLabel[acao.status]}</Badge>}
            {acao && <Badge variant="outline">Atualizado {new Date(acao.ultimaAtualizacao).toLocaleTimeString('pt-BR')}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {carregandoAcao && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24" />)}
            {!carregandoAcao && acao && (
              <>
                <ResumoItem titulo="Participantes ativos" valor={`${acao.participantesAtivos}/${acao.totalParticipantes}`} />
                <ResumoItem titulo="Leads distribuídos" valor={acao.leadsDistribuidos} />
                <ResumoItem titulo="Notificações enviadas" valor={acao.notificacoesEnviadas} />
                <ResumoItem titulo="Meta prevista" valor={acao.entregasPrevistas} />
              </>
            )}
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progresso da meta</span>
              <span>{progresso}%</span>
            </div>
            <Progress value={progresso} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Participantes ({participantes.length})</CardTitle>
            <CardDescription>Visualize o engajamento e o status de cada participante.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={apenasAtivos} onCheckedChange={setApenasAtivos} id="apenasAtivos" />
            <label htmlFor="apenasAtivos" className="text-sm text-muted-foreground">
              Mostrar somente ativos
            </label>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {carregandoParticipantes ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leads recebidos</TableHead>
                  <TableHead>Distribuições</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead>Último evento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leads recebidos</TableHead>
                  <TableHead>Distribuições</TableHead>
                  <TableHead>Engajamento</TableHead>
                  <TableHead>Último evento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participantesFiltrados.map(participante => (
                  <TableRow key={participante.id}>
                    <TableCell>
                      <div className="font-medium">{participante.nome}</div>
                      <div className="text-xs text-muted-foreground">{participante.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={participante.status === 'ativo' ? 'success' : participante.status === 'pausado' ? 'warning' : 'secondary'}>
                        {participante.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{participante.leadsRecebidos}</TableCell>
                    <TableCell>{participante.distribuicoesRealizadas}</TableCell>
                    <TableCell>{participante.engajamento}%</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(participante.ultimoEvento).toLocaleString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
                {participantesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      Nenhum participante para exibir com o filtro atual.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico da ação</CardTitle>
          <CardDescription>Eventos recentes relacionados a status, notificações e participação.</CardDescription>
        </CardHeader>
        <CardContent>
          {carregandoHistorico ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {historico.map(item => (
                <div key={item.id} className="flex flex-col gap-1 rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{item.titulo}</div>
                    <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                  {item.autor ? <p className="text-xs text-muted-foreground">Responsável: {item.autor}</p> : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogoNotificacao} onOpenChange={setDialogoNotificacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar notificação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Enviar somente para ativos</p>
                <p className="text-xs text-muted-foreground">Quando habilitado, somente participantes ativos receberão a notificação.</p>
              </div>
              <Switch checked={apenasAtivos} onCheckedChange={setApenasAtivos} />
            </div>
            <Textarea
              value={mensagemNotificacao}
              onChange={event => setMensagemNotificacao(event.target.value)}
              placeholder="Escreva a mensagem"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoNotificacao(false)}>
              Cancelar
            </Button>
            <Button onClick={enviarNotificacao}>Enviar notificação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ResumoItemProps {
  titulo: string;
  valor: number | string;
}

function ResumoItem({ titulo, valor }: ResumoItemProps) {
  return (
    <Card className="border-muted bg-muted/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        <CardDescription className="text-2xl font-semibold text-foreground">{valor}</CardDescription>
      </CardHeader>
    </Card>
  );
}
