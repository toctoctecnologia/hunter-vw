import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('UsuariosPage filters', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
    vi.resetModules();
    vi.doMock('@/hooks/ui/useIsMobile', () => ({ useIsMobile: () => true }));
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'admin' }),
      hasRole: () => true,
    }));
    vi.doMock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
  });

  it('applies filters via sheet and calls load', async () => {
    const load = vi.fn();
    const setFilters = vi.fn(() => load());
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [
          { id: '1', name: 'Ana Silva', email: 'ana@example.com', active: true },
        ],
        load,
        loading: false,
        error: null,
        toggleStatus: vi.fn(),
        bulkUpdateStatus: vi.fn(),
        bulkLink: vi.fn(),
        setFilters,
        page: 1,
        pageSize: 10,
        setPage: vi.fn(),
        setPageSize: vi.fn(),
      });
      return { __esModule: true, default: store, useUsers: store };
    });
    const UsuariosPage = (await import('@/pages/usuarios/UsuariosPage')).default;
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button');
    const filterBtn = buttons.find((btn) => btn.querySelector('.lucide-filter'))!;
    fireEvent.click(filterBtn);
    await screen.findByText('Filtros');
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(load).toHaveBeenCalled();
  });
});
