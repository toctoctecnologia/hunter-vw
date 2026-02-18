import { describe, it, expect, vi } from 'vitest';
import { buildLastSalesVM, PropertyFetcher } from '@/features/users/mappers/propertyMapper';
import { UserSaleItem } from '@/features/users/types';
import type { PropertySummary } from '@/features/properties/types';

describe('buildLastSalesVM', () => {
  it('fetches property summaries and maps to view models', async () => {
    const sales: UserSaleItem[] = [
      { saleId: '1', propertyId: 'p1', soldAt: '2024-01-01', soldPrice: 1000 },
      { saleId: '2', propertyId: 'p2', soldAt: '2024-02-01', soldPrice: 2000 },
    ];

    const summaries: Record<string, PropertySummary> = {
      p1: {
        id: 1,
        code: 'C1',
        type: 'Apartamento',
        title: 'Imóvel 1',
        city: 'Cidade 1',
        area: 50,
        beds: 2,
        baths: 1,
        parking: 1,
        status: 'Vendido',
        salePrice: 1000,
        saleDate: '2024-01-01',
      },
      p2: {
        id: 2,
        code: 'C2',
        type: 'Casa',
        title: 'Imóvel 2',
        city: 'Cidade 2',
        area: 80,
        beds: 3,
        baths: 2,
        parking: 2,
        status: 'Vendido',
        salePrice: 2000,
        saleDate: '2024-02-01',
      },
    };

    const fetcher: PropertyFetcher = vi.fn(async (id: string) => summaries[id]);

    const result = await buildLastSalesVM(sales, fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher).toHaveBeenNthCalledWith(1, 'p1');
    expect(fetcher).toHaveBeenNthCalledWith(2, 'p2');
    expect(result).toEqual([
      { saleId: '1', soldAt: '2024-01-01', soldPrice: 1000, property: summaries.p1 },
      { saleId: '2', soldAt: '2024-02-01', soldPrice: 2000, property: summaries.p2 },
    ]);
  });
});
