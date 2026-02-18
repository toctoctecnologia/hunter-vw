/**
 * Mock data for properties with proposals
 * Follows the same schema as LeadDeal from the lead's Negócios tab
 */

export interface MockProposal {
  id: string;
  amount: number;
  status: 'draft' | 'negotiating' | 'sent' | 'approved' | 'rejected' | 'won' | 'lost';
  kind: 'proposal_sale' | 'proposal_rent' | 'sale' | 'won';
  description: string;
  terms?: string;
  commissionPercentage?: number;
  commissionBase?: number;
  createdAt: string;
  updatedAt: string;
  negotiationId?: string;
  leadName?: string;
  leadPhone?: string;
}

export interface MockPropertyWithProposal {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  bairro: string;
  cidade: string;
  estado: string;
  valor: number;
  areaPrivativa: number;
  quartos: number;
  suites: number;
  vagas: number;
  disponibilidade: 'disponivel' | 'reservado' | 'vendido' | 'locado' | 'indisponivel';
  situacao: string;
  origem: string;
  equipe: string;
  captador: string;
  captadoEm: string;
  atualizadoEm: string;
  hasActiveProposal: boolean;
  activeProposalCount: number;
  proposalStage: 'sem_proposta' | 'proposta' | 'em_negociacao' | 'reservado';
  lastProposalUpdateAt?: string;
  proposalValue?: number;
  linkedNegotiationId?: string;
  reservedFlag?: boolean;
  proposals: MockProposal[];
}

