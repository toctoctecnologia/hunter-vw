import { api } from '@/shared/lib/api';

import { Permission } from '@/shared/types';

import { SaveProfile, Profile } from '@/features/dashboard/access-control/types';

export async function getProfiles() {
  const { data } = await api.get<Profile[]>('dashboard/access-management/profiles');
  return data;
}

export async function createProfile(profile: SaveProfile) {
  const { data } = await api.post<Profile>('dashboard/access-management/profile', profile);
  return data;
}

export async function updateProfile(profileCode: string, profile: SaveProfile) {
  const { data } = await api.patch<Profile>(`dashboard/access-management/profile/${profileCode}`, profile);
  return data;
}

export async function getPlanPermissions() {
  const { data } = await api.get<Permission[]>('dashboard/access-management/permissions');
  return data;
}

export async function getProfilePermissions(profileCode: string) {
  const { data } = await api.get<Permission[]>(`dashboard/access-management/profile/${profileCode}/permissions`);
  return data;
}
