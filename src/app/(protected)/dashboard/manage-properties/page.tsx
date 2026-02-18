'use client';
import { BadgeCheck } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { formatValue } from '@/shared/lib/utils';

import { getGeneralMetrics } from '@/features/dashboard/properties/api/property-manage';

import { SecondaryDistrictClient } from '@/features/dashboard/properties/components/tables/secondary-district-table/client';
import { PropertyFeatureClient } from '@/features/dashboard/properties/components/tables/property-feature-table/client';
import { ManageProperties } from '@/features/dashboard/properties/components/manage-properties';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { StatusCard } from '@/shared/components/StatusCard';
import { Loading } from '@/shared/components/loading';
import { withPermission } from '@/shared/hoc/with-permission';

function Page() {
  const [activeTab, setActiveTab] = useState('properties');

  const { data, isLoading } = useQuery({
    queryKey: ['property-general-metrics'],
    queryFn: () => getGeneralMetrics(),
  });

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <StatusCard
              title="Imóveis captados"
              description="Total de imóveis captados"
              icon={BadgeCheck}
              trend={
                data?.percentageOfCaptationProperties ? `+${String(data?.percentageOfCaptationProperties ?? 0)}%` : undefined
              }
              trendUp={data?.percentageOfCaptationProperties ? data.percentageOfCaptationProperties >= 0 : undefined}
              value={String(data?.captationPropertiesCount || 0)}
            />

            <StatusCard
              title="Imóveis ativos"
              description="Total de imóveis ativos"
              icon={BadgeCheck}
              trend={data?.percentageOfActiveProperties ? `+${String(data?.percentageOfActiveProperties ?? 0)}%` : undefined}
              trendUp={data?.percentageOfActiveProperties ? data.percentageOfActiveProperties >= 0 : undefined}
              value={String(data?.activePropertiesCount || 0)}
            />

            <StatusCard
              title="Volume captado"
              description="Total do volume captado"
              icon={BadgeCheck}
              trend={data?.volumnCaptationValuePercentage ? `+${String(data?.volumnCaptationValuePercentage ?? 0)}%` : undefined}
              trendUp={data?.volumnCaptationValuePercentage ? data.volumnCaptationValuePercentage >= 0 : undefined}
              value={data?.volumnCaptationValue ? formatValue(data.volumnCaptationValue) : formatValue(0)}
            />
          </>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 gap-1">
          <TabsTrigger value="properties">Imóveis</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="neighborhoods">Segundo Bairro</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <ManageProperties />
        </TabsContent>

        <TabsContent value="features">
          <PropertyFeatureClient />
        </TabsContent>

        <TabsContent value="neighborhoods">
          <SecondaryDistrictClient />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default withPermission(Page, ['2200']);
