import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { removeNonNumeric } from '@/shared/lib/masks';
import {
  PropertyConstructionStatus,
  PropertyDestination,
  PropertyLaunchType,
  PropertyPositionType,
  PropertyPurpose,
  PropertyReadinessStatus,
  PropertySecondaryType,
  PropertySignStatus,
  PropertySituation,
} from '@/shared/types';

import { getCondominiums } from '@/features/dashboard/properties/api/condominiums';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import {
  propertyConstructionStatusLabels,
  propertyLaunchTypeLabels,
  propertyPositionTypeLabels,
  signStatusLabels,
} from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function InfoCard({ form }: DataCardProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: condominiums = { content: [] }, isLoading: isLoadingCondominiums } = useQuery({
    queryKey: ['condominiums', pagination],
    queryFn: () => getCondominiums(pagination),
  });

  return (
    <Card>
      <CardHeader title="Dados do Imóvel" />

      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="info.destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destinação</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyDestination).map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination.replace(/_/g, ' ')}
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
            name="info.readinessStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status de Prontidão</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyReadinessStatus).map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination.replace(/_/g, ' ')}
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
            name="info.situation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertySituation).map((situation) => (
                      <SelectItem key={situation} value={situation}>
                        {situation.replace(/_/g, ' ')}
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
            name="info.purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finalidade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
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

          <FormField
            control={form.control}
            name="info.secondaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertySecondaryType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ')}
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
            name="info.keysAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Chaves</FormLabel>
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

          <FormField
            control={form.control}
            name="info.constructionStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status da Construção</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyConstructionStatus).map((constructionStatus) => (
                      <SelectItem key={constructionStatus} value={constructionStatus}>
                        {propertyConstructionStatusLabels[constructionStatus]}
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
            name="info.launchType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Lançamento</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyLaunchType).map((launchType) => (
                      <SelectItem key={launchType} value={launchType}>
                        {propertyLaunchTypeLabels[launchType]}
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
            name="info.propertyPositionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição do Imóvel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyPositionType).map((positionType) => (
                      <SelectItem key={positionType} value={positionType}>
                        {propertyPositionTypeLabels[positionType]}
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
            name="feature.keyLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização da Chave</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Imobiliária, Portaria, Com o proprietário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="info.access"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acesso</FormLabel>
                <FormControl>
                  <Input placeholder="Acesso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feature.area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área</FormLabel>
                <FormControl>
                  <Input placeholder="Área" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="info.garageLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização da Vaga</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Subsolo 2, vaga 45" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condominiumUuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condomínio</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  disabled={isLoadingCondominiums}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingCondominiums ? 'Carregando...' : 'Selecione o condomínio'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {condominiums.content.map((condominium) => (
                      <SelectItem key={condominium.uuid} value={condominium.uuid}>
                        {condominium.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="info.signAuthorized"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <Label className="cursor-pointer font-normal">Placa Autorizada</Label>
              </FormItem>
            )}
          />

          {form.watch('info.signAuthorized') && (
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="info.signStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da Placa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PropertySignStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {signStatusLabels[status]}
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
                name="info.signDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes da Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Placa instalada na fachada principal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
