import { getGestaoVendasService } from './getGestaoVendasService';

export type SaleChecklistStatus = 'Pendente' | 'Em andamento' | 'Concluído' | 'Bloqueado';

export interface SaleChecklistItem {
  id: string;
  sourceType: 'SaleContract';
  sourceId: string;
  titulo: string;
  status: SaleChecklistStatus;
  exigeAnexo: boolean;
  responsavel: string;
  prazo: string;
  anexoUrl?: string;
}

export const listSaleChecklistByContract = (contractId: string) =>
  getGestaoVendasService().listChecklistByContract(contractId);

export const createSaleChecklistItem = (item: SaleChecklistItem) =>
  getGestaoVendasService().createChecklistItem(item);

export const updateSaleChecklistItem = (id: string, updates: Partial<SaleChecklistItem>) =>
  getGestaoVendasService().updateChecklistItem(id, updates);
