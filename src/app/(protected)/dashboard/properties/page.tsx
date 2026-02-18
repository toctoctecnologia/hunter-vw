'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { withPermission } from '@/shared/hoc/with-permission';

import { PropertyFilters, PropertyStatus } from '@/shared/types';
import { cn, getCalculatedGrid, propertyStatusToLabel } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import PropertyFiltersSheet from '@/features/dashboard/properties/components/sheet/property-filters-sheet';
import { ManagerProperty } from '@/features/dashboard/properties/components/properties/manage';
import { PropertyForm } from '@/features/dashboard/properties/components/form/property-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Properties } from '@/features/dashboard/properties/components/properties';
import { DropdownMenuSeparator } from '@/shared/components/ui/dropdown-menu';
import { Filter, FilterSearchInput } from '@/shared/components/filters';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('currentTab') || 'properties');
  const [filterByStatus, setFilterByStatus] = useState<PropertyStatus | ''>('');
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <PropertyFiltersSheet open={showFiltersSheet} onClose={() => setShowFiltersSheet(false)} onApplyFilters={setFilters} />

      <div className="space-y-4">
        <Filter>
          <FilterSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFilter={() => setShowFiltersSheet(true)}
          />

          <Select
            value={filterByStatus}
            onValueChange={(value) => setFilterByStatus(value === 'undefined' ? '' : (value as PropertyStatus))}
          >
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Imóveis apenas no status" />
            </SelectTrigger>

            <SelectContent>
              {Object.values(PropertyStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {propertyStatusToLabel(status)}
                </SelectItem>
              ))}
              <DropdownMenuSeparator className="bg-zinc-700" />
              <SelectItem value="undefined">Limpar seleção</SelectItem>
            </SelectContent>
          </Select>
        </Filter>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={cn('grid w-full rounded-xl p-1 mb-4', getCalculatedGrid(user, ['2501'], 2))}>
            {hasFeature(user?.userInfo.profile.permissions, '2501') && <TabsTrigger value="new">Novo Imóvel</TabsTrigger>}
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="manage">Gestão</TabsTrigger>
          </TabsList>

          {hasFeature(user?.userInfo.profile.permissions, '2501') && (
            <TabsContent value="new">
              <PropertyForm />
            </TabsContent>
          )}

          <TabsContent value="properties">
            <Properties searchTerm={searchTerm} filterByStatus={filterByStatus} filters={filters} />
          </TabsContent>

          <TabsContent value="manage">
            <ManagerProperty searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default withPermission(Page, ['2500']);
