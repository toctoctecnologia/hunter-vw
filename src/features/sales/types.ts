export interface SaleNegotiationEvent {
  date: string; // ISO date
  description: string;
  actor?: string;
}

export interface SalePartyShare {
  party: string;
  percentage: number;
}

export interface SaleProperty {
  id: number;
  code: string;
  type: string;
  title: string;
  city: string;
  area: number;
  beds: number;
  baths: number;
  parking: number;
  image?: string;
}

export interface SaleDetail {
  saleId: string;
  soldPrice: number;
  soldAt: string; // ISO date
  property: SaleProperty;
  negotiation: SaleNegotiationEvent[];
  distribution: SalePartyShare[];
}
