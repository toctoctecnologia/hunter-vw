import { ColumnDef } from '@tanstack/react-table';

import { funnelStageLabels, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { LeadDetail } from '@/shared/types';

import { CellAction } from '@/features/dashboard/manage-leads/components/tables/leads-table/cell-action';
import { Checkbox } from '@/shared/components/ui/checkbox';

export const columns: ColumnDef<LeadDetail>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'phone1',
    header: 'TELEFONE',
    cell: ({ row }) => <span>{normalizePhoneNumber(row.original.phone1)}</span>,
  },
  {
    accessorKey: 'originType',
    header: 'ORIGEM',
    cell: ({ row }) => <span>{LeadOriginTypeToLabel(row.original.originType)}</span>,
  },
  {
    accessorKey: 'funnelStep',
    header: 'STATUS',
    cell: ({ row }) => <span>{funnelStageLabels[row.original.funnelStep]}</span>,
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
