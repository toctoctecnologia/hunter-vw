import { ColumnDef } from '@tanstack/react-table';

import { CondominiumDetail } from '@/shared/types';

import { CellAction } from '@/features/dashboard/properties/components/tables/condominiums-table/cell-action';
import { formatValue } from '@/shared/lib/utils';

export const columns: ColumnDef<CondominiumDetail>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'builder',
    header: 'CONSTRUTORA',
    cell: ({ row }) => row.original?.builder?.name || '-',
  },
  {
    accessorKey: 'price',
    header: 'Valor',
    cell: ({ row }) => formatValue(row.original.price),
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
