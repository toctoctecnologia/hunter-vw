'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { DayOfWeek, PropertyVisiting } from '@/shared/types';
import { ALL_DAYS, DAY_OF_WEEK_LABELS } from '@/shared/lib/utils';

import {
  getPropertyVisitings,
  newPropertyVisiting,
  updatePropertyVisiting,
  deletePropertyVisiting,
} from '@/features/dashboard/properties/api/property-visiting';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Loading } from '@/shared/components/loading';

import {
  propertyVisitingSchema,
  PropertyVisitingFormData,
} from '@/features/dashboard/properties/components/form/property-visiting-form/schema';

interface PropertyVisitingDaysProps {
  propertyUuid: string;
}

export function PropertyVisitingDays({ propertyUuid }: PropertyVisitingDaysProps) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);

  const { data: visitings = [], isLoading } = useQuery({
    queryKey: ['property-visitings', propertyUuid],
    queryFn: () => getPropertyVisitings(propertyUuid),
  });

  const form = useForm<PropertyVisitingFormData>({
    resolver: zodResolver(propertyVisitingSchema),
    defaultValues: {
      dayOfWeek: undefined,
      startTime: '',
      endTime: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PropertyVisitingFormData) => newPropertyVisiting(propertyUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-visitings', propertyUuid] });
      toast.success('Horário de visita adicionado com sucesso');
      handleCloseModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PropertyVisitingFormData) => updatePropertyVisiting(propertyUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-visitings', propertyUuid] });
      toast.success('Horário de visita atualizado com sucesso');
      handleCloseModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (dayOfWeek: DayOfWeek) => deletePropertyVisiting(propertyUuid, dayOfWeek),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-visitings', propertyUuid] });
      toast.success('Horário de visita removido com sucesso');
    },
  });

  const handleOpenModal = (day: DayOfWeek) => {
    const visiting = visitings.find((v) => v.dayOfWeek === day);
    if (visiting) {
      setEditingDay(day);
      form.reset({
        dayOfWeek: day,
        startTime: visiting.startTime,
        endTime: visiting.endTime,
      });
    } else {
      setEditingDay(null);
      form.reset({
        dayOfWeek: day,
        startTime: '',
        endTime: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDay(null);
    form.reset();
  };

  const handleSubmit = (data: PropertyVisitingFormData) => {
    if (editingDay) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (day: DayOfWeek) => {
    deleteMutation.mutate(day);
  };

  const getVisitingForDay = (day: DayOfWeek): PropertyVisiting | undefined => {
    if (!visitings) return undefined;
    return (visitings as unknown as PropertyVisiting[]).find((v) => v.dayOfWeek === day);
  };

  const getAvailableDays = (): DayOfWeek[] => {
    if (!visitings) return ALL_DAYS;
    const usedDays = (visitings as unknown as PropertyVisiting[]).map((v) => v.dayOfWeek);
    return ALL_DAYS.filter((day) => !usedDays.includes(day));
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={handleCloseModal} title={editingDay ? 'Editar Horário' : 'Adicionar Horário'}>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(editingDay ? [editingDay] : getAvailableDays()).map((day) => (
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

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Início</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Término</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(handleSubmit)}
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      <Card>
        <CardHeader title="Horários de Visitas" />

        <CardContent className="space-y-4">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_DAYS.map((day) => {
                const visiting = getVisitingForDay(day);
                return (
                  <div key={day} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{DAY_OF_WEEK_LABELS[day]}</p>
                      {visiting ? (
                        <p className="text-sm text-muted-foreground">
                          {visiting.startTime} - {visiting.endTime}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Sem horário disponível</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {visiting ? (
                        <>
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenModal(day)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            type="button"
                            size="icon"
                            onClick={() => handleDelete(day)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenModal(day)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
