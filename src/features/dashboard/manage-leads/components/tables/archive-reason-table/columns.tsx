import { ColumnDef } from '@tanstack/react-table';

import { ArchiveReason } from '@/shared/types';

import { CellAction } from '@/features/dashboard/manage-leads/components/tables/archive-reason-table/cell-action';

export const columns: ColumnDef<ArchiveReason>[] = [
  {
    accessorKey: 'uuid',
    header: 'UUID',
  },
  {
    accessorKey: 'reason',
    header: 'MOTIVO',
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
