import type { ContratoLocacao, ContratoStatus } from '@/services/gestao-locacao/contratosLocacaoService';
import { landlordsMock } from './landlords.mock';
import { tenantsMock } from './tenants.mock';

export interface ContractBeneficiaryRef {
  landlordId: string;
  percentual: number;
  tipo: 'Locador' | 'Beneficiário';
}

export interface ContractDetail {
  id: string;
  codigo: string;
  status: ContratoStatus;
  imovel: {
    tipo: string;
    codigo: string;
    endereco: string;
  };
  finalidade: string;
  responsavel: string;
  duracao: string;
  dataInicio: string;
  proximoReajuste: string;
  reajuste: string;
  inicio: string;
  fim: string;
  valorAluguel: string;
  diaVencimento: string;
  tipoGarantia: string;
  inadimplente: boolean;
  saldoAberto: string;
  diasParaVencimento: number;
  motivoEncerramento?: string;
  beneficiarios: ContractBeneficiaryRef[];
  locatarioId: string;
  ocupantes: Array<{ nome: string; parentesco: string }>;
  valores: {
    aluguel: string;
    indiceReajuste: string;
    taxaAdministracao: string;
    taxaIntermediacao: string;
    taxaBancaria: string;
    multa: string;
    juros: string;
  };
  faturamento: {
    formaPagamento: string;
    vencimento: string;
    prePago: boolean;
    faturaAutomatica: boolean;
    diasAntecedencia: number;
    canaisEnvio: string[];
  };
  repasse: {
    automatico: boolean;
    diaRepasse: string;
    garantido: boolean;
    mesesGarantia: number;
  };
  seguros: {
    incendio: { ativo: boolean; valor: string };
    garantia: string;
    fiadores: Array<{ nome: string; cpf: string }>;
  };
}

