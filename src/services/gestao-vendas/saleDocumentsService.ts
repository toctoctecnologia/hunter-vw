import { getGestaoVendasService } from './getGestaoVendasService';

export interface SaleDocument {
  id: string;
  contratoId: string;
  nome: string;
  categoria: string;
  tags: string[];
  atualizadoEm: string;
  status: string;
}

export interface SaleDocumentFilters extends Record<string, string> {
  status: string;
  categoria: string;
  contrato: string;
}

export const listSaleDocuments = (filters: Partial<SaleDocumentFilters>) =>
  getGestaoVendasService().listDocuments(filters as Record<string, string>);

export const createSaleDocument = (document: SaleDocument) =>
  getGestaoVendasService().createDocument(document);

export const updateSaleDocument = (id: string, updates: Partial<SaleDocument>) =>
  getGestaoVendasService().updateDocument(id, updates);
