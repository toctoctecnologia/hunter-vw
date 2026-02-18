'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  newLeadPropertyPreferenceHistory,
  updateLeadPropertyPreferenceHistory,
} from '@/features/dashboard/sales/api/lead-property-preference-history';
import {
  leadPropertyPreferenceHistoryFormSchema,
  LeadPropertyPreferenceHistoryFormData,
} from '@/features/dashboard/sales/components/form/lead-property-preference-history-form';

import { ModalProps, PropertyPreferenceHistoryItem, PropertyType } from '@/shared/types';
import { propertyTypeLabels } from '@/shared/lib/property-status';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Modal } from '@/shared/components/ui/modal';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { removeNonNumeric } from '@/shared/lib/masks';

interface EditPropertyCharacteristicsModalProps extends Omit<ModalProps, 'title'> {
  leadUuid: string;
  characteristics: PropertyPreferenceHistoryItem | null;
}

export function EditPropertyPreferenceHistoryModal({
  open,
  onClose,
  leadUuid,
  characteristics,
}: EditPropertyCharacteristicsModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<LeadPropertyPreferenceHistoryFormData>({
    resolver: zodResolver(leadPropertyPreferenceHistoryFormSchema),
    defaultValues: {
      propertyType: PropertyType.APARTAMENTO,
      area: '',
      rooms: '',
      bathrooms: '',
      garageSpots: '',
      suites: '',
      internalArea: '',
      externalArea: '',
      lotArea: '',
      propertyValue: '',
      city: '',
      state: '',
      neighborhood: '',
    },
  });

  useEffect(() => {
    if (open && characteristics) {
      form.reset({
        propertyType: characteristics.propertyType,
        area: characteristics.area?.toString() || '',
        rooms: characteristics.rooms?.toString() || '',
        bathrooms: characteristics.bathrooms?.toString() || '',
        garageSpots: characteristics.garageSpots?.toString() || '',
        suites: characteristics.suites?.toString() || '',
        internalArea: characteristics.internalArea?.toString() || '',
        externalArea: characteristics.externalArea?.toString() || '',
        lotArea: characteristics.lotArea?.toString() || '',
        propertyValue: characteristics.propertyValue?.toString() || '',
        city: characteristics.city || '',
        state: characteristics.state || '',
        neighborhood: characteristics.neighborhood || '',
      });
    }
  }, [open, characteristics, form]);

  const createMutation = useMutation({
    mutationFn: (data: LeadPropertyPreferenceHistoryFormData) => {
      return newLeadPropertyPreferenceHistory(leadUuid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-property-preference-history'] });
      toast.success('Características criadas com sucesso!');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: LeadPropertyPreferenceHistoryFormData) => {
      return updateLeadPropertyPreferenceHistory(characteristics!.uuid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-property-preference-history'] });
      toast.success('Características atualizadas com sucesso!');
      onClose();
    },
  });

  const onSubmit = (data: LeadPropertyPreferenceHistoryFormData) => {
    if (!characteristics) {
      return createMutation.mutate(data);
    }
    updateMutation.mutate(data);
  };

  return (
    <Modal
      title="Características do Imóvel"
      description="Adicione ou edite as características do imóvel de interesse do lead"
      open={open}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Imóvel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {propertyTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UF"
                        maxLength={2}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Dimensões</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="internalArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Interna (m²)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Externa (m²)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lotArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área do Lote (m²)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Cômodos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garageSpots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas de Garagem</FormLabel>
                    <FormControl>
                      <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
