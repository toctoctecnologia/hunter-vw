import { httpJSON } from '@/lib/http';
import { searchUsers, USERS as usersMock } from '@/mocks/users';
import type { User } from '@/services/users';
import { IS_MOCK } from '@/utils/env';

interface FetchUsersParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filters?: Record<string, any>;
}

type FetchUsersSource = 'mock' | 'api' | 'mock-fallback';

export async function fetchUsers({
  page = 1,
  pageSize = 10,
  query = '',
  filters = {},
}: FetchUsersParams = {}): Promise<{ users: User[]; source: FetchUsersSource }> {
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));
  if (pageSize) params.set('pageSize', String(pageSize));
  if (query) params.set('query', query);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();

  const buildMock = () => {
    let all = searchUsers(query ?? '');
    if (filters.role && filters.role !== 'todos' && filters.role !== '') {
      all = all.filter(u => u.role === filters.role);
    }
    all = all.map(u => ({
      ...u,
      timeOnPlatform: Math.floor(Math.random() * 365) + 1,
      dataEntradaISO: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }));
    const start = (page - 1) * pageSize;
    return all.slice(start, start + pageSize);
  };

  if (IS_MOCK) {
    return { users: buildMock(), source: 'mock' };
  }

  try {
    const data = await httpJSON<{ items: User[] }>(
      `/api/usuarios${qs ? `?${qs}` : ''}`,
    );
    const users = data?.items ?? [];
    return { users, source: 'api' };
  } catch (error) {
    console.warn('fetchUsers fallback to mock:', error);
    return { users: usersMock, source: 'mock-fallback' };
  }
}

export default fetchUsers;
