'use client';

import { useEffect } from 'react';
import { House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

import { newBuilder, updateBuilder } from '@/features/dashboard/properties/api/builders';

import { ModalProps, PropertyBuilder } from '@/shared/types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { removeNonNumeric } from '@/shared/lib/masks';

const builderSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  yearsOfExperience: z.string().min(1, { error: 'Anos de experiência inválido' }),
});

interface SaveBuilderModalProps extends Omit<ModalProps, 'title' | 'description'> {
  builder?: PropertyBuilder | null;
}

export function SaveBuilderModal({ builder, onClose, ...props }: SaveBuilderModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<PropertyBuilder, 'uuid'>) => newBuilder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      toast.success('Construtora criada com sucesso!');
      form.reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Omit<PropertyBuilder, 'uuid'> }) => updateBuilder({ ...data, uuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builders'] });
      toast.success('Construtora atualizada com sucesso!');
      form.reset();
      onClose();
    },
  });

  const form = useForm<Omit<PropertyBuilder, 'uuid'>>({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      name: '',
      yearsOfExperience: '',
    },
  });

  useEffect(() => {
    if (builder) {
      form.reset({
        name: builder.name,
        yearsOfExperience: String(builder.yearsOfExperience),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder]);

  function onSubmit(formData: Omit<PropertyBuilder, 'uuid'>) {
    if (builder) {
      updateMutation.mutate({ uuid: builder.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title="Construtora" onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Construtora ABC" icon={House} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anos de experiência</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 5" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
            {builder ? 'Atualizar construtora' : 'Cadastrar construtora'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
