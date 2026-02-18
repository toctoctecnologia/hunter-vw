export interface DistributionTarget {
  id: string;
  type: 'user' | 'team' | 'store';
  name: string;
  quotaLeads?: number;
  quotaProperties?: number;
  active?: boolean;
  members?: Array<{ userId: string; active: boolean; name: string }>;
}

export interface DistributionStrategy {
  type: 'round_robin' | 'weighted' | 'by_team' | 'by_store';
  targets: DistributionTarget[];
  maxItemsPerPerson?: number;
}

export interface DistributionScope {
  leads: {
    hot: boolean;
    warm: boolean;
    cold: boolean;
  };
  properties: boolean;
}

export interface DistributionPreviewRow {
  destId: string;
  destLabel: string;
  leadsHot: number;
  leadsWarm: number;
  leadsCold: number;
  properties: number;
  total: number;
}

export interface DistributionPreviewResponse {
  rows: DistributionPreviewRow[];
  warnings: string[];
  totals: {
    leadsHot: number;
    leadsWarm: number;
    leadsCold: number;
    properties: number;
    total: number;
  };
}

export interface SearchResult {
  id: string;
  type: 'user' | 'team' | 'store';
  name: string;
  active: boolean;
  members?: Array<{ userId: string; active: boolean; name: string }>;
}