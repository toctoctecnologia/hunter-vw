'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

import { withPermission } from '@/shared/hoc/with-permission';

import { useIsMobile } from '@/shared/hooks/use-mobile';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { DistributionReport } from '@/features/dashboard/manage-reports/components/distribution-report';
import { PropertiesReport } from '@/features/dashboard/manage-reports/components/properties-report';
import { SchedulesReport } from '@/features/dashboard/manage-reports/components/schedules-report';
import { LeadsReport } from '@/features/dashboard/manage-reports/components/leads-report';
import { UsersReport } from '@/features/dashboard/manage-reports/components/users-report';
import { FloatingActionButton } from '@/shared/components/ui/floating-action-button';

function Page() {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('leads-report');

  return (
    <div className="space-y-4 pb-6">
      {isMobile ? (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um relatório" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leads-report">Leads</SelectItem>
            <SelectItem value="properties-report">Imóveis</SelectItem>
            <SelectItem value="users-report">Corretores</SelectItem>
            <SelectItem value="schedules-report">Agenda</SelectItem>
            <SelectItem value="distribution-report">Distribuição</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl p-1">
            <TabsTrigger value="leads-report">Leads</TabsTrigger>
            <TabsTrigger value="properties-report">Imóveis</TabsTrigger>
            <TabsTrigger value="users-report">Corretores</TabsTrigger>
            <TabsTrigger value="schedules-report">Agenda</TabsTrigger>
            <TabsTrigger value="distribution-report">Distribuição</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="leads-report">
          <LeadsReport />
        </TabsContent>

        <TabsContent value="properties-report">
          <PropertiesReport />
        </TabsContent>

        <TabsContent value="users-report">
          <UsersReport />
        </TabsContent>

        <TabsContent value="schedules-report">
          <SchedulesReport />
        </TabsContent>

        <TabsContent value="distribution-report">
          <DistributionReport />
        </TabsContent>
      </Tabs>

      <FloatingActionButton>
        <FloatingActionButton.Trigger
          onClick={() => router.push('/dashboard/manage-reports/files')}
          label="Visualizar arquivos exportados"
          icon={ArrowRight}
        />
      </FloatingActionButton>
    </div>
  );
}

export default withPermission(Page, ['2100']);
