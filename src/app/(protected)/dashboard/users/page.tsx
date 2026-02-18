'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { withPermission } from '@/shared/hoc/with-permission';
import { hasFeature } from '@/shared/lib/permissions';

import { useAuth } from '@/shared/hooks/use-auth';

import { getUserMetrics } from '@/features/dashboard/access-control/api/user';

import { UserClient } from '@/features/dashboard/access-control/components/tables/users-table/client';
import { NewUserModal } from '@/features/dashboard/access-control/components/modal/new-user-modal';
import { TeamClient } from '@/features/dashboard/properties/components/tables/team-table/client';
import { UnitClient } from '@/features/dashboard/properties/components/tables/unit-table/client';
import { Filter, FilterAddButton, FilterSearchInput } from '@/shared/components/filters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { StatusCard } from '@/shared/components/StatusCard';
import { Loading } from '@/shared/components/loading';
import { cn, getCalculatedGrid } from '@/shared/lib/utils';

function Page() {
  const { user } = useAuth();

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: usersMetrics = [], isLoading } = useQuery({
    queryKey: ['user-metrics'],
    queryFn: () => getUserMetrics(),
  });

  return (
    <>
      <NewUserModal open={isNewUserModalOpen} onClose={() => setIsNewUserModalOpen(false)} />

      <div className="grid md:grid-cols-3 gap-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {usersMetrics.map(({ title, description, icon, value }, index) => (
              <StatusCard key={index} title={title} description={description} icon={icon} value={String(value)} />
            ))}
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={cn('grid w-full grid-cols-3 rounded-xl p-1 gap-1', getCalculatedGrid(user, ['1400', '1450', '2150']))}
        >
          {hasFeature(user?.userInfo.profile.permissions, '1400') && <TabsTrigger value="users">Usuários</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1450') && <TabsTrigger value="teams">Equipes</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '2150') && <TabsTrigger value="units">Unidades</TabsTrigger>}
        </TabsList>

        {hasFeature(user?.userInfo.profile.permissions, '1400') && (
          <TabsContent value="users">
            <div className="space-y-4">
              <Filter>
                <FilterSearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} showFilterButton={false} />
                {(hasFeature(user?.userInfo.profile.permissions, '1401') ||
                  hasFeature(user?.userInfo.profile.permissions, '1402')) && (
                  <FilterAddButton onClick={() => setIsNewUserModalOpen(true)} icon={Plus}>
                    Novo usuário
                  </FilterAddButton>
                )}
              </Filter>

              <UserClient searchTerm={searchTerm} />
            </div>
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1450') && (
          <TabsContent value="teams">
            <TeamClient />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '2150') && (
          <TabsContent value="units">
            <UnitClient />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}

export default withPermission(Page, ['1400']);
