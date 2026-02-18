'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';

import { DistributionReportFilters, DistributionReportStatus } from '@/shared/types';
import { cn, distributionReportStatusLabels } from '@/shared/lib/utils';

import { getQueues } from '@/features/dashboard/distribution/api/queue';
import { getLeads } from '@/features/dashboard/sales/api/lead';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { TypographyMuted } from '@/shared/components/ui/typography';
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
  lead: z.string().optional(),
  queue: z.string().optional(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface DistributionReportFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: DistributionReportFilters) => void;
}

export default function DistributionReportFiltersSheet({
  open,
  onClose,
  onApplyFilters,
}: DistributionReportFiltersSheetProps) {
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);

  const { data: queues = [] } = useQuery({
    queryKey: ['redistribution-queues'],
    queryFn: () => getQueues({ isActive: '' }, ''),
  });

  const pagination = { pageIndex: 0, pageSize: 999 };
  const { data: leads = { content: [] } } = useQuery({
    queryKey: ['redistribution-leads'],
    queryFn: () => getLeads({ pagination }),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: '',
      startDate: null,
      endDate: null,
      lead: '',
      queue: '',
    },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.({
      data,
      user: selectedCatcher ? selectedCatcher.uuid : undefined,
    } as DistributionReportFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({
      status: '',
      startDate: null,
      endDate: null,
      lead: '',
      queue: '',
    });
    setSelectedCatcher(null);
  };

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            setSelectedCatcher(selectedItem[0]);
          } else {
            setSelectedCatcher(null);
          }
          setShowCatcherModal(false);
        }}
      />

      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtros de Distribuição</SheetTitle>
            <SheetDescription>Aplique filtros para refinar o relatório</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(DistributionReportStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {distributionReportStatusLabels[status]}
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
                    <FormLabel>Leads</FormLabel>
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

              <FormField
                control={form.control}
                name="queue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fila </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma fila" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {queues.map((queue) => (
                          <SelectItem key={queue.uuid} value={queue.uuid}>
                            {queue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <TypographyMuted>Corretor</TypographyMuted>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedCatcher && 'text-muted-foreground',
                  )}
                  onClick={() => setShowCatcherModal(true)}
                >
                  {selectedCatcher ? selectedCatcher.name : 'Selecionar Corretor'}
                  {selectedCatcher && (
                    <X
                      className="ml-auto h-4 w-4 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCatcher(null);
                      }}
                    />
                  )}
                </Button>
              </div>

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
    </>
  );
}
