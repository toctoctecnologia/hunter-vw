'use client';

import { useEffect } from 'react';
import { File, House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

import {
  newCondominiumFeature,
  updateCondominiumFeature,
} from '@/features/dashboard/properties/api/condominium-feature';

import { condominiumFeatureTypeLabels } from '@/shared/lib/utils';

import { CondominiumFeature, CondominiumFeatureType, ModalProps } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';

const condominiumFeatureSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  description: z.string(),
  type: z.nativeEnum(CondominiumFeatureType, { error: 'Tipo é obrigatório' }),
});

interface SaveCondominiumFeatureModalProps extends Omit<ModalProps, 'title' | 'description'> {
  condominiumFeature?: CondominiumFeature | null;
}

export function SaveCondominiumFeatureModal({
  condominiumFeature,
  onClose,
  ...props
}: SaveCondominiumFeatureModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<CondominiumFeature, 'uuid'>) => newCondominiumFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominium-feature'] });
      toast.success('Característica criada com sucesso!');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Omit<CondominiumFeature, 'uuid'> }) =>
      updateCondominiumFeature({ ...data, uuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominium-feature'] });
      toast.success('Característica atualizada com sucesso!');
      onClose();
    },
  });

  const form = useForm<Omit<CondominiumFeature, 'uuid'>>({
    resolver: zodResolver(condominiumFeatureSchema),
    defaultValues: {
      name: condominiumFeature?.name || '',
      description: condominiumFeature?.description || '',
      type: condominiumFeature?.type || CondominiumFeatureType.LEISURE,
    },
  });

  useEffect(() => {
    if (condominiumFeature) {
      form.reset({
        name: condominiumFeature.name,
        description: condominiumFeature.description,
        type: condominiumFeature.type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condominiumFeature]);

  function onSubmit(formData: Omit<CondominiumFeature, 'uuid'>) {
    if (condominiumFeature) {
      updateMutation.mutate({ uuid: condominiumFeature.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title="Característica do Condomínio" onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Piscina" icon={House} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CondominiumFeatureType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {condominiumFeatureTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Descrição da característica" icon={File} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
            {condominiumFeature ? 'Atualizar característica' : 'Cadastrar característica'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
