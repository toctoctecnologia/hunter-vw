'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { APPOINTMENT_COLORS } from '@/shared/lib/constants';
import { cn, timeToString, stringToTime, getTimeOneHourAhead } from '@/shared/lib/utils';

import { getTaskTypes } from '@/features/dashboard/calendar/api/tasks';
import { getLeads } from '@/features/dashboard/sales/api/lead';

import { TaskFormData, taskSchema } from '@/features/dashboard/calendar/components/modal/save-task/schema';
import { Task } from '@/features/dashboard/calendar/types';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';

interface SaveTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  editingTask?: Task | null;
  isLoading?: boolean;
  lead?: {
    uuid: string;
    name: string;
  };
}

export function SaveTaskModal({ open, onClose, onSubmit, editingTask, isLoading, lead }: SaveTaskModalProps) {
  const selectContentRef = useRef<HTMLDivElement>(null);

  const { data: taskTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['task-types'],
    queryFn: getTaskTypes,
  });

  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['leads-infinite'],
    queryFn: ({ pageParam = 0 }) => getLeads({ pagination: { pageIndex: pageParam, pageSize: 20 } }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });

  const leads = leadsData?.pages.flatMap((page) => page.content) ?? [];

  const handleScroll = useCallback(() => {
    const element = selectContentRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      taskCode: '',
      taskDate: format(new Date(), 'yyyy-MM-dd'),
      taskTime: getTimeOneHourAhead(),
      color: '#3b82f6',
      leadUuid: '',
      propertyCode: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: lead ? `Acompanhamento ${lead.name}` : editingTask?.title || '',
        description: editingTask?.description || '',
        taskCode: lead ? 'PHONE_CALL' : editingTask?.taskType.code || '',
        taskDate: lead
          ? format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')
          : editingTask?.taskDate || format(new Date(), 'yyyy-MM-dd'),
        taskTime: editingTask?.taskTime || getTimeOneHourAhead(),
        color: editingTask?.color || '#3b82f6',
        leadUuid: lead?.uuid || editingTask?.lead?.uuid || '',
        propertyCode: editingTask?.propertyCode || '',
      });
    }
  }, [open, editingTask, form, lead]);

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Follow-up com cliente" {...field} />
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
                  <Textarea placeholder="Detalhes da tarefa..." className="resize-none" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leadUuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingLeads}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um lead" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent ref={selectContentRef} onScroll={handleScroll}>
                    {leads.map((leadItem) => (
                      <SelectItem key={leadItem.uuid} value={leadItem.uuid}>
                        {leadItem.name}
                      </SelectItem>
                    ))}
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do Imóvel (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="1234..." className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taskCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Tarefa</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTypes}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de tarefa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.code} value={type.code}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="taskDate"
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

            <FormField
              control={form.control}
              name="taskTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Horário</FormLabel>
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
              {editingTask ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
