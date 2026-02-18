import { ColumnDef } from '@tanstack/react-table';

import { propertyFeatureTypeLabels } from '@/shared/lib/utils';
import { PropertyFeature } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/property-feature-table/cell-action';

export const columns: ColumnDef<PropertyFeature>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'type',
    header: 'TIPO',
    cell: ({ row }) => propertyFeatureTypeLabels[row.original.type],
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'description',
    header: 'DESCRIÇÃO',
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
