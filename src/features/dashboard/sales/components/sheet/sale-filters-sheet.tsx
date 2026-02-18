'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  LeadQualification,
  LeadFunnelStages,
  LeadStatusType,
  LeadOriginType,
  LeadNegotiationType,
  LeadIntensityType,
  FunnelDirection,
  NegotiationFilters,
  PropertyType,
} from '@/shared/types';

import {
  intensityConfig,
  LeadOriginTypeToLabel,
  funnelStageLabels,
  negotiationTypeLabels,
  funnelDirectionTypeLabels,
  leadStatusTypeLabels,
} from '@/shared/lib/utils';
import { getTeams } from '@/features/dashboard/properties/api/teams';
import { propertyTypeLabels } from '@/shared/lib/property-status';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Separator } from '@/shared/components/ui/separator';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { removeNonNumeric } from '@/shared/lib/masks';

const filterSchema = z.object({
  qualification: z.union([z.nativeEnum(LeadQualification), z.literal('')]).optional(),
  afterDistribution: z.boolean().optional(),
  funnelStep: z.union([z.nativeEnum(LeadFunnelStages), z.literal('')]).optional(),
  status: z.union([z.nativeEnum(LeadStatusType), z.literal('')]).optional(),
  origin: z.union([z.nativeEnum(LeadOriginType), z.literal('')]).optional(),
  negotiationType: z.union([z.nativeEnum(LeadNegotiationType), z.literal('')]).optional(),
  intensityType: z.union([z.nativeEnum(LeadIntensityType), z.literal('')]).optional(),
  lastContactedAtFrom: z.string().optional(),
  lastContactedAtTo: z.string().optional(),
  teamUuid: z.string().optional(),
  contactOriginType: z.union([z.nativeEnum(FunnelDirection), z.literal('')]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  preferences: z.object({
    area: z.string().optional(),
    rooms: z.string().optional(),
    bathrooms: z.string().optional(),
    garageSpots: z.string().optional(),
    suites: z.string().optional(),
    internalArea: z.string().optional(),
    externalArea: z.string().optional(),
    lotArea: z.string().optional(),
    propertyValue: z.string().optional(),
    propertyType: z.union([z.nativeEnum(PropertyType), z.literal('')]),
    city: z.string().optional(),
    state: z.string().optional(),
    neighborhood: z.string().optional(),
  }),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface SaleFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: NegotiationFilters) => void;
}

export default function SaleFiltersSheet({ open, onClose, onApplyFilters }: SaleFiltersSheetProps) {
  const { data: teamsData = { content: [] } } = useQuery({
    queryKey: ['sale-filters-teams'],
    queryFn: () => getTeams({ pageIndex: 0, pageSize: 999 }),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      qualification: '',
      afterDistribution: false,
      funnelStep: '',
      status: '',
      origin: '',
      negotiationType: '',
      intensityType: '',
      lastContactedAtFrom: '',
      lastContactedAtTo: '',
      teamUuid: '',
      contactOriginType: '',
      startDate: '',
      endDate: '',
      preferences: {
        area: '',
        rooms: '',
        bathrooms: '',
        garageSpots: '',
        suites: '',
        internalArea: '',
        externalArea: '',
        lotArea: '',
        propertyValue: '',
        propertyType: '',
        city: '',
        state: '',
        neighborhood: '',
      },
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const filters: NegotiationFilters = {
      qualification: data.qualification === '' ? undefined : (data.qualification as LeadQualification),
      afterDistribution: data.afterDistribution || undefined,
      funnelStep: data.funnelStep === '' ? undefined : (data.funnelStep as LeadFunnelStages),
      status: data.status === '' ? undefined : (data.status as LeadStatusType),
      origin: data.origin === '' ? undefined : (data.origin as LeadOriginType),
      negotiationType: data.negotiationType === '' ? undefined : (data.negotiationType as LeadNegotiationType),
      intensityType: data.intensityType === '' ? undefined : (data.intensityType as LeadIntensityType),
      lastContactedAtFrom: data.lastContactedAtFrom || undefined,
      lastContactedAtTo: data.lastContactedAtTo || undefined,
      teamUuid: data.teamUuid || undefined,
      contactOriginType: (data.contactOriginType || FunnelDirection.INBOUND) as FunnelDirection,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      preferences: {
        area: data.preferences?.area ? Number(data.preferences.area) : undefined,
        rooms: data.preferences?.rooms ? Number(data.preferences.rooms) : undefined,
        bathrooms: data.preferences?.bathrooms ? Number(data.preferences.bathrooms) : undefined,
        garageSpots: data.preferences?.garageSpots ? Number(data.preferences.garageSpots) : undefined,
        suites: data.preferences?.suites ? Number(data.preferences.suites) : undefined,
        internalArea: data.preferences?.internalArea ? Number(data.preferences.internalArea) : undefined,
        externalArea: data.preferences?.externalArea ? Number(data.preferences.externalArea) : undefined,
        lotArea: data.preferences?.lotArea ? Number(data.preferences.lotArea) : undefined,
        propertyValue: data.preferences?.propertyValue ? Number(data.preferences.propertyValue) : undefined,
        propertyType: data.preferences?.propertyType === '' ? undefined : data.preferences?.propertyType,
        city: data.preferences?.city || undefined,
        state: data.preferences?.state || undefined,
        neighborhood: data.preferences?.neighborhood || undefined,
      },
    };
    onApplyFilters?.(filters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({
      qualification: '',
      afterDistribution: false,
      funnelStep: '',
      status: '',
      origin: '',
      negotiationType: '',
      intensityType: '',
      lastContactedAtFrom: '',
      lastContactedAtTo: '',
      teamUuid: '',
      contactOriginType: '',
      startDate: '',
      endDate: '',
      preferences: {
        area: '',
        rooms: '',
        bathrooms: '',
        garageSpots: '',
        suites: '',
        internalArea: '',
        externalArea: '',
        lotArea: '',
        propertyValue: '',
        propertyType: '',
        city: '',
        state: '',
        neighborhood: '',
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de Negociação</SheetTitle>
          <SheetDescription>Aplique filtros para refinar a busca de leads</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            {/* Data de Início e Fim */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Início</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Fim</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Último Contato */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastContactedAtFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Último Contato De</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
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
                name="lastContactedAtTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Último Contato Até</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Qualificação */}
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualificação</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a qualificação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={LeadQualification.RECENT}>Recente</SelectItem>
                      <SelectItem value={LeadQualification.ATTENTION}>Atenção</SelectItem>
                      <SelectItem value={LeadQualification.URGENT}>Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Etapa do Funil */}
            <FormField
              control={form.control}
              name="funnelStep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etapa do Funil</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a etapa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(funnelStageLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(leadStatusTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Origem */}
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
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

            {/* Tipo de Negociação */}
            <FormField
              control={form.control}
              name="negotiationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Negociação</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(negotiationTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Intensidade */}
            <FormField
              control={form.control}
              name="intensityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intensidade</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
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

            {/* Tipo de Contato (Inbound/Outbound) */}
            <FormField
              control={form.control}
              name="contactOriginType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Contato</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === field.value ? '' : value)} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de contato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(funnelDirectionTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Equipe */}
            <FormField
              control={form.control}
              name="teamUuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a equipe" />
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

            {/* Após Distribuição */}
            <FormField
              control={form.control}
              name="afterDistribution"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Após Distribuição</FormLabel>
                    <p className="text-sm text-muted-foreground">Filtrar leads após distribuição</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Características do Imóvel</h3>

              <FormField
                control={form.control}
                name="preferences.propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Imóvel</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === field.value ? '' : value)}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(propertyTypeLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
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
                  name="preferences.rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nº de quartos"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nº de banheiros"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Suítes e Vagas */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferences.suites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suítes</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nº de suítes"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.garageSpots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nº de vagas"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Áreas */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferences.area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Total (m²)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Área total"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.internalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Interna (m²)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Área interna"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferences.externalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Externa (m²)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Área externa"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.lotArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área do Lote (m²)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Área do lote"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferences.propertyValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Imóvel (R$)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Valor do imóvel"
                        {...field}
                        onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferences.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferences.neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
  );
}
