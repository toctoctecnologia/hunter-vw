import { api } from '@/shared/lib/api';
import { Permission } from '@/shared/types';

export async function getPermissions() {
  const { data } = await api.get<Permission[]>('dashboard/super-admin/permissions');
  return data;
}
