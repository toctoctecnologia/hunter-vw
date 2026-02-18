import { ColumnDef } from '@tanstack/react-table';

import { PropertyBuilder } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/builder-table/cell-action';

export const columns: ColumnDef<PropertyBuilder>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'yearsOfExperience',
    header: 'ANOS DE EXPERIÊNCIA',
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
