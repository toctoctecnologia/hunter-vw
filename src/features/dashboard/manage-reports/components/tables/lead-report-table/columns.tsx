import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { formatValue, funnelStageLabels, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { LeadsReportData } from '@/shared/types';

export const columns: ColumnDef<LeadsReportData>[] = [
  {
    accessorKey: 'name',
    header: 'NOME',
  },
  {
    accessorKey: 'phone1',
    header: 'TELEFONE 1',
    cell: ({ row }) => <span>{normalizePhoneNumber(row.original.phone1)}</span>,
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    accessorKey: 'originType',
    header: 'ORIGEM',
    cell: ({ row }) => <span>{LeadOriginTypeToLabel(row.original.originType)}</span>,
  },
  {
    accessorKey: 'catcherName',
    header: 'CORRETOR RESPONSÁVEL',
  },
  {
    accessorKey: 'teamName',
    header: 'TIME RESPONSÁVEL',
  },
  {
    accessorKey: 'funnelStep',
    header: 'ETAPA DO FUNIL',
    cell: ({ row }) => <span>{funnelStageLabels[row.original.funnelStep]}</span>,
  },
  {
    accessorKey: 'productPrice',
    header: 'VALOR DO IMÓVEL',
    cell: ({ row }) => <span>{row.original.productPrice ? formatValue(row.original.productPrice) : 'N/A'}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'CRIADO EM',
    cell: ({ row }) => <span>{format(row.original.createdAt, 'dd/MM/yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'updatedAt',
    header: 'ATUALIZADO EM',
    cell: ({ row }) => <span>{format(row.original.updatedAt, 'dd/MM/yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'lastContactedAt',
    header: 'ULTIMO CONTATO EM',
    cell: ({ row }) => (
      <span>{row.original.lastContactedAt ? format(row.original.lastContactedAt, 'dd/MM/yyyy HH:mm') : 'N/A'}</span>
    ),
  },
];
