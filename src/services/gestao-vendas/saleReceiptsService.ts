import { getGestaoVendasService } from './getGestaoVendasService';

export interface SaleReceipt {
  id: string;
  contrato: string;
  cliente: string;
  status: string;
  formaPagamento: string;
  valor: string;
  vencimento: string;
  dataPagamento: string;
}

export interface SaleReceiptFilters extends Record<string, string> {
  status: string;
  periodo: string;
  formaPagamento: string;
  contrato: string;
  cliente: string;
}

export const listSaleReceipts = (filters: Partial<SaleReceiptFilters>) =>
  getGestaoVendasService().listReceipts(filters as Record<string, string>);

export const createSaleReceipt = (receipt: SaleReceipt) => ({
  ...receipt,
  id: receipt.id || String(Date.now()),
});

export const updateSaleReceipt = (receipt: SaleReceipt) => ({
  ...receipt,
});
