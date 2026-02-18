'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getPropertyById } from '@/features/dashboard/properties/api/properties';

import { CondominiumDetail } from '@/features/dashboard/properties/components/condominium-detail';
import { PropertyDetail } from '@/features/dashboard/properties/components/property-detail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BackHeader } from '@/features/dashboard/components/back-header';
import { NoContentCard } from '@/shared/components/no-content-card';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

export default function Page() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [activeTab, setActiveTab] = useState('detail');
  const currentTitle = activeTab === 'detail' ? 'Detalhes do Imóvel' : 'Detalhes do Condomínio';

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['property', uuid],
    queryFn: () => getPropertyById(uuid),
    enabled: !!uuid,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar propriedade" />;
  if (!property) return <NoContentCard title="Propriedade não encontrada" />;

  return (
    <div className="space-y-4">
      <BackHeader title={currentTitle} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 gap-1">
          <TabsTrigger value="detail">Imóvel</TabsTrigger>
          <TabsTrigger value="condominium">Condomínio</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <PropertyDetail uuid={uuid} property={property} />
        </TabsContent>

        <TabsContent value="condominium">
          <CondominiumDetail uuid={property.featureSummary.condominium?.uuid} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
