'use client';

import { withPermission } from '@/shared/hoc/with-permission';

import { ImoviewApiCard } from '@/features/dashboard/manage-api/components/imoview-api-card';
import { LaisApiCard } from '@/features/dashboard/manage-api/components/lais-api-card';
import { SwaggerCard } from '@/features/dashboard/manage-api/components/swagger-card';
import { CnmApiCard } from '@/features/dashboard/manage-api/components/cnm-api-card';
import { DwvApiCard } from '@/features/dashboard/manage-api/components/dwv-api-card';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <SwaggerCard />

      {hasFeature(user?.userInfo.profile.permissions, '1901') && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ImoviewApiCard />

          <CnmApiCard />

          <DwvApiCard />

          <LaisApiCard />
        </div>
      )}
    </div>
  );
}

export default withPermission(Page, ['1900']);
