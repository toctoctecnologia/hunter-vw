'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { z } from 'zod';

import { removeNonNumeric } from '@/shared/lib/masks';
import {
  PropertyConstructionStatus,
  PropertyDestination,
  PropertyFilters,
  PropertyGarageType,
  PropertyLaunchType,
  PropertyPositionType,
  PropertyQualification,
  PropertySituation,
  PropertyType,
} from '@/shared/types';
import {
  cn,
  propertyConstructionStatusLabels,
  propertyDestinationLabels,
  propertyLaunchTypeLabels,
  propertyPositionTypeLabels,
  propertySituationLabels,
} from '@/shared/lib/utils';

import { getPropertyFeatures } from '@/features/dashboard/properties/api/property-feature';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/ui/sheet';

const filterSchema = z.object({
  qualificationType: z.union([z.nativeEnum(PropertyQualification), z.literal('')]),
  featureUuids: z.array(z.string()),
  area: z.string().optional(),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  garageSpots: z.string().optional(),
  keyLocations: z.string().optional(),
  isHighlighted: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isAvailableForRent: z.boolean().optional(),
  acceptsPermuta: z.boolean().optional(),
  displayedOnPortal: z.boolean().optional(),
  internetPublication: z.boolean().optional(),
  situation: z.union([z.nativeEnum(PropertySituation), z.literal('')]),
  destination: z.union([z.nativeEnum(PropertyDestination), z.literal('')]),
  region: z.string().optional(),
  subRegion: z.string().optional(),
  usageZone: z.string().optional(),
  constructionStatus: z.union([z.nativeEnum(PropertyConstructionStatus), z.literal('')]),
  launchType: z.union([z.nativeEnum(PropertyLaunchType), z.literal('')]),
  propertyPositionType: z.union([z.nativeEnum(PropertyPositionType), z.literal('')]),
  registrationStartDate: z.string().optional(),
  registrationEndDate: z.string().optional(),
  suites: z.string().optional(),
  internalArea: z.string().optional(),
  externalArea: z.string().optional(),
  lotArea: z.string().optional(),
  garageType: z.union([z.nativeEnum(PropertyGarageType), z.literal('')]),
  propertyType: z.union([z.nativeEnum(PropertyType), z.literal('')]),
  propertyValue: z.string().optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface PropertyFiltersSheetProps {
  open?: boolean;
  onClose?: () => void;
  onApplyFilters?: (filters: PropertyFilters) => void;
}

export default function PropertyFiltersSheet({ open, onClose, onApplyFilters }: PropertyFiltersSheetProps) {
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });
  const { data: propertyFeatures = [] } = useQuery({
    queryKey: ['property-features', pagination],
    queryFn: () => getPropertyFeatures(pagination),
  });

  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      qualificationType: '',
      featureUuids: [],
      area: '',
      rooms: '',
      bathrooms: '',
      garageSpots: '',
      suites: '',
      internalArea: '',
      externalArea: '',
      lotArea: '',
      garageType: '',
      propertyType: '',
      propertyValue: '',
      keyLocations: '',
      isHighlighted: false,
      isAvailable: false,
      isAvailableForRent: false,
      acceptsPermuta: false,
      displayedOnPortal: false,
      internetPublication: false,
      situation: '',
      destination: '',
      region: '',
      subRegion: '',
      usageZone: '',
      constructionStatus: '',
      launchType: '',
      propertyPositionType: '',
      registrationStartDate: '',
      registrationEndDate: '',
    },
  });

  const onSubmit = (data: FilterFormData) => {
    const filters: PropertyFilters = {
      filter: '',
      status: null,
      qualificationType: data.qualificationType === '' ? null : (data.qualificationType as PropertyQualification),
      featureUuids: data.featureUuids,
      catcherUuids: selectedCatcher ? selectedCatcher.uuid : undefined,
      area: data.area || '',
      rooms: data.rooms || '',
      bathrooms: data.bathrooms || '',
      garageSpots: data.garageSpots || '',
      suites: data.suites || '',
      internalArea: data.internalArea || '',
      externalArea: data.externalArea || '',
      lotArea: data.lotArea || '',
      garageType: data.garageType === '' ? undefined : (data.garageType as PropertyGarageType),
      propertyType: data.propertyType === '' ? undefined : (data.propertyType as PropertyType),
      propertyValue: data.propertyValue || '',
      keyLocations: data.keyLocations,
      isHighlighted: data.isHighlighted,
      isAvailable: data.isAvailable,
      isAvailableForRent: data.isAvailableForRent,
      acceptsPermuta: data.acceptsPermuta,
      displayedOnPortal: data.displayedOnPortal,
      internetPublication: data.internetPublication,
      situation: data.situation === '' ? undefined : (data.situation as PropertySituation),
      destination: data.destination === '' ? undefined : (data.destination as PropertyDestination),
      region: data.region,
      subRegion: data.subRegion,
      usageZone: data.usageZone,
      constructionStatus:
        data.constructionStatus === '' ? undefined : (data.constructionStatus as PropertyConstructionStatus),
      launchType: data.launchType === '' ? undefined : (data.launchType as PropertyLaunchType),
      propertyPositionType:
        data.propertyPositionType === '' ? undefined : (data.propertyPositionType as PropertyPositionType),
      registrationStartDate: data.registrationStartDate,
      registrationEndDate: data.registrationEndDate,
    };
    onApplyFilters?.(filters);
    onClose?.();
  };

  const handleClearFilters = () => {
    form.reset({
      qualificationType: '',
      featureUuids: [],
      area: '',
      rooms: '',
      bathrooms: '',
      garageSpots: '',
      suites: '',
      internalArea: '',
      externalArea: '',
      lotArea: '',
      garageType: '',
      propertyType: '',
      propertyValue: '',
      keyLocations: '',
      isHighlighted: false,
      isAvailable: false,
      isAvailableForRent: false,
      acceptsPermuta: false,
      displayedOnPortal: false,
      internetPublication: false,
      situation: '',
      destination: '',
      region: '',
      subRegion: '',
      usageZone: '',
      constructionStatus: '',
      launchType: '',
      propertyPositionType: '',
      registrationStartDate: '',
      registrationEndDate: '',
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
            <SheetTitle>Filtros de Propriedades</SheetTitle>
            <SheetDescription>Aplique filtros para refinar a busca de imóveis</SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="qualificationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualificação</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a qualificação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyQualification.RECENT}>Recente</SelectItem>
                        <SelectItem value={PropertyQualification.ATTENTION}>Atenção</SelectItem>
                        <SelectItem value={PropertyQualification.URGENT}>Urgente</SelectItem>
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
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Imóvel</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyType.CASA}>Casa</SelectItem>
                        <SelectItem value={PropertyType.CASA_EM_CONDOMINIO}>Casa em Condomínio</SelectItem>
                        <SelectItem value={PropertyType.TERRENO_EM_CONDOMINIO}>Terreno em Condomínio</SelectItem>
                        <SelectItem value={PropertyType.TERRENO}>Terreno</SelectItem>
                        <SelectItem value={PropertyType.APARTAMENTO}>Apartamento</SelectItem>
                        <SelectItem value={PropertyType.APARTAMENTO_DIFERENCIADO}>Apartamento Diferenciado</SelectItem>
                        <SelectItem value={PropertyType.COBERTURA}>Cobertura</SelectItem>
                        <SelectItem value={PropertyType.PREDIO_INTEIRO}>Prédio Inteiro</SelectItem>
                        <SelectItem value={PropertyType.LOFT_STUDIO_KITNET}>Loft/Studio/Kitnet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Garagem</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo de garagem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyGarageType.SEM_VAGA}>Sem Vaga</SelectItem>
                        <SelectItem value={PropertyGarageType.SIMPLES}>Simples</SelectItem>
                        <SelectItem value={PropertyGarageType.DUPLA}>Dupla</SelectItem>
                        <SelectItem value={PropertyGarageType.COBERTA}>Coberta</SelectItem>
                        <SelectItem value={PropertyGarageType.DESCOBERTA}>Descoberta</SelectItem>
                        <SelectItem value={PropertyGarageType.BOX}>Box</SelectItem>
                        <SelectItem value={PropertyGarageType.VAGA_ROTATIVA}>Vaga Rotativa</SelectItem>
                        <SelectItem value={PropertyGarageType.VAGA_TRANCADA}>Vaga Trancada</SelectItem>
                        <SelectItem value={PropertyGarageType.OUTRO}>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Situação */}
              <FormField
                control={form.control}
                name="situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertySituation.VAGO_DISPONIVEL}>
                          {propertySituationLabels[PropertySituation.VAGO_DISPONIVEL]}
                        </SelectItem>
                        <SelectItem value={PropertySituation.EM_REFORMA}>
                          {propertySituationLabels[PropertySituation.EM_REFORMA]}
                        </SelectItem>
                        <SelectItem value={PropertySituation.OCUPADO}>
                          {propertySituationLabels[PropertySituation.OCUPADO]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Destinação */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinação</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a destinação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyDestination.RESIDENCIAL}>
                          {propertyDestinationLabels[PropertyDestination.RESIDENCIAL]}
                        </SelectItem>
                        <SelectItem value={PropertyDestination.COMERCIAL}>
                          {propertyDestinationLabels[PropertyDestination.COMERCIAL]}
                        </SelectItem>
                        <SelectItem value={PropertyDestination.INDUSTRIAL}>
                          {propertyDestinationLabels[PropertyDestination.INDUSTRIAL]}
                        </SelectItem>
                        <SelectItem value={PropertyDestination.RURAL}>
                          {propertyDestinationLabels[PropertyDestination.RURAL]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status de Construção */}
              <FormField
                control={form.control}
                name="constructionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status de Construção</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyConstructionStatus.READY}>
                          {propertyConstructionStatusLabels[PropertyConstructionStatus.READY]}
                        </SelectItem>
                        <SelectItem value={PropertyConstructionStatus.UNDER_CONSTRUCTION}>
                          {propertyConstructionStatusLabels[PropertyConstructionStatus.UNDER_CONSTRUCTION]}
                        </SelectItem>
                        <SelectItem value={PropertyConstructionStatus.LAUNCH}>
                          {propertyConstructionStatusLabels[PropertyConstructionStatus.LAUNCH]}
                        </SelectItem>
                        <SelectItem value={PropertyConstructionStatus.PRE_LAUNCH}>
                          {propertyConstructionStatusLabels[PropertyConstructionStatus.PRE_LAUNCH]}
                        </SelectItem>
                        <SelectItem value={PropertyConstructionStatus.FINISHING}>
                          {propertyConstructionStatusLabels[PropertyConstructionStatus.FINISHING]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo de Lançamento */}
              <FormField
                control={form.control}
                name="launchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Lançamento</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyLaunchType.VERTICAL}>
                          {propertyLaunchTypeLabels[PropertyLaunchType.VERTICAL]}
                        </SelectItem>
                        <SelectItem value={PropertyLaunchType.HORIZONTAL}>
                          {propertyLaunchTypeLabels[PropertyLaunchType.HORIZONTAL]}
                        </SelectItem>
                        <SelectItem value={PropertyLaunchType.LOTS}>
                          {propertyLaunchTypeLabels[PropertyLaunchType.LOTS]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Posição do Imóvel */}
              <FormField
                control={form.control}
                name="propertyPositionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição do Imóvel</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === field.value ? '' : value);
                      }}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a posição" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PropertyPositionType.FRONT}>
                          {propertyPositionTypeLabels[PropertyPositionType.FRONT]}
                        </SelectItem>
                        <SelectItem value={PropertyPositionType.BACK}>
                          {propertyPositionTypeLabels[PropertyPositionType.BACK]}
                        </SelectItem>
                        <SelectItem value={PropertyPositionType.MIDDLE}>
                          {propertyPositionTypeLabels[PropertyPositionType.MIDDLE]}
                        </SelectItem>
                        <SelectItem value={PropertyPositionType.SIDE}>
                          {propertyPositionTypeLabels[PropertyPositionType.SIDE]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-4">
                {/* Região */}
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Região</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a região" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sub-região */}
                <FormField
                  control={form.control}
                  name="subRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-região</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a sub-região" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Zona de Uso */}
                <FormField
                  control={form.control}
                  name="usageZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zona de Uso</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a zona de uso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Localizações-Chave */}
              <FormField
                control={form.control}
                name="keyLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização da Chave</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a localização da chave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {/* Data Início Cadastro */}
                <FormField
                  control={form.control}
                  name="registrationStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Início Cadastro</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data Fim Cadastro */}
                <FormField
                  control={form.control}
                  name="registrationEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fim Cadastro</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Checkboxes de status */}
              <div className="space-y-3">
                <FormLabel>Status do Imóvel</FormLabel>
                <div className="grid md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="isHighlighted"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Destacado</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Disponível</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAvailableForRent"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Disponível para Alugar</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptsPermuta"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Aceita Permuta</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="displayedOnPortal"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Exibido em Portal</Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="internetPublication"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="cursor-pointer font-normal">Publicação na Internet</Label>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Valor do Imóvel */}
                <FormField
                  control={form.control}
                  name="propertyValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (máx)</FormLabel>
                      <FormControl>
                        <CurrencyInput {...field} placeholder="R$ 0,00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Área */}
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m² máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Área Interna */}
                <FormField
                  control={form.control}
                  name="internalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Interna (m² máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Área Externa */}
                <FormField
                  control={form.control}
                  name="externalArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área Externa (m² máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Área do Lote */}
                <FormField
                  control={form.control}
                  name="lotArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área do Lote (m² máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Quartos */}
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos (máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Suítes */}
                <FormField
                  control={form.control}
                  name="suites"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suítes (máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Características do Imóvel */}
              <FormField
                control={form.control}
                name="featureUuids"
                render={({ field }) => {
                  const handleAddFeature = (featureUuid: string) => {
                    field.onChange([...field.value, featureUuid]);
                  };

                  const handleRemoveFeature = (featureUuid: string) => {
                    field.onChange(field.value.filter((uuid) => uuid !== featureUuid));
                  };

                  const availableFeatures = propertyFeatures.filter((feature) => !field.value?.includes(feature.uuid));

                  return (
                    <FormItem>
                      <FormLabel>Características do Imóvel</FormLabel>
                      <div>
                        {/* Características selecionadas */}
                        {field.value?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {field.value.map((featureUuid) => {
                              const feature = propertyFeatures.find((f) => f.uuid === featureUuid);
                              if (!feature) return null;

                              return (
                                <Badge key={feature.uuid} variant="secondary" className="gap-1">
                                  {feature.name}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(feature.uuid)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        )}

                        {/* Select para adicionar características */}
                        {availableFeatures.length > 0 && (
                          <Select onValueChange={handleAddFeature} value="">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione característica" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFeatures.map((feature) => (
                                <SelectItem key={feature.uuid} value={feature.uuid}>
                                  {feature.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {/* Banheiros */}
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros (máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Vagas de Garagem */}
                <FormField
                  control={form.control}
                  name="garageSpots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas (máx)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="" />

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
