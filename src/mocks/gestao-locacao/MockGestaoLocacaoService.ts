import { contractDetailsMock } from './contracts.mock';
import { landlordsMock } from './landlords.mock';
import { notesMock } from './notes.mock';
import { repairsMock } from './repairs.mock';
import { tasksMock } from './tasks.mock';
import { tenantsMock } from './tenants.mock';
import { invoicesMock } from './invoices.mock';
import { transfersMock } from './transfers.mock';
import type {
  ContractBeneficiary,
  ContractDetailView,
  GestaoLocacaoService,
} from '@/services/gestao-locacao/gestaoLocacaoService';

const resolveBeneficiaries = (contratoId: string): ContractBeneficiary[] => {
  const detail = contractDetailsMock.find((item) => item.id === contratoId);
  if (!detail) return [];

  return detail.beneficiarios
    .map((benef) => {
      const landlord = landlordsMock.find((item) => item.id === benef.landlordId);
      if (!landlord) return null;
      return {
        id: benef.landlordId,
        nome: landlord.nome,
        documento: landlord.documento,
        tipo: benef.tipo,
        percentual: benef.percentual,
        banco: landlord.banco,
        agencia: landlord.agencia,
        conta: landlord.conta,
        tipoRepasse: landlord.tipoRepasse,
        historico: landlord.historico,
      };
    })
    .filter(Boolean) as ContractBeneficiary[];
};

const resolveContractDetail = (contratoId: string): ContractDetailView | undefined => {
  const detail = contractDetailsMock.find((item) => item.id === contratoId);
  if (!detail) return undefined;

  const locatario = tenantsMock.find((tenant) => tenant.id === detail.locatarioId);
  return {
    ...detail,
    locadores: resolveBeneficiaries(detail.id),
    locatarios: locatario
      ? [{ nome: locatario.nome, cpf: locatario.documento, tipo: 'Assinante' }]
      : [],
  };
};

export class MockGestaoLocacaoService implements GestaoLocacaoService {
  getContractById(id: string) {
    return resolveContractDetail(id);
  }

  listContracts(filters: Record<string, string>) {
    let items = [...contractDetailsMock];
    if (filters.status) {
      items = items.filter((item) => item.status === filters.status);
    }
    if (filters.locatario) {
      items = items.filter(
        (item) => tenantsMock.find((tenant) => tenant.id === item.locatarioId)?.nome === filters.locatario
      );
    }
    if (filters.locador) {
      items = items.filter((item) =>
        resolveBeneficiaries(item.id).some((benef) => benef.nome === filters.locador)
      );
    }
    if (filters.imovel) {
      items = items.filter((item) => item.imovel.endereco === filters.imovel);
    }
    if (filters.garantia) {
      items = items.filter((item) => item.tipoGarantia === filters.garantia);
    }
    if (filters.diaVencimento) {
      items = items.filter((item) => item.diaVencimento === filters.diaVencimento);
    }
    if (filters.faixaValor) {
      const parsed = (valor: string) =>
        Number(valor.replace(/[^0-9,-]+/g, '').replace('.', '').replace(',', '.'));
      items = items.filter((item) => {
        const aluguel = parsed(item.valorAluguel);
        if (filters.faixaValor === 'ate-2500') return aluguel <= 2500;
        if (filters.faixaValor === '2500-5000') return aluguel >= 2500 && aluguel <= 5000;
        if (filters.faixaValor === 'acima-5000') return aluguel > 5000;
        return true;
      });
    }
    if (filters.vigencia) {
      items = items.filter((item) => {
        if (filters.vigencia === 'ate-6m') return item.diasParaVencimento <= 180;
        if (filters.vigencia === '6-12m') return item.diasParaVencimento > 180 && item.diasParaVencimento <= 365;
        if (filters.vigencia === 'acima-12m') return item.diasParaVencimento > 365;
        return true;
      });
    }

    return {
      items: items.map((item) => {
        const locatario = tenantsMock.find((tenant) => tenant.id === item.locatarioId);
        const locador = resolveBeneficiaries(item.id)[0];
        return {
          id: item.id,
          codigo: item.codigo,
          imovel: item.imovel,
          locador: locador?.nome ?? 'Equipe Hunter',
          locatario: locatario?.nome ?? 'Usuário Demo',
          reajuste: item.reajuste,
          inicio: item.inicio,
          fim: item.fim,
          valorAluguel: item.valorAluguel,
          diaVencimento: item.diaVencimento,
          tipoGarantia: item.tipoGarantia,
          status: item.status,
          inadimplente: item.inadimplente,
          saldoAberto: item.saldoAberto,
          diasParaVencimento: item.diasParaVencimento,
          motivoEncerramento: item.motivoEncerramento,
        };
      }),
    };
  }

  listContractBeneficiaries(contractId: string) {
    return resolveBeneficiaries(contractId);
  }

  listInvoicesByContract(contractId: string) {
    const contrato = contractDetailsMock.find((item) => item.id === contractId);
    if (!contrato) return [];
    return invoicesMock.filter((item) => item.contrato === contrato.codigo);
  }

  listTransfersByContract(contractId: string) {
    const contrato = contractDetailsMock.find((item) => item.id === contractId);
    if (!contrato) return [];
    return transfersMock.filter((item) => item.contrato === contrato.codigo);
  }

  listRepairsByContract(contractId: string) {
    return repairsMock.filter((item) => item.contratoId === contractId);
  }

  listTasksByContract(contractId: string) {
    return tasksMock.filter((item) => item.contratoId === contractId);
  }

  listNotesByContract(contractId: string) {
    return notesMock.filter((item) => item.contratoId === contractId);
  }
}
