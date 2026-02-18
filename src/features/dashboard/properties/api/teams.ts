import { PaginationState } from '@tanstack/react-table';

import { api } from '@/shared/lib/api';

import { Record, TeamDetail, TeamMember } from '@/shared/types';

import { TeamFormData } from '@/features/dashboard/properties/components/form/team-form/schema';

export async function getTeams(pagination: PaginationState, search?: string) {
  const { pageIndex, pageSize } = pagination;
  const params = search ? { name: search, page: pageIndex, size: pageSize } : { page: pageIndex, size: pageSize };
  const { data } = await api.get<Record<TeamDetail>>('dashboard/team', { params });
  return data;
}

export async function getTeam(teamUuid: string) {
  const { data } = await api.get<TeamDetail>(`dashboard/team/${teamUuid}`);
  return data;
}

export async function getTeamMembers(teamUuid: string) {
  const { data } = await api.get<TeamMember[]>(`dashboard/team/${teamUuid}/members`);
  return data;
}

export async function newTeam(formData: TeamFormData) {
  const { data } = await api.post('dashboard/team', formData);
  return data;
}

export async function updateTeam(teamUuid: string, formData: TeamFormData) {
  const { data } = await api.put(`dashboard/team/${teamUuid}`, formData);
  return data;
}

export async function deleteTeam(teamUuid: string) {
  const { data } = await api.delete(`dashboard/team/${teamUuid}`);
  return data;
}

export async function addTeamMember(teamUuid: string, userUuid: string) {
  const { data } = await api.post(`dashboard/team/${teamUuid}/members`, { userUuid });
  return data;
}

export async function deleteTeamMember(teamUuid: string, userUuid: string) {
  const { data } = await api.delete(`dashboard/team/${teamUuid}/members/${userUuid}`);
  return data;
}
