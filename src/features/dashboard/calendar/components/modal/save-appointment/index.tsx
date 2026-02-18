'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { APPOINTMENT_COLORS } from '@/shared/lib/constants';
import { cn, timeToString, stringToTime, getTimeOneHourAhead } from '@/shared/lib/utils';

import { CalendarAppointment } from '@/features/dashboard/calendar/types';

import { AppointmentFormData, appointmentSchema } from '@/features/dashboard/calendar/components/modal/save-appointment/schema';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';

interface SaveAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => void;
  selectedDate?: Date;
  selectedHour?: number;
  editingEvent?: CalendarAppointment | null;
  isLoading?: boolean;
}

export function SaveAppointmentModal({
  open,
  onClose,
  onSubmit,
  selectedDate,
  selectedHour,
  editingEvent,
  isLoading,
}: SaveAppointmentModalProps) {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      description: '',
      appointmentDate: format(new Date(), 'yyyy-MM-dd'),
      startingTime: getTimeOneHourAhead(),
      endingTime: getTimeOneHourAhead(2),
      color: '#3b82f6',
    },
  });

  // Atualiza os valores do form quando open, selectedDate, selectedHour ou editingEvent mudarem
  useEffect(() => {
    if (open) {
      const getDate = () => {
        if (editingEvent) return editingEvent.appointmentDate;
        if (selectedDate) return format(selectedDate, 'yyyy-MM-dd');
        return format(new Date(), 'yyyy-MM-dd');
      };

      const getStartTime = () => {
        if (editingEvent) {
          if (typeof editingEvent.startingTime === 'string') {
            return stringToTime(editingEvent.startingTime);
          }
          return editingEvent.startingTime;
        }
        if (selectedHour !== undefined) return { hour: selectedHour, minute: 0, second: 0 };
        return getTimeOneHourAhead();
      };

      const getEndTime = () => {
        if (editingEvent) {
          if (typeof editingEvent.endingTime === 'string') {
            return stringToTime(editingEvent.endingTime);
          }
          return editingEvent.endingTime;
        }
        if (selectedHour !== undefined) return { hour: selectedHour + 1, minute: 0, second: 0 };
        return getTimeOneHourAhead(2);
      };

      form.reset({
        title: editingEvent?.title || '',
        description: editingEvent?.description || '',
        appointmentDate: getDate(),
        startingTime: getStartTime(),
        endingTime: getEndTime(),
        color: editingEvent?.color || '#3b82f6',
      });
    }
  }, [open, selectedDate, selectedHour, editingEvent, form]);

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingEvent ? 'Editar Compromisso' : 'Novo Compromisso'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Reunião com cliente" {...field} />
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
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detalhes do compromisso..." className="resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(parse(field.value, 'yyyy-MM-dd', new Date()), "dd 'de' MMM yyyy", {
                              locale: ptBR,
                            })
                          : 'Selecione uma data'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, 'yyyy-MM-dd'));
                        }
                      }}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startingTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário de início</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      value={timeToString(field.value)}
                      onChange={(e) => field.onChange(stringToTime(e.target.value))}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endingTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário de fim</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      value={timeToString(field.value)}
                      onChange={(e) => field.onChange(stringToTime(e.target.value))}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {APPOINTMENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className="size-10 rounded-md border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color.value,
                          borderColor: field.value === color.value ? '#000' : 'transparent',
                        }}
                        onClick={() => field.onChange(color.value)}
                        title={color.label}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingEvent ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
