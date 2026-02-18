import { subDays } from 'date-fns';

export type DealKind = 'proposal_sale' | 'proposal_rent' | 'sale' | 'won';

export type DealStatus =
  | 'draft'
  | 'sent'
  | 'negotiating'
  | 'approved'
  | 'rejected'
  | 'won'
  | 'lost';

export interface DealPropertySummary {
  id: string;
  code: string;
  title: string;
  type: string;
  city: string;
  price: number;
  area: number;
  beds: number;
  baths: number;
  parking: number;
  coverUrl?: string;
}

export interface DealTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  kind: 'interaction' | 'milestone' | 'document';
}

export interface DealParticipantProfile {
  id: string;
  name: string;
  role?: 'captador' | 'corretor' | 'coordenador' | 'assistente';
  avatarUrl?: string;
}

export interface DealParticipant { 
  id: string;
  memberId: string;
  name: string;
  role?: DealParticipantProfile['role'];
  avatarUrl?: string;
  percent: number;
  amount: number;
}

export type DealParticipantInput = Omit<DealParticipant, 'amount'>;

export interface DealInstallmentPlan {
  count: number;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
}

export interface DealCommissionForecastShare {
  totalPercent: number;
  totalAmount: number;
}

export interface DealCommissionForecast {
  totalCommission: number;
  participantsShare: DealCommissionForecastShare;
  companyShare: DealCommissionForecastShare;
}

