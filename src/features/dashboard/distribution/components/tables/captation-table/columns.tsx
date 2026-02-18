import { ColumnDef } from '@tanstack/react-table';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import { captationStatusLabels, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { CaptationItem } from '@/shared/types';

export const columns: ColumnDef<CaptationItem>[] = [
  {
    accessorKey: 'offeredAt',
    header: 'DATA OFERTA',
    cell: ({ row }) => {
      try {
        const offeredAt = new Date(row.original.offeredAt);
        return <span>{format(offeredAt, 'dd/MM/yyyy', { locale: ptBR })}</span>;
      } catch {
        return 'N/A';
      }
    },
  },
  {
    accessorKey: 'leadName',
    header: 'NOME DO LEAD',
  },
  {
    accessorKey: 'leadEmail',
    header: 'EMAIL DO LEAD',
  },
  {
    accessorKey: 'phone',
    header: 'TELEFONE',
    cell: ({ row }) => normalizePhoneNumber(row.original.phone),
  },
  {
    accessorKey: 'origin',
    header: 'ORIGEM',
    cell: ({ row }) => LeadOriginTypeToLabel[row.original.origin as keyof typeof LeadOriginTypeToLabel],
  },
  {
    accessorKey: 'catcherName',
    header: 'CAPTADOR',
  },
  {
    accessorKey: 'queueName',
    header: 'FILA',
  },
  {
    accessorKey: 'teamName',
    header: 'TIME',
  },
  {
    accessorKey: 'productTitle',
    header: 'PRODUTO',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => captationStatusLabels[row.original.status as keyof typeof captationStatusLabels],
  },
];
