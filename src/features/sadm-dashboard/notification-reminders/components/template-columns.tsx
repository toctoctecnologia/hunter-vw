import { ColumnDef } from '@tanstack/react-table';

import { NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';
import { NotificationTemplateItem } from '@/shared/types';

import { TemplateCellAction } from '@/features/sadm-dashboard/notification-reminders/components/template-cell-action';
import { Badge } from '@/shared/components/ui/badge';

export function getTemplateColumns(
  onEdit: (template: NotificationTemplateItem) => void,
  onDelete: (template: NotificationTemplateItem) => void,
  onViewReminders: (template: NotificationTemplateItem) => void,
): ColumnDef<NotificationTemplateItem>[] {
  return [
    {
      accessorKey: 'name',
      header: 'NOME',
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
      accessorKey: 'messageText',
      header: 'MENSAGEM',
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-xs" title={row.original.messageText}>
          {row.original.messageText}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'STATUS',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'outline'}>
          {row.original.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'CRIADO EM',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      id: 'actions',
      header: 'AÇÕES',
      cell: ({ row }) => (
        <TemplateCellAction
          template={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewReminders={onViewReminders}
        />
      ),
    },
  ];
}
