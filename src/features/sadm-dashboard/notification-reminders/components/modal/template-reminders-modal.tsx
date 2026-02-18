import { PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Bell, Calendar, Clock, User } from 'lucide-react';

import { DAY_OF_WEEK_LABELS, FREQUENCY_LABELS, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';
import { NotificationTemplateItem, NotificationReminderItem } from '@/shared/types';

import { getRemindersForTemplate } from '@/features/sadm-dashboard/notification-reminders/api/templates';

import { Modal } from '@/shared/components/ui/modal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

function ReminderCard({ reminder }: { reminder: NotificationReminderItem }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-3.5" />
            <span className="truncate max-w-48" title={reminder.userUuid}>
              {reminder.userUuid.slice(0, 8)}...
            </span>
          </div>
          <Badge variant={reminder.isEnabled ? 'default' : 'outline'}>{reminder.isEnabled ? 'Ativo' : 'Inativo'}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            <Bell className="mr-1 size-3" />
            {NOTIFICATION_TYPE_LABELS[reminder.notificationType] ?? reminder.notificationType}
          </Badge>

          <Badge variant="outline">
            <Calendar className="mr-1 size-3" />
            {FREQUENCY_LABELS[reminder.frequency] ?? reminder.frequency}
          </Badge>

          {reminder.dayOfWeek && (
            <Badge variant="outline">{DAY_OF_WEEK_LABELS[reminder.dayOfWeek] ?? reminder.dayOfWeek}</Badge>
          )}

          {reminder.reminderTime && (
            <Badge variant="outline">
              <Clock className="mr-1 size-3" />
              {reminder.reminderTime.slice(0, 5)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface TemplateRemindersModalProps {
  open: boolean;
  onClose: () => void;
  template: NotificationTemplateItem;
}

export function TemplateRemindersModal({ open, onClose, template }: TemplateRemindersModalProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['template-reminders', template.uuid, pagination],
    queryFn: () => getRemindersForTemplate(pagination, template.uuid),
    enabled: open,
  });

  const totalPages = data?.totalPages ?? 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Lembretes do Template: ${template.name}`}
      description="Lista de lembretes associados a este template."
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Carregando lembretes...</p>
          </div>
        ) : !data?.content?.length ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Nenhum lembrete associado a este template.</p>
          </div>
        ) : (
          <>
            <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
              {data.content.map((reminder) => (
                <ReminderCard key={reminder.userUuid + reminder.notificationType} reminder={reminder} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">
                  Página {pagination.pageIndex + 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.pageIndex === 0}
                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.pageIndex + 1 >= totalPages}
                    onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
