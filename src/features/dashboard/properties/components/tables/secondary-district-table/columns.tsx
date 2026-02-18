import { ColumnDef } from '@tanstack/react-table';

import { PropertySecondaryDistrict } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/secondary-district-table/cell-action';

export const columns: ColumnDef<PropertySecondaryDistrict>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
