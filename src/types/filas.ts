export type FilaTipo = 'Personalizada' | 'Padrão';

export interface Regra {
  id: string;
  campo: 'titulo'|'bairro'|'cidade'|'diasMemoria'|'fonte'|'etiqueta'|'keywords'|'precoMaiorQue'|'precoMenorQue'|'tipoNegociacao'|'facebookPagina'|'facebookFormulario'|'listaCodigos'|'limiteLeadsAbertos'|'captacaoPorEquipe'|'captacaoPorUsuario'|'origem'|'statusLead'|'prioridade';
  operador?: 'contém'|'igual'|'maior'|'menor'|'entre'|'qualquer';
  valor: string | number | [number, number];
}

export interface UsuarioFila {
  id: string;
  nome: string;
  email?: string;
  ativo: boolean;             // toggle individual
  disponivelAgora: boolean;   // depende do check-in/horário
  ordemRotacao: number;       // posição na rotação
  ultimoCheckin?: string;     // timestamp do último check-in
  limiteLeadsAbertos?: number; // máximo de leads abertos simultâneos
  observacao?: string;         // comentários adicionais
}

export interface ConfigAvancadas {
  redistribuicaoAtiva: boolean;        // Se SIM, não atendidos reencaminham
  preservarPosicaoIndisponivel: boolean; // Se SIM, volta à mesma posição
  corFila?: string;                     // Cor da régua lateral do card
  destinoDistribuicao?: 'roletao' | 'proximo_fila' | 'nao_redistribui';
  tempoLimiteAtendimento?: number;      // Tempo em minutos antes de ir para roletão/próximo
  pausaEntreCorretores?: number;        // Tempo em minutos entre cada passagem (só para proximo_fila)
  horarioFuncionamentoInicio?: string;  // Horário início funcionamento (ex: '09:00')
  horarioFuncionamentoFim?: string;     // Horário fim funcionamento (ex: '18:00')
}

export interface ConfigHorarioCheckin {
  habilitarJanela: boolean;
  diasSemana: Array<'dom'|'seg'|'ter'|'qua'|'qui'|'sex'|'sab'>;
  horaInicio: string; // '08:00'
  horaFim: string;    // '18:00'
  exigeCheckin: boolean;
  habilitarQrCode: boolean;
  qrCodeUrl?: string;
}

export interface Fila {
  id: string;
  tipo: FilaTipo;
  nome: string;
  prioridade: number;              // ordem global (1 = mais alta)
  regras: Regra[];
  usuarios: UsuarioFila[];
  proximoUsuarioId?: string;       // calculado pela rotação
  leadsRecebidos?: number;
  ativosNaFila?: number;           // quantidade de usuários ativos
  configHorarioCheckin: ConfigHorarioCheckin;
  configAvancadas: ConfigAvancadas;
  habilitada: boolean;             // switch do card
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditoriaEvento {
  id: string;
  tipo: 'CRIACAO'|'EDICAO'|'EXCLUSAO'|'REDISTRIBUICAO'|'REORDENACAO'|'CHECKIN'|'CHECKOUT'|'DISTRIBUICAO'|'LEAD_REPRESADO';
  descricao: string;
  autor: string;
  timestamp: string;
  filaId?: string;
  leadId?: string;
  usuarioId?: string;
  detalhes?: Record<string, any>;
}

export interface CaptacaoLead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  origem: string;
  equipe?: string;
  captador?: string;
  filaNome?: string;
  campanha?: string;
  formulario?: string;
  status: 'novo'|'distribuido'|'atendido'|'perdido'|'represado';
  filaId?: string;
  usuarioId?: string;
  dataCaptura: string;
  dadosAdicionais?: Record<string, any>;
}

export interface CheckinStatus {
  usuarioId: string;
  nome: string;
  email: string;
  status: 'online'|'offline'|'ausente';
  ultimoCheckin?: string;
  ultimoCheckout?: string;
  filaIds: string[];
  leadsAtivos: number;
}

// Campos disponíveis para regras
export const CAMPOS_REGRA = [
  { value: 'titulo', label: 'Título do Lead' },
  { value: 'bairro', label: 'Bairro' },
  { value: 'cidade', label: 'Cidade' },
  { value: 'diasMemoria', label: 'Dias de memória' },
  { value: 'fonte', label: 'Fonte' },
  { value: 'etiqueta', label: 'Etiqueta' },
  { value: 'keywords', label: 'Keywords' },
  { value: 'precoMaiorQue', label: 'Preço (maior que)' },
  { value: 'precoMenorQue', label: 'Preço (menor que)' },
  { value: 'tipoNegociacao', label: 'Tipo de Negociação' },
  { value: 'facebookPagina', label: 'Facebook Leads - Nome da página' },
  { value: 'facebookFormulario', label: 'Facebook Leads - Nome do formulário' },
  { value: 'listaCodigos', label: 'Lista de códigos' },
  { value: 'limiteLeadsAbertos', label: 'Limite de leads abertos (Novo e Em negociação)' },
  { value: 'captacaoPorEquipe', label: 'Captação por equipe' },
  { value: 'captacaoPorUsuario', label: 'Captação por usuário' },
] as const;

export const OPERADORES_REGRA = [
  { value: 'contém', label: 'contém' },
  { value: 'igual', label: 'igual a' },
  { value: 'maior', label: 'maior que' },
  { value: 'menor', label: 'menor que' },
  { value: 'entre', label: 'entre' },
  { value: 'qualquer', label: 'qualquer valor' },
] as const;

export const DIAS_SEMANA = [
  { value: 'dom', label: 'Dom' },
  { value: 'seg', label: 'Seg' },
  { value: 'ter', label: 'Ter' },
  { value: 'qua', label: 'Qua' },
  { value: 'qui', label: 'Qui' },
  { value: 'sex', label: 'Sex' },
  { value: 'sab', label: 'Sáb' },
] as const;
