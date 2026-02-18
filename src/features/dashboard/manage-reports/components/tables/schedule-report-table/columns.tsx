import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { ScheduleReportData } from '@/shared/types';

export const columns: ColumnDef<ScheduleReportData>[] = [
  {
    accessorKey: 'title',
    header: 'TÍTULO',
  },
  {
    accessorKey: 'date',
    header: 'DATA',
    cell: ({ row }) => <span>{format(row.original.date, 'dd/MM/yyyy HH:mm')}</span>,
  },
  {
    accessorKey: 'clientName',
    header: 'CLIENTE',
  },
  {
    accessorKey: 'isCompleted',
    header: 'CONCLUÍDA',
    cell: ({ row }) => <span>{row.original.isCompleted ? 'Concluída' : 'N/A'}</span>,
  },
];
