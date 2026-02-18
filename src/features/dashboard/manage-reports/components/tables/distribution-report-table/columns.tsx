import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { distributionReportStatusLabels } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { DistributionReportData } from '@/shared/types';

import { Badge } from '@/shared/components/ui/badge';

export const columns: ColumnDef<DistributionReportData>[] = [
  {
    accessorKey: 'leadName',
    header: 'NOME DO LEAD',
  },
  {
    accessorKey: 'leadPhone',
    header: 'TELEFONE DO LEAD',
    cell: ({ row }) => <span>{normalizePhoneNumber(row.original.leadPhone)}</span>,
  },
  {
    accessorKey: 'leadEmail',
    header: 'EMAIL DO LEAD',
  },
  {
    accessorKey: 'userName',
    header: 'CORRETOR RESPONSÁVEL',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      return <Badge>{distributionReportStatusLabels[row.original.status]}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CRIADO EM',
    cell: ({ row }) => <span>{format(row.original.createdAt, 'dd/MM/yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'offeredAt',
    header: 'OFERECIDO EM',
    cell: ({ row }) => <span>{format(row.original.offeredAt, 'dd/MM/yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'expiresAt',
    header: 'EXPIRA EM',
    cell: ({ row }) => <span>{format(row.original.expiresAt, 'dd/MM/yyyy HH:mm')}</span>,
  },
];
