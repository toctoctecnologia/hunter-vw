import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { acoesApi } from '../api';
import type { AcaoDistribuicao, AcaoStatus, AcoesMetricas } from '../api';

type StatusFiltro = AcaoStatus | 'todas';
type TipoFiltro = AcaoDistribuicao['tipo'] | 'todos';

export interface FiltrosAcoes {
  status: StatusFiltro;
  tipo: TipoFiltro;
  busca: string;
}

const filtroPadrao: FiltrosAcoes = {
  status: 'todas',
  tipo: 'todos',
  busca: '',
};

export function useAcoesPainel() {
  const [acoes, setAcoes] = useState<AcaoDistribuicao[]>([]);
  const [metricas, setMetricas] = useState<AcoesMetricas | null>(null);
  const [filtros, setFiltros] = useState<FiltrosAcoes>(filtroPadrao);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMetricas, setCarregandoMetricas] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarMetricas = useCallback(async () => {
    try {
      setCarregandoMetricas(true);
      const dados = await acoesApi.metricas();
      setMetricas(dados);
    } catch (error) {
      console.error('Erro ao carregar métricas das ações', error);
      toast.error('Não foi possível carregar as métricas.');
    } finally {
      setCarregandoMetricas(false);
    }
  }, []);

  const carregarAcoes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await acoesApi.listarAcoes(filtros);
      setAcoes(dados);
    } catch (error) {
      console.error('Erro ao carregar ações de distribuição', error);
      setErro('Não foi possível carregar as ações.');
      toast.error('Erro ao carregar as ações de distribuição.');
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarMetricas();
    const intervalo = window.setInterval(carregarMetricas, 30000);
    return () => window.clearInterval(intervalo);
  }, [carregarMetricas]);

  useEffect(() => {
    carregarAcoes();
  }, [carregarAcoes]);

  const atualizarStatus = useCallback(async (acaoId: string, status: AcaoStatus) => {
    try {
      const atualizado = await acoesApi.atualizarStatus(acaoId, status);
      setAcoes(prev => prev.map(acao => (acao.id === acaoId ? atualizado : acao)));
      carregarMetricas();
      toast.success('Status da ação atualizado.');
    } catch (error) {
      console.error('Erro ao atualizar status da ação', error);
      toast.error('Não foi possível atualizar o status.');
    }
  }, [carregarMetricas]);

  const enviarNotificacao = useCallback(async (acaoId: string, mensagem: string, participantes?: string[]) => {
    try {
      await acoesApi.enviarNotificacao(acaoId, mensagem, participantes);
      toast.success('Notificação enviada.');
      carregarMetricas();
    } catch (error) {
      console.error('Erro ao enviar notificação', error);
      toast.error('Não foi possível enviar a notificação.');
    }
  }, [carregarMetricas]);

  const setFiltro = useCallback(<K extends keyof FiltrosAcoes>(chave: K, valor: FiltrosAcoes[K]) => {
    setFiltros(prev => ({ ...prev, [chave]: valor }));
  }, []);

  const resetarFiltros = useCallback(() => {
    setFiltros(filtroPadrao);
  }, []);

  const resumoFiltros = useMemo(() => ({
    ativo: filtros.status !== 'todas' || filtros.tipo !== 'todos' || Boolean(filtros.busca),
    filtros,
  }), [filtros]);

  return {
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
    recarregar: carregarAcoes,
  };
}
