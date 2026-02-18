import { getGestaoVendasService } from './getGestaoVendasService';

export interface SaleEvent {
  id: string;
  contrato: string;
  titulo: string;
  data: string;
  horario: string;
  responsavel: string;
  status: string;
  origem: string;
}

export interface SaleEventFilters extends Record<string, string> {
  status: string;
  responsavel: string;
  periodo: string;
  tipo: string;
}

export const listSaleEvents = (filters: Partial<SaleEventFilters>) =>
  getGestaoVendasService().listEvents(filters as Record<string, string>);

export const createSaleEvent = (event: SaleEvent) => ({
  ...event,
  id: event.id || String(Date.now()),
});

export const updateSaleEvent = (event: SaleEvent) => ({
  ...event,
});
