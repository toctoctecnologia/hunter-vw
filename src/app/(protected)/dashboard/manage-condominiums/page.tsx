'use client';
import { useState } from 'react';

import { CondominiumFeatureClient } from '@/features/dashboard/properties/components/tables/condominium-feature-table/client';
import { CondominiumsClient } from '@/features/dashboard/properties/components/tables/condominiums-table/client';
import { BuilderClient } from '@/features/dashboard/properties/components/tables/builder-table/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { withPermission } from '@/shared/hoc/with-permission';

function Page() {
  const [activeTab, setActiveTab] = useState('condominiums');

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 gap-1">
          <TabsTrigger value="condominiums">Condomínios</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="builders">Construtoras</TabsTrigger>
        </TabsList>

        <TabsContent value="condominiums">
          <CondominiumsClient />
        </TabsContent>

        <TabsContent value="features">
          <CondominiumFeatureClient />
        </TabsContent>

        <TabsContent value="builders">
          <BuilderClient />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default withPermission(Page, ['2300']);
