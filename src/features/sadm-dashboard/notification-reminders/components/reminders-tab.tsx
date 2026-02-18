'use client';

import { useCallback, useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Ban, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { NotificationReminderItem } from '@/shared/types';

import {
  deleteReminder,
  getReminders,
  toggleReminders,
  deactivateAllReminders,
  deleteAllReminders,
} from '@/features/sadm-dashboard/notification-reminders/api/reminders';

import { getReminderColumns } from '@/features/sadm-dashboard/notification-reminders/components/reminder-columns';
import { ReminderBatchFormModal } from '@/features/sadm-dashboard/notification-reminders/components/modal/reminder-batch-form-modal';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { DataTable } from '@/shared/components/ui/data-table';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export function RemindersTab() {
  const queryClient = useQueryClient();

  const [reminderToDelete, setReminderToDelete] = useState<NotificationReminderItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [bulkDeactivateAlertOpen, setBulkDeactivateAlertOpen] = useState(false);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [batchFormOpen, setBatchFormOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['notification-reminders', pagination],
    queryFn: () => getReminders(pagination),
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteReminder(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-reminders'] });
      toast.success('Lembrete excluído com sucesso');
      setDeleteAlertOpen(false);
      setReminderToDelete(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ isEnabled, uuids }: { isEnabled: boolean; uuids: string[] }) => toggleReminders(isEnabled, uuids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-reminders'] });
      toast.success('Status do lembrete atualizado');
    },
  });

  const deactivateAllMutation = useMutation({
    mutationFn: () => deactivateAllReminders(),
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['notification-reminders'] });
      toast.success(`${count} lembrete(s) desativado(s)`);
      setBulkDeactivateAlertOpen(false);
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => deleteAllReminders(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-reminders'] });
      toast.success('Todos os lembretes foram excluídos');
      setBulkDeleteAlertOpen(false);
    },
  });

  const handleDelete = useCallback((reminder: NotificationReminderItem) => {
    setReminderToDelete(reminder);
    setDeleteAlertOpen(true);
  }, []);

  const handleToggle = useCallback(
    (reminder: NotificationReminderItem) => {
      toggleMutation.mutate({ isEnabled: !reminder.isEnabled, uuids: [reminder.uuid] });
    },
    [toggleMutation],
  );

  const columns = useMemo(() => getReminderColumns(handleDelete, handleToggle), [handleDelete, handleToggle]);

  const tableData = data?.content ?? [];

  return (
    <>
      <AlertModal
        isOpen={deleteAlertOpen}
        onClose={() => {
          setDeleteAlertOpen(false);
          setReminderToDelete(null);
        }}
        onConfirm={() => {
          if (reminderToDelete) deleteMutation.mutate(reminderToDelete.uuid);
        }}
        loading={deleteMutation.isPending}
        title="Excluir lembrete"
        description="Tem certeza que deseja excluir este lembrete? Essa ação não poderá ser desfeita."
      />

      <AlertModal
        isOpen={bulkDeactivateAlertOpen}
        onClose={() => setBulkDeactivateAlertOpen(false)}
        onConfirm={() => deactivateAllMutation.mutate()}
        loading={deactivateAllMutation.isPending}
        isDestructive={false}
        title="Desativar todos os lembretes"
        description="Tem certeza que deseja desativar todos os lembretes de todos os usuários?"
      />

      <AlertModal
        isOpen={bulkDeleteAlertOpen}
        onClose={() => setBulkDeleteAlertOpen(false)}
        onConfirm={() => deleteAllMutation.mutate()}
        loading={deleteAllMutation.isPending}
        title="Excluir todos os lembretes"
        description="Tem certeza que deseja excluir TODOS os lembretes? Essa ação não poderá ser desfeita."
      />

      <div className="flex flex-col gap-4">
        <div className="flex-col md:flex-row flex md:items-center md:justify-end gap-4">
          <div className="flex-col md:flex-row flex md:items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Ações em massa</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setBulkDeactivateAlertOpen(true)}>
                  <Ban className="size-4 mr-2" />
                  Desativar todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBulkDeleteAlertOpen(true)} className="text-destructive">
                  <Trash2 className="size-4 mr-2" />
                  Excluir todos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setBatchFormOpen(true)}>
              <Plus className="size-4 mr-2" />
              Novo Lembrete
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando lembretes...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}

        <ReminderBatchFormModal open={batchFormOpen} onClose={() => setBatchFormOpen(false)} />
      </div>
    </>
  );
}
