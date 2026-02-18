import { ColumnDef } from '@tanstack/react-table';

import { normalizePhoneNumber } from '@/shared/lib/masks';
import { CatcherReportData } from '@/shared/types';

export const columns: ColumnDef<CatcherReportData>[] = [
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    accessorKey: 'phone',
    header: 'TELEFONE',
    cell: ({ row }) => <span>{normalizePhoneNumber(row.original.phone)}</span>,
  },
  {
    accessorKey: 'isActive',
    header: 'ATIVO',
    cell: ({ row }) => <span>{row.original.isActive ? 'Sim' : 'Não'}</span>,
  },
];
