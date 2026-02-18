import { ColumnDef } from '@tanstack/react-table';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { RedistributionItem } from '@/shared/types';

import { Checkbox } from '@/shared/components/ui/checkbox';

export const columns: ColumnDef<RedistributionItem>[] = [
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
  { accessorKey: 'name', header: 'LEAD' },
  { accessorKey: 'email', header: 'EMAIL' },
  { accessorKey: 'phone1', header: 'TELEFONE 1' },
  { accessorKey: 'origin', header: 'ORIGEM', cell: ({ row }) => LeadOriginTypeToLabel(row.original.originType) },
  { accessorKey: 'catcher', header: 'CORRETOR', cell: ({ row }) => row?.original?.catcher?.name || 'N/A' },
  {
    accessorKey: 'offeredAt',
    header: 'ARQUIVADO EM',
    cell: ({ row }) => {
      try {
        const offeredAt = new Date(row.original.archivedAt);
        return <span>{format(offeredAt, 'dd/MM/yyyy', { locale: ptBR })}</span>;
      } catch {
        return 'N/A';
      }
    },
  },
];
