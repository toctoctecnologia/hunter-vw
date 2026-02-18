import type { SaleContract } from './saleContractsService';
import type { SaleReceipt } from './saleReceiptsService';
import type { SaleCommission } from './saleCommissionsService';
import type { SaleTransferTask } from './saleTransfersService';
import type { SaleDocument } from './saleDocumentsService';
import type { SaleEvent } from './saleEventsService';
import type { SaleChecklistItem } from './saleChecklistService';
import type { SaleNote, SaleTask } from '@/mocks/gestao-vendas/types';

export interface SaleContractDetail extends SaleContract {
  comprador: {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
  };
  vendedor: {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
  };
  corretor: {
    nome: string;
    documento: string;
    email: string;
    telefone: string;
  };
  empreendimento: string;
  incorporadora: string;
  endereco: string;
  dataCriacao: string;
  observacoes?: string;
}

export interface GestaoVendasService {
  getContractById: (id: string) => SaleContractDetail | undefined;
  listContracts: (filters: Record<string, string>) => { items: SaleContract[] };
  listReceipts: (filters: Record<string, string>) => { items: SaleReceipt[] };
  listCommissions: (filters: Record<string, string>) => { items: SaleCommission[] };
  listTransfers: (filters: Record<string, string>) => { items: SaleTransferTask[] };
  listDocuments: (filters: Record<string, string>) => { items: SaleDocument[] };
  listEvents: (filters: Record<string, string>) => { items: SaleEvent[] };
  listChecklistByContract: (contractId: string) => SaleChecklistItem[];
  listNotesByContract: (contractId: string) => SaleNote[];
  listTasksByContract: (contractId: string) => SaleTask[];
  createChecklistItem: (item: SaleChecklistItem) => SaleChecklistItem;
  updateChecklistItem: (id: string, updates: Partial<SaleChecklistItem>) => SaleChecklistItem | undefined;
  createDocument: (doc: SaleDocument) => SaleDocument;
  updateDocument: (id: string, updates: Partial<SaleDocument>) => SaleDocument | undefined;
}
