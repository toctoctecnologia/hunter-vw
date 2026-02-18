'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Users } from 'lucide-react';

import { DAY_OF_WEEK_LABELS, FREQUENCY_LABELS, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';
import { DayOfWeek, NotificationFrequency, NotificationType } from '@/shared/types';

import { batchReminders } from '@/features/sadm-dashboard/notification-reminders/api/reminders';
import { getTemplates } from '@/features/sadm-dashboard/notification-reminders/api/templates';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  reminderBatchSchema,
  ReminderBatchFormData,
} from '@/features/sadm-dashboard/notification-reminders/components/form/reminder-batch-schema';
import { removeNonNumeric } from '@/shared/lib/masks';

interface ReminderBatchFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReminderBatchFormModal({ open, onClose }: ReminderBatchFormModalProps) {
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<SelectedItem[]>([]);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const form = useForm<ReminderBatchFormData>({
    resolver: zodResolver(reminderBatchSchema),
    defaultValues: {
      userUuid: '',
      notificationType: NotificationType.REMINDER,
      frequency: NotificationFrequency.DAILY,
      dayOfWeek: null,
      dayOfMonth: null,
      reminderTime: '',
      isEnabled: true,
      templateUuid: undefined,
    },
  });

  const frequency = form.watch('frequency');

  const { data: templatesData } = useQuery({
    queryKey: ['notification-templates-select'],
    queryFn: () => getTemplates(),
    enabled: open,
  });

  const batchMutation = useMutation({
    mutationFn: (data: ReminderBatchFormData[]) => batchReminders(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['notification-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['template-reminders'] });

      if (response.failureCount > 0) {
        toast.warning(`${response.successCount} lembrete(s) criado(s), ${response.failureCount} erro(s).`);
      } else {
        toast.success(`${response.successCount} lembrete(s) criado(s) com sucesso!`);
      }
      handleClose();
    },
  });

  function handleClose() {
    form.reset();
    setSelectedUsers([]);
    onClose();
  }

  function handleUsersConfirm(users: SelectedItem[]) {
    setSelectedUsers(users);
    setUserModalOpen(false);

    if (users.length === 1) {
      form.setValue('userUuid', users[0].uuid);
    }
  }

  function onSubmit(data: ReminderBatchFormData) {
    if (selectedUsers.length === 0) {
      toast.error('Selecione ao menos um usuário');
      return;
    }

    const timeValue = data.reminderTime.length === 5 ? `${data.reminderTime}:00` : data.reminderTime;

    const assignments: ReminderBatchFormData[] = selectedUsers.map((user) => ({
      ...data,
      userUuid: user.uuid,
      reminderTime: timeValue,
      templateUuid: data.templateUuid || undefined,
      dayOfWeek: data.frequency === NotificationFrequency.WEEKLY ? data.dayOfWeek : null,
      dayOfMonth: data.frequency === NotificationFrequency.MONTHLY ? data.dayOfMonth : null,
    }));

    batchMutation.mutate(assignments);
  }

  return (
    <>
      <CatcherListModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onConfirm={handleUsersConfirm}
        initialSelected={selectedUsers}
      />

      <Modal
        open={open}
        onClose={handleClose}
        title="Novo Lembrete em Lote"
        description="Crie lembretes para um ou mais usuários de uma vez."
        className="max-w-lg"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))} className="flex flex-col gap-4">
            <div className="space-y-2">
              <FormLabel>Usuários</FormLabel>
              <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setUserModalOpen(true)}>
                <Users className="size-4 mr-2" />
                {selectedUsers.length === 0 ? 'Selecionar usuários' : `${selectedUsers.length} usuário(s) selecionado(s)`}
              </Button>
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedUsers.slice(0, 5).map((user) => (
                    <Badge key={user.uuid} variant="secondary" className="text-xs">
                      {user.name}
                    </Badge>
                  ))}
                  {selectedUsers.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedUsers.length - 5} mais
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="notificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Notificação</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(NotificationType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {NOTIFICATION_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(NotificationFrequency).map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {FREQUENCY_LABELS[freq]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {frequency === NotificationFrequency.WEEKLY && (
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia da Semana</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o dia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(DayOfWeek).map((day) => (
                          <SelectItem key={day} value={day}>
                            {DAY_OF_WEEK_LABELS[day]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {frequency === NotificationFrequency.MONTHLY && (
              <FormField
                control={form.control}
                name="dayOfMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia do Mês</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1-31"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="reminderTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input type="time" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="templateUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template (opcional)</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v === 'NONE' ? undefined : v)} value={field.value ?? 'NONE'}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Mensagem padrão do sistema" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">Mensagem padrão do sistema</SelectItem>
                      {templatesData?.map((template) => (
                        <SelectItem key={template.uuid} value={template.uuid}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="text-sm font-medium">Ativo</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={batchMutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={batchMutation.isPending}>
                Criar Lembretes
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
}
