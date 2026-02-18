export interface DistribuicaoConfig {
  timeoutMin: number;
  redistribuicaoGlobal: boolean;
  horarioInicio: string;
  horarioFim: string;
}

export interface DistribuicaoHistorico {
  id: number;
  data: string;
  evento: string;
  lead: string;
  de?: string;
  para?: string;
  fila: string;
  observacao?: string;
}

export interface RoletaoResponse<T = any> {
  leads: T[];
  config: DistribuicaoConfig;
}

export interface Fila {
  id: number;
  nome: string;
  regras: string[];
  redistribuicao: boolean;
  preservarPosicao: boolean;
  ativo: boolean;
  ordem: number;
}
