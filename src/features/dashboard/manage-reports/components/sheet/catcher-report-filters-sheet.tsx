'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getTeams } from '@/features/dashboard/properties/api/teams';

import { CatchersReportFilters } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
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
  isActive: z.string().optional(),
  team: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface CatcherReportFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: CatchersReportFilters) => void;
}

export default function CatcherReportFiltersSheet({ open, onClose, onApplyFilters }: CatcherReportFiltersSheetProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });
  const { data: teams = { content: [] } } = useQuery({
    queryKey: ['teams', pagination],
    queryFn: () => getTeams(pagination),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: { isActive: '', team: '' },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.(data as CatchersReportFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({ isActive: '', team: '' });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de Corretores</SheetTitle>
          <SheetDescription>Aplique filtros para refinar o relatório</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status do Lead</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Ativos</SelectItem>
                      <SelectItem value="1">Inativos</SelectItem>
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
