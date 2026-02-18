import {
  brokers,
  buyers,
  saleChecklistItems,
  saleCommissions,
  saleContracts,
  saleDocuments,
  saleEvents,
  saleNotes,
  saleReceipts,
  saleTasks,
  saleTransfers,
  sellers,
} from './data';
import type { GestaoVendasService, SaleContractDetail } from '@/services/gestao-vendas/gestaoVendasService';
import type { SaleChecklistItem } from '@/services/gestao-vendas/saleChecklistService';
import type { SaleDocument } from '@/services/gestao-vendas/saleDocumentsService';

let checklistStore = [...saleChecklistItems];
let documentsStore = [...saleDocuments];

const resolveContractDetail = (contractId: string): SaleContractDetail | undefined => {
  const contract = saleContracts.find((item) => item.id === contractId);
  if (!contract) return undefined;

  const comprador = buyers.find((buyer) => buyer.id === contract.compradorId);
  const vendedor = sellers.find((seller) => seller.id === contract.vendedorId);
  const corretor = brokers.find((broker) => broker.id === contract.corretorId);

  return {
    ...contract,
    comprador: {
      nome: comprador?.nome ?? 'Comprador Demo',
      documento: comprador?.documento ?? '000.000.000-00',
      email: comprador?.email ?? 'comprador@exemplo.com.br',
      telefone: comprador?.telefone ?? '(11) 90000-0000',
    },
    vendedor: {
      nome: vendedor?.nome ?? 'Vendedor Demo',
      documento: vendedor?.documento ?? '000.000.000-00',
      email: vendedor?.email ?? 'vendedor@exemplo.com.br',
      telefone: vendedor?.telefone ?? '(11) 90000-0000',
    },
    corretor: {
      nome: corretor?.nome ?? 'Corretor Demo',
      documento: corretor?.documento ?? '000.000.000-00',
      email: corretor?.email ?? 'corretor@exemplo.com.br',
      telefone: corretor?.telefone ?? '(11) 90000-0000',
    },
    empreendimento: contract.imovel.empreendimento,
    incorporadora: contract.imovel.incorporadora,
    endereco: contract.imovel.endereco,
    dataCriacao: contract.dataAssinatura,
    observacoes: 'Checklist do contrato atualizado com as últimas pendências.',
  };
};

export class MockGestaoVendasService implements GestaoVendasService {
  getContractById(id: string) {
    return resolveContractDetail(id);
  }

  listContracts(filters: Record<string, string>) {
    let items = [...saleContracts];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.corretor) {
      items = items.filter(
        (item) => brokers.find((broker) => broker.id === item.corretorId)?.nome === filters.corretor
      );
    }
    if (filters.comprador) {
      items = items.filter(
        (item) => buyers.find((buyer) => buyer.id === item.compradorId)?.nome === filters.comprador
      );
    }
    if (filters.imovel) {
      items = items.filter((item) => item.imovel.endereco === filters.imovel);
    }
    if (filters.incorporadora) {
      items = items.filter((item) => item.imovel.incorporadora === filters.incorporadora);
    }
    if (filters.tipoVenda) {
      items = items.filter((item) => item.tipoVenda === filters.tipoVenda);
    }
    if (filters.banco) {
      items = items.filter((item) => item.bancoFinanciamento === filters.banco);
    }
    return {
      items: items.map((item) => ({
        ...item,
      })),
    };
  }

  listReceipts(filters: Record<string, string>) {
    let items = [...saleReceipts];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.contrato) {
      items = items.filter((item) => item.contrato === filters.contrato);
    }
    if (filters.cliente) {
      items = items.filter((item) => item.cliente === filters.cliente);
    }
    if (filters.formaPagamento) {
      items = items.filter((item) => item.formaPagamento === filters.formaPagamento);
    }
    return { items };
  }

  listCommissions(filters: Record<string, string>) {
    let items = [...saleCommissions];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.corretor) {
      items = items.filter((item) => item.corretor === filters.corretor);
    }
    if (filters.contrato) {
      items = items.filter((item) => item.contrato === filters.contrato);
    }
    return { items };
  }

  listTransfers(filters: Record<string, string>) {
    let items = [...saleTransfers];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.responsavel) {
      items = items.filter((item) => item.responsavel === filters.responsavel);
    }
    if (filters.contrato) {
      items = items.filter((item) => item.contrato === filters.contrato);
    }
    return { items };
  }

  listDocuments(filters: Record<string, string>) {
    let items = [...documentsStore];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.categoria) {
      items = items.filter((item) => item.categoria === filters.categoria);
    }
    if (filters.contrato) {
      items = items.filter((item) => item.contratoId === filters.contrato);
    }
    return { items };
  }

  listEvents(filters: Record<string, string>) {
    let items = [...saleEvents];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.responsavel) {
      items = items.filter((item) => item.responsavel === filters.responsavel);
    }
    return { items };
  }

  listChecklistByContract(contractId: string) {
    return checklistStore.filter((item) => item.sourceId === contractId);
  }

  listNotesByContract(contractId: string) {
    return saleNotes.filter((item) => item.contratoId === contractId);
  }

  listTasksByContract(contractId: string) {
    return saleTasks.filter((item) => item.contratoId === contractId);
  }

  createChecklistItem(item: SaleChecklistItem) {
    checklistStore = [item, ...checklistStore];
    return item;
  }

  updateChecklistItem(id: string, updates: Partial<SaleChecklistItem>) {
    let updated: SaleChecklistItem | undefined;
    checklistStore = checklistStore.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...updates };
      return updated;
    });
    return updated;
  }

  createDocument(doc: SaleDocument) {
    documentsStore = [doc, ...documentsStore];
    return doc;
  }

  updateDocument(id: string, updates: Partial<SaleDocument>) {
    let updated: SaleDocument | undefined;
    documentsStore = documentsStore.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...updates };
      return updated;
    });
    return updated;
  }
}
