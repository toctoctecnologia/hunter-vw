'use client';

import { useEffect } from 'react';
import { File, House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

import { newPropertyFeature, updatePropertyFeature } from '@/features/dashboard/properties/api/property-feature';

import { ModalProps, PropertyFeature, PropertyFeatureType } from '@/shared/types';
import { propertyFeatureTypeLabels } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';

const propertyFeatureSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
  type: z.nativeEnum(PropertyFeatureType, { error: 'Tipo é obrigatório' }),
  description: z.string(),
});

interface SavePropertyFeatureModalProps extends Omit<ModalProps, 'title' | 'description'> {
  propertyFeature?: PropertyFeature | null;
}

export function SavePropertyFeatureModal({ propertyFeature, onClose, ...props }: SavePropertyFeatureModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<PropertyFeature, 'uuid'>) => newPropertyFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-feature'] });
      toast.success('Característica criada com sucesso!');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Omit<PropertyFeature, 'uuid'> }) =>
      updatePropertyFeature({ ...data, uuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-feature'] });
      toast.success('Característica atualizada com sucesso!');
      onClose();
    },
  });

  const form = useForm<Omit<PropertyFeature, 'uuid'>>({
    resolver: zodResolver(propertyFeatureSchema),
    defaultValues: {
      name: propertyFeature?.name || '',
      description: propertyFeature?.description || '',
      type: propertyFeature?.type || PropertyFeatureType.LEISURE,
    },
  });

  useEffect(() => {
    if (propertyFeature) {
      form.reset({
        name: propertyFeature.name,
        description: propertyFeature.description,
        type: propertyFeature.type,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyFeature]);

  function onSubmit(formData: Omit<PropertyFeature, 'uuid'>) {
    if (propertyFeature) {
      updateMutation.mutate({ uuid: propertyFeature.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title="Característica do Imóvel" onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Churrasqueira" icon={House} {...field} />
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
                      {Object.values(PropertyFeatureType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {propertyFeatureTypeLabels[type]}
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
            {propertyFeature ? 'Atualizar característica' : 'Cadastrar característica'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
