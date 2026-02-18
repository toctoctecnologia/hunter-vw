import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeAll, vi, expect } from 'vitest';
import GestaoApi from '@/pages/GestaoApi';

describe('GestaoApi connector rendering', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('shows new connectors', () => {
    render(
      <MemoryRouter>
        <GestaoApi />
      </MemoryRouter>
    );

    const names = [
      'ZAP',
      'Viva Real',
      'Imóvelweb',
      'OLX',
      'Chaves na Mão',
      'Rocket Imob',
      'WATI',
      'Meta Ads',
      'TikTok Ads'
    ];

    for (const name of names) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });
});
