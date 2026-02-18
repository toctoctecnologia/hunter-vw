import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Test for UserLastSales component rendering

describe('UserLastSales', () => {
  it('renders property data, sale date, and link', async () => {
    const viewModels = [
      {
        saleId: '1',
        soldAt: '2024-01-01',
        soldPrice: 1000000,
        property: {
          id: 1,
          code: 'C1',
          type: 'Apartamento',
          title: 'Imóvel Teste',
          city: 'Cidade Teste',
          area: 100,
          beds: 3,
          baths: 2,
          parking: 1,
          status: 'Vendido',
          salePrice: 1000000,
          saleDate: '2024-01-01',
          image: '/img.jpg',
        },
      },
    ];

    vi.doMock('@/features/users/mappers/propertyMapper', () => ({
      buildLastSalesVM: vi.fn(async () => viewModels),
    }));

    const { buildLastSalesVM } = await import('@/features/users/mappers/propertyMapper');
    const vm = await buildLastSalesVM([], vi.fn());
    const sales = vm.map(v => ({
      ...v.property,
      salePrice: v.soldPrice,
      saleDate: v.soldAt,
      saleId: v.saleId,
    }));

    const UserLastSales = (await import('@/features/users/profile/UserLastSales')).default;

    render(
      <MemoryRouter>
        <UserLastSales sales={sales} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Imóvel Teste')).toBeInTheDocument();
    const date = new Date('2024-01-01').toLocaleDateString('pt-BR');
    expect(screen.getByText(`Data da venda: ${date}`)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ver Detalhes da Venda' }),
    ).toHaveAttribute('href', '/vendas/1');
  });
});

