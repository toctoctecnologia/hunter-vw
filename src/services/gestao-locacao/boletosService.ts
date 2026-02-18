import { invoicesMock } from '@/mocks/gestao-locacao/invoices.mock';
import { shouldUseGestaoLocacaoMocks } from './getGestaoLocacaoService';

export type BoletoStatus = 'Pago' | 'Em aberto' | 'Em atraso';

export interface Boleto {
  id: string;
  numero: string;
  contrato: string;
  locatario: string;
  locador: string;
  imovel: string;
  valor: string;
  competencia: string;
  vencimento: string;
  multaJuros: string;
  formaPagamento: string;
  status: BoletoStatus;
  dataPagamento?: string;
  diasAtraso?: number;
}

export interface BoletosFilters extends Record<string, string> {
  periodo: string;
  vencimento: string;
  status: string;
  locatario: string;
  locador: string;
  imovel: string;
  formaPagamento: string;
  busca: string;
}

const boletosMock: Boleto[] = invoicesMock;

const applyFilters = (filters: Partial<BoletosFilters>) =>
  boletosMock.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.periodo && item.competencia !== filters.periodo) return false;
    if (filters.locatario && item.locatario !== filters.locatario) return false;
    if (filters.locador && item.locador !== filters.locador) return false;
    if (filters.imovel && item.imovel !== filters.imovel) return false;
    if (filters.formaPagamento && item.formaPagamento !== filters.formaPagamento) return false;
    if (filters.busca) {
      const query = filters.busca.toLowerCase();
      if (!item.numero.toLowerCase().includes(query) && !item.contrato.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

const currencyToNumber = (value: string) =>
  Number(value.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));

export const listBoletos = (filters: Partial<BoletosFilters>) => {
  if (!shouldUseGestaoLocacaoMocks()) {
    return { items: [] };
  }
  return { items: applyFilters(filters) };
};

export const summaryBoletos = (filters: Partial<BoletosFilters>) => {
  const items = shouldUseGestaoLocacaoMocks() ? applyFilters(filters) : [];
  const totalFaturado = items.reduce((total, item) => total + currencyToNumber(item.valor), 0);
  const totalPago = items
    .filter((item) => item.status === 'Pago')
    .reduce((total, item) => total + currencyToNumber(item.valor), 0);
  const totalAberto = items
    .filter((item) => item.status === 'Em aberto')
    .reduce((total, item) => total + currencyToNumber(item.valor), 0);
  const totalAtraso = items
    .filter((item) => item.status === 'Em atraso')
    .reduce((total, item) => total + currencyToNumber(item.valor), 0);

  return {
    summary: {
      totalFaturado,
      totalPago,
      totalAberto,
      totalAtraso,
    },
  };
};