export const contractDetailsMock: ContractDetail[] = [
  {
    id: '1',
    codigo: '2093477/1',
    status: 'Ativo',
    imovel: {
      tipo: 'Apartamento',
      codigo: 'MAT 000123456',
      endereco: 'Rua Exemplo, 100, Centro, São Paulo - SP',
    },
    finalidade: 'Residencial',
    responsavel: 'Usuário Demo',
    duracao: '30 meses',
    dataInicio: '18/10/2022',
    proximoReajuste: '18/10/2024',
    reajuste: '18/10/2024',
    inicio: '18/10/2022',
    fim: '18/10/2025',
    valorAluguel: 'R$ 2.500,00',
    diaVencimento: '10',
    tipoGarantia: 'Seguro fiança',
    inadimplente: false,
    saldoAberto: 'R$ 0,00',
    diasParaVencimento: 45,
    beneficiarios: [
      { landlordId: 'locador-1', percentual: 70, tipo: 'Locador' },
      { landlordId: 'locador-2', percentual: 30, tipo: 'Beneficiário' },
    ],
    locatarioId: 'locatario-1',
    ocupantes: [{ nome: 'Ana Ferreira', parentesco: 'Cônjuge' }],
    valores: {
      aluguel: 'R$ 2.500,00',
      indiceReajuste: 'IGP-M',
      taxaAdministracao: '10%',
      taxaIntermediacao: '100%',
      taxaBancaria: 'R$ 5,00',
      multa: '10%',
      juros: '1% ao mês',
    },
    faturamento: {
      formaPagamento: 'Boleto',
      vencimento: 'Dia 10',
      prePago: false,
      faturaAutomatica: true,
      diasAntecedencia: 5,
      canaisEnvio: ['Email', 'WhatsApp'],
    },
    repasse: {
      automatico: true,
      diaRepasse: 'Dia 15',
      garantido: true,
      mesesGarantia: 12,
    },
    seguros: {
      incendio: { ativo: true, valor: 'R$ 150,00/mês' },
      garantia: 'Fiador',
      fiadores: [{ nome: 'Equipe Hunter', cpf: '666.777.888-99' }],
    },
  },
  {
    id: '2',
    codigo: '1477462/1',
    status: 'Em encerramento',
    imovel: {
      tipo: 'Casa',
      codigo: 'IMV 0000456',
      endereco: 'Rua das Flores, 250, Jardim Azul, Curitiba - PR',
    },
    finalidade: 'Residencial',
    responsavel: 'Sistema',
    duracao: '24 meses',
    dataInicio: '05/02/2023',
    proximoReajuste: '05/02/2025',
    reajuste: '05/02/2025',
    inicio: '05/02/2023',
    fim: '05/02/2025',
    valorAluguel: 'R$ 3.200,00',
    diaVencimento: '05',
    tipoGarantia: 'Fiador',
    inadimplente: true,
    saldoAberto: 'R$ 1.280,00',
    diasParaVencimento: 12,
    motivoEncerramento: 'Venda do imóvel',
    beneficiarios: [
      { landlordId: 'locador-2', percentual: 60, tipo: 'Locador' },
      { landlordId: 'locador-4', percentual: 40, tipo: 'Beneficiário' },
    ],
    locatarioId: 'locatario-2',
    ocupantes: [{ nome: 'Bruna Alves', parentesco: 'Irmã' }],
    valores: {
      aluguel: 'R$ 3.200,00',
      indiceReajuste: 'IPCA',
      taxaAdministracao: '8%',
      taxaIntermediacao: '100%',
      taxaBancaria: 'R$ 6,50',
      multa: '10%',
      juros: '1% ao mês',
    },
    faturamento: {
      formaPagamento: 'Pix',
      vencimento: 'Dia 5',
      prePago: false,
      faturaAutomatica: true,
      diasAntecedencia: 3,
      canaisEnvio: ['Email'],
    },
    repasse: {
      automatico: true,
      diaRepasse: 'Dia 12',
      garantido: false,
      mesesGarantia: 0,
    },
    seguros: {
      incendio: { ativo: true, valor: 'R$ 95,00/mês' },
      garantia: 'Fiador',
      fiadores: [{ nome: 'Usuário Demo', cpf: '777.888.999-00' }],
    },
  },
  {
    id: '3',
    codigo: '2004101/1',
    status: 'Pendente',
    imovel: {
      tipo: 'Sala Comercial',
      codigo: 'SAL 0000987',
      endereco: 'Av. Horizonte, 450, Centro, Porto Alegre - RS',
    },
    finalidade: 'Comercial',
    responsavel: 'Equipe Hunter',
    duracao: '18 meses',
    dataInicio: '12/05/2023',
    proximoReajuste: '12/11/2024',
    reajuste: '12/11/2024',
    inicio: '12/05/2023',
    fim: '12/11/2024',
    valorAluguel: 'R$ 6.900,00',
    diaVencimento: '12',
    tipoGarantia: 'Caução',
    inadimplente: false,
    saldoAberto: 'R$ 0,00',
    diasParaVencimento: 28,
    beneficiarios: [{ landlordId: 'locador-5', percentual: 100, tipo: 'Locador' }],
    locatarioId: 'locatario-3',
    ocupantes: [{ nome: 'Rafael Souza', parentesco: 'Sócio' }],
    valores: {
      aluguel: 'R$ 6.900,00',
      indiceReajuste: 'IGP-M',
      taxaAdministracao: '12%',
      taxaIntermediacao: '100%',
      taxaBancaria: 'R$ 7,00',
      multa: '8%',
      juros: '1% ao mês',
    },
    faturamento: {
      formaPagamento: 'Transferência',
      vencimento: 'Dia 12',
      prePago: true,
      faturaAutomatica: false,
      diasAntecedencia: 0,
      canaisEnvio: ['Email', 'WhatsApp'],
    },
    repasse: {
      automatico: false,
      diaRepasse: 'Dia 18',
      garantido: false,
      mesesGarantia: 0,
    },
    seguros: {
      incendio: { ativo: false, valor: 'R$ 0,00' },
      garantia: 'Caução',
      fiadores: [],
    },
  },
];

const findLocadorPrincipal = (detail: ContractDetail) => {
  const principal = detail.beneficiarios[0];
  return landlordsMock.find((landlord) => landlord.id === principal?.landlordId)?.nome ?? 'Equipe Hunter';
};

const findLocatarioNome = (detail: ContractDetail) =>
  tenantsMock.find((tenant) => tenant.id === detail.locatarioId)?.nome ?? 'Usuário Demo';

export const contratosMock: ContratoLocacao[] = contractDetailsMock.map((detail) => ({
  id: detail.id,
  codigo: detail.codigo,
  imovel: detail.imovel,
  locador: findLocadorPrincipal(detail),
  locatario: findLocatarioNome(detail),
  reajuste: detail.reajuste,
  inicio: detail.inicio,
  fim: detail.fim,
  valorAluguel: detail.valorAluguel,
  diaVencimento: detail.diaVencimento,
  tipoGarantia: detail.tipoGarantia,
  status: detail.status,
  inadimplente: detail.inadimplente,
  saldoAberto: detail.saldoAberto,
  diasParaVencimento: detail.diasParaVencimento,
  motivoEncerramento: detail.motivoEncerramento,
}));
