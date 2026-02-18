import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('SidebarNav permissions', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('hides access management when permission is missing', async () => {
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'user' }),
      hasRole: () => true,
    }));
    vi.doMock('@/data/accessControl', () => ({
      hasPermission: () => false,
    }));
    const { SidebarNav } = await import('@/components/shell/SidebarNav');
    render(
      <MemoryRouter>
        <SidebarNav activeTab="home" setActiveTab={() => {}} isOpen onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Gestão de acessos')).not.toBeInTheDocument();
  });

  it('shows access management when permission is present', async () => {
    vi.doMock('@/utils/auth', () => ({
      getCurrentUser: () => ({ id: '1', role: 'user' }),
      hasRole: () => true,
    }));
    vi.doMock('@/data/accessControl', () => ({
      hasPermission: () => true,
    }));
    const { SidebarNav } = await import('@/components/shell/SidebarNav');
    render(
      <MemoryRouter>
        <SidebarNav activeTab="home" setActiveTab={() => {}} isOpen onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Gestão de acessos')).toBeInTheDocument();
  });
});
