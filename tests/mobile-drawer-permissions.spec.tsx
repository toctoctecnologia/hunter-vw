import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('MobileDrawer permissions', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('hides access management when permission is missing', async () => {
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'user' }),
    }));
    vi.doMock('@/data/accessControl', () => ({
      hasPermission: () => false,
    }));
    vi.doMock('@/components/ui/drawer', () => ({
      Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));
    const { MobileDrawer } = await import('@/app-mobile/navigation/MobileDrawer');
    render(
      <MemoryRouter>
        <MobileDrawer open onOpenChange={() => {}} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Gestão de acessos')).not.toBeInTheDocument();
  });

  it('shows access management when permission is present', async () => {
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'user' }),
    }));
    vi.doMock('@/data/accessControl', () => ({
      hasPermission: () => true,
    }));
    vi.doMock('@/components/ui/drawer', () => ({
      Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    }));
    const { MobileDrawer } = await import('@/app-mobile/navigation/MobileDrawer');
    render(
      <MemoryRouter>
        <MobileDrawer open onOpenChange={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Gestão de acessos')).toBeInTheDocument();
  });
});
