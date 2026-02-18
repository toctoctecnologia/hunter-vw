import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

describe('UsuariosPage', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
    vi.resetModules();
    vi.doMock('@/hooks/ui/useIsMobile', () => ({ useIsMobile: () => true }));
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'admin' }),
      hasRole: () => true,
    }));
  });

  it('navigates to user detail on row click', async () => {
    const UsuariosPage = (await import('@/pages/usuarios/UsuariosPage')).default;
    render(
      <MemoryRouter initialEntries={['/usuarios']}>
        <Routes>
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuarios/:id" element={<div>Perfil</div>} />
        </Routes>
      </MemoryRouter>
    );

    const [userCell] = await screen.findAllByText('Ana Silva');
    fireEvent.click(userCell);
    await screen.findByText('Perfil');
  });

  it('renders empty state', async () => {
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [],
        load: vi.fn(),
        loading: false,
        error: null,
        toggleStatus: vi.fn(),
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
    await screen.findByText('Nenhum usuário encontrado.');
  });

  it('renders error state', async () => {
    const load = vi.fn();
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [],
        load,
        loading: false,
        error: 'Falha ao carregar usuários.',
        toggleStatus: vi.fn(),
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
    await screen.findByText('Falha ao carregar usuários.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(load).toHaveBeenCalled();
  });

  it('handles pagination', async () => {
    const setPage = vi.fn();
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [
          { id: '1', name: 'Ana Silva', email: 'ana@example.com', active: true },
        ],
        load: vi.fn(),
        loading: false,
        error: null,
        toggleStatus: vi.fn(),
        bulkUpdateStatus: vi.fn(),
        bulkLink: vi.fn(),
        setFilters: vi.fn(),
        page: 1,
        pageSize: 10,
        setPage,
        setPageSize: vi.fn(),
        query: '',
        setQuery: vi.fn(),
      });
      return { __esModule: true, default: store, useUsers: store };
    });
    const UsuariosPage = (await import('@/pages/usuarios/UsuariosPage')).default;
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    const nextButtons = await screen.findAllByLabelText('Go to next page');
    nextButtons.forEach((btn) => fireEvent.click(btn));
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it('handles search input', async () => {
    const state = { query: '' };
    const setQuery = vi.fn((q: string) => {
      state.query = q;
    });
    vi.doMock('@/hooks/users/useUsers', () => {
      const store = () => ({
        items: [
          { id: '1', name: 'Ana Silva', email: 'ana@example.com', active: true },
        ],
        load: vi.fn(),
        loading: false,
        error: null,
        toggleStatus: vi.fn(),
        bulkUpdateStatus: vi.fn(),
        bulkLink: vi.fn(),
        setFilters: vi.fn(),
        page: 1,
        pageSize: 10,
        setPage: vi.fn(),
        setPageSize: vi.fn(),
        get query() {
          return state.query;
        },
        setQuery,
      });
      return { __esModule: true, default: store, useUsers: store };
    });
    const UsuariosPage = (await import('@/pages/usuarios/UsuariosPage')).default;
    render(
      <MemoryRouter>
        <UsuariosPage />
      </MemoryRouter>
    );
    const search = (await screen.findAllByPlaceholderText('Buscar'))[0];
    fireEvent.change(search, { target: { value: 'ana' } });
    await screen.findByDisplayValue('ana');
    expect(setQuery).toHaveBeenCalledWith('ana');
  });
});
