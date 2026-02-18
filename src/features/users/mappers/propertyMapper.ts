import type { PropertySummary } from '@/features/properties/types';
import type { UserSaleItem } from '../types';

export type PropertyFetcher = (propertyId: string) => Promise<PropertySummary>;

export interface LastSaleViewModel {
  saleId: string;
  soldAt: string;
  soldPrice: number;
  property: PropertySummary;
}

export async function buildLastSalesVM(
  sales: UserSaleItem[],
  fetcher: PropertyFetcher,
): Promise<LastSaleViewModel[]> {
  return Promise.all(
    sales.map(async sale => ({
      saleId: sale.saleId,
      soldAt: sale.soldAt,
      soldPrice: sale.soldPrice,
      property: await fetcher(sale.propertyId),
    })),
  );
}
