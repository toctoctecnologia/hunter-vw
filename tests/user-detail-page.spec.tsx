import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

describe('UserDetailPage', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
    vi.resetModules();
    vi.doMock('@/hooks/ui/useIsMobile', () => ({ useIsMobile: () => true }));
    vi.doMock('@/utils/auth', () => ({ getCurrentUser: () => ({ id: '1', role: 'admin' }) }));
  });

  it('renders KPI cards', async () => {
    const Page = (await import('@/app/(admin)/usuarios/[userId]/page')).default;
    render(
      <MemoryRouter>
        <Page params={{ userId: '1' }} />
      </MemoryRouter>,
    );
    await screen.findByText('Captações');
    await screen.findByText('Taxa de vacância');
  });

  it('renders last sales cards', async () => {
    const Page = (await import('@/app/(admin)/usuarios/[userId]/page')).default;
    render(
      <MemoryRouter>
        <Page params={{ userId: '1' }} />
      </MemoryRouter>,
    );
    await screen.findByText('Falcon Tower • Unidade 2702');
    const link = screen.getAllByRole('link', {
      name: 'Ver Detalhes da Venda',
    })[0];
    expect(link).toHaveAttribute('href', '/vendas/1');
  });
});
