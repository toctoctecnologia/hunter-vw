'use client';

import { useEffect } from 'react';
import { House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

import { newArchiveReason, updateArchiveReason } from '@/features/dashboard/manage-leads/api/archive-reason';

import { ArchiveReason, ModalProps } from '@/shared/types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';

const archiveReasonSchema = z.object({
  reason: z.string().min(2, 'O motivo é obrigatório'),
});

interface SaveArchiveReasonModalProps extends Omit<ModalProps, 'title' | 'description'> {
  archiveReason?: ArchiveReason | null;
}

export function SaveArchiveReasonModal({ archiveReason, onClose, ...props }: SaveArchiveReasonModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<ArchiveReason, 'uuid'>) => newArchiveReason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveReasons'] });
      toast.success('Motivo de arquivamento criado com sucesso!');
      form.reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Omit<ArchiveReason, 'uuid'> }) =>
      updateArchiveReason({ ...data, uuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archiveReasons'] });
      toast.success('Motivo de arquivamento atualizado com sucesso!');
      form.reset();
      onClose();
    },
  });

  const form = useForm<Omit<ArchiveReason, 'uuid'>>({
    resolver: zodResolver(archiveReasonSchema),
    defaultValues: {
      reason: archiveReason?.reason || '',
    },
  });

  useEffect(() => {
    if (archiveReason) {
      form.reset({
        reason: archiveReason.reason,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveReason]);

  function onSubmit(formData: Omit<ArchiveReason, 'uuid'>) {
    if (archiveReason) {
      updateMutation.mutate({ uuid: archiveReason.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title="Motivo de Arquivamento" onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Motivo 1" icon={House} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
            {archiveReason ? 'Atualizar motivo de arquivamento' : 'Cadastrar motivo de arquivamento'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
