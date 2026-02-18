'use client';
import { useState } from 'react';

import { hasFeature } from '@/shared/lib/permissions';

import { useAuth } from '@/shared/hooks/use-auth';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { SyncAppsInfo } from '@/features/dashboard/profile/components/sync-apps-info';
import { ProfileInfo } from '@/features/dashboard/profile/components/profile-info';

export default function Page() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  if (hasFeature(user?.userInfo.profile.permissions, '1100')) {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 gap-1">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="apps">Sincronização</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ProfileInfo />
        </TabsContent>

        <TabsContent value="apps">
          <SyncAppsInfo />
        </TabsContent>
      </Tabs>
    );
  }

  return <ProfileInfo />;
}
