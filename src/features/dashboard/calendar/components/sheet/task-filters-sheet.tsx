'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, User, X } from 'lucide-react';
import { useState } from 'react';

import { TaskFilters } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { getTaskTypes } from '@/features/dashboard/calendar/api/tasks';
import { getTeams } from '@/features/dashboard/properties/api/teams';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

const filterSchema = z.object({
  taskTypeCode: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  teamId: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface TaskFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: TaskFilters) => void;
}

export default function TaskFiltersSheet({ open, onClose, onApplyFilters }: TaskFiltersSheetProps) {
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);
  const [showCatcherModal, setShowCatcherModal] = useState(false);

  const { data: teamsData = { content: [] }, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['catcher-list-teams'],
    queryFn: () => getTeams({ pageIndex: 0, pageSize: 999 }),
  });

  const { data: taskTypes = [], isLoading: isLoadingTypes } = useQuery({
    queryKey: ['task-types'],
    queryFn: () => getTaskTypes(),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: { startDate: undefined, endDate: undefined, teamId: '', taskTypeCode: '' },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.({ ...data, userId: selectedCatcher?.uuid || undefined } as TaskFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({ startDate: undefined, endDate: undefined, teamId: '', taskTypeCode: '' });
  };

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (setSelectedCatcher) {
            if (selectedItem.length > 0) {
              setSelectedCatcher({ uuid: selectedItem[0].uuid, name: selectedItem[0].name });
            } else {
              setSelectedCatcher(null);
            }
          }
          setShowCatcherModal(false);
        }}
      />

      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros de Tarefas</SheetTitle>
            <SheetDescription>Aplique filtros para buscar tarefas</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecione uma data'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Fim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecione uma data'}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                variant="outline"
                type="button"
                className={cn(
                  'w-full md:w-60 justify-start text-left font-normal',
                  !selectedCatcher && 'text-muted-foreground',
                )}
                onClick={() => setShowCatcherModal(true)}
              >
                <User className="mr-2 h-4 w-4" />
                {selectedCatcher ? selectedCatcher.name : 'Selecionar Responsável'}
                {selectedCatcher && (
                  <X
                    className="ml-auto h-4 w-4 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCatcher?.(null);
                    }}
                  />
                )}
              </Button>

              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTeams}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma equipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamsData.content.map((team) => (
                          <SelectItem key={team.uuid} value={String(team.uuid)}>
                            {team.name}
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
                name="taskTypeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Tarefa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTypes}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um tipo de tarefa" />
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
            </form>

            <SheetFooter className="gap-2 mt-auto">
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>Aplicar Filtros</Button>
            </SheetFooter>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
