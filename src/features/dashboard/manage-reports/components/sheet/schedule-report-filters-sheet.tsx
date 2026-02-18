'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { z } from 'zod';

import { getTeams } from '@/features/dashboard/properties/api/teams';

import { ScheduleReportFilters } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { getLeads } from '@/features/dashboard/sales/api/lead';
import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';
import { Calendar } from '@/shared/components/ui/calendar';

const filterSchema = z.object({
  isCompleted: z.string().optional(),
  team: z.string().optional(),
  lead: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface ScheduleReportFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: ScheduleReportFilters) => void;
}

export default function ScheduleReportFiltersSheet({ open, onClose, onApplyFilters }: ScheduleReportFiltersSheetProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: teams = { content: [] } } = useQuery({
    queryKey: ['teams', pagination],
    queryFn: () => getTeams(pagination),
  });

  const { data: leads = { content: [] } } = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads({ pagination: { pageIndex: 0, pageSize: 999 } }),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: { isCompleted: '', team: '', lead: '', startDate: null, endDate: null },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.(data as ScheduleReportFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({ isCompleted: '', team: '', lead: '', startDate: null, endDate: null });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de Tarefas</SheetTitle>
          <SheetDescription>Aplique filtros para refinar o relatório</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da Tarefa</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Apenas Completas</SelectItem>
                      <SelectItem value="1">Apenas Não Completas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma equipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.content.map((team) => (
                        <SelectItem key={team.uuid} value={team.uuid}>
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
              name="lead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um lead" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leads.content.map((lead) => (
                        <SelectItem key={lead.uuid} value={lead.uuid}>
                          {lead.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Inicial</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'dd/MM/yyyy', { locale: ptBR }) : 'Data inicial'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          autoFocus
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
                    <FormLabel>Data Final</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'dd/MM/yyyy', { locale: ptBR }) : 'Data final'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
  );
}
