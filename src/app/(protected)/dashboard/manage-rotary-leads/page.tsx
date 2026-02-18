'use client';
import { useState } from 'react';

import { withPermission } from '@/shared/hoc/with-permission';

import { useAuth } from '@/shared/hooks/use-auth';
import { cn, getCalculatedGrid } from '@/shared/lib/utils';
import { hasFeature } from '@/shared/lib/permissions';

import { RotaryLeadsNextInLine } from '@/features/dashboard/sales/components/rotary-leads-next-in-line';
import { RotaryLeadsSettings } from '@/features/dashboard/sales/components/rotary-leads-settings';
import { RotaryLeadsRanking } from '@/features/dashboard/sales/components/rotary-leads-ranking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

function Page() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('settings');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className={cn('grid w-full grid-cols-3 rounded-xl p-1 gap-1', getCalculatedGrid(user, ['1801', '1802', '1803']))}>
        {hasFeature(user?.userInfo.profile.permissions, '1801') && <TabsTrigger value="settings">Configurações</TabsTrigger>}
        {hasFeature(user?.userInfo.profile.permissions, '1802') && <TabsTrigger value="ranking">Ranking</TabsTrigger>}
        {hasFeature(user?.userInfo.profile.permissions, '1803') && <TabsTrigger value="nl">Próximo da fila</TabsTrigger>}
      </TabsList>

      {hasFeature(user?.userInfo.profile.permissions, '1801') && (
        <TabsContent value="settings">
          <RotaryLeadsSettings />
        </TabsContent>
      )}

      {hasFeature(user?.userInfo.profile.permissions, '1802') && (
        <TabsContent value="ranking">
          <RotaryLeadsRanking />
        </TabsContent>
      )}

      {hasFeature(user?.userInfo.profile.permissions, '1803') && (
        <TabsContent value="nl">
          <RotaryLeadsNextInLine />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default withPermission(Page, ['1800']);