export interface DealDocument {
  id: string;
  name: string;
  url?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface LeadDeal {
  id: string;
  leadId: string;
  kind: DealKind;
  status: DealStatus;
  title: string;
  amount: number;
  commissionPercentage?: number;
  commissionBase?: number;
  paymentMethod?: string;
  proposalSentAt?: string;
  proposalValidUntil?: string;
  property?: DealPropertySummary;
  buyerName?: string;
  sellerName?: string;
  notes?: string;
  askingPrice?: number;
  downPayment?: number;
  installments?: DealInstallmentPlan;
  terms?: string;
  approved?: boolean;
  approvedAt?: string;
  participants: DealParticipant[];
  timeline: DealTimelineEvent[];
  documents: DealDocument[];
  commissionForecast?: DealCommissionForecast;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface LeadDealDraft {
  id?: string;
  leadId: string;
  kind: DealKind;
  status: DealStatus;
  title: string;
  amount: number;
  commissionPercentage?: number;
  commissionBase?: number;
  paymentMethod?: string;
  proposalSentAt?: string;
  proposalValidUntil?: string;
  property?: DealPropertySummary;
  buyerName?: string;
  sellerName?: string;
  notes?: string;
  askingPrice?: number;
  downPayment?: number;
  installments?: DealInstallmentPlan;
  terms?: string;
  approved?: boolean;
  approvedAt?: string;
  participants: DealParticipantInput[];
  timeline?: DealTimelineEvent[];
  documents?: DealDocument[];
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string;
}

export type LeadDealPatch = Partial<Omit<LeadDealDraft, 'participants'>> & {
  participants?: DealParticipantInput[];
};

const dealParticipantProfiles: DealParticipantProfile[] = [
  {
    id: 'member-ana',
    name: 'Ana Rodrigues',
    role: 'corretor',
    avatarUrl: 'https://i.pravatar.cc/100?img=35',
  },
  {
    id: 'member-bruno',
    name: 'Bruno Costa',
    role: 'captador',
    avatarUrl: 'https://i.pravatar.cc/100?img=23',
  },
  {
    id: 'member-helena',
    name: 'Helena Silva',
    role: 'coordenador',
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
  },
];

const roundCurrency = (value: number) => Number(value.toFixed(2));

export const calculateParticipantTotals = (
  participants: Pick<DealParticipant, 'percent' | 'amount'>[],
): DealCommissionForecastShare => {
  const totals = participants.reduce(
    (acc, participant) => {
      acc.totalPercent += participant.percent;
      acc.totalAmount += participant.amount;
      return acc;
    },
    { totalPercent: 0, totalAmount: 0 },
  );

  return {
    totalPercent: roundCurrency(totals.totalPercent),
    totalAmount: roundCurrency(totals.totalAmount),
  };
};

export const calculateCommissionForecast = (
  participants: DealParticipant[],
  commissionBase?: number,
): DealCommissionForecast => {
  const participantTotals = calculateParticipantTotals(participants);
  const totalCommission =
    typeof commissionBase === 'number' ? roundCurrency(commissionBase) : participantTotals.totalAmount;
  const companyAmount = roundCurrency(totalCommission - participantTotals.totalAmount);
  const companyPercent = roundCurrency(100 - participantTotals.totalPercent);

  return {
    totalCommission,
    participantsShare: participantTotals,
    companyShare: {
      totalPercent: Math.max(0, companyPercent),
      totalAmount: Math.max(0, companyAmount),
    },
  };
};

const computeCommissionBase = (
  amount: number,
  commissionPercentage?: number,
  commissionBase?: number,
) => {
  if (typeof commissionBase === 'number') {
    return roundCurrency(commissionBase);
  }

  if (typeof commissionPercentage === 'number') {
    return roundCurrency((amount * commissionPercentage) / 100);
  }

  return undefined;
};

export const createDealParticipants = (
  participants: DealParticipantInput[],
  amount: number,
  commissionBase?: number,
): DealParticipant[] => {
  const base = typeof commissionBase === 'number' ? commissionBase : amount;
  return participants.map(participant => ({
    ...participant,
    amount: roundCurrency(base * (participant.percent / 100)),
  }));
};

const cloneDeal = (deal: LeadDeal): LeadDeal => ({
  ...deal,
  participants: deal.participants.map(participant => ({ ...participant })),
  property: deal.property ? { ...deal.property } : undefined,
  installments: deal.installments ? { ...deal.installments } : undefined,
  timeline: deal.timeline.map(event => ({ ...event })),
  documents: deal.documents.map(document => ({ ...document })),
  commissionForecast: deal.commissionForecast
    ? {
        totalCommission: deal.commissionForecast.totalCommission,
        participantsShare: { ...deal.commissionForecast.participantsShare },
        companyShare: { ...deal.commissionForecast.companyShare },
      }
    : undefined,
});

const today = new Date();

const l001ProposalAmount = 2475000;
const l001ProposalCommissionBase = computeCommissionBase(l001ProposalAmount, 5);
const l001ProposalParticipants = createDealParticipants(
  [
    {
      id: 'participant-ana-proposal-sale',
      memberId: dealParticipantProfiles[0].id,
      name: dealParticipantProfiles[0].name,
      role: dealParticipantProfiles[0].role,
      avatarUrl: dealParticipantProfiles[0].avatarUrl,
      percent: 50,
    },
    {
      id: 'participant-bruno-proposal-sale',
      memberId: dealParticipantProfiles[1].id,
      name: dealParticipantProfiles[1].name,
      role: dealParticipantProfiles[1].role,
      avatarUrl: dealParticipantProfiles[1].avatarUrl,
      percent: 30,
    },
    {
      id: 'participant-helena-proposal-sale',
      memberId: dealParticipantProfiles[2].id,
      name: dealParticipantProfiles[2].name,
      role: dealParticipantProfiles[2].role,
      avatarUrl: dealParticipantProfiles[2].avatarUrl,
      percent: 20,
    },
  ],
  l001ProposalAmount,
  l001ProposalCommissionBase,
);
const l001ProposalCommissionForecast = calculateCommissionForecast(
  l001ProposalParticipants,
  l001ProposalCommissionBase,
);
const l001ProposalDownPayment = 495000;
const l001ProposalInstallmentAmount = roundCurrency(
  (l001ProposalAmount - l001ProposalDownPayment) / 24,
);

const l001ApprovedAmount = 1980000;
const l001ApprovedCommissionBase = computeCommissionBase(l001ApprovedAmount, 5.5);
const l001ApprovedParticipants = createDealParticipants(
  [
    {
      id: 'participant-ana-approved-sale',
      memberId: dealParticipantProfiles[0].id,
      name: dealParticipantProfiles[0].name,
      role: dealParticipantProfiles[0].role,
      avatarUrl: dealParticipantProfiles[0].avatarUrl,
      percent: 45,
    },
    {
      id: 'participant-bruno-approved-sale',
      memberId: dealParticipantProfiles[1].id,
      name: dealParticipantProfiles[1].name,
      role: dealParticipantProfiles[1].role,
      avatarUrl: dealParticipantProfiles[1].avatarUrl,
      percent: 35,
    },
    {
      id: 'participant-helena-approved-sale',
      memberId: dealParticipantProfiles[2].id,
      name: dealParticipantProfiles[2].name,
      role: dealParticipantProfiles[2].role,
      avatarUrl: dealParticipantProfiles[2].avatarUrl,
      percent: 20,
    },
  ],
  l001ApprovedAmount,
  l001ApprovedCommissionBase,
);
const l001ApprovedCommissionForecast = calculateCommissionForecast(
  l001ApprovedParticipants,
  l001ApprovedCommissionBase,
);
const l001ApprovedDownPayment = 297000;
const l001ApprovedInstallmentAmount = roundCurrency(
  (l001ApprovedAmount - l001ApprovedDownPayment) / 18,
);

const l001WonAmount = 3120000;
const l001WonCommissionBase = computeCommissionBase(l001WonAmount, 4);
const l001WonParticipants = createDealParticipants(
  [
    {
      id: 'participant-ana-won-sale',
      memberId: dealParticipantProfiles[0].id,
      name: dealParticipantProfiles[0].name,
      role: dealParticipantProfiles[0].role,
      avatarUrl: dealParticipantProfiles[0].avatarUrl,
      percent: 55,
    },
    {
      id: 'participant-bruno-won-sale',
      memberId: dealParticipantProfiles[1].id,
      name: dealParticipantProfiles[1].name,
      role: dealParticipantProfiles[1].role,
      avatarUrl: dealParticipantProfiles[1].avatarUrl,
      percent: 45,
    },
  ],
  l001WonAmount,
  l001WonCommissionBase,
);
const l001WonCommissionForecast = calculateCommissionForecast(
  l001WonParticipants,
  l001WonCommissionBase,
);
const l001WonDownPayment = 780000;
const l001WonInstallmentAmount = roundCurrency(
  (l001WonAmount - l001WonDownPayment) / 12,
);


const mockDeals: LeadDeal[] = [
  {
    id: 'deal-l001-proposal-sale',
    leadId: 'L-001',
    kind: 'proposal_sale',
    status: 'negotiating',
    title: 'Proposta Atlântico Residence',
    amount: l001ProposalAmount,
    commissionPercentage: 5,
    commissionBase: l001ProposalCommissionBase,
    paymentMethod: 'Financiamento bancário',
    proposalSentAt: subDays(today, 14).toISOString(),
    proposalValidUntil: subDays(today, -1).toISOString(),
    property: {
      id: 'prop-l001-01',
      code: 'AP-501',
      title: 'Apartamento alto padrão - Atlântico Residence',
      type: 'Apartamento',
      city: 'Florianópolis, SC',
      price: 2550000,
      area: 142,
      beds: 3,
      baths: 4,
      parking: 2,
      coverUrl: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=800&auto=format&fit=crop',
    },
    buyerName: 'Fernanda Lima',
    sellerName: 'Construtora Atlântico',
    notes: 'Cliente solicitou revisão de parcelas antes de aprovar a proposta final.',
    askingPrice: 2550000,
    downPayment: l001ProposalDownPayment,
    installments: {
      count: 24,
      amount: l001ProposalInstallmentAmount,
      frequency: 'monthly',
    },
    terms: 'Entrada de 20% e saldo em 24 parcelas mensais corrigidas pelo IPCA.',
    approved: false,
    participants: l001ProposalParticipants,
    timeline: [
      {
        id: 'deal-l001-proposal-sale-event-1',
        date: subDays(today, 14).toISOString(),
        title: 'Proposta enviada ao comprador',
        description: 'Apresentação da proposta com condições de financiamento.',
        kind: 'document',
      },
      {
        id: 'deal-l001-proposal-sale-event-2',
        date: subDays(today, 7).toISOString(),
        title: 'Visita técnica realizada',
        description: 'Visita adicional realizada para tirar dúvidas sobre reformas.',
        kind: 'interaction',
      },
    ],
    documents: [
      {
        id: 'doc-l001-proposal-sale-1',
        name: 'Proposta Comercial - Atlântico Residence.pdf',
        uploadedAt: subDays(today, 14).toISOString(),
        uploadedBy: 'Ana Rodrigues',
      },
      {
        id: 'doc-l001-proposal-sale-2',
        name: 'Memorial Descritivo.pdf',
        uploadedAt: subDays(today, 13).toISOString(),
        uploadedBy: 'Bruno Costa',
      },
    ],
    commissionForecast: l001ProposalCommissionForecast,
    createdAt: subDays(today, 30).toISOString(),
    updatedAt: subDays(today, 3).toISOString(),
  },
  {
    id: 'deal-l001-approved-sale',
    leadId: 'L-001',
    kind: 'sale',
    status: 'approved',
    title: 'Proposta aprovada - Vista do Parque',
    amount: l001ApprovedAmount,
    commissionPercentage: 5.5,
    commissionBase: l001ApprovedCommissionBase,
    paymentMethod: 'Financiamento bancário',
    proposalSentAt: subDays(today, 21).toISOString(),
    proposalValidUntil: subDays(today, -4).toISOString(),
    property: {
      id: 'prop-l001-02',
      code: 'AP-728',
      title: 'Apartamento garden - Vista do Parque',
      type: 'Apartamento',
      city: 'Curitiba, PR',
      price: 2050000,
      area: 168,
      beds: 4,
      baths: 4,
      parking: 3,
      coverUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=800&auto=format&fit=crop',
    },
    buyerName: 'Rodrigo Neves',
    sellerName: 'Incorporação Horizonte',
    notes: 'Documentação enviada ao banco e aprovação formal recebida nesta semana.',
    askingPrice: 2050000,
    downPayment: l001ApprovedDownPayment,
    installments: {
      count: 18,
      amount: l001ApprovedInstallmentAmount,
      frequency: 'monthly',
    },
    terms: 'Entrada de 15% e saldo parcelado em 18 vezes com correção pelo CDI.',
    approved: true,
    approvedAt: subDays(today, 2).toISOString(),
    participants: l001ApprovedParticipants,
    timeline: [
      {
        id: 'deal-l001-approved-sale-event-1',
        date: subDays(today, 21).toISOString(),
        title: 'Proposta apresentada ao cliente',
        description: 'Proposta entregue com condição especial de financiamento.',
        kind: 'document',
      },
      {
        id: 'deal-l001-approved-sale-event-2',
        date: subDays(today, 10).toISOString(),
        title: 'Reunião de negociação',
        description: 'Cliente solicitou abatimento no valor da entrada.',
        kind: 'interaction',
      },
      {
        id: 'deal-l001-approved-sale-event-3',
        date: subDays(today, 2).toISOString(),
        title: 'Crédito aprovado pelo banco',
        description: 'Instituição financeira aprovou a operação e liberou contrato.',
        kind: 'milestone',
      },
    ],
    documents: [
      {
        id: 'doc-l001-approved-sale-1',
        name: 'Proposta Comercial - Vista do Parque.pdf',
        uploadedAt: subDays(today, 21).toISOString(),
        uploadedBy: 'Ana Rodrigues',
      },
      {
        id: 'doc-l001-approved-sale-2',
        name: 'Aprovação de Crédito.pdf',
        uploadedAt: subDays(today, 2).toISOString(),
        uploadedBy: 'Helena Silva',
      },
    ],
    commissionForecast: l001ApprovedCommissionForecast,
    createdAt: subDays(today, 45).toISOString(),
    updatedAt: subDays(today, 2).toISOString(),
  },
  {
    id: 'deal-l001-won-sale',
    leadId: 'L-001',
    kind: 'won',
    status: 'won',
    title: 'Venda concluída - Maison Esmeralda',
    amount: l001WonAmount,
    commissionPercentage: 4,
    commissionBase: l001WonCommissionBase,
    paymentMethod: 'Transferência bancária',
    property: {
      id: 'prop-l001-03',
      code: 'COB-980',
      title: 'Cobertura duplex - Maison Esmeralda',
      type: 'Cobertura',
      city: 'Porto Alegre, RS',
      price: 3150000,
      area: 254,
      beds: 4,
      baths: 5,
      parking: 3,
      coverUrl: 'https://images.unsplash.com/photo-1465311440653-ba9b1d9b0f5b?q=80&w=800&auto=format&fit=crop',
    },
    buyerName: 'Patrícia Andrade',
    sellerName: 'Construtora Maison',
    notes: 'Negociação concluída com pagamento de sinal reforçado e assinatura do contrato.',
    askingPrice: 3150000,
    downPayment: l001WonDownPayment,
    installments: {
      count: 12,
      amount: l001WonInstallmentAmount,
      frequency: 'monthly',
    },
    terms: 'Entrada de 25% e saldo em 12 parcelas com correção pelo CDI.',
    approved: true,
    approvedAt: subDays(today, 20).toISOString(),
    participants: l001WonParticipants,
    timeline: [
      {
        id: 'deal-l001-won-sale-event-1',
        date: subDays(today, 35).toISOString(),
        title: 'Assinatura da proposta inicial',
        description: 'Cliente confirmou interesse e assinou a proposta inicial.',
        kind: 'interaction',
      },
      {
        id: 'deal-l001-won-sale-event-2',
        date: subDays(today, 20).toISOString(),
        title: 'Contrato aprovado em assembleia',
        description: 'Assembleia da construtora aprovou os termos do contrato.',
        kind: 'milestone',
      },
      {
        id: 'deal-l001-won-sale-event-3',
        date: subDays(today, 3).toISOString(),
        title: 'Pagamento do sinal',
        description: 'Cliente efetuou pagamento integral do sinal negociado.',
        kind: 'milestone',
      },
    ],
    documents: [
      {
        id: 'doc-l001-won-sale-1',
        name: 'Contrato Assinado - Maison Esmeralda.pdf',
        uploadedAt: subDays(today, 3).toISOString(),
        uploadedBy: 'Bruno Costa',
      },
      {
        id: 'doc-l001-won-sale-2',
        name: 'Comprovante de Pagamento do Sinal.pdf',
        uploadedAt: subDays(today, 3).toISOString(),
        uploadedBy: 'Ana Rodrigues',
      },
    ],
    commissionForecast: l001WonCommissionForecast,
    createdAt: subDays(today, 90).toISOString(),
    updatedAt: subDays(today, 1).toISOString(),
    closedAt: subDays(today, 1).toISOString(),
  },
];
let dealsStore: LeadDeal[] = mockDeals.map(cloneDeal);

export async function listDeals(leadId: string): Promise<LeadDeal[]> {
  return dealsStore
    .filter(deal => deal.leadId === leadId)
    .map(cloneDeal)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function createDeal(leadId: string, payload: LeadDealDraft): Promise<LeadDeal> {
  const now = new Date().toISOString();
  const commissionBase = computeCommissionBase(payload.amount, payload.commissionPercentage, payload.commissionBase);
  const participants = createDealParticipants(payload.participants, payload.amount, commissionBase);
  const commissionForecast = calculateCommissionForecast(participants, commissionBase);

  const deal: LeadDeal = {
    id: `lead-deal-${crypto.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
    leadId: payload.leadId ?? leadId,
    kind: payload.kind,
    status: payload.status,
    title: payload.title,
    amount: payload.amount,
    commissionPercentage: payload.commissionPercentage,
    commissionBase,
    paymentMethod: payload.paymentMethod,
    proposalSentAt: payload.proposalSentAt,
    proposalValidUntil: payload.proposalValidUntil,
    property: payload.property ? { ...payload.property } : undefined,
    buyerName: payload.buyerName,
    sellerName: payload.sellerName,
    notes: payload.notes,
    askingPrice: payload.askingPrice,
    downPayment: payload.downPayment,
    installments: payload.installments ? { ...payload.installments } : undefined,
    terms: payload.terms,
    approved: payload.approved,
    approvedAt: payload.approvedAt,
    participants,
    timeline: payload.timeline ? payload.timeline.map(event => ({ ...event })) : [],
    documents: payload.documents ? payload.documents.map(document => ({ ...document })) : [],
    commissionForecast,
    createdAt: payload.createdAt ?? now,
    updatedAt: payload.updatedAt ?? now,
    closedAt: payload.closedAt,
  };

  dealsStore = [deal, ...dealsStore];
  return cloneDeal(deal);
}

export async function updateDeal(
  leadId: string,
  id: string,
  patch: LeadDealPatch,
): Promise<LeadDeal> {
  const dealIndex = dealsStore.findIndex(item => item.id === id && item.leadId === leadId);
  if (dealIndex === -1) {
    throw new Error('Deal not found');
  }

  const current = dealsStore[dealIndex];
  const amount = patch.amount ?? current.amount;
  const commissionPercentage = patch.commissionPercentage ?? current.commissionPercentage;
  const commissionBase =
    patch.commissionBase != null
      ? computeCommissionBase(amount, commissionPercentage, patch.commissionBase)
      : computeCommissionBase(amount, commissionPercentage) ?? current.commissionBase;

  const participantInputs = (patch.participants ?? current.participants).map(participant => ({
    id: participant.id,
    memberId: participant.memberId,
    name: participant.name,
    role: participant.role,
    avatarUrl: participant.avatarUrl,
    percent: participant.percent,
  }));

  const participants = createDealParticipants(participantInputs, amount, commissionBase);
  const commissionForecast = calculateCommissionForecast(participants, commissionBase);

  const updated: LeadDeal = {
    ...current,
    kind: patch.kind ?? current.kind,
    status: patch.status ?? current.status,
    title: patch.title ?? current.title,
    amount,
    commissionPercentage,
    commissionBase,
    paymentMethod: patch.paymentMethod ?? current.paymentMethod,
    proposalSentAt: patch.proposalSentAt ?? current.proposalSentAt,
    proposalValidUntil: patch.proposalValidUntil ?? current.proposalValidUntil,
    property: patch.property ? { ...patch.property } : current.property,
    buyerName: patch.buyerName ?? current.buyerName,
    sellerName: patch.sellerName ?? current.sellerName,
    notes: patch.notes ?? current.notes,
    askingPrice: patch.askingPrice ?? current.askingPrice,
    downPayment: patch.downPayment ?? current.downPayment,
    installments: patch.installments
      ? { ...patch.installments }
      : current.installments
      ? { ...current.installments }
      : undefined,
    terms: patch.terms ?? current.terms,
    approved: patch.approved ?? current.approved,
    approvedAt: patch.approvedAt ?? current.approvedAt,
    participants,
    timeline: patch.timeline ? patch.timeline.map(event => ({ ...event })) : current.timeline.map(event => ({ ...event })),
    documents: patch.documents
      ? patch.documents.map(document => ({ ...document }))
      : current.documents.map(document => ({ ...document })),
    commissionForecast,
    createdAt: patch.createdAt ?? current.createdAt,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
    closedAt: patch.closedAt ?? current.closedAt,
  };

  dealsStore[dealIndex] = updated;
  return cloneDeal(updated);
}

export async function deleteDeal(leadId: string, id: string): Promise<void> {
  dealsStore = dealsStore.filter(deal => !(deal.id === id && deal.leadId === leadId));
}

export const dealsMocks = {
  participants: dealParticipantProfiles,
  deals: mockDeals.map(cloneDeal),
};

type DealExportFormat = 'csv' | 'json';

export interface ExportDealsOptions {
  filename?: string;
  formats?: DealExportFormat[];
}

const formatDealInstallments = (installments?: DealInstallmentPlan) => {
  if (!installments) return '';
  return `${installments.count}x de ${installments.amount} (${installments.frequency})`;
};

const normalizeDealForExport = (deal: LeadDeal) => ({
  id: deal.id,
  leadId: deal.leadId,
  title: deal.title,
  kind: deal.kind,
  status: deal.status,
  amount: deal.amount,
  commissionPercentage: deal.commissionPercentage ?? '',
  commissionBase: deal.commissionBase ?? '',
  paymentMethod: deal.paymentMethod ?? '',
  buyerName: deal.buyerName ?? '',
  sellerName: deal.sellerName ?? '',
  askingPrice: deal.askingPrice ?? '',
  downPayment: deal.downPayment ?? '',
  installments: formatDealInstallments(deal.installments),
  participants: deal.participants
    .map(participant => `${participant.name} (${participant.percent}%)`)
    .join(' | '),
  propertyId: deal.property?.id ?? '',
  propertyCode: deal.property?.code ?? '',
  propertyTitle: deal.property?.title ?? '',
  propertyCity: deal.property?.city ?? '',
  proposalSentAt: deal.proposalSentAt ?? '',
  proposalValidUntil: deal.proposalValidUntil ?? '',
  createdAt: deal.createdAt,
  updatedAt: deal.updatedAt,
  closedAt: deal.closedAt ?? '',
});

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportDeals = (
  deals: LeadDeal[],
  { filename, formats }: ExportDealsOptions = {},
) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  if (!deals.length) {
    return;
  }

  const normalized = deals.map(normalizeDealForExport);
  const selectedFormats: DealExportFormat[] =
    formats && formats.length ? formats : ['csv', 'json'];

  const pad = (value: number) => String(value).padStart(2, '0');
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(
    now.getHours(),
  )}-${pad(now.getMinutes())}`;
  const baseName = filename ?? (deals.length === 1 ? `negocio-${deals[0].id}` : 'negocios');

  if (selectedFormats.includes('csv')) {
    const headers = Object.keys(normalized[0]);
    const csvRows = [headers.join(';')];

    for (const row of normalized) {
      const values = headers.map(header => {
        const value = row[header as keyof typeof row];
        const stringValue = value === undefined || value === null ? '' : String(value);
        const escaped = stringValue.replace(/"/g, '""');
        return /[;"\n]/.test(escaped) ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(';'));
    }

    const csvContent = '\ufeff' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${baseName}_${timestamp}.csv`);
  }

  if (selectedFormats.includes('json')) {
    const jsonContent = JSON.stringify(normalized, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, `${baseName}_${timestamp}.json`);
  }
};

export const __resetDealsStore = () => {
  dealsStore = mockDeals.map(cloneDeal);
};

export const __getDealParticipantProfiles = () => dealParticipantProfiles.map(profile => ({ ...profile }));

