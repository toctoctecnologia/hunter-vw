import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import UserAuditTable from '@/features/users/audit/UserAuditTable';
import { getUserAudit } from '@/services/users';

describe('UserAuditTable custom range', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK = '1';
  });

  it('filters events using custom date range', async () => {
    const data = await getUserAudit('1');
    const { container } = render(
      <UserAuditTable data={data} loading={false} error={null} />,
    );
    const periodSelect = screen.getAllByRole('combobox')[1];
    fireEvent.click(periodSelect);
    fireEvent.click(screen.getByText('Personalizado'));

    await waitFor(() => {
      expect(container.querySelectorAll('input[type="date"]').length).toBe(2);
    });
    const dateInputs = container.querySelectorAll('input[type="date"]');
    const startInput = dateInputs[0] as HTMLInputElement;
    const endInput = dateInputs[1] as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: '2025-08-01' } });
    fireEvent.change(endInput, { target: { value: '2025-08-02' } });

    expect(screen.getByText('Nenhum evento encontrado')).toBeInTheDocument();
  });
});
