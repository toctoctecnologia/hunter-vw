import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { acoesApi } from '@/features/distribuicao/acoes/api';
import type { AcaoDistribuicao, AcaoHistoricoEvento } from '@/features/distribuicao/acoes/api';

const tipoLabel: Record<AcaoHistoricoEvento['tipo'], string> = {
  status: 'Status',
  notificacao: 'Notificação',
  participante: 'Participante',
  distribuicao: 'Distribuição',
  recorrencia: 'Recorrência',
};

export default function AcaoCheckinHistoricoPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [acao, setAcao] = useState<AcaoDistribuicao | null>(null);
  const [historico, setHistorico] = useState<AcaoHistoricoEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | AcaoHistoricoEvento['tipo']>('todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        setLoading(true);
        const [detalhes, eventos] = await Promise.all([acoesApi.detalhes(id), acoesApi.historico(id)]);
        setAcao(detalhes);
        setHistorico(eventos);
      } catch (error) {
        console.error('Erro ao carregar histórico da ação', error);
        setErro('Não foi possível carregar o histórico.');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id]);

  const eventosFiltrados = useMemo(() => {
    return historico.filter(evento => {
      if (filtroTipo !== 'todos' && evento.tipo !== filtroTipo) return false;
      if (busca) {
        const termo = busca.toLowerCase();
        return evento.titulo.toLowerCase().includes(termo) || evento.descricao.toLowerCase().includes(termo);
      }
      return true;
    });
  }, [historico, filtroTipo, busca]);

  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      default:
        break;
    }
  };

  return (
    <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
      <div className="mx-auto w-full max-w-4xl space-y-6 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={() => navigate(`/distribuicao/acoes/${id ?? ''}`)}>
            Voltar
          </Button>
          {acao && <span className="text-sm text-muted-foreground">Histórico completo da ação “{acao.titulo}”.</span>}
        </div>

        {erro ? (
          <Card>
            <CardHeader>
              <CardTitle>Erro ao carregar histórico</CardTitle>
              <CardDescription>{erro}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/distribuicao/acoes')}>
                Voltar para ações
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>Linha do tempo da ação</CardTitle>
                <CardDescription>Visualize todos os eventos ordenados cronologicamente.</CardDescription>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Input value={busca} onChange={event => setBusca(event.target.value)} placeholder="Buscar por título ou descrição" />
                <Select value={filtroTipo} onValueChange={value => setFiltroTipo(value as typeof filtroTipo)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="notificacao">Notificação</SelectItem>
                    <SelectItem value="participante">Participante</SelectItem>
                    <SelectItem value="distribuicao">Distribuição</SelectItem>
                    <SelectItem value="recorrencia">Recorrência</SelectItem>
                  </SelectContent>
                </Select>
                {acao && (
                  <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                    <p><strong>Período:</strong> {new Date(acao.inicioPrevisto).toLocaleString('pt-BR')}</p>
                    {acao.terminoPrevisto ? <p><strong>Fim:</strong> {new Date(acao.terminoPrevisto).toLocaleString('pt-BR')}</p> : null}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {eventosFiltrados.map(evento => (
                    <div key={evento.id} className="flex flex-col gap-1 rounded-lg border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{tipoLabel[evento.tipo]}</Badge>
                          <span className="font-medium">{evento.titulo}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(evento.timestamp).toLocaleString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                      {evento.autor ? <span className="text-xs text-muted-foreground">Responsável: {evento.autor}</span> : null}
                      {evento.meta ? (
                        <div className="mt-2 rounded-md bg-muted/60 p-2 text-xs text-muted-foreground">
                          {Object.entries(evento.meta).map(([chave, valor]) => (
                            <p key={chave}>
                              <strong>{chave}:</strong> {valor}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {eventosFiltrados.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhum evento encontrado com os filtros aplicados.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ResponsiveLayout>
  );
}
