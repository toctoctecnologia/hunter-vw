'use client';
import { useState } from 'react';

import { propertyStatusToLabel } from '@/shared/lib/utils';
import { PropertyStatus } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Properties } from '@/features/dashboard/properties/components/properties';
import { DropdownMenuSeparator } from '@/shared/components/ui/dropdown-menu';
import { Filter, FilterSearchInput } from '@/shared/components/filters';

export function ManageProperties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByStatus, setFilterByStatus] = useState<PropertyStatus | ''>('');

  return (
    <div className="space-y-4">
      <Filter>
        <FilterSearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          showFilterButton={false}
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

      <Properties searchTerm={searchTerm} manageProperty />
    </div>
  );
}
