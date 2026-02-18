import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConnectorModal from '@/features/integracoes/ConnectorModal';
import { connectors } from '@/lib/mock/connectors';

vi.mock('@/components/ui/use-toast', () => ({ toast: vi.fn() }));

describe('ConnectorModal wizard', () => {
  it('navigates through steps and shows prefilled mapping', () => {
    const onSave = vi.fn();
    const connector = connectors[0];

    render(
      <ConnectorModal
        open
        onOpenChange={() => {}}
        connector={connector}
        onSave={onSave}
      />
    );

    expect(screen.getByLabelText('apiKey')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Próximo'));
    fireEvent.click(screen.getByText('Testar conexão'));
    fireEvent.click(screen.getByText('Próximo'));

    expect(screen.getByDisplayValue('nome')).toBeInTheDocument();
    expect(screen.getByText('Nome completo do contato')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Próximo'));
    expect(screen.getByText('Sincronizar agora')).toBeInTheDocument();
  });
});
