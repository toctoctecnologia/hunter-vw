'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { normalizeCnpjNumber, removeNonNumeric } from '@/shared/lib/masks';

import { newUnit, updateUnit } from '@/features/dashboard/properties/api/units';
import { ModalProps, UnitDetail } from '@/shared/types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { UnitFormData, unitSchema } from '@/features/dashboard/properties/components/form/unit-form/schema';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';

interface SaveUnitModalProps extends Omit<ModalProps, 'title' | 'description'> {
  unit?: UnitDetail | null;
}

export function SaveUnitModal({ unit, onClose, ...props }: SaveUnitModalProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: UnitFormData) =>
      newUnit({
        ...data,
        federalDocument: removeNonNumeric(data.federalDocument),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade criada com sucesso!');
      form.reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UnitFormData }) =>
      updateUnit(uuid, { ...data, federalDocument: removeNonNumeric(data.federalDocument) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Unidade atualizada com sucesso!');
      onClose();
    },
  });

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      federalDocument: '',
      municipalRegistration: '',
      stateRegistration: '',
      socialReason: '',
      website: '',
    },
  });

  useEffect(() => {
    if (unit) {
      form.reset({
        socialReason: unit.socialReason,
        federalDocument: unit.federalDocument,
        municipalRegistration: unit.municipalRegistration,
        stateRegistration: unit.stateRegistration,
        website: unit.website,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  function onSubmit(formData: UnitFormData) {
    if (unit) {
      updateMutation.mutate({ uuid: unit.uuid, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal {...props} title={unit ? 'Editar Unidade' : 'Nova Unidade'} onClose={onClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="socialReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razão Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Empresa LTDA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="federalDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" {...field} value={normalizeCnpjNumber(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stateRegistration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Estadual</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123.456.789.012" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="municipalRegistration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inscrição Municipal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://www.exemplo.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" isLoading={isPending} className="w-full text-sm sm:text-base py-2 sm:py-3">
            {unit ? 'Atualizar unidade' : 'Cadastrar unidade'}
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
