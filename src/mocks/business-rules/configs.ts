export interface IntervaloConfig {
  de: number;
  ate: number;
}

export interface DadosConfig {
  avaliacao: {
    venda: IntervaloConfig;
    locacao: IntervaloConfig;
    atualizacaoVenda: IntervaloConfig;
    atualizacaoAluguel: IntervaloConfig;
    atualizacaoLancamento: IntervaloConfig;
    insercaoAtendimento: IntervaloConfig;
    interacaoLocacao: IntervaloConfig;
  };
  marcaDagua: {
    habilitada: boolean;
    posicao: 'superior' | 'inferior';
    tamanho: number;
  };
  agenda: {
    janelaInicio: string;
    janelaFim: string;
    duracaoPadrao: number;
  };
  portais: {
    enviarFotosCondominio: boolean;
    ordemMidia: string;
  };
  pontuacoes: {
    corretorVenda: { captacao: number; visita: number; proposta: number; fechamento: number };
    corretorAluguel: { captacao: number; visita: number; proposta: number; fechamento: number };
  };
}

export interface FunilStage {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export interface FunilConfig {
  limiteEtapas: number;
  etapas: FunilStage[];
}

export interface AuxTableItem {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface AuxTableConfig {
  id: string;
  nome: string;
  descricao: string;
  items: AuxTableItem[];
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: 'texto' | 'numero' | 'select' | 'booleano';
  required: boolean;
  helper?: string;
}

export interface FormConfig {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  fields: FormFieldConfig[];
}

export const initialDadosConfig: DadosConfig = {
  avaliacao: {
    venda: { de: 350000, ate: 1800000 },
    locacao: { de: 1800, ate: 8900 },
    atualizacaoVenda: { de: 15, ate: 90 },
    atualizacaoAluguel: { de: 10, ate: 60 },
    atualizacaoLancamento: { de: 20, ate: 120 },
    insercaoAtendimento: { de: 1, ate: 7 },
    interacaoLocacao: { de: 2, ate: 14 },
  },
  marcaDagua: {
    habilitada: true,
    posicao: 'inferior',
    tamanho: 14,
  },
  agenda: {
    janelaInicio: '08:00',
    janelaFim: '19:00',
    duracaoPadrao: 60,
  },
  portais: {
    enviarFotosCondominio: true,
    ordemMidia: 'Fotos > Plantas > Tour 360 > Vídeos',
  },
  pontuacoes: {
    corretorVenda: { captacao: 3, visita: 2, proposta: 3, fechamento: 5 },
    corretorAluguel: { captacao: 2, visita: 2, proposta: 2, fechamento: 4 },
  },
};

export const initialFunilConfig: FunilConfig = {
  limiteEtapas: 10,
  etapas: [
    { id: 'novo', nome: 'Novo', descricao: 'Lead recebido', ativo: true },
    { id: 'contato', nome: 'Contato', descricao: 'Primeiro contato realizado', ativo: true },
    { id: 'qualificado', nome: 'Qualificado', descricao: 'Interesse confirmado', ativo: true },
    { id: 'proposta', nome: 'Proposta', descricao: 'Proposta enviada', ativo: true },
    { id: 'fechado', nome: 'Fechado', descricao: 'Ganho ou perdido', ativo: true },
  ],
};

export const initialAuxTables: AuxTableConfig[] = [
  {
    id: 'tipos-imoveis',
    nome: 'Tipos de imóveis',
    descricao: 'Listagem e governança de tipos de imóveis.',
    items: [
      { id: 'apto', nome: 'Apartamento', ativo: true },
      { id: 'casa', nome: 'Casa', ativo: true },
      { id: 'cobertura', nome: 'Cobertura', ativo: true },
    ],
  },
  {
    id: 'cidades',
    nome: 'Cidades',
    descricao: 'Domínio territorial para cadastros e funil.',
    items: [
      { id: 'sp', nome: 'São Paulo', ativo: true },
      { id: 'campinas', nome: 'Campinas', ativo: true },
      { id: 'santos', nome: 'Santos', ativo: true },
    ],
  },
  {
    id: 'bancos',
    nome: 'Bancos',
    descricao: 'Bancos permitidos para recebimento.',
    items: [
      { id: 'itau', nome: 'Itaú', ativo: true },
      { id: 'bradesco', nome: 'Bradesco', ativo: true },
      { id: 'caixa', nome: 'Caixa', ativo: true },
    ],
  },
  {
    id: 'profissoes',
    nome: 'Profissões',
    descricao: 'Domínio para propostas e formulários.',
    items: [
      { id: 'adv', nome: 'Advogado', ativo: true },
      { id: 'eng', nome: 'Engenheiro', ativo: true },
      { id: 'dev', nome: 'Desenvolvedor', ativo: true },
    ],
  },
  {
    id: 'nacionalidades',
    nome: 'Nacionalidades',
    descricao: 'Suporte para documentação e propostas.',
    items: [
      { id: 'br', nome: 'Brasileira', ativo: true },
      { id: 'pt', nome: 'Portuguesa', ativo: true },
      { id: 'it', nome: 'Italiana', ativo: true },
    ],
  },
  {
    id: 'tipos-telefone',
    nome: 'Tipos de telefone',
    descricao: 'Categorias de contato.',
    items: [
      { id: 'cel', nome: 'Celular', ativo: true },
      { id: 'fixo', nome: 'Fixo', ativo: true },
      { id: 'com', nome: 'Comercial', ativo: true },
    ],
  },
  {
    id: 'tipos-atendimento',
    nome: 'Tipos de atendimento',
    descricao: 'Motivos e naturezas de atendimento.',
    items: [
      { id: 'captacao', nome: 'Captação', ativo: true },
      { id: 'locacao', nome: 'Locação', ativo: true },
      { id: 'venda', nome: 'Venda', ativo: true },
    ],
  },
  {
    id: 'motivos-descarte',
    nome: 'Motivos de descarte',
    descricao: 'Motivos padronizados para encerramento.',
    items: [
      { id: 'preco', nome: 'Preço fora', ativo: true },
      { id: 'perfil', nome: 'Fora do perfil', ativo: true },
      { id: 'duplicado', nome: 'Duplicado', ativo: true },
    ],
  },
  {
    id: 'motivos-parecer',
    nome: 'Motivos de parecer',
    descricao: 'Justificativas para parecer técnico.',
    items: [
      { id: 'documento', nome: 'Documento pendente', ativo: true },
      { id: 'analise', nome: 'Em análise', ativo: true },
    ],
  },
];

export const initialFormConfigs: FormConfig[] = [
  {
    id: 'captacao',
    nome: 'Ficha de captação',
    descricao: 'Formulário para captação de imóveis.',
    ativo: true,
    fields: [
      { id: 'titulo', label: 'Título do imóvel', type: 'texto', required: true, helper: 'Como o imóvel será identificado' },
      { id: 'valor', label: 'Valor estimado', type: 'numero', required: true },
      { id: 'canal', label: 'Canal de origem', type: 'select', required: true },
      { id: 'exclusivo', label: 'Exclusivo', type: 'booleano', required: false },
    ],
  },
  {
    id: 'visita',
    nome: 'Formulário de visita',
    descricao: 'Checklist obrigatório para visitas.',
    ativo: true,
    fields: [
      { id: 'data', label: 'Data da visita', type: 'texto', required: true },
      { id: 'horario', label: 'Horário', type: 'texto', required: true },
      { id: 'responsavel', label: 'Responsável', type: 'texto', required: true },
      { id: 'observacoes', label: 'Observações', type: 'texto', required: false },
    ],
  },
];
