import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let toast: ReturnType<typeof vi.fn>;

describe('UsuariosPage toggle status', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
    vi.resetModules();
    toast = vi.fn();
    vi.doMock('@/hooks/ui/useIsMobile', () => ({ useIsMobile: () => true }));
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'admin' }),
      hasRole: () => true,
    }));
    vi.doMock('@/hooks/use-toast', () => ({ useToast: () => ({ toast }) }));
  });

  it('toggles status with switch and shows toast', async () => {
    const toggleStatus = vi.fn();
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [
          { id: '1', name: 'Ana Silva', email: 'ana@example.com', active: true },
        ],
        load: vi.fn(),
        loading: false,
        error: null,
        toggleStatus,
        toggleRoletao: vi.fn(),
        bulkUpdateStatus: vi.fn(),
        bulkLink: vi.fn(),
        setFilters: vi.fn(),
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
    const switchEl = screen.getByLabelText('Status para Ana Silva');
    fireEvent.click(switchEl);
    await screen.findByText('Confirmar');
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(toggleStatus).toHaveBeenCalledWith('1', false));
    expect(toast).toHaveBeenCalledWith({ title: 'Usuário desativado' });
  });
});
