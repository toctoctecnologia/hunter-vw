import { getGestaoVendasService } from './getGestaoVendasService';

export type SaleContractStatus =
  | 'Ativo'
  | 'Em assinatura'
  | 'Em financiamento'
  | 'Em pós-venda'
  | 'Concluído'
  | 'Pendente';

export type SaleType = 'Pronto' | 'Na planta' | 'Permuta' | 'Financiamento';

export interface SaleContract {
  id: string;
  codigo: string;
  imovel: {
    tipo: string;
    codigo: string;
    endereco: string;
    empreendimento: string;
    incorporadora: string;
    valor: string;
  };
  compradorId: string;
  vendedorId: string;
  corretorId: string;
  status: SaleContractStatus;
  tipoVenda: SaleType;
  bancoFinanciamento: string;
  dataAssinatura: string;
  dataConclusao: string;
  valorVenda: string;
  entrada: string;
  financiamento: string;
}

export interface SaleContractFilters extends Record<string, string> {
  periodo: string;
  corretor: string;
  comprador: string;
  imovel: string;
  incorporadora: string;
  status: string;
  tipoVenda: string;
  banco: string;
}

export const listSaleContracts = (filters: Partial<SaleContractFilters>) =>
  getGestaoVendasService().listContracts(filters as Record<string, string>);

export const getSaleContractById = (id: string) =>
  getGestaoVendasService().getContractById(id);

export const createSaleContract = (contract: SaleContract) => ({
  ...contract,
  id: contract.id || String(Date.now()),
});

export const updateSaleContract = (contract: SaleContract) => ({
  ...contract,
});

export const summarySaleContracts = (filters: Partial<SaleContractFilters>) => {
  const { items } = listSaleContracts(filters);
  const ativos = items.filter((item) => item.status === 'Ativo').length;
  const assinatura = items.filter((item) => item.status === 'Em assinatura').length;
  const financiamento = items.filter((item) => item.status === 'Em financiamento').length;
  const posVenda = items.filter((item) => item.status === 'Em pós-venda').length;
  const concluidos = items.filter((item) => item.status === 'Concluído').length;
  const pendentes = items.filter((item) => item.status === 'Pendente').length;

  return {
    summary: {
      ativos: String(ativos),
      assinatura: String(assinatura),
      financiamento: String(financiamento),
      posVenda: String(posVenda),
      concluidos: String(concluidos),
      pendentes: String(pendentes),
    },
  };
};
