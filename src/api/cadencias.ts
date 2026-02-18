import type { Cadencia } from '@/types/cadencia';

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);

const mockCadencias: Cadencia[] = [
  {
    id: 'cad-1',
    nome: 'Cadência personalizada · Chegou o vídeo',
    descricao: 'Reage automaticamente quando o vídeo do imóvel chega e abre a cadência completa para o time.',
    status: 'ativa',
    prioridade: 1,
    cor: 'hsl(var(--accentSoft))',
    responsavel: { tipo: 'equipe', nome: 'Equipe Digital' },
    equipe: 'Equipe Digital',
    evento: 'Chegada de vídeo do imóvel',
    canais: ['WhatsApp', 'Ligação', 'Email'],
    sla: 'Retorno em até 2h',
    tags: ['Relacionamento', 'Vídeo', 'Prioritária'],
    regrasTabela: [
      {
        id: 'rt-1',
        titulo: 'Entrada do lead',
        detalhes: 'Classificar como Novo lead, atribuir corretor e registrar origem.',
        destaque: 'Novo lead',
        categoria: 'Entrada',
        ativa: true,
      },
      {
        id: 'rt-2',
        titulo: 'Qualificação',
        detalhes: 'Sequência consultiva por 4 dias com roteiros de vídeo e texto.',
        categoria: 'Contato',
        ativa: true,
      },
      {
        id: 'rt-3',
        titulo: 'Sem resposta',
        detalhes: 'Migrar lead para estágio Amarelo e abrir tarefa de ligação imediata.',
        destaque: 'Amarelo',
        categoria: 'Contato',
        ativa: true,
      },
      {
        id: 'rt-4',
        titulo: 'Contato feito',
        detalhes: 'Marcar como Verde e disparar material de apoio + CTA do vídeo.',
        destaque: 'Verde',
        categoria: 'Conversão',
        ativa: true,
      },
    ],
    regrasEntrada: [
      { id: 're-1', campo: 'titulo', operador: 'contém', valor: 'vídeo' },
      { id: 're-2', campo: 'origem', operador: 'igual', valor: 'Instagram' },
    ],
    tentativas: {
      minimoObrigatorio: 4,
      intervalo: '2h',
      canais: ['WhatsApp', 'Ligação', 'Email'],
      resultadoEsperado: 'Contato estabelecido',
      acaoPosFalha: 'descartar',
      motivoPosFalha: 'Lead não respondeu após 4 tentativas',
      redistribuir: false,
      criarTarefaGestor: true,
    },
    passos: [
      {
        id: 'ps-1',
        nome: 'Follow-up inicial',
        tipo: 'whatsapp',
        prazo: 'em 2h',
        template: 'Mensagem com link do vídeo',
        responsavel: 'Usuário',
        canal: 'WhatsApp',
        ativo: true,
      },
      {
        id: 'ps-2',
        nome: 'Reforço de ligação',
        tipo: 'ligacao',
        prazo: 'em 1 dia',
        template: 'Roteiro de ligação consultiva',
        responsavel: 'Equipe Digital',
        canal: 'Ligação',
        ativo: true,
      },
      {
        id: 'ps-3',
        nome: 'Email de revisão',
        tipo: 'email',
        prazo: 'em 3 dias',
        template: 'Resumo + CTA',
        responsavel: 'Equipe Digital',
        canal: 'Email',
        ativo: true,
      },
    ],
    gatilho: {
      tipo: 'novo-lead',
      etapasFunil: ['Chegada de vídeo'],
    },
    regrasResultado: {
      respondeu: 'Encerrar cadência',
      marcouVisita: 'Pausar até a data da visita',
      negocioFechado: 'Mover para cadência de pós-venda em 30 dias',
    },
    resumo: {
      janelaEstimativa: '5 dias · 3 passos · 2 automações',
      exemplosEntrada: ['Leads com vídeo novo', 'Origem Instagram ou indicação'],
      exemplosExclusao: ['Leads sem mídia', 'Leads internos de reuso'],
    },
  },
  {
    id: 'cad-2',
    nome: 'Cadência de relacionamento · Pós-negócio',
    descricao: 'Continua o contato com quem já fechou e prepara terreno para novas oportunidades.',
    status: 'ativa',
    prioridade: 2,
    cor: '#22C55E',
    responsavel: { tipo: 'equipe', nome: 'Sucesso do Cliente' },
    equipe: 'Sucesso do Cliente',
    evento: 'Negócio fechado',
    canais: ['WhatsApp', 'Email'],
    sla: 'Retorno em 24h',
    tags: ['Pós-venda', 'Relacionamento'],
    regrasTabela: [
      { id: 'rt-5', titulo: 'Onboarding', detalhes: 'Disparar mensagem de boas-vindas com o vídeo final.', categoria: 'Entrega', ativa: true },
      {
        id: 'rt-6',
        titulo: 'Checkpoints',
        detalhes: 'Acompanhamento quinzenal com roteiro rápido e pesquisa de satisfação.',
        categoria: 'Follow-up',
        ativa: true,
      },
      {
        id: 'rt-7',
        titulo: 'Sinal de upgrade',
        detalhes: 'Mover para Verde quando houver interesse em nova unidade.',
        destaque: 'Verde',
        categoria: 'Oportunidade',
        ativa: true,
      },
      {
        id: 'rt-8',
        titulo: 'Risco de churn',
        detalhes: 'Aplicar playbook de retenção se ficar 30 dias sem interação.',
        destaque: 'Vermelho',
        categoria: 'Alerta',
        ativa: false,
      },
    ],
    regrasEntrada: [
      { id: 're-3', campo: 'origem', operador: 'igual', valor: 'Pós-venda' },
      { id: 're-4', campo: 'statusLead', operador: 'igual', valor: 'Fechado' },
    ],
    tentativas: {
      minimoObrigatorio: 3,
      intervalo: '24h',
      canais: ['WhatsApp', 'Email'],
      resultadoEsperado: 'Contato estabelecido',
      acaoPosFalha: 'redistribuir',
      motivoPosFalha: 'Conta sem resposta',
      redistribuir: true,
      criarTarefaGestor: false,
    },
    passos: [
      {
        id: 'ps-4',
        nome: 'Lembrete de pós-venda',
        tipo: 'whatsapp',
        prazo: 'em 7 dias',
        template: 'Pesquisa NPS',
        responsavel: 'Sucesso do Cliente',
        canal: 'WhatsApp',
        ativo: true,
      },
      {
        id: 'ps-5',
        nome: 'Revisão de uso',
        tipo: 'ligacao',
        prazo: 'em 15 dias',
        template: 'Script curto',
        responsavel: 'Sucesso do Cliente',
        canal: 'Ligação',
        ativo: true,
      },
      {
        id: 'ps-6',
        nome: 'Oferta complementar',
        tipo: 'email',
        prazo: 'em 30 dias',
        template: 'Portfólio atualizado',
        responsavel: 'Sucesso do Cliente',
        canal: 'Email',
        ativo: true,
      },
    ],
    gatilho: {
      tipo: 'negocio-fechado',
      posVendaIntervalos: [30, 60, 90],
    },
    regrasResultado: {
      respondeu: 'Encerrar cadência',
      marcouVisita: 'Pausar até a visita',
      negocioFechado: 'Continuar em pós-venda com intervalo de 30 dias',
    },
    resumo: {
      janelaEstimativa: '30 dias · 3 passos · 2 automações',
      exemplosEntrada: ['Clientes fechados no último mês', 'Upsell em análise'],
      exemplosExclusao: ['Leads perdidos', 'Contas com ticket baixo'],
    },
  },
  {
    id: 'cad-3',
    nome: 'Cadência express · Plantão de mídia',
    descricao: 'Fluxo acelerado para leads de campanha com urgência e prazos curtos.',
    status: 'pausada',
    prioridade: 3,
    cor: '#3B82F6',
    responsavel: { tipo: 'equipe', nome: 'Time Plantão' },
    equipe: 'Time Plantão',
    evento: 'Campanha flash',
    canais: ['WhatsApp', 'Ligação'],
    sla: 'Retorno em até 1h',
    tags: ['Urgente', 'Campanha', 'Acelerada'],
    regrasTabela: [
      {
        id: 'rt-9',
        titulo: 'Primeiro contato',
        detalhes: 'Mensagem personalizada em < 30 minutos com o vídeo.',
        categoria: 'Entrada',
        ativa: true,
      },
      {
        id: 'rt-10',
        titulo: 'Escala de cor',
        detalhes: 'Verde se respondeu em até 24h, Amarelo após 48h.',
        destaque: 'Amarelo',
        categoria: 'Contato',
        ativa: true,
      },
      {
        id: 'rt-11',
        titulo: 'Redistribuição',
        detalhes: 'Enviar para outro corretor se ninguém falar em 2 dias.',
        categoria: 'Atribuição',
        ativa: false,
      },
    ],
    regrasEntrada: [
      { id: 're-5', campo: 'origem', operador: 'igual', valor: 'Campanha flash' },
      { id: 're-6', campo: 'prioridade', operador: 'maior', valor: 7 },
    ],
    tentativas: {
      minimoObrigatorio: 5,
      intervalo: '1h',
      canais: ['WhatsApp', 'Ligação'],
      resultadoEsperado: 'Sem resposta',
      acaoPosFalha: 'tarefa-gestor',
      motivoPosFalha: 'Lead não retornou em até 24h',
      redistribuir: true,
      criarTarefaGestor: true,
    },
    passos: [
      {
        id: 'ps-7',
        nome: 'Contato imediato',
        tipo: 'whatsapp',
        prazo: 'em 30 min',
        template: 'Mensagem curta de urgência',
        responsavel: 'Time Plantão',
        canal: 'WhatsApp',
        ativo: true,
      },
      {
        id: 'ps-8',
        nome: 'Reforço com ligação',
        tipo: 'ligacao',
        prazo: 'em 2h',
        template: 'Roteiro rápido',
        responsavel: 'Time Plantão',
        canal: 'Ligação',
        ativo: true,
      },
      {
        id: 'ps-9',
        nome: 'Última tentativa',
        tipo: 'ligacao',
        prazo: 'em 1 dia',
        template: 'Escalada para gestor',
        responsavel: 'Gestor Plantão',
        canal: 'Ligação',
        ativo: true,
      },
    ],
    gatilho: {
      tipo: 'sem-resposta',
      tempoSemRespostaHoras: 24,
    },
    regrasResultado: {
      respondeu: 'Mover para fila principal',
      marcouVisita: 'Pausar cadência até a visita',
      negocioFechado: 'Enviar para pós-venda em 60 dias',
    },
    resumo: {
      janelaEstimativa: '24h · 3 passos rápidos · 2 automações',
      exemplosEntrada: ['Campanha flash', 'Landing page acelerada'],
      exemplosExclusao: ['Reuso interno', 'Leads com SLA expirado'],
    },
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const cadenciasApi = {
  async getCadencias(): Promise<Cadencia[]> {
    await delay(20);
    return [...mockCadencias].sort((a, b) => a.prioridade - b.prioridade);
  },

  async getCadencia(id: string): Promise<Cadencia | null> {
    await delay(15);
    return mockCadencias.find((cad) => cad.id === id) ?? null;
  },

  async updateCadencia(id: string, payload: Partial<Cadencia>): Promise<Cadencia> {
    await delay(25);
    const index = mockCadencias.findIndex((cad) => cad.id === id);
    if (index === -1) throw new Error('Cadência não encontrada');
    mockCadencias[index] = { ...mockCadencias[index], ...payload };
    return mockCadencias[index];
  },

  async createCadencia(payload: Omit<Cadencia, 'id'>): Promise<Cadencia> {
    await delay(30);
    const newCadencia: Cadencia = {
      ...payload,
      id: uid(),
    };
    mockCadencias.push(newCadencia);
    return newCadencia;
  },

  async duplicateCadencia(id: string): Promise<Cadencia> {
    await delay(25);
    const cadencia = mockCadencias.find((cad) => cad.id === id);
    if (!cadencia) throw new Error('Cadência não encontrada');
    const duplicated: Cadencia = {
      ...cadencia,
      id: uid(),
      nome: `${cadencia.nome} (cópia)`,
      prioridade: mockCadencias.length + 1,
      status: 'pausada',
    };
    mockCadencias.push(duplicated);
    return duplicated;
  },

  async deleteCadencia(id: string): Promise<void> {
    await delay(15);
    const index = mockCadencias.findIndex((cad) => cad.id === id);
    if (index === -1) throw new Error('Cadência não encontrada');
    mockCadencias.splice(index, 1);
  },

  async reorderCadencias(order: string[]): Promise<void> {
    await delay(20);
    order.forEach((id, idx) => {
      const cad = mockCadencias.find((item) => item.id === id);
      if (cad) {
        cad.prioridade = idx + 1;
      }
    });
  },
};
