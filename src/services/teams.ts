import { httpJSON } from '@/lib/http';
import type {
  CreateTeamInput,
  Team,
  TeamFilters,
  TeamListResponse,
  TeamMember,
  TeamMemberFilters,
  TeamMemberInput,
  TeamMemberListResponse,
  UpdateTeamInput,
  UpdateTeamMemberInput,
  UpdateTeamStatusInput,
} from '@/types/teams';

const BASE_URL = '/api/teams';

function toArray<T>(value: T | T[] | undefined): T[] | undefined {
  if (typeof value === 'undefined') return undefined;
  if (Array.isArray(value)) return value.length ? value : undefined;
  return [value];
}

function buildQuery(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.set(key, value.join(','));
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function listTeams(filters: TeamFilters = {}): Promise<TeamListResponse> {
  const query = buildQuery({
    q: filters.q,
    city: toArray(filters.city),
    status: toArray(filters.status),
    managerId: toArray(filters.managerId),
    page: filters.page,
    perPage: filters.perPage,
  });

  return httpJSON<TeamListResponse>(`${BASE_URL}${query}`);
}

export async function createTeam(payload: CreateTeamInput): Promise<Team> {
  return httpJSON<Team>(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateTeam(id: string, payload: UpdateTeamInput): Promise<Team> {
  return httpJSON<Team>(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateTeamStatus(
  id: string,
  payload: UpdateTeamStatusInput,
): Promise<Team> {
  return httpJSON<Team>(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteTeam(id: string): Promise<void> {
  await httpJSON<void>(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

export async function listTeamMembers(
  teamId: string,
  filters: TeamMemberFilters = {},
): Promise<TeamMemberListResponse> {
  const query = buildQuery({
    status: toArray(filters.status),
    role: toArray(filters.role),
    page: filters.page,
    perPage: filters.perPage,
  });

  return httpJSON<TeamMemberListResponse>(`${BASE_URL}/${teamId}/members${query}`);
}

export async function addTeamMembers(
  teamId: string,
  members: TeamMemberInput[] | TeamMemberInput,
): Promise<TeamMemberListResponse> {
  const payload = Array.isArray(members) ? members : [members];
  return httpJSON<TeamMemberListResponse>(`${BASE_URL}/${teamId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ members: payload }),
  });
}

export async function updateTeamMember(
  teamId: string,
  memberId: string,
  payload: UpdateTeamMemberInput,
): Promise<TeamMember> {
  return httpJSON<TeamMember>(`${BASE_URL}/${teamId}/members/${memberId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function removeTeamMember(teamId: string, memberId: string): Promise<void> {
  await httpJSON<void>(`${BASE_URL}/${teamId}/members/${memberId}`, { method: 'DELETE' });
}
