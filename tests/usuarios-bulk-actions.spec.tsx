import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

let toast: ReturnType<typeof vi.fn>;

describe('UsuariosPage bulk actions', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
    vi.resetModules();
    toast = vi.fn();
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'admin' }),
      hasRole: () => true,
    }));
    vi.doMock('@/hooks/use-toast', () => ({ useToast: () => ({ toast }) }));
  });

  const setup = async (bulkUpdateStatus = vi.fn()) => {
    vi.doMock('@/services/users', () => ({
      __esModule: true,
      bulkExportUsers: vi.fn().mockResolvedValue(undefined),
    }));
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [
          { id: '1', name: 'Ana Silva', email: 'ana@example.com', active: true },
          { id: '2', name: 'Bruno Dias', email: 'bruno@example.com', active: false },
        ],
        load: vi.fn(),
        loading: false,
        error: null,
        toggleStatus: vi.fn(),
        bulkUpdateStatus,
        bulkLink: vi.fn(),
        setFilters: vi.fn(),
        page: 1,
        pageSize: 10,
        setPage: vi.fn(),
        setPageSize: vi.fn(),
      });
      return { __esModule: true, default: store, useUsers: store };
    });
    const DesktopUsuarios = (await import('@/pages/desktop/Usuarios')).default;
    render(
      <MemoryRouter>
        <DesktopUsuarios />
      </MemoryRouter>
    );
    return { bulkUpdateStatus };
  };

  it('performs activate, deactivate and export', async () => {
    const { bulkUpdateStatus } = await setup(vi.fn());
    const [, firstUser] = screen.getAllByRole('checkbox');

    fireEvent.click(firstUser);
    await screen.findByText('1 selecionado(s)');
    fireEvent.click(screen.getByRole('button', { name: 'Ativar' }));
    await waitFor(() => expect(bulkUpdateStatus).toHaveBeenCalledWith(['1'], true));

    fireEvent.click(firstUser);
    await screen.findByText('1 selecionado(s)');
    fireEvent.click(screen.getByRole('button', { name: 'Desativar' }));
    await waitFor(() => expect(bulkUpdateStatus).toHaveBeenCalledWith(['1'], false));

    fireEvent.click(firstUser);
    await screen.findByText('1 selecionado(s)');
    const exportBtn = screen.getByText('Exportar CSV');
    fireEvent.click(exportBtn);
    await waitFor(() => expect(toast).toHaveBeenCalled());
  });
});
