'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';

import { cn, getYearOptions, intensityConfig, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { MONTH_NAMES } from '@/shared/constants';

import { LeadsDashboardFilters, LeadIntensityType, LeadOriginType, PropertyPurpose } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { getQueues } from '@/features/dashboard/distribution/api/queue';
import { getTeams } from '@/features/dashboard/properties/api/teams';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

const filterSchema = z.object({
  month: z.number().nullable(),
  year: z.number().nullable(),
  teamUuid: z.string().optional(),
  funnelType: z.string().optional(),
  campaignUuid: z.string().optional(),
  propertyPurpose: z.union([z.nativeEnum(PropertyPurpose), z.literal('')]).optional(),
  funnelStepId: z.string().optional(),
  intensityType: z.union([z.nativeEnum(LeadIntensityType), z.literal('')]).optional(),
  originType: z.union([z.nativeEnum(LeadOriginType), z.literal('')]).optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface DashboardFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: LeadsDashboardFilters) => void;
}

export default function DashboardFiltersSheet({ open, onClose, onApplyFilters }: DashboardFiltersSheetProps) {
  const currentDate = new Date();
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);

  const { data: teamsData = { content: [] } } = useQuery({
    queryKey: ['leads-dashboard-teams'],
    queryFn: () => getTeams({ pageIndex: 0, pageSize: 999 }),
  });

  const { data: queues = [] } = useQuery({
    queryKey: ['queues'],
    queryFn: () => getQueues({ isActive: '0' }, ''),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      teamUuid: '',
      funnelType: '',
      campaignUuid: '',
      propertyPurpose: '',
      funnelStepId: '',
      intensityType: '',
      originType: '',
    },
  });

  const onSubmit = (data: FilterFormData) => {
    onApplyFilters?.({
      ...data,
      catcherId: selectedCatcher ? selectedCatcher.uuid : undefined,
    } as LeadsDashboardFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      teamUuid: '',
      funnelType: '',
      campaignUuid: '',
      propertyPurpose: '',
      funnelStepId: '',
      intensityType: '',
      originType: '',
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
            <SheetTitle>Filtros de Leads</SheetTitle>
            <SheetDescription>Aplique filtros para refinar a busca de leads</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        value={field.value ? field.value?.toString() : ''}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="mês" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MONTH_NAMES.map((month, index) => (
                            <SelectItem key={index} value={(index + 1).toString()}>
                              {month}
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        value={field.value ? field.value?.toString() : ''}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="ano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getYearOptions(3).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="campaignUuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campanha</FormLabel>

                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a campanha" />
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

              <FormField
                control={form.control}
                name="intensityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intensidade</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === field.value ? '' : value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a intensidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(intensityConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                              {config.label}
                            </div>
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
                name="originType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === field.value ? '' : value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a origem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(LeadOriginType).map((origin) => (
                          <SelectItem key={origin} value={origin}>
                            {LeadOriginTypeToLabel(origin)}
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

              <FormField
                control={form.control}
                name="teamUuid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipe</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="equipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamsData.content.map((team) => (
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
                name="propertyPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finalidade do Imóvel</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === field.value ? '' : value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a finalidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PropertyPurpose).map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>
                            {purpose.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Funil (input básico) */}
              <FormField
                control={form.control}
                name="funnelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Funil</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o tipo de funil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ID do Step do Funil (input básico) */}
              <FormField
                control={form.control}
                name="funnelStepId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Step do Funil</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o ID do step do funil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <SheetFooter className="gap-2 p-0 m-0">
                <Button type="button" variant="outline" onClick={handleClearFilters}>
                  Limpar Filtros
                </Button>
                <Button type="submit">Aplicar Filtros</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
