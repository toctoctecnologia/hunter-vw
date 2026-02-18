import { ColumnDef } from '@tanstack/react-table';

import { CondominiumFeature } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/condominium-feature-table/cell-action';
import { condominiumFeatureTypeLabels } from '@/shared/lib/utils';

export const columns: ColumnDef<CondominiumFeature>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'type',
    header: 'TIPO',
    cell: ({ row }) => condominiumFeatureTypeLabels[row.original.type],
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
