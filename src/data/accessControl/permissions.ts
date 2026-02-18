// ============================================
// HUNTER - SISTEMA DE PERMISSÕES E ESCOPOS
// ============================================
// Regra mãe:
// - Permissão controla AÇÃO (botões, telas, criação, edição, ações sensíveis)
// - Escopo controla VISÃO (quais registros entram nas queries e seletores)
// - Filtros da tela só refinam dentro do escopo, nunca ampliam
// - Exportar sempre respeita o escopo
// - Dados sensíveis pedem permissão extra, não só escopo

export interface PermissionAction {
  id: string;
  label: string;
  description: string;
}

export interface PermissionModule {
  id: string;
  label: string;
  description?: string;
  actions: PermissionAction[];
  submodules?: PermissionModule[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: {
    id: string;
    label: string;
  };
  action: {
    id: string;
    label: string;
  };
}

// Escopos oficiais do sistema
export type DataScope = 'proprio' | 'equipe' | 'filial' | 'empresa';

export const DATA_SCOPES: { id: DataScope; label: string; description: string }[] = [
  { id: 'proprio', label: 'Próprio', description: 'Apenas registros do próprio usuário' },
  { id: 'equipe', label: 'Equipe', description: 'Registros do usuário e da sua equipe' },
  { id: 'filial', label: 'Filial', description: 'Todos os registros da filial' },
  { id: 'empresa', label: 'Empresa', description: 'Todos os registros da empresa' },
];

// Ordem padrão das ações: Ver, Incluir, Alterar, Gerenciar, Exportar, Excluir
export const PERMISSION_MODULES: PermissionModule[] = [
  // ============================================
  // HOME
  // ============================================
  {
    id: 'home',
    label: 'Home',
    description: 'Painel principal com indicadores, funil, agenda resumida e sincronização.',
    actions: [
      {
        id: 'view',
        label: 'Ver dashboard',
        description: 'Entrar na tela e visualizar indicadores e cards conforme escopo.',
      },
      {
        id: 'edit',
        label: 'Alterar dashboard',
        description: 'Ajustar filtros pessoais, período e organização visual do próprio dashboard.',
      },
      {
        id: 'manage',
        label: 'Gerenciar dashboard',
        description: 'Definir layout padrão da empresa, cards globais, metas e regras de cálculo.',
      },
      {
        id: 'export',
        label: 'Exportar dashboard',
        description: 'Exportar visão do dashboard conforme escopo (sempre auditável).',
      },
    ],
  },

  // ============================================
  // FOTOS
  // ============================================
  {
    id: 'photos',
    label: 'Fotos',
    description: 'Envio, gerenciamento e histórico de fotos.',
    actions: [
      {
        id: 'view',
        label: 'Ver fotos',
        description: 'Visualizar status, fila, pendências, prévias e histórico.',
      },
      {
        id: 'edit',
        label: 'Alterar fotos',
        description: 'Enviar fotos, ajustar tags, editar pacotes e status operacionais permitidos.',
      },
      {
        id: 'manage',
        label: 'Gerenciar fotos',
        description: 'Definir padrões de entrega, SLA, automações, templates e integrações.',
      },
      {
        id: 'export',
        label: 'Exportar fotos',
        description: 'Exportar dados de fotos quando disponível (sempre auditável).',
      },
    ],
  },

  // ============================================
  // SINCRONIZAÇÕES
  // ============================================
  {
    id: 'syncs',
    label: 'Sincronizações',
    description: 'Integrações, conexões e logs de sincronização.',
    actions: [
      {
        id: 'view',
        label: 'Ver sincronizações',
        description: 'Visualizar status, últimos sincronismos, erros e logs resumidos.',
      },
      {
        id: 'edit',
        label: 'Alterar sincronizações',
        description: 'Reautorizar integrações, reiniciar sincronização e ajustar parâmetros básicos.',
      },
      {
        id: 'manage',
        label: 'Gerenciar sincronizações',
        description: 'Conectar novas fontes, definir chaves, webhooks e políticas globais.',
      },
      {
        id: 'export',
        label: 'Exportar sincronizações',
        description: 'Exportar logs ou relatórios quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // RECURSOS
  // ============================================
  {
    id: 'resources',
    label: 'Recursos',
    description: 'Conectores e blocos habilitáveis como calendário e Meta Ads.',
    actions: [
      {
        id: 'view',
        label: 'Ver recursos',
        description: 'Visualizar recursos disponíveis e status de cada um.',
      },
      {
        id: 'edit',
        label: 'Alterar recursos',
        description: 'Ajustar configurações básicas do recurso quando permitido.',
      },
      {
        id: 'manage',
        label: 'Gerenciar recursos',
        description: 'Habilitar recursos para a empresa e definir parâmetros globais.',
      },
      {
        id: 'export',
        label: 'Exportar recursos',
        description: 'Exportar dados de recursos quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // NOTIFICAÇÕES
  // ============================================
  {
    id: 'notifications',
    label: 'Notificações',
    description: 'Alertas críticos e comunicados do sistema.',
    actions: [
      {
        id: 'view',
        label: 'Ver notificações',
        description: 'Visualizar alertas críticos, falhas de sincronização e comunicados.',
      },
      {
        id: 'edit',
        label: 'Alterar notificações',
        description: 'Marcar notificações como lidas ou silenciar tipos de alerta.',
      },
      {
        id: 'manage',
        label: 'Gerenciar notificações',
        description: 'Definir eventos, destinatários e prioridades das notificações.',
      },
      {
        id: 'export',
        label: 'Exportar notificações',
        description: 'Exportar histórico de notificações quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // PERFIL
  // ============================================
  {
    id: 'profile',
    label: 'Perfil e configurações',
    description: 'Dados do usuário, integrações pessoais e preferências.',
    actions: [
      {
        id: 'view',
        label: 'Ver perfil',
        description: 'Visualizar dados cadastrais e status de integrações pessoais.',
      },
      {
        id: 'edit',
        label: 'Alterar perfil',
        description: 'Editar dados de contato, preferências e integrações pessoais.',
      },
      {
        id: 'manage',
        label: 'Gerenciar integrações do perfil',
        description: 'Definir integrações disponíveis, perfis autorizados e regras globais.',
      },
      {
        id: 'export',
        label: 'Exportar dados pessoais',
        description: 'Exportar dados pessoais quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // NEGOCIAÇÃO
  // ============================================
  {
    id: 'negotiation',
    label: 'Negociações',
    description: 'Funil comercial, agenda do funil, roletão, cambã e listas.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar negociações',
        description: 'Ver negociações, timeline, anexos permitidos, proposta, histórico, funil, indicadores e listas em modo leitura.',
      },
      {
        id: 'create',
        label: 'Incluir negociações',
        description: 'Criar negociação, vincular lead/imóvel, criar proposta, criar tarefas iniciais.',
      },
      {
        id: 'edit',
        label: 'Alterar negociações',
        description: 'Editar campos, trocar etapa/status/valores, classificar, registrar interação, reatribuir responsável dentro do escopo.',
      },
      {
        id: 'manage',
        label: 'Gerenciar negociações',
        description: 'Excluir negociação, alterar regra do funil (etapas, metas), reatribuição fora do padrão.',
      },
      {
        id: 'export',
        label: 'Exportar negociações',
        description: 'Exportar negociações do universo visível no escopo.',
      },
    ],
    submodules: [
      {
        id: 'negotiation.roletao',
        label: 'Roletão e Listas',
        description: 'Filas de distribuição e listas dentro de Negociação.',
        actions: [
          {
            id: 'view',
            label: 'Ver roletão e listas',
            description: 'Ver fila, histórico, quem recebeu, sem mexer em regra.',
          },
          {
            id: 'manage',
            label: 'Gerenciar roletão e listas',
            description: 'Redistribuir, resetar, alterar parâmetros locais.',
          },
        ],
      },
    ],
  },

  // ============================================
  // AGENDA
  // ============================================
  {
    id: 'agenda',
    label: 'Agenda',
    description: 'Compromissos, visitas e tarefas recorrentes.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar agenda',
        description: 'Ver agenda e tarefas, com histórico permitido.',
      },
      {
        id: 'create',
        label: 'Incluir compromissos',
        description: 'Criar tarefa e evento.',
      },
      {
        id: 'edit',
        label: 'Alterar compromissos',
        description: 'Editar, reagendar, concluir, mudar status.',
      },
      {
        id: 'manage',
        label: 'Gerenciar agenda',
        description: 'Configurar regras de follow-up automático, bloqueios, padrões operacionais.',
      },
      {
        id: 'export',
        label: 'Exportar agenda',
        description: 'Exportar agenda e tarefas quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // IMÓVEIS
  // ============================================
  {
    id: 'properties',
    label: 'Imóveis',
    description: 'Cadastro e manutenção do portfólio de imóveis.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar imóveis',
        description: 'Ver listagem, detalhes, histórico, fotos, anexos não sensíveis, captador principal e dados de vendedor/locador dentro do escopo.',
      },
      {
        id: 'create',
        label: 'Incluir imóveis',
        description: 'Cadastrar imóvel, vendedor/locador, definir captador principal, duplicar imóvel.',
      },
      {
        id: 'edit',
        label: 'Alterar imóveis',
        description: 'Editar dados gerais, status, valores, captador principal (se permitido), portais, dados de vendedor/locador.',
      },
      {
        id: 'manage',
        label: 'Gerenciar imóveis',
        description: 'Validar cadastro, gerenciar fotos/anexos, informações avançadas, portais, conta/carteira, mesclar, reatribuir fora do padrão.',
      },
      {
        id: 'export',
        label: 'Exportar imóveis',
        description: 'Exportar listagem de imóveis do escopo.',
      },
      {
        id: 'delete',
        label: 'Excluir imóveis',
        description: 'Excluir imóvel (ação rara).',
      },
      {
        id: 'view_sensitive_external',
        label: 'Ver dados sensíveis fora da filial',
        description: 'Permite ver vendedor/locador de imóveis fora da filial do usuário (permissão especial).',
      },
    ],
  },

  // ============================================
  // CONDOMÍNIOS
  // ============================================
  {
    id: 'condos',
    label: 'Condomínios',
    description: 'Cadastro de condomínios, características, construtoras.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar condomínios',
        description: 'Ver condomínios, detalhes, histórico, características, construtora, torres, fotos e anexos.',
      },
      {
        id: 'create',
        label: 'Incluir condomínios',
        description: 'Cadastrar condomínio, construtora associada, características base.',
      },
      {
        id: 'edit',
        label: 'Alterar condomínios',
        description: 'Editar dados, detalhes avançados, características e vínculos.',
      },
      {
        id: 'manage',
        label: 'Gerenciar condomínios',
        description: 'Gerenciar fotos, anexos, informações avançadas, mesclar condomínios, ajustar vínculos com atendimentos/negociações.',
      },
      {
        id: 'delete',
        label: 'Excluir condomínios',
        description: 'Excluir condomínio (ação rara).',
      },
    ],
  },

  // ============================================
  // ALUGUÉIS
  // ============================================
  {
    id: 'rentals',
    label: 'Aluguéis',
    description: 'Contratos, faturas, repasses, análises e régua de cobrança.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar aluguéis',
        description: 'Ver contratos, faturas, repasses e análises.',
      },
      {
        id: 'create',
        label: 'Incluir registros',
        description: 'Criar contratos, faturas, lançamentos de repasse.',
      },
      {
        id: 'edit',
        label: 'Alterar registros',
        description: 'Editar contratos, faturas, valores, datas.',
      },
      {
        id: 'manage',
        label: 'Gerenciar aluguéis',
        description: 'Aprovar repasses, configurar régua de cobrança, ações administrativas.',
      },
      {
        id: 'export',
        label: 'Exportar aluguéis',
        description: 'Exportar dados de aluguéis do escopo.',
      },
    ],
    submodules: [
      {
        id: 'rentals.contracts',
        label: 'Contratos',
        actions: [
          { id: 'view', label: 'Visualizar contratos', description: 'Ver listagem e detalhes de contratos.' },
          { id: 'create', label: 'Criar contratos', description: 'Cadastrar novos contratos.' },
          { id: 'edit', label: 'Editar contratos', description: 'Alterar dados dos contratos.' },
          { id: 'manage', label: 'Gerenciar contratos', description: 'Aprovar, encerrar, renovar contratos.' },
        ],
      },
      {
        id: 'rentals.invoices',
        label: 'Faturas',
        actions: [
          { id: 'view', label: 'Visualizar faturas', description: 'Ver faturas e histórico de pagamentos.' },
          { id: 'create', label: 'Criar faturas', description: 'Gerar novas faturas.' },
          { id: 'edit', label: 'Editar faturas', description: 'Alterar valores e datas de faturas.' },
          { id: 'manage', label: 'Gerenciar faturas', description: 'Baixar, estornar, cancelar faturas.' },
        ],
      },
      {
        id: 'rentals.transfers',
        label: 'Repasses',
        actions: [
          { id: 'view', label: 'Visualizar repasses', description: 'Ver repasses programados e realizados.' },
          { id: 'create', label: 'Criar repasses', description: 'Registrar novos repasses.' },
          { id: 'manage', label: 'Aprovar repasses', description: 'Aprovar e liberar repasses.' },
        ],
      },
      {
        id: 'rentals.analytics',
        label: 'Análises',
        actions: [
          { id: 'view', label: 'Visualizar análises', description: 'Ver dashboards e métricas de aluguéis.' },
          { id: 'export', label: 'Exportar análises', description: 'Exportar relatórios de análise.' },
        ],
      },
      {
        id: 'rentals.collection',
        label: 'Régua de Cobrança',
        actions: [
          { id: 'view', label: 'Visualizar régua', description: 'Ver configurações da régua de cobrança.' },
          { id: 'manage', label: 'Gerenciar régua', description: 'Configurar etapas e automações da cobrança.' },
        ],
      },
    ],
  },

  // ============================================
  // EQUIPES
  // ============================================
  {
    id: 'teams',
    label: 'Equipes',
    description: 'Gestão de equipes e membros.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar equipes',
        description: 'Ver listagem de equipes e detalhes permitidos.',
      },
      {
        id: 'edit',
        label: 'Alterar equipes',
        description: 'Criar equipes, editar membros e regras operacionais.',
      },
      {
        id: 'manage',
        label: 'Gerenciar equipes',
        description: 'Definir regras globais, limites, hierarquias e auditoria.',
      },
      {
        id: 'export',
        label: 'Exportar equipes',
        description: 'Exportar dados de equipes quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // LEADS
  // ============================================
  {
    id: 'leads',
    label: 'Leads',
    description: 'Leads e histórico operacional.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar leads',
        description: 'Ver leads e histórico conforme escopo.',
      },
      {
        id: 'edit',
        label: 'Alterar leads',
        description: 'Cadastrar, editar lead, alterar status, etapa e responsável.',
      },
      {
        id: 'manage',
        label: 'Gerenciar leads',
        description: 'Mesclar, excluir quando permitido e definir regras globais.',
      },
      {
        id: 'export',
        label: 'Exportar leads',
        description: 'Exportar leads quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // INDICADORES DE LEADS
  // ============================================
  {
    id: 'lead_indicators',
    label: 'Indicadores de Leads',
    description: 'Dashboards, campanhas e listas de leads.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar indicadores',
        description: 'Ver dashboards, métricas, campanhas e listas em modo leitura.',
      },
      {
        id: 'create',
        label: 'Incluir campanhas/listas',
        description: 'Criar campanha e lista.',
      },
      {
        id: 'edit',
        label: 'Alterar campanhas/listas',
        description: 'Editar campanha, lista, filtros, parâmetros.',
      },
      {
        id: 'manage',
        label: 'Gerenciar indicadores',
        description: 'Arquivar, encerrar, duplicar campanha, alterar regras globais.',
      },
      {
        id: 'export',
        label: 'Exportar indicadores',
        description: 'Exportar dados dentro do escopo.',
      },
    ],
    submodules: [
      {
        id: 'lead_indicators.campaigns',
        label: 'Campanhas',
        actions: [
          { id: 'view', label: 'Visualizar campanhas', description: 'Ver campanhas ativas e histórico.' },
          { id: 'create', label: 'Criar campanhas', description: 'Cadastrar novas campanhas.' },
          { id: 'edit', label: 'Editar campanhas', description: 'Alterar configurações de campanhas.' },
          { id: 'manage', label: 'Gerenciar campanhas', description: 'Arquivar, pausar, encerrar campanhas.' },
        ],
      },
    ],
  },

  // ============================================
  // USUÁRIOS
  // ============================================
  {
    id: 'users',
    label: 'Usuários',
    description: 'Gestão dos usuários internos da plataforma.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar usuários',
        description: 'Ver lista, detalhes, perfil, status, indicadores e histórico de atualizações.',
      },
      {
        id: 'create',
        label: 'Incluir usuários',
        description: 'Criar usuário.',
      },
      {
        id: 'edit',
        label: 'Alterar usuários',
        description: 'Editar dados do usuário, trocar equipe/filial (se permitido).',
      },
      {
        id: 'manage',
        label: 'Gerenciar usuários',
        description: 'Ativar, desativar, definir perfil/permissões, resetar acessos, revogar tokens, gerenciar vínculos.',
      },
      {
        id: 'export',
        label: 'Exportar usuários',
        description: 'Exportar listagem do escopo.',
      },
    ],
    submodules: [
      {
        id: 'users.automations',
        label: 'Automações do Usuário',
        description: 'Automações, cadências e gatilhos por usuário.',
        actions: [
          {
            id: 'view',
            label: 'Ver automações do usuário',
            description: 'Ver quais automações estão ligadas para o usuário.',
          },
          {
            id: 'manage',
            label: 'Gerenciar automações do usuário',
            description: 'Ativar, desativar, editar regras de automação do usuário.',
          },
        ],
      },
    ],
  },

  // ============================================
  // DISTRIBUIÇÃO
  // ============================================
  {
    id: 'distribution',
    label: 'Distribuição',
    description: 'Filas, históricos, captações e ações de venda.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar distribuição',
        description: 'Ver filas, histórico, captações e ações de venda em leitura.',
      },
      {
        id: 'create',
        label: 'Incluir filas/regras',
        description: 'Criar fila, regra, parâmetros de captação.',
      },
      {
        id: 'edit',
        label: 'Alterar regras',
        description: 'Editar regras, prioridades e condições.',
      },
      {
        id: 'manage',
        label: 'Gerenciar distribuição',
        description: 'Redistribuir, resetar, ações sistêmicas, gerenciar regras globais.',
      },
      {
        id: 'export',
        label: 'Exportar distribuição',
        description: 'Exportar relatórios de distribuição quando existir (sempre auditável).',
      },
    ],
  },

  // ============================================
  // MÓDULOS DE PODER (sem escopo dinâmico)
  // ============================================
  {
    id: 'access_control',
    label: 'Gestão de Acessos',
    description: 'Configuração de perfis e permissões (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar perfis de acesso',
        description: 'Acessar listagem de perfis e suas permissões.',
      },
      {
        id: 'manage_roles',
        label: 'Gerenciar perfis de acesso',
        description: 'Criar, editar ou remover perfis de acesso.',
      },
      {
        id: 'manage_permissions',
        label: 'Gerenciar permissões de perfis',
        description: 'Ajustar permissões atribuídas a cada perfil.',
      },
      {
        id: 'export',
        label: 'Exportar matriz de acessos',
        description: 'Exportar matriz de acessos quando existir (sempre auditável).',
      },
    ],
  },

