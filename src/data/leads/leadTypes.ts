export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost' | 'won';

export type DateRangeKey = '7d' | '30d' | '90d' | '365d' | 'all';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  ownerId?: string;
  ownerName?: string;
  status: LeadStatus;
  source?: string;
  createdAt: string;
  updatedAt?: string;
}
