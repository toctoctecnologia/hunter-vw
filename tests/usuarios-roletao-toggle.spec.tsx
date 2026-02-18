import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useUsers } from '@/hooks/users/useUsers';
import { toggleUserRoletao } from '@/services/users';

vi.mock('@/services/users', async () => {
  const actual = await vi.importActual<typeof import('@/services/users')>(
    '@/services/users'
  );
  return {
    ...actual,
    toggleUserRoletao: vi.fn().mockResolvedValue({ success: true }),
  };
});

const TestComponent = () => {
  const user = useUsers((state) => state.items[0]);
  return <div>{user?.roletaoEnabled ? 'enabled' : 'disabled'}</div>;
};

describe('toggleRoletao', () => {
  it('updates roletaoEnabled and UI', async () => {
    useUsers.setState({
      items: [
        { id: '1', name: 'Ana', email: 'ana@example.com', active: true, roletaoEnabled: false },
      ],
      current: null,
    });

    render(<TestComponent />);

    screen.getByText('disabled');

    await act(async () => {
      await useUsers.getState().toggleRoletao('1', true);
    });

    expect(toggleUserRoletao).toHaveBeenCalledWith('1', true);
    screen.getByText('enabled');
  });
});
