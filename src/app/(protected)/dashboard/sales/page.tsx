'use client';
import { useState } from 'react';
import { useSearchParams } from '@/shims/next-navigation';
import { EllipsisVertical, ImportIcon, Plus } from 'lucide-react';

import { useAuth } from '@/shared/hooks/use-auth';

import { withPermission } from '@/shared/hoc/with-permission';
import { cn, getCalculatedGrid } from '@/shared/lib/utils';
import { hasFeature } from '@/shared/lib/permissions';

import { NegotiationFilters } from '@/shared/types';

import { LeadImportModal } from '@/features/dashboard/sales/components/modal/lead-import-modal';
import SaleFiltersSheet from '@/features/dashboard/sales/components/sheet/sale-filters-sheet';
import { SaveLeadModal } from '@/features/dashboard/sales/components/modal/save-lead-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { FloatingActionButton } from '@/shared/components/ui/floating-action-button';
import { KanbanBoard } from '@/features/dashboard/sales/components/kanban-board';
import { RotaryLead } from '@/features/dashboard/sales/components/rotary-lead';
import { FunnelCrm } from '@/features/dashboard/sales/components/funnel-crm';
import { ManageTab } from '@/features/dashboard/sales/components/manage-tab';
import { LeadList } from '@/features/dashboard/sales/components/lead-list';
import { Filter, FilterSearchInput } from '@/shared/components/filters';

function Page() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('currentTab') || 'leadList');
  const [isSaveLeadModalOpen, setIsSaveLeadModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filters, setFilters] = useState<NegotiationFilters | null>(null);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <SaveLeadModal open={isSaveLeadModalOpen} onClose={() => setIsSaveLeadModalOpen(false)} title="Criar Novo Lead" />

      <LeadImportModal open={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />

      <SaleFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

      <Filter>
        <FilterSearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFilter={() => setShowFiltersSheet(true)}
        />
      </Filter>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className={cn(
            'grid w-full grid-cols-5 rounded-xl p-1 gap-1',
            getCalculatedGrid(user, ['1201', '1202', '1203', '1204', '1205']),
          )}
        >
          {hasFeature(user?.userInfo.profile.permissions, '1201') && <TabsTrigger value="rotary-lead">Roletão</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1203') && <TabsTrigger value="leadList">Lista</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1202') && <TabsTrigger value="kanban">Kanban</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1204') && <TabsTrigger value="manage">Gestão</TabsTrigger>}
          {hasFeature(user?.userInfo.profile.permissions, '1205') && <TabsTrigger value="funnel">Funil</TabsTrigger>}
        </TabsList>

        {hasFeature(user?.userInfo.profile.permissions, '1201') && (
          <TabsContent value="rotary-lead">
            <RotaryLead />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1203') && (
          <TabsContent value="leadList">
            <LeadList filters={filters} searchTerm={searchTerm} />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1202') && (
          <TabsContent value="kanban">
            <KanbanBoard filters={filters} searchTerm={searchTerm} />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1204') && (
          <TabsContent value="manage">
            <ManageTab />
          </TabsContent>
        )}

        {hasFeature(user?.userInfo.profile.permissions, '1205') && (
          <TabsContent value="funnel">
            <FunnelCrm />
          </TabsContent>
        )}
      </Tabs>

      <FloatingActionButton>
        {hasFeature(user?.userInfo.profile.permissions, '1207') && (
          <FloatingActionButton.Item onClick={() => setIsSaveLeadModalOpen(true)} label="Novo Lead" icon={Plus} />
        )}
        <FloatingActionButton.Item onClick={() => setIsImportModalOpen(true)} label="Importar" icon={ImportIcon} />

        <FloatingActionButton.Trigger icon={EllipsisVertical} label="" />
      </FloatingActionButton>
    </>
  );
}

export default withPermission(Page, ['1200']);
