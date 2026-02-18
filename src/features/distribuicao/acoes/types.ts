export type AcaoStatus = 'agendada' | 'em_andamento' | 'pausada' | 'encerrada';

export type AcaoRecorrenciaTipo = 'nao_recorrente' | 'diaria' | 'semanal' | 'mensal';

export interface AcaoRecorrencia {
  tipo: AcaoRecorrenciaTipo;
  diasSemana?: Array<'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'>;
  intervalo?: number;
  horario?: string;
  dataFim?: string | null;
}

export interface AcaoDistribuicao {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'checkin' | 'notificacao' | 'redistribuicao';
  redistribuicaoOrigem?: 'existentes' | 'upload';
  origemLeads?: 'existentes' | 'upload';
  filaId?: string;
  filaNome?: string;
  status: AcaoStatus;
  inicioPrevisto: string;
  terminoPrevisto?: string | null;
  totalParticipantes: number;
  participantesAtivos: number;
  leadsDistribuidos: number;
  entregasPrevistas: number;
  notificacoesEnviadas: number;
  responsavel: string;
  ultimaAtualizacao: string;
  recorrencia?: AcaoRecorrencia;
}

export interface AcoesMetricas {
  totalAcoes: number;
  ativas: number;
  agendadas: number;
  pausadas: number;
  encerradas: number;
  leadsDistribuidos: number;
  participantesEngajados: number;
  notificacoesPendentes: number;
}

export interface AcaoParticipante {
  id: string;
  nome: string;
  email: string;
  papel: 'corretor' | 'coordenador' | 'suporte';
  status: 'ativo' | 'pausado' | 'removido';
  leadsRecebidos: number;
  distribuicoesRealizadas: number;
  ultimoEvento: string;
  engajamento: number;
}

export interface AcaoHistoricoEvento {
  id: string;
  timestamp: string;
  titulo: string;
  descricao: string;
  tipo: 'status' | 'notificacao' | 'participante' | 'distribuicao' | 'recorrencia';
  autor?: string;
  meta?: Record<string, string | number>;
}

export interface NovaAcaoPayload {
  titulo: string;
  descricao: string;
  tipo: AcaoDistribuicao['tipo'];
  redistribuicaoOrigem?: AcaoDistribuicao['redistribuicaoOrigem'];
  origemLeads?: AcaoDistribuicao['origemLeads'];
  filaId: string;
  inicioPrevisto: string;
  terminoPrevisto?: string | null;
  participantes: string[];
  recorrencia?: AcaoRecorrencia;
  enviarNotificacao?: boolean;
  mensagemNotificacao?: string;
}
