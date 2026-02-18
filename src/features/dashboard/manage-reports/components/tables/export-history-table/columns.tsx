import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { ExportHistoryData } from '@/shared/types';

import { CellAction } from '@/features/dashboard/manage-reports/components/tables/export-history-table/cell-action';

export const columns: ColumnDef<ExportHistoryData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'reportType',
    header: 'TIPO DE RELATÓRIO',
    cell: ({ row }) => {
      const availableTypes: Record<string, string> = {
        PROPERTIES: 'Propriedades',
        LEADS: 'Leads',
        CATCHERS: 'Usuários',
        APPOINTMENTS: 'Tarefas',
      };
      const { reportType } = row.original;
      return <span>{availableTypes[reportType] || reportType}</span>;
    },
  },
  {
    accessorKey: 'format',
    header: 'FORMATO',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const availableStatuses: Record<string, string> = { PENDING: 'Pendente', COMPLETED: 'Concluído' };
      const { status } = row.original;
      return <span>{availableStatuses[status] || status}</span>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'CRIADO EM',
    cell: ({ row }) => <span>{format(row.original.createdAt, 'dd/MM/yyyy HH:mm:ss')}</span>,
  },
  {
    accessorKey: 'processedAt',
    header: 'PROCESSADO EM',
    cell: ({ row }) => (
      <span>{row.original.processedAt ? format(row.original.processedAt, 'dd/MM/yyyy HH:mm:ss') : 'N/A'}</span>
    ),
  },
  {
    id: 'actions',
    header: 'AÇÕES',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
