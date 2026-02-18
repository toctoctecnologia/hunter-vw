import type { ContratoLocacao } from './contratosLocacaoService';
import type { Boleto } from './boletosService';
import type { Transferencia } from './transferenciasService';
import type { ContractNote } from '@/mocks/gestao-locacao/notes.mock';
import type { ContractTask } from '@/mocks/gestao-locacao/tasks.mock';
import type { ContractRepair } from '@/mocks/gestao-locacao/repairs.mock';
import type { LandlordHistorico, TipoRepasse } from '@/mocks/gestao-locacao/landlords.mock';
import type { ContractDetail } from '@/mocks/gestao-locacao/contracts.mock';

export interface ContractBeneficiary {
  id: string;
  nome: string;
  documento: string;
  tipo: 'Locador' | 'Beneficiário';
  percentual: number;
  banco: string;
  agencia: string;
  conta: string;
  tipoRepasse: TipoRepasse;
  historico: LandlordHistorico[];
}

export interface ContractDetailView extends ContractDetail {
  locadores: ContractBeneficiary[];
  locatarios: Array<{ nome: string; cpf: string; tipo: string }>;
}

export interface GestaoLocacaoService {
  getContractById: (id: string) => ContractDetailView | undefined;
  listContracts: (filters: Record<string, string>) => { items: ContratoLocacao[] };
  listContractBeneficiaries: (contractId: string) => ContractBeneficiary[];
  listInvoicesByContract: (contractId: string) => Boleto[];
  listTransfersByContract: (contractId: string) => Transferencia[];
  listRepairsByContract: (contractId: string) => ContractRepair[];
  listTasksByContract: (contractId: string) => ContractTask[];
  listNotesByContract: (contractId: string) => ContractNote[];
}
