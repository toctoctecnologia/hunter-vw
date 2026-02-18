import { getGestaoVendasService } from './getGestaoVendasService';

export interface SaleTransferTask {
  id: string;
  contrato: string;
  tarefa: string;
  status: string;
  responsavel: string;
  dataPrevista: string;
  dataConclusao: string;
  anexos: string;
}

export interface SaleTransferFilters extends Record<string, string> {
  status: string;
  responsavel: string;
  contrato: string;
}

export const listSaleTransfers = (filters: Partial<SaleTransferFilters>) =>
  getGestaoVendasService().listTransfers(filters as Record<string, string>);

export const createSaleTransfer = (transfer: SaleTransferTask) => ({
  ...transfer,
  id: transfer.id || String(Date.now()),
});

export const updateSaleTransfer = (transfer: SaleTransferTask) => ({
  ...transfer,
});
