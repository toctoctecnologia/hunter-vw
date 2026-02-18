export type ApiHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOperation {
  method: ApiHttpMethod;
  path: string;
  description: string;
  authRequired?: boolean;
  id?: string;
}

export interface ApiSection {
  id: string;
  title: string;
  description: string;
  operations: ApiOperation[];
}

export const hunterApiMeta = {
  title: 'Hunter API',
  version: '1.0.0',
  spec: 'OAS3',
  basePath: '/v1',
  swaggerPath: '/docs/hunter-api.json',
  servers: [
    {
      name: 'Produção',
      url: 'https://api.huntercrm.com.br',
    },
    {
      name: 'Sandbox',
      url: 'https://sandbox.huntercrm.com.br',
    },
  ],
};

export const hunterApiSections: ApiSection[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Painel inicial com visão consolidada de operações e alertas.',
    operations: [
      {
        method: 'GET',
        path: '/home/overview',
        description: 'Retorna indicadores gerais, atalhos e widgets do painel inicial.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/home/widgets',
        description: 'Personaliza a ordem e o estado dos widgets da home para o usuário.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'negociacoes',
    title: 'Negociações',
    description: 'Pipeline comercial com etapas, ofertas e propostas.',
    operations: [
      {
        method: 'GET',
        path: '/negociacoes',
        description: 'Lista negociações com filtros por etapa, origem, funil e responsável.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/negociacoes/kanban',
        description: 'Retorna o pipeline em formato Kanban com totais por etapa.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/negociacoes/lista',
        description: 'Lista simplificada para buscas rápidas, exportação e filtros salvos.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/negociacoes/{id}',
        description: 'Busca detalhes completos da negociação, timeline e anexos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/negociacoes',
        description: 'Cria uma nova negociação com proposta, cliente e empreendimento.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/negociacoes/{id}/etapa',
        description: 'Move a negociação para a próxima etapa do funil e registra o motivo.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/negociacoes/{id}/tarefas',
        description: 'Cria tarefas vinculadas à negociação (atrasadas, futuras ou concluídas).',
        authRequired: true,
      },
    ],
  },
  {
    id: 'agenda',
    title: 'Agenda',
    description: 'Compromissos, visitas e confirmações com clientes.',
    operations: [
      {
        method: 'GET',
        path: '/agenda/eventos',
        description: 'Retorna eventos da agenda, visitas agendadas e compromissos compartilhados.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/agenda/eventos',
        description: 'Agenda um novo evento com cliente, imóvel e lembretes.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/agenda/eventos/{id}/confirmacao',
        description: 'Confirma presença, reagenda ou cancela um evento existente.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/agenda/tarefas',
        description: 'Retorna tarefas do calendário (hoje, atrasadas, futuras ou concluídas).',
        authRequired: true,
      },
    ],
  },
  {
    id: 'tarefas',
    title: 'Tarefas',
    description: 'Atividades operacionais, fluxos e checklists.',
    operations: [
      {
        method: 'GET',
        path: '/tarefas',
        description: 'Lista tarefas com filtros por status, SLA e responsável.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/tarefas',
        description: 'Cria uma tarefa manual ou derivada de automação.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/tarefas/{id}/concluir',
        description: 'Conclui a tarefa e registra observações e tempo gasto.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/tarefas/dashboard',
        description: 'Resumo por escopo (hoje, atrasadas, futuras, concluídas) e filtros salvos.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'imoveis',
    title: 'Imóveis',
    description: 'Cadastro central de unidades, características e mídias.',
    operations: [
      {
        method: 'GET',
        path: '/imoveis',
        description: 'Retorna imóveis com filtros por status, tipo, valor e localização.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/imoveis/{id}',
        description: 'Detalha fichas técnicas, proprietários e disponibilidade.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/imoveis',
        description: 'Cria ou importa um imóvel com fotos, documentação e vínculos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/imoveis/{id}/foto-capa',
        description: 'Atualiza a foto de capa ou galeria do imóvel via upload seguro.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/imoveis/filtros',
        description: 'Salva filtros avançados de imóveis (status, aluguel, venda, bairro).',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/imoveis/{id}/publicacao',
        description: 'Publica ou desativa o anúncio do imóvel em portais externos.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'gestao-imoveis',
    title: 'Gestão de Imóveis',
    description: 'Administração de portfólio, vistorias e atualizações massivas.',
    operations: [
      {
        method: 'GET',
        path: '/gestao-imoveis/vistorias',
        description: 'Lista vistorias, laudos e pendências por imóvel.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/gestao-imoveis/vistorias',
        description: 'Registra nova vistoria com checklist e fotos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/gestao-imoveis/sincronizar',
        description: 'Dispara sincronização de portais, ERP ou CRMs externos.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/gestao-imoveis/relatorios',
        description: 'Gera relatórios operacionais de imóveis e atualizações em massa.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'aluguéis',
    title: 'Aluguéis',
    description: 'Gestão do ciclo de locação, proposta à entrega das chaves.',
    operations: [
      {
        method: 'GET',
        path: '/aluguéis',
        description: 'Lista contratos de locação ativos, cancelados e em aprovação.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/aluguéis',
        description: 'Cria uma nova locação com proponente, garantias e imóvel.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/aluguéis/{id}/renovacao',
        description: 'Registra renovação ou reajuste automático do contrato.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'contratos',
    title: 'Contratos',
    description: 'Formalização digital, assinaturas e anexos.',
    operations: [
      {
        method: 'GET',
        path: '/contratos',
        description: 'Retorna contratos com status, partes e vencimentos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/contratos',
        description: 'Gera um contrato a partir de template com merge de dados.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/contratos/{id}/assinar',
        description: 'Envia o contrato para assinatura eletrônica com trilha de auditoria.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'faturas',
    title: 'Faturas',
    description: 'Cobranças recorrentes, notas e boletos.',
    operations: [
      {
        method: 'GET',
        path: '/faturas',
        description: 'Lista faturas com status financeiro, impostos e split.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/faturas',
        description: 'Emite fatura com itens, centro de custo e instruções de pagamento.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/faturas/{id}/baixar',
        description: 'Baixa manual de uma fatura e registra motivo.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'repasses',
    title: 'Repasses',
    description: 'Distribuição financeira para proprietários e parceiros.',
    operations: [
      {
        method: 'GET',
        path: '/repasses',
        description: 'Retorna lotes de repasse, beneficiários e comprovantes.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/repasses',
        description: 'Cria um lote de repasse com rateio e agenda de pagamento.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/repasses/{id}/liquidar',
        description: 'Confirma liquidação do repasse e anexa comprovantes bancários.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'analises',
    title: 'Análises',
    description: 'Indicadores avançados e BI operacional.',
    operations: [
      {
        method: 'GET',
        path: '/analises/painel',
        description: 'Retorna painéis configurados e métricas agregadas.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/analises/exportar',
        description: 'Gera exportação customizada (CSV/XLSX) de indicadores.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/analises/alertas',
        description: 'Cria alertas automáticos baseados em limites e metas.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'regras-cobranca',
    title: 'Regras de cobrança',
    description: 'Motor de faturamento com regras flexíveis.',
    operations: [
      {
        method: 'GET',
        path: '/regras-cobranca',
        description: 'Lista regras ativas, periodicidade e componentes de preço.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/regras-cobranca',
        description: 'Cria ou versiona uma regra de cobrança com vigência.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/regras-cobranca/{id}/simular',
        description: 'Simula aplicação da regra em contratos e imóveis.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'indicadores-leads',
    title: 'Indicadores de Lead',
    description: 'Métricas de funil, SLA e origens.',
    operations: [
      {
        method: 'GET',
        path: '/leads/indicadores',
        description: 'Retorna taxa de conversão, tempo de resposta e eficiência.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/leads/indicadores/metas',
        description: 'Define metas por canal, equipe e campanha.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/leads/indicadores/webhook',
        description: 'Configura webhook para streaming de métricas em tempo real.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Painéis customizados por time, com permissões e compartilhamento.',
    operations: [
      {
        method: 'GET',
        path: '/dashboard',
        description: 'Lista dashboards, owners e filtros salvos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/dashboard',
        description: 'Cria um dashboard com widgets configuráveis.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/dashboard/{id}/publicar',
        description: 'Publica/compartilha um dashboard com URL segura ou time.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'campanhas',
    title: 'Campanhas',
    description: 'Gestão de campanhas, orçamentos e performance.',
    operations: [
      {
        method: 'GET',
        path: '/campanhas',
        description: 'Lista campanhas com orçamento, CPL e ROI.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/campanhas',
        description: 'Abre nova campanha com canais, metas e período.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/campanhas/{id}/encerrar',
        description: 'Encerra campanha e fixa resultados consolidados.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'listas-lead',
    title: 'Listas de Lead',
    description: 'Segmentações dinâmicas e listas acionáveis.',
    operations: [
      {
        method: 'GET',
        path: '/leads/listas',
        description: 'Retorna listas inteligentes com contagem e critérios.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/leads/listas',
        description: 'Cria uma lista dinâmica com filtros, scoring e ações.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/leads/listas/{id}/disparar',
        description: 'Dispara ação massiva (e-mail, SMS ou webhooks) para a lista.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'filtros',
    title: 'Filtros',
    description: 'Biblioteca de filtros salvos e reutilizáveis em todas as telas.',
    operations: [
      {
        method: 'GET',
        path: '/filtros',
        description: 'Lista filtros salvos por objeto (leads, imóveis, negociações).',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/filtros',
        description: 'Salva um novo filtro com compartilhamento e favoritos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/filtros/{id}/clonar',
        description: 'Clona um filtro existente mantendo critérios e ordenação.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'usuarios',
    title: 'Usuários',
    description: 'Gestão de identidades, times e MFA.',
    operations: [
      {
        method: 'GET',
        path: '/usuarios',
        description: 'Retorna usuários com roles, squads e status de MFA.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/usuarios',
        description: 'Cria usuário com permissões, grupo e política de senha.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/usuarios/{id}/redefinir-senha',
        description: 'Gera link de redefinição de senha com HMAC.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'distribuicao',
    title: 'Distribuição',
    description: 'Regras de distribuição e roteamento de leads.',
    operations: [
      {
        method: 'GET',
        path: '/distribuicao/regras',
        description: 'Lista regras de roteamento, pesos e prioridades.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/distribuicao/regras',
        description: 'Cria regra de distribuição por skill, agenda ou disponibilidade.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/distribuicao/regras/{id}/testar',
        description: 'Simula roteamento para validar critérios e fairness.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'gestao-api',
    title: 'Gestão de API',
    description: 'Tokens, webhooks e auditoria de integração.',
    operations: [
      {
        method: 'GET',
        path: '/api/chaves',
        description: 'Lista chaves de API, escopos e datas de expiração.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/chaves',
        description: 'Emite uma nova chave com escopos e restrições de IP.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/webhooks/testar',
        description: 'Envia evento de teste para o endpoint configurado.',
        authRequired: true,
      },
      {
        method: 'GET',
        path: '/api/webhooks/eventos',
        description: 'Lista catálogo completo de eventos disponíveis para webhooks.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/webhooks/colecoes',
        description: 'Cria ou aplica coleções de eventos com presets e filtros.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/api/webhooks/rotacionar-secret',
        description: 'Rotaciona o secret HMAC do webhook e ativa imediatamente.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'gestao-roletao',
    title: 'Gestão de roletão',
    description: 'Fila rotativa e fairness de distribuição.',
    operations: [
      {
        method: 'GET',
        path: '/roletao/fila',
        description: 'Retorna posição atual de cada usuário na fila rotativa.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/roletao/fila',
        description: 'Reordena a fila, pausa usuários e aplica limites.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/roletao/fila/{id}/pular',
        description: 'Pula usuário atual, registra motivo e notifica próximo.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'gestao-relatorios',
    title: 'Gestão de relatórios',
    description: 'Relatórios operacionais e financeiros sob demanda.',
    operations: [
      {
        method: 'GET',
        path: '/relatorios',
        description: 'Lista relatórios disponíveis, periodicidade e formatos.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/relatorios',
        description: 'Solicita geração de relatório com filtros e destinatários.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/relatorios/{id}/reprocessar',
        description: 'Reprocessa relatório com nova janela temporal.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'automacao',
    title: 'Automação',
    description: 'Workflows, gatilhos e ações encadeadas.',
    operations: [
      {
        method: 'GET',
        path: '/automacao/fluxos',
        description: 'Retorna fluxos ativos, gatilhos e taxas de sucesso.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/automacao/fluxos',
        description: 'Cria fluxo com passos, atrasos e ramificações.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/automacao/fluxos/{id}/publicar',
        description: 'Publica ou pausa um fluxo e envia eventos pendentes.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'gestao-acesso',
    title: 'Gestão de acesso',
    description: 'Papéis, políticas e logs de autenticação.',
    operations: [
      {
        method: 'GET',
        path: '/acesso/papeis',
        description: 'Lista papéis, escopos e políticas anexadas.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/acesso/papeis',
        description: 'Cria papel customizado com permissões granulares.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/acesso/logs/exportar',
        description: 'Exporta logs de autenticação e autorização com filtros.',
        authRequired: true,
      },
    ],
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos',
    description: 'Cobrança, split e reconciliação com PSPs.',
    operations: [
      {
        method: 'GET',
        path: '/pagamentos',
        description: 'Retorna pagamentos, status, comprovantes e split aplicados.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/pagamentos',
        description: 'Inicia pagamento com método (Pix, cartão, boleto) e antifraude.',
        authRequired: true,
      },
      {
        method: 'POST',
        path: '/pagamentos/{id}/conciliar',
        description: 'Concilia pagamento com extrato bancário e fecha divergências.',
        authRequired: true,
      },
    ],
  },
];
