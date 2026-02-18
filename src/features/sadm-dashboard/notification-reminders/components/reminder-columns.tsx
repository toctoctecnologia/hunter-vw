import { ColumnDef } from '@tanstack/react-table';

import { DAY_OF_WEEK_LABELS, FREQUENCY_LABELS, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';
import { NotificationReminderItem } from '@/shared/types';

import { ReminderCellAction } from '@/features/sadm-dashboard/notification-reminders/components/reminder-cell-action';
import { Badge } from '@/shared/components/ui/badge';

export function getReminderColumns(
  onDelete: (reminder: NotificationReminderItem) => void,
  onToggle: (reminder: NotificationReminderItem) => void,
): ColumnDef<NotificationReminderItem>[] {
  return [
    {
      accessorKey: 'userUuid',
      header: 'USUÁRIO',
      cell: ({ row }) => (
        <span className="truncate max-w-40" title={row.original.userUuid}>
          {row.original.userUuid.slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: 'notificationType',
      header: 'TIPO',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {NOTIFICATION_TYPE_LABELS[row.original.notificationType] ?? row.original.notificationType}
        </Badge>
      ),
    },
    {
      accessorKey: 'frequency',
      header: 'FREQUÊNCIA',
      cell: ({ row }) => FREQUENCY_LABELS[row.original.frequency] ?? row.original.frequency,
    },
    {
      accessorKey: 'dayOfWeek',
      header: 'DIA DA SEMANA',
      cell: ({ row }) =>
        row.original.dayOfWeek ? (DAY_OF_WEEK_LABELS[row.original.dayOfWeek] ?? row.original.dayOfWeek) : '-',
    },
    {
      accessorKey: 'dayOfMonth',
      header: 'DIA DO MÊS',
      cell: ({ row }) => row.original.dayOfMonth ?? '-',
    },
    {
      accessorKey: 'reminderTime',
      header: 'HORÁRIO',
      cell: ({ row }) => row.original.reminderTime?.slice(0, 5) ?? '-',
    },
    {
      accessorKey: 'template',
      header: 'TEMPLATE',
      cell: ({ row }) => row.original.template?.name ?? 'Padrão do sistema',
    },
    {
      accessorKey: 'isEnabled',
      header: 'STATUS',
      cell: ({ row }) => (
        <Badge variant={row.original.isEnabled ? 'default' : 'outline'}>
          {row.original.isEnabled ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'AÇÕES',
      cell: ({ row }) => <ReminderCellAction reminder={row.original} onDelete={onDelete} onToggle={onToggle} />,
    },
  ];
}