  {
    id: 'roletao_management',
    label: 'Gestão de Roletão',
    description: 'Parâmetros globais do roletão: peso, fairness, regra bola preta (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar configurações do roletão',
        description: 'Ver regras globais de distribuição.',
      },
      {
        id: 'manage',
        label: 'Gerenciar roletão',
        description: 'Alterar parâmetros globais, pesos, fairness, regras especiais.',
      },
    ],
  },

  {
    id: 'api_management',
    label: 'Gestão API',
    description: 'Integrações externas e tokens de acesso (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar tokens de API',
        description: 'Consultar tokens de API e histórico de uso.',
      },
      {
        id: 'create',
        label: 'Gerar tokens de API',
        description: 'Criar novos tokens e definir escopos de integração.',
      },
      {
        id: 'revoke',
        label: 'Revogar tokens de API',
        description: 'Revogar tokens ativos e encerrar integrações.',
      },
      {
        id: 'export',
        label: 'Exportar chaves de API',
        description: 'Exportar relatório de chaves quando existir (sempre auditável).',
      },
    ],
  },

  {
    id: 'payments',
    label: 'Pagamentos',
    description: 'Controle de recebíveis, repasses e cobranças (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar dados financeiros',
        description: 'Consultar lançamentos, extratos e indicadores financeiros.',
      },
      {
        id: 'create',
        label: 'Registrar lançamentos',
        description: 'Inserir novos lançamentos, repasses ou cobranças.',
      },
      {
        id: 'edit',
        label: 'Editar lançamentos',
        description: 'Ajustar valores, datas ou classificações.',
      },
      {
        id: 'approve',
        label: 'Aprovar pagamentos',
        description: 'Aprovar pagamentos, repasses e liberações financeiras.',
      },
      {
        id: 'export',
        label: 'Exportar pagamentos',
        description: 'Exportar relatórios financeiros quando existir (sempre auditável).',
      },
    ],
  },

  {
    id: 'reports_management',
    label: 'Gestão de Relatórios',
    description: 'Configuração e templates de relatórios (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar relatórios',
        description: 'Acessar dashboards analíticos e relatórios.',
      },
      {
        id: 'export',
        label: 'Exportar relatórios',
        description: 'Gerar exportações em CSV, XLSX.',
      },
      {
        id: 'export_sensitive',
        label: 'Exportar dados sensíveis',
        description: 'Exportar relatórios com dados pessoais ou sensíveis.',
      },
      {
        id: 'manage',
        label: 'Gerenciar relatórios',
        description: 'Criar e editar templates de relatórios.',
      },
    ],
  },

  {
    id: 'properties_management',
    label: 'Gestão de Imóveis',
    description: 'Regras globais de imóveis, validação, portais (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar configurações',
        description: 'Ver regras e configurações globais de imóveis.',
      },
      {
        id: 'manage',
        label: 'Gerenciar configurações',
        description: 'Alterar regras de validação, campos obrigatórios, integrações de portais.',
      },
      {
        id: 'export',
        label: 'Exportar estruturas',
        description: 'Exportar estruturas e parametrizações quando existir (sempre auditável).',
      },
    ],
  },

  {
    id: 'condos_management',
    label: 'Gestão de Condomínios',
    description: 'Regras globais de condomínios, estruturas e auditoria.',
    actions: [
      {
        id: 'view',
        label: 'Visualizar configurações',
        description: 'Ver estruturas globais e parâmetros de condomínios.',
      },
      {
        id: 'edit',
        label: 'Alterar configurações',
        description: 'Criar ou editar estruturas e tabelas de condomínios.',
      },
      {
        id: 'manage',
        label: 'Gerenciar configurações',
        description: 'Definir regras globais, exclusões críticas e auditoria.',
      },
      {
        id: 'export',
        label: 'Exportar estruturas',
        description: 'Exportar dados de condomínios quando existir (sempre auditável).',
      },
    ],
  },

  {
    id: 'leads_management',
    label: 'Gestão de Leads',
    description: 'Regras de leads, arquivamento, estrutura (módulo de poder).',
    actions: [
      {
        id: 'view',
        label: 'Visualizar configurações',
        description: 'Ver regras e configurações de leads.',
      },
      {
        id: 'manage',
        label: 'Gerenciar configurações',
        description: 'Alterar regras de arquivamento, campos, estrutura de funil.',
      },
      {
        id: 'export',
        label: 'Exportar regras',
        description: 'Exportar regras de leads quando existir (sempre auditável).',
      },
    ],
  },
];

// Função para achatar módulos e submódulos em lista de permissões
function flattenModules(modules: PermissionModule[], parentPrefix = ''): Permission[] {
  const permissions: Permission[] = [];

  for (const mod of modules) {
    const moduleId = parentPrefix ? `${parentPrefix}.${mod.id.split('.').pop()}` : mod.id;

    for (const action of mod.actions) {
      permissions.push({
        id: `${moduleId}.${action.id}`,
        name: action.label,
        description: action.description,
        module: {
          id: moduleId,
          label: mod.label,
        },
        action: {
          id: action.id,
          label: action.label,
        },
      });
    }

    if (mod.submodules) {
      permissions.push(...flattenModules(mod.submodules, moduleId));
    }
  }

  return permissions;
}

export const PERMISSIONS: Permission[] = flattenModules(PERMISSION_MODULES);

// Helper para obter todas as permissões de um módulo
export function getModulePermissions(moduleId: string): string[] {
  return PERMISSIONS
    .filter(p => p.module.id === moduleId || p.module.id.startsWith(`${moduleId}.`))
    .map(p => p.id);
}

// Helper para verificar se uma permissão existe
export function permissionExists(permissionId: string): boolean {
  return PERMISSIONS.some(p => p.id === permissionId);
}
