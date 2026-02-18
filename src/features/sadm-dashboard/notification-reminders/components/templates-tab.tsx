'use client';

import { useCallback, useMemo, useState } from 'react';
import { PaginationState } from '@tanstack/react-table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { NotificationTemplateItem, NotificationType } from '@/shared/types';
import { NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';

import { TemplateRemindersModal } from '@/features/sadm-dashboard/notification-reminders/components/modal/template-reminders-modal';
import { TemplateFormModal } from '@/features/sadm-dashboard/notification-reminders/components/template-form-modal';
import { getTemplateColumns } from '@/features/sadm-dashboard/notification-reminders/components/template-columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { deleteTemplate, getTemplates } from '@/features/sadm-dashboard/notification-reminders/api/templates';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { DataTable } from '@/shared/components/ui/data-table';
import { Button } from '@/shared/components/ui/button';

export function TemplatesTab() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
  const [typeFilter, setTypeFilter] = useState<NotificationType | undefined>(undefined);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateItem | null>(null);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<NotificationTemplateItem | null>(null);

  const [remindersModalTemplate, setRemindersModalTemplate] = useState<NotificationTemplateItem | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ['notification-templates', typeFilter],
    queryFn: () => getTemplates(typeFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteTemplate(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast.success('Template excluído com sucesso');
      setDeleteAlertOpen(false);
      setTemplateToDelete(null);
    },
  });

  const handleEdit = useCallback((template: NotificationTemplateItem) => {
    setEditingTemplate(template);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((template: NotificationTemplateItem) => {
    setTemplateToDelete(template);
    setDeleteAlertOpen(true);
  }, []);

  const handleViewReminders = useCallback((template: NotificationTemplateItem) => {
    setRemindersModalTemplate(template);
  }, []);

  function handleCloseForm() {
    setFormOpen(false);
    setEditingTemplate(null);
  }

  const columns = useMemo(
    () => getTemplateColumns(handleEdit, handleDelete, handleViewReminders),
    [handleEdit, handleDelete, handleViewReminders],
  );

  return (
    <>
      <TemplateFormModal open={formOpen} onClose={handleCloseForm} editingTemplate={editingTemplate} />

      <AlertModal
        isOpen={deleteAlertOpen}
        onClose={() => {
          setDeleteAlertOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={() => {
          if (templateToDelete) deleteMutation.mutate(templateToDelete.uuid);
        }}
        loading={deleteMutation.isPending}
        title="Excluir template"
        description={`Tem certeza que deseja excluir o template "${templateToDelete?.name}"? Essa ação não poderá ser desfeita.`}
      />

      {remindersModalTemplate && (
        <TemplateRemindersModal
          open={!!remindersModalTemplate}
          onClose={() => setRemindersModalTemplate(null)}
          template={remindersModalTemplate}
        />
      )}

      <div className="flex flex-col gap-4">
        <div className="flex md:flex-row gap-4 flex-col md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Select
              value={typeFilter ?? 'ALL'}
              onValueChange={(v) => {
                setTypeFilter(v === 'ALL' ? undefined : (v as NotificationType));
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                {Object.values(NotificationType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {NOTIFICATION_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4 mr-2" />
            Novo Template
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Carregando templates...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            pageCount={data.length ?? 0}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
      </div>
    </>
  );
}
