import { getGestaoVendasService } from './getGestaoVendasService';

export interface SaleCommission {
  id: string;
  contrato: string;
  corretor: string;
  percentual: string;
  valorBruto: string;
  retencoes: string;
  valorLiquido: string;
  status: string;
  dataPrevista: string;
  dataPaga: string;
}

export interface SaleCommissionFilters extends Record<string, string> {
  status: string;
  corretor: string;
  contrato: string;
}

export const listSaleCommissions = (filters: Partial<SaleCommissionFilters>) =>
  getGestaoVendasService().listCommissions(filters as Record<string, string>);

export const createSaleCommission = (commission: SaleCommission) => ({
  ...commission,
  id: commission.id || String(Date.now()),
});

export const updateSaleCommission = (commission: SaleCommission) => ({
  ...commission,
});
