'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlanPermissions, getProfiles } from '@/features/dashboard/access-control/api/profile';

import { withPermission } from '@/shared/hoc/with-permission';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { Permissions } from '@/features/dashboard/access-control/components/permissions';
import { Profiles } from '@/features/dashboard/access-control/components/profiles';
import { Loading } from '@/shared/components/loading';

function Page() {
  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => getProfiles(),
  });

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['profile-permissions'],
    queryFn: () => getPlanPermissions(),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="lg:col-span-1">
        <CardHeader className="px-2 sm:px-4">
          <CardTitle className="text-xl sm:text-2xl">Perfis de Acesso</CardTitle>
        </CardHeader>
        <CardContent className="h-full px-0 border-t">
          {isLoadingProfiles ? <Loading /> : <Profiles data={profiles} availablePermissions={permissions} />}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader className="px-2 sm:px-4">
          <CardTitle className="text-xl sm:text-2xl">Permissões do seu plano</CardTitle>
        </CardHeader>
        <CardContent className="border-t px-0">{isLoading ? <Loading /> : <Permissions data={permissions} />}</CardContent>
      </Card>
    </div>
  );
}

export default withPermission(Page, ['1700']);
