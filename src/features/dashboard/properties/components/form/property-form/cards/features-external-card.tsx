import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getPropertyFeatures } from '@/features/dashboard/properties/api/property-feature';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { removeNonNumeric } from '@/shared/lib/masks';
import { PropertyFeatureType, PropertyGarageType } from '@/shared/types';

import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function FeaturesExternalCard({ form }: DataCardProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: propertyFeatures = [] } = useQuery({
    queryKey: ['property-features', pagination, PropertyFeatureType.EXTERNAL],
    queryFn: () => getPropertyFeatures(pagination, '', PropertyFeatureType.EXTERNAL),
  });

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="feature.garageSpots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vagas *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.garageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo da Vaga</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PropertyGarageType).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, ' ')}
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
          name="info.elevatorsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Elevadores</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.towersCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº torres/blocos</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.floorsCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº andares</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.unitsPerFloor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidades por andar</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.totalUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total unidades</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-4">
        <FormField
          control={form.control}
          name="featureUuids"
          render={({ field }) => {
            const handleToggleFeature = (featureUuid: string) => {
              if (field.value.includes(featureUuid)) {
                field.onChange(field.value.filter((uuid) => uuid !== featureUuid));
              } else {
                field.onChange([...field.value, featureUuid]);
              }
            };

            return (
              <FormItem>
                {propertyFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {propertyFeatures.map((feature) => {
                      const isSelected = field.value.includes(feature.uuid);
                      return (
                        <Badge
                          key={feature.uuid}
                          variant={isSelected ? 'default' : 'outline'}
                          className="cursor-pointer hover:opacity-80 transition-opacity p-2"
                          onClick={() => handleToggleFeature(feature.uuid)}
                        >
                          {feature.name}
                          {isSelected && <X className="ml-1 h-3 w-3" />}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </>
  );
}
