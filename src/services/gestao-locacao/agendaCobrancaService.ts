import { shouldUseGestaoLocacaoMocks } from './getGestaoLocacaoService';

export interface AgendaCobrancaFilters extends Record<string, string> {
  periodo: string;
  regra: string;
  status: string;
  responsavel: string;
}

export interface AgendaRule {
  id: string;
  nome: string;
  status: string;
  etapas: number;
  canais: string;
  atualizacao: string;
}

export interface AgendaContrato {
  id: string;
  contrato: string;
  imovel: string;
  locador: string;
  locatario: string;
  regra: string;
  status: string;
}

export interface AgendaEvento {
  id: string;
  data: string;
  tipo: string;
  canal: string;
  acao: string;
  contrato: string;
  boleto: string;
  status: string;
}

const rulesMock: AgendaRule[] = [
  { id: '1', nome: 'Agenda padrão da carteira', status: 'Ativa', etapas: 5, canais: 'Email, WhatsApp', atualizacao: 'Hoje' },
  { id: '2', nome: 'Agenda premium', status: 'Ativa', etapas: 7, canais: 'Email, SMS, Ligação', atualizacao: 'Há 2 dias' },
];

const contratosMock: AgendaContrato[] = [
  { id: '1', contrato: '2093477/1', imovel: 'Apartamento | Rua Exemplo, 100', locador: 'Maria Santos', locatario: 'Luiz Victor Ferreira', regra: 'Agenda padrão', status: 'Ativo' },
  { id: '2', contrato: '1477462/1', imovel: 'Casa | Rua das Flores, 250', locador: 'João Exemplo', locatario: 'Carolina Lima', regra: 'Agenda premium', status: 'Ativo' },
];

const eventosMock: AgendaEvento[] = [
  { id: '1', data: '08/12/2024 09:00', tipo: 'Pré-vencimento', canal: 'WhatsApp', acao: 'Enviar mensagem', contrato: '2093477/1', boleto: 'FAT-2024-001', status: 'Previsto' },
  { id: '2', data: '10/12/2024 14:00', tipo: 'Pós-vencimento', canal: 'Ligação', acao: 'Notificar responsável', contrato: '1477462/1', boleto: 'FAT-2024-002', status: 'Previsto' },
  { id: '3', data: '12/12/2024 10:00', tipo: 'Confirmação de pagamento', canal: 'Email', acao: 'Confirmar baixa', contrato: '2004101/1', boleto: 'FAT-2024-003', status: 'Previsto' },
];

export const listRules = (_filters: Partial<AgendaCobrancaFilters>) => ({
  items: shouldUseGestaoLocacaoMocks() ? rulesMock : [],
});
export const listLinkedContracts = (_filters: Partial<AgendaCobrancaFilters>) => ({
  items: shouldUseGestaoLocacaoMocks() ? contratosMock : [],
});
export const listScheduledEvents = (_filters: Partial<AgendaCobrancaFilters>) => ({
  items: shouldUseGestaoLocacaoMocks() ? eventosMock : [],
});

export const summaryAgendaCobranca = (_filters: Partial<AgendaCobrancaFilters>) => ({
  summary: {
    regrasAtivas: shouldUseGestaoLocacaoMocks() ? rulesMock.length : 0,
    contratosVinculados: shouldUseGestaoLocacaoMocks() ? contratosMock.length : 0,
    agendamentosPrevistos: shouldUseGestaoLocacaoMocks() ? eventosMock.length : 0,
  },
});
