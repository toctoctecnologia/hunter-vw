import type {
  AcaoDistribuicao,
  AcaoHistoricoEvento,
  AcaoParticipante,
  AcaoStatus,
  AcoesMetricas,
  NovaAcaoPayload,
} from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const now = () => new Date().toISOString();

const nomes = [
  'Ana Souza',
  'Bruno Carvalho',
  'Carla Mendes',
  'Diego Lima',
  'Eduarda Martins',
  'Fábio Duarte',
  'Gabriela Ramos',
  'Henrique Tavares',
  'Isabela Monteiro',
  'João Pedro',
  'Karen Campos',
  'Leonardo Braga',
  'Mariana Freitas',
  'Nathalia Alves',
  'Otávio Rocha',
  'Paula Santoro',
  'Rafael Queiroz',
  'Sabrina Moura',
  'Thiago Barbosa',
  'Vanessa Mourão',
];

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const sampleDescricao = [
  'Rotina de disponibilidade para garantir atendimento ágil aos leads novos.',
  'Campanha de reengajamento dos corretores com maior potencial de distribuição.',
  'Checklist operacional para validar presença dos times antes do pico de captação.',
  'Ação preventiva para monitorar pausas e retornos dos operadores ao longo do dia.',
];

const gerarDescricao = () => `${randomItem(sampleDescricao)} Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;

const tipos: Array<AcaoDistribuicao['tipo']> = ['checkin', 'notificacao', 'redistribuicao'];

const baseAcoes: AcaoDistribuicao[] = Array.from({ length: 6 }).map((_, index) => {
  const status: AcaoStatus = index === 0 ? 'em_andamento' : index === 1 ? 'agendada' : index === 2 ? 'pausada' : 'encerrada';
  const inicio = new Date(Date.now() - randomInt(1, 5) * 24 * 60 * 60 * 1000).toISOString();
  const termino =
    status === 'encerrada'
      ? new Date(Date.now() - randomInt(1, 2) * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString();
  const participantes = randomInt(8, 28);
  const ativos = Math.max(3, Math.floor(participantes * (status === 'encerrada' ? 0.4 : 0.7)));
  const filaId = index % 2 === 0 ? 'fila-1' : 'fila-2';
  const filaNome = filaId === 'fila-1' ? 'Fila Norte' : 'Fila Digital';
  return {
    id: `acao-${index + 1}`,
    titulo: index === 0 ? 'Check-in Matinal' : `Ação ${index + 1}`,
    descricao: gerarDescricao(),
    tipo: tipos[index % tipos.length],
    redistribuicaoOrigem: tipos[index % tipos.length] === 'redistribuicao' ? 'existentes' : undefined,
    origemLeads: tipos[index % tipos.length] === 'redistribuicao' ? 'existentes' : 'upload',
    filaId,
    filaNome,
    status,
    inicioPrevisto: inicio,
    terminoPrevisto: termino,
    totalParticipantes: participantes,
    participantesAtivos: ativos,
    leadsDistribuidos: randomInt(40, 220),
    entregasPrevistas: randomInt(60, 280),
    notificacoesEnviadas: randomInt(0, 50),
    responsavel: randomItem(nomes),
    ultimaAtualizacao: now(),
    recorrencia:
      status === 'encerrada'
        ? undefined
        : {
            tipo: index % 2 === 0 ? 'diaria' : 'semanal',
            diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
            horario: index % 2 === 0 ? '08:00' : '14:00',
            intervalo: 1,
          },
  } satisfies AcaoDistribuicao;
});

const criarParticipante = (acaoId: string, idx: number): AcaoParticipante => {
  const nome = randomItem(nomes);
  const email = `${nome.toLowerCase().replace(/[^a-z]+/g, '.')}.${idx}@empresa.com`;
  const status: AcaoParticipante['status'] = idx % 7 === 0 ? 'pausado' : 'ativo';
  return {
    id: `${acaoId}-participante-${idx}`,
    nome,
    email,
    papel: idx % 10 === 0 ? 'coordenador' : 'corretor',
    status,
    leadsRecebidos: randomInt(0, 40),
    distribuicoesRealizadas: randomInt(0, 70),
    ultimoEvento: new Date(Date.now() - randomInt(1, 120) * 60 * 1000).toISOString(),
    engajamento: randomInt(30, 100),
  } satisfies AcaoParticipante;
};

const participantesPorAcao: Record<string, AcaoParticipante[]> = Object.fromEntries(
  baseAcoes.map(acao => [
    acao.id,
    Array.from({ length: acao.totalParticipantes }).map((_, index) => criarParticipante(acao.id, index + 1)),
  ])
);

const historicoPorAcao: Record<string, AcaoHistoricoEvento[]> = Object.fromEntries(
  baseAcoes.map(acao => [
    acao.id,
    Array.from({ length: 10 }).map((_, index) => {
      const tipo: AcaoHistoricoEvento['tipo'] = ['status', 'participante', 'distribuicao', 'notificacao'][index % 4] as any;
      const titulo =
        tipo === 'status'
          ? 'Status atualizado'
          : tipo === 'participante'
          ? 'Participante ajustado'
          : tipo === 'notificacao'
          ? 'Notificação enviada'
          : 'Execução de distribuição';
      return {
        id: `${acao.id}-evento-${index}`,
        timestamp: new Date(Date.now() - randomInt(1, 10) * 6 * 60 * 1000).toISOString(),
        titulo,
        descricao: gerarDescricao(),
        tipo,
        autor: randomItem(nomes),
      } satisfies AcaoHistoricoEvento;
    }),
  ])
);

let acoesStore = [...baseAcoes];

const recomputeMetricas = (): AcoesMetricas => {
  const totalAcoes = acoesStore.length;
  const ativas = acoesStore.filter(acao => acao.status === 'em_andamento').length;
  const agendadas = acoesStore.filter(acao => acao.status === 'agendada').length;
  const pausadas = acoesStore.filter(acao => acao.status === 'pausada').length;
  const encerradas = acoesStore.filter(acao => acao.status === 'encerrada').length;
  const leadsDistribuidos = acoesStore.reduce((acc, acao) => acc + acao.leadsDistribuidos, 0);
  const participantesEngajados = acoesStore.reduce((acc, acao) => acc + acao.participantesAtivos, 0);
  const notificacoesPendentes = acoesStore.reduce(
    (acc, acao) => acc + Math.max(acao.entregasPrevistas - acao.notificacoesEnviadas, 0),
    0,
  );

  return {
    totalAcoes,
    ativas,
    agendadas,
    pausadas,
    encerradas,
    leadsDistribuidos,
    participantesEngajados,
    notificacoesPendentes,
  } satisfies AcoesMetricas;
};

export const acoesApi = {
  async listarAcoes(filtros?: { status?: AcaoStatus | 'todas'; busca?: string; tipo?: AcaoDistribuicao['tipo'] | 'todos' }) {
    await delay(350);
    let resultado = [...acoesStore];

    if (filtros?.status && filtros.status !== 'todas') {
      resultado = resultado.filter(acao => acao.status === filtros.status);
    }

    if (filtros?.tipo && filtros.tipo !== 'todos') {
      resultado = resultado.filter(acao => acao.tipo === filtros.tipo);
    }

    if (filtros?.busca) {
      const termo = filtros.busca.toLowerCase();
      resultado = resultado.filter(acao =>
        acao.titulo.toLowerCase().includes(termo) || acao.descricao.toLowerCase().includes(termo),
      );
    }

    return resultado.sort((a, b) => new Date(b.ultimaAtualizacao).getTime() - new Date(a.ultimaAtualizacao).getTime());
  },

  async metricas() {
    await delay(200);
    return recomputeMetricas();
  },

  async detalhes(id: string) {
    await delay(250);
    const acao = acoesStore.find(item => item.id === id);
    if (!acao) throw new Error('Ação não encontrada');
    return acao;
  },

  async participantes(id: string) {
    await delay(300);
    const participantes = participantesPorAcao[id];
    if (!participantes) throw new Error('Participantes não encontrados');
    return participantes.sort((a, b) => b.engajamento - a.engajamento);
  },

  async historico(id: string) {
    await delay(250);
    const eventos = historicoPorAcao[id];
    if (!eventos) throw new Error('Histórico não encontrado');
    return eventos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async criar(payload: NovaAcaoPayload) {
    await delay(500);
    const novaAcao: AcaoDistribuicao = {
      id: `acao-${Date.now()}`,
      titulo: payload.titulo,
      descricao: payload.descricao,
      tipo: payload.tipo,
      redistribuicaoOrigem: payload.redistribuicaoOrigem,
      origemLeads: payload.origemLeads,
      filaId: payload.filaId,
      filaNome: payload.filaId === 'fila-1' ? 'Fila Norte' : payload.filaId === 'fila-2' ? 'Fila Digital' : 'Fila selecionada',
      status: 'agendada',
      inicioPrevisto: payload.inicioPrevisto,
      terminoPrevisto: payload.terminoPrevisto ?? null,
      totalParticipantes: payload.participantes.length,
      participantesAtivos: payload.participantes.length,
      leadsDistribuidos: 0,
      entregasPrevistas: randomInt(40, 160),
      notificacoesEnviadas: payload.enviarNotificacao ? payload.participantes.length : 0,
      responsavel: randomItem(nomes),
      ultimaAtualizacao: now(),
      recorrencia: payload.recorrencia,
    };

    acoesStore = [novaAcao, ...acoesStore];
    participantesPorAcao[novaAcao.id] = payload.participantes.map((id, index) => criarParticipante(novaAcao.id, index + 1));
    historicoPorAcao[novaAcao.id] = [
      {
        id: `${novaAcao.id}-criada`,
        timestamp: now(),
        titulo: 'Ação criada',
        descricao: 'Ação criada manualmente pelo operador.',
        tipo: 'status',
      },
    ];

    if (payload.enviarNotificacao) {
      historicoPorAcao[novaAcao.id].push({
        id: `${novaAcao.id}-notificacao-inicial`,
        timestamp: now(),
        titulo: 'Notificação enviada',
        descricao:
          payload.mensagemNotificacao || 'Notificação inicial enviada automaticamente para os participantes selecionados.',
        tipo: 'notificacao',
      });
    }

    return novaAcao;
  },

  async atualizarStatus(id: string, status: AcaoStatus) {
    await delay(320);
    const acao = acoesStore.find(item => item.id === id);
    if (!acao) throw new Error('Ação não encontrada');

    acao.status = status;
    acao.ultimaAtualizacao = now();

    historicoPorAcao[id] = [
      {
        id: `${id}-status-${Date.now()}`,
        timestamp: now(),
        titulo: 'Status atualizado',
        descricao: `Ação movida para o status ${status.replace('_', ' ')}.`,
        tipo: 'status',
      },
      ...(historicoPorAcao[id] ?? []),
    ];

    return acao;
  },

  async enviarNotificacao(id: string, mensagem: string, participantes?: string[]) {
    await delay(360);
    const acao = acoesStore.find(item => item.id === id);
    if (!acao) throw new Error('Ação não encontrada');

    const quantidade = participantes?.length ?? participantesPorAcao[id]?.length ?? 0;
    acao.notificacoesEnviadas += quantidade;
    acao.ultimaAtualizacao = now();

    historicoPorAcao[id] = [
      {
        id: `${id}-notificacao-${Date.now()}`,
        timestamp: now(),
        titulo: 'Notificação enviada',
        descricao: mensagem,
        tipo: 'notificacao',
        meta: { quantidade },
      },
      ...(historicoPorAcao[id] ?? []),
    ];

    return { sucesso: true };
  },
};

export type { AcaoDistribuicao, AcaoHistoricoEvento, AcaoParticipante, AcoesMetricas, AcaoStatus } from './types';