const now = new Date();
const formatDate = (daysAgo: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const MOCK_PROPERTIES_WITH_PROPOSALS: MockPropertyWithProposal[] = [
  // Property 1: With active proposal in negotiation - LONG DESCRIPTION
  {
    id: 'prop-mock-1',
    codigo: 'IMV-2024-001',
    titulo: 'Apartamento Alto Padrão Moema',
    tipo: 'Apartamento',
    bairro: 'Moema',
    cidade: 'São Paulo',
    estado: 'SP',
    valor: 1850000,
    areaPrivativa: 180,
    quartos: 4,
    suites: 2,
    vagas: 3,
    disponibilidade: 'disponivel',
    situacao: 'em_negociacao',
    origem: 'Site',
    equipe: 'Vendas Premium',
    captador: 'Carlos Silva',
    captadoEm: formatDate(45),
    atualizadoEm: formatDate(1),
    hasActiveProposal: true,
    activeProposalCount: 1,
    proposalStage: 'em_negociacao',
    lastProposalUpdateAt: formatDate(1),
    proposalValue: 1750000,
    linkedNegotiationId: 'neg-001',
    proposals: [
      {
        id: 'proposal-1',
        amount: 1750000,
        status: 'negotiating',
        kind: 'proposal_sale',
        description: 'PROPOSTA DE COMPRA Imóvel: Apartamento Alto Padrão Moema Unidade: Apartamento 1203, bloco B Valor de venda do imóvel: R$ 1.850.000,00 Valor total da proposta Valor total ofertado: R$ 1.750.000,00. Condições de pagamento Entrada no valor total de R$ 525.000,00, composta por: Valor em dinheiro no montante de R$ 425.000,00. Veículo entregue como parte do pagamento: BMW X5, ano 2022, pelo valor ofertado de R$ 100.000,00. O saldo remanescente no valor de R$ 1.225.000,00 será pago por meio de financiamento bancário aprovado pelo Banco Itaú em 30 anos, com parcelas iniciais de R$ 12.500,00. Cliente muito interessado, já visitou o imóvel duas vezes e solicitou contraproposta do proprietário.',
        commissionPercentage: 5,
        createdAt: formatDate(5),
        updatedAt: formatDate(1),
        negotiationId: 'neg-001',
        leadName: 'João Mendes',
        leadPhone: '(11) 98765-4321',
      }
    ]
  },
  // Property 2: With approved proposal (reserved)
  {
    id: 'prop-mock-2',
    codigo: 'IMV-2024-002',
    titulo: 'Casa em Condomínio Alphaville',
    tipo: 'Casa',
    bairro: 'Alphaville',
    cidade: 'Barueri',
    estado: 'SP',
    valor: 2400000,
    areaPrivativa: 350,
    quartos: 5,
    suites: 4,
    vagas: 4,
    disponibilidade: 'reservado',
    situacao: 'reservado',
    origem: 'Indicação',
    equipe: 'Alto Padrão',
    captador: 'Maria Santos',
    captadoEm: formatDate(90),
    atualizadoEm: formatDate(0),
    hasActiveProposal: true,
    activeProposalCount: 1,
    proposalStage: 'reservado',
    lastProposalUpdateAt: formatDate(0),
    proposalValue: 2350000,
    linkedNegotiationId: 'neg-002',
    reservedFlag: true,
    proposals: [
      {
        id: 'proposal-2',
        amount: 2350000,
        status: 'approved',
        kind: 'proposal_sale',
        description: 'PROPOSTA DE COMPRA Imóvel: Casa em Condomínio Alphaville Valor de venda do imóvel: R$ 2.400.000,00 Valor total ofertado: R$ 2.350.000,00. Condições de pagamento Entrada no valor total de R$ 1.175.000,00, composta por: Valor em dinheiro no montante de R$ 875.000,00. Imóvel dado como parte de pagamento: Apartamento no Morumbi, avaliado em R$ 300.000,00. O saldo remanescente no valor de R$ 1.175.000,00 será pago por meio de 24 parcelas mensais de R$ 48.958,33. Proposta aceita pela proprietária. Comissão 5%. Venda em parceria com a Imobile. Imóvel da pauta deles. Eles irão rodar contrato. Documentação já em análise pelo cartório.',
        commissionPercentage: 5,
        createdAt: formatDate(15),
        updatedAt: formatDate(0),
        negotiationId: 'neg-002',
        leadName: 'Roberto Almeida',
        leadPhone: '(11) 91234-5678',
      }
    ]
  },
  // Property 3: With multiple proposals
  {
    id: 'prop-mock-3',
    codigo: 'IMV-2024-003',
    titulo: 'Cobertura Duplex Jardins',
    tipo: 'Cobertura',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    estado: 'SP',
    valor: 4500000,
    areaPrivativa: 420,
    quartos: 4,
    suites: 4,
    vagas: 6,
    disponibilidade: 'disponivel',
    situacao: 'em_negociacao',
    origem: 'Portais',
    equipe: 'Luxo',
    captador: 'Ana Paula',
    captadoEm: formatDate(60),
    atualizadoEm: formatDate(2),
    hasActiveProposal: true,
    activeProposalCount: 2,
    proposalStage: 'em_negociacao',
    lastProposalUpdateAt: formatDate(2),
    proposalValue: 4200000,
    linkedNegotiationId: 'neg-003',
    proposals: [
      {
        id: 'proposal-3a',
        amount: 4200000,
        status: 'negotiating',
        kind: 'proposal_sale',
        description: 'Proposta: R$ 4.200.000,00. Obs.: Cliente estrangeiro, pagamento via transferência internacional. Prazo de 45 dias para fechamento. Comissão 4%.',
        commissionPercentage: 4,
        createdAt: formatDate(7),
        updatedAt: formatDate(2),
        negotiationId: 'neg-003',
        leadName: 'Michael Thompson',
        leadPhone: '+1 555-1234',
      },
      {
        id: 'proposal-3b',
        amount: 4000000,
        status: 'sent',
        kind: 'proposal_sale',
        description: 'Proposta: R$ 4.000.000,00. Obs.: Investidor brasileiro, interesse em fechar rápido. Entrada de 50% + parcelas.',
        commissionPercentage: 5,
        createdAt: formatDate(10),
        updatedAt: formatDate(5),
        negotiationId: 'neg-003b',
        leadName: 'Fernando Costa',
        leadPhone: '(11) 99876-5432',
      }
    ]
  },
  // Property 4: With sent proposal
  {
    id: 'prop-mock-4',
    codigo: 'IMV-2024-004',
    titulo: 'Apartamento Garden Pinheiros',
    tipo: 'Apartamento',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    estado: 'SP',
    valor: 980000,
    areaPrivativa: 95,
    quartos: 2,
    suites: 1,
    vagas: 2,
    disponibilidade: 'disponivel',
    situacao: 'proposta',
    origem: 'Site',
    equipe: 'Vendas',
    captador: 'Pedro Lima',
    captadoEm: formatDate(30),
    atualizadoEm: formatDate(3),
    hasActiveProposal: true,
    activeProposalCount: 1,
    proposalStage: 'proposta',
    lastProposalUpdateAt: formatDate(3),
    proposalValue: 920000,
    linkedNegotiationId: 'neg-004',
    proposals: [
      {
        id: 'proposal-4',
        amount: 920000,
        status: 'sent',
        kind: 'proposal_sale',
        description: 'Proposta: R$ 920.000,00. Obs.: Primeira compra do cliente, aguardando aprovação de financiamento pelo banco. Previsão de resposta em 5 dias úteis.',
        commissionPercentage: 6,
        createdAt: formatDate(5),
        updatedAt: formatDate(3),
        negotiationId: 'neg-004',
        leadName: 'Mariana Oliveira',
        leadPhone: '(11) 97654-3210',
      }
    ]
  },
  // Property 5: No proposal (for testing empty state)
  {
    id: 'prop-mock-5',
    codigo: 'IMV-2024-005',
    titulo: 'Studio Moderno Vila Madalena',
    tipo: 'Studio',
    bairro: 'Vila Madalena',
    cidade: 'São Paulo',
    estado: 'SP',
    valor: 550000,
    areaPrivativa: 38,
    quartos: 1,
    suites: 0,
    vagas: 1,
    disponibilidade: 'disponivel',
    situacao: 'ativo',
    origem: 'Portais',
    equipe: 'Vendas',
    captador: 'Lucas Ferreira',
    captadoEm: formatDate(20),
    atualizadoEm: formatDate(10),
    hasActiveProposal: false,
    activeProposalCount: 0,
    proposalStage: 'sem_proposta',
    proposals: []
  },
  // Property 6: No proposal (for testing empty state)
  {
    id: 'prop-mock-6',
    codigo: 'IMV-2024-006',
    titulo: 'Terreno Comercial Brooklin',
    tipo: 'Terreno',
    bairro: 'Brooklin',
    cidade: 'São Paulo',
    estado: 'SP',
    valor: 3200000,
    areaPrivativa: 800,
    quartos: 0,
    suites: 0,
    vagas: 0,
    disponibilidade: 'disponivel',
    situacao: 'ativo',
    origem: 'Indicação',
    equipe: 'Comercial',
    captador: 'Rodrigo Barros',
    captadoEm: formatDate(15),
    atualizadoEm: formatDate(8),
    hasActiveProposal: false,
    activeProposalCount: 0,
    proposalStage: 'sem_proposta',
    proposals: []
  }
];

// Flag to enable mock data (can be set via environment or runtime)
export const USE_MOCK_PROPOSALS = import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_PROPOSALS === 'true';

/**
 * Get properties with proposals (mock or API)
 * Falls back to mock if API returns error or empty
 */
export function getPropertiesWithProposals(): MockPropertyWithProposal[] {
  // For now, always return mock data
  // In production, this would check API first
  if (USE_MOCK_PROPOSALS) {
    return MOCK_PROPERTIES_WITH_PROPOSALS;
  }
  return MOCK_PROPERTIES_WITH_PROPOSALS; // Fallback
}

/**
 * Get only properties with active proposals
 */
export function getPropertiesWithActiveProposals(): MockPropertyWithProposal[] {
  return getPropertiesWithProposals().filter(p => p.hasActiveProposal);
}

/**
 * Get the primary (most recent) proposal for a property
 */
export function getPrimaryProposal(property: MockPropertyWithProposal): MockProposal | null {
  if (!property.proposals.length) return null;
  return property.proposals.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];
}
