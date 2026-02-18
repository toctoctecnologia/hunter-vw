import { getGestaoLocacaoService } from './getGestaoLocacaoService';

export type ContratoStatus = 'Ativo' | 'Em encerramento' | 'Pendente' | 'Encerrado';

export interface ContratoLocacao {
  id: string;
  codigo: string;
  imovel: {
    tipo: string;
    codigo: string;
    endereco: string;
  };
  locador: string;
  locatario: string;
  reajuste: string;
  inicio: string;
  fim: string;
  valorAluguel: string;
  diaVencimento: string;
  tipoGarantia: string;
  status: ContratoStatus;
  inadimplente: boolean;
  saldoAberto: string;
  diasParaVencimento: number;
  motivoEncerramento?: string;
}

export interface ContratosFilters extends Record<string, string> {
  vigencia: string;
  locador: string;
  locatario: string;
  imovel: string;
  garantia: string;
  status: string;
  faixaValor: string;
  diaVencimento: string;
}

export const listContratos = (filters: Partial<ContratosFilters>) =>
  getGestaoLocacaoService().listContracts(filters as Record<string, string>);

export const summaryContratos = (filters: Partial<ContratosFilters>) => {
  const { items } = listContratos(filters);
  const ativos = items.filter((item) => item.status === 'Ativo').length;
  const encerramento = items.filter((item) => item.status === 'Em encerramento').length;
  const inadimplentes = items.filter((item) => item.inadimplente).length;
  const vencendo30 = items.filter((item) => item.diasParaVencimento <= 30).length;
  const vencendo60 = items.filter((item) => item.diasParaVencimento > 30 && item.diasParaVencimento <= 60).length;
  const vencendo90 = items.filter((item) => item.diasParaVencimento > 60 && item.diasParaVencimento <= 90).length;

  return {
    summary: {
      ativos: String(ativos),
      encerramento: String(encerramento),
      inadimplentes: String(inadimplentes),
      vencendo30: String(vencendo30),
      vencendo60: String(vencendo60),
      vencendo90: String(vencendo90),
    },
  };
};
