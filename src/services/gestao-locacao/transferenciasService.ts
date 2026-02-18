import { transfersMock } from '@/mocks/gestao-locacao/transfers.mock';
import { shouldUseGestaoLocacaoMocks } from './getGestaoLocacaoService';

export type TransferenciaStatus = 'Pendente' | 'Processando' | 'Concluída' | 'Cancelada';

export interface Transferencia {
  id: string;
  locador: string;
  locatario: string;
  contrato: string;
  imovel: string;
  competencia: string;
  valorBruto: string;
  comissao: string;
  valorRetido: string;
  valorLiquido: string;
  status: TransferenciaStatus;
  dataPrevista: string;
  dataExecucao?: string;
  comprovante?: string;
  motivoRetencao?: string;
  metodo: string;
  responsavel: string;
}

export interface TransferenciasFilters extends Record<string, string> {
  periodo: string;
  locador: string;
  locatario: string;
  imovel: string;
  status: string;
  competencia: string;
  metodo: string;
  responsavel: string;
}

const transferenciasMock: Transferencia[] = transfersMock;

const applyFilters = (filters: Partial<TransferenciasFilters>) =>
  transferenciasMock.filter((item) => {
    if (filters.locador && item.locador !== filters.locador) return false;
    if (filters.locatario && item.locatario !== filters.locatario) return false;
    if (filters.imovel && item.imovel !== filters.imovel) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.competencia && item.competencia !== filters.competencia) return false;
    if (filters.metodo && item.metodo !== filters.metodo) return false;
    if (filters.responsavel && item.responsavel !== filters.responsavel) return false;
    return true;
  });

const currencyToNumber = (value: string) =>
  Number(value.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));

export const listTransferencias = (filters: Partial<TransferenciasFilters>) => {
  if (!shouldUseGestaoLocacaoMocks()) {
    return { items: [] };
  }
  return { items: applyFilters(filters) };
};

export const summaryTransferencias = (filters: Partial<TransferenciasFilters>) => {
  const items = shouldUseGestaoLocacaoMocks() ? applyFilters(filters) : [];
  const totalTransferir = items
    .filter((item) => item.status !== 'Concluída')
    .reduce((total, item) => total + currencyToNumber(item.valorLiquido), 0);
  const totalTransferido = items
    .filter((item) => item.status === 'Concluída')
    .reduce((total, item) => total + currencyToNumber(item.valorLiquido), 0);
  const totalRetido = items.reduce((total, item) => total + currencyToNumber(item.valorRetido), 0);
  const totalComissao = items.reduce((total, item) => total + currencyToNumber(item.comissao), 0);

  return {
    summary: {
      totalTransferir,
      totalTransferido,
      totalRetido,
      totalComissao,
    },
  };
};
