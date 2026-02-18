'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getTeams } from '@/features/dashboard/properties/api/teams';

import { PropertiesReportFilters, PropertyStatus } from '@/shared/types';
import { propertyStatusLabels } from '@/shared/lib/property-status';
import { cn } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
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
  status: z.string().optional(),
  team: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface PropertyReportFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: PropertiesReportFilters) => void;
}

export default function PropertyReportFiltersSheet({ open, onClose, onApplyFilters }: PropertyReportFiltersSheetProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });
  const { data: teams = { content: [] } } = useQuery({
    queryKey: ['teams', pagination],
    queryFn: () => getTeams(pagination),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: '',
      team: '',
      startDate: null,
      endDate: null,
    },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.(data as PropertiesReportFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({
      status: '',
      team: '',
      startDate: null,
      endDate: null,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de Propriedades</SheetTitle>
          <SheetDescription>Aplique filtros para refinar o relatório</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da Propriedade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PropertyStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {propertyStatusLabels[status]}
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
