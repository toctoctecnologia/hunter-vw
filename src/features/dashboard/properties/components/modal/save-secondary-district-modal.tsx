'use client';

import { useEffect } from 'react';
import { House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import z from 'zod';

import { newDistrict, updateDistrict } from '@/features/dashboard/properties/api/secondary-district';

import { ModalProps, PropertySecondaryDistrict } from '@/shared/types';

import { Modal } from '@/shared/components/ui/modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

const secondaryDistrictSchema = z.object({
  name: z.string().min(2, 'O nome é obrigatório'),
});

interface SaveSecondaryDistrictModalProps extends Omit<ModalProps, 'title' | 'description'> {
  secondaryDistrict?: PropertySecondaryDistrict | null;
}

export function SaveSecondaryDistrictModal({ secondaryDistrict, onClose, ...props }: SaveSecondaryDistrictModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Omit<PropertySecondaryDistrict, 'uuid'>) => newDistrict(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondary-district'] });
      toast.success('Segundo bairro criado com sucesso!');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: Omit<PropertySecondaryDistrict, 'uuid'> }) =>
      updateDistrict({ ...data, uuid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondary-district'] });
      toast.success('Segundo bairro atualizado com sucesso!');
      onClose();
    },
  });

  const form = useForm<Omit<PropertySecondaryDistrict, 'uuid'>>({
    resolver: zodResolver(secondaryDistrictSchema),
    defaultValues: {
      name: secondaryDistrict?.name || '',
    },
  });

  useEffect(() => {
    if (secondaryDistrict) {
      form.reset({
        name: secondaryDistrict.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryDistrict]);

  function onSubmit(formData: Omit<PropertySecondaryDistrict, 'uuid'>) {
    if (secondaryDistrict) {
      updateMutation.mutate({ uuid: secondaryDistrict.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title="Segundo Bairro" onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Beira Mar" icon={House} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
            {secondaryDistrict ? 'Atualizar bairro' : 'Cadastrar bairro'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
