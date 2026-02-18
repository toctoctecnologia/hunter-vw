import type { Regra } from './filas';

export type CadenciaStatus = 'ativa' | 'pausada';

export type CadenciaGatilhoTipo =
  | 'novo-lead'
  | 'mudanca-etapa'
  | 'negocio-fechado'
  | 'sem-resposta'
  | 'lead-sem-atividade';

export type CadenciaPassoTipo = 'whatsapp' | 'ligacao' | 'email' | 'visita';

export interface CadenciaRegraTabela {
  id: string;
  titulo: string;
  detalhes: string;
  destaque?: string;
  categoria?: string;
  ativa: boolean;
}

export interface CadenciaPasso {
  id: string;
  nome: string;
  tipo: CadenciaPassoTipo;
  prazo: string;
  template?: string;
  responsavel: string;
  canal?: string;
  ativo: boolean;
}

export interface CadenciaGatilhoConfig {
  tipo: CadenciaGatilhoTipo;
  etapasFunil?: string[];
  posVendaIntervalos?: number[];
  tempoSemRespostaHoras?: number;
  tempoInatividadeDias?: number;
}

export interface CadenciaTentativasConfig {
  minimoObrigatorio: number;
  intervalo: string;
  canais: string[];
  resultadoEsperado: 'Contato estabelecido' | 'Sem resposta';
  acaoPosFalha: 'descartar' | 'redistribuir' | 'tarefa-gestor';
  motivoPosFalha?: string;
  redistribuir?: boolean;
  criarTarefaGestor?: boolean;
}

export interface CadenciaRegrasResultado {
  respondeu: string;
  marcouVisita: string;
  negocioFechado: string;
}

export interface CadenciaResumoExecucao {
  janelaEstimativa: string;
  exemplosEntrada: string[];
  exemplosExclusao: string[];
}

export interface Cadencia {
  id: string;
  nome: string;
  descricao: string;
  status: CadenciaStatus;
  prioridade: number;
  cor: string;
  responsavel: {
    tipo: 'equipe' | 'usuario';
    nome: string;
  };
  equipe?: string;
  evento: string;
  canais: string[];
  sla?: string;
  tags?: string[];
  regrasTabela: CadenciaRegraTabela[];
  regrasEntrada: Regra[];
  tentativas: CadenciaTentativasConfig;
  passos: CadenciaPasso[];
  gatilho: CadenciaGatilhoConfig;
  regrasResultado: CadenciaRegrasResultado;
  resumo: CadenciaResumoExecucao;
}

export interface CadenciaFiltro {
  status?: CadenciaStatus | '';
  gatilho?: CadenciaGatilhoTipo | '';
  responsavel?: string;
  canal?: string;
  sla?: string;
}

export interface CadenciaPreview {
  totalPassos: number;
  totalAutomacoes: number;
  janela: string;
}
