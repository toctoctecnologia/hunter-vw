export interface Proposal {
  id: string;
  leadId: string;
  propertyId: string;
  value: number;
  status: 'sent' | 'accepted' | 'rejected';
}

export interface CommissionSplit {
  userId: string;
  percentage: number; // 0-100
}

export interface Deal {
  id: string;
  proposal: Proposal;
  commission: CommissionSplit[];
  createdAt: string;
  closedAt: string;
}
