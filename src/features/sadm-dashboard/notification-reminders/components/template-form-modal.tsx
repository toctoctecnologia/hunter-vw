'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { NotificationType } from '@/shared/types';

import { newTemplate, updateTemplate } from '@/features/sadm-dashboard/notification-reminders/api/templates';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import {
  templateSchema,
  TemplateFormData,
} from '@/features/sadm-dashboard/notification-reminders/components/form/template-schema';
import { NOTIFICATION_TYPE_LABELS } from '@/shared/lib/utils';

interface TemplateFormModalProps {
  open: boolean;
  onClose: () => void;
  editingTemplate?: {
    uuid: string;
    name: string;
    messageText: string;
    notificationType: NotificationType;
    isActive: boolean;
  } | null;
}

export function TemplateFormModal({ open, onClose, editingTemplate }: TemplateFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editingTemplate;

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      messageText: '',
      notificationType: NotificationType.REMINDER,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TemplateFormData) => newTemplate(data.name, data.messageText, data.notificationType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast.success('Template criado com sucesso');
      handleClose();
    },
    onError: () => {
      toast.error('Erro ao criar template');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TemplateFormData) =>
      updateTemplate(editingTemplate!.uuid, data.name, data.messageText, editingTemplate!.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast.success('Template atualizado com sucesso');
      handleClose();
    },
    onError: () => {
      toast.error('Erro ao atualizar template');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleClose() {
    form.reset();
    onClose();
  }

  function onSubmit(data: TemplateFormData) {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  useEffect(() => {
    if (editingTemplate) {
      form.reset({
        name: editingTemplate.name,
        messageText: editingTemplate.messageText,
        notificationType: editingTemplate.notificationType,
        isActive: editingTemplate.isActive,
      });
    }
  }, [editingTemplate, form]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar Template' : 'Novo Template'}
      description={
        isEditing ? 'Edite as informações do template de notificação.' : 'Crie um novo template de notificação.'
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do template" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notificationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
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
            name="messageText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <Textarea placeholder="Texto da mensagem do template..." rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isPending}>
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
