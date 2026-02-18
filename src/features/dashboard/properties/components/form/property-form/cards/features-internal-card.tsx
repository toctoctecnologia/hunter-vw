import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getPropertyFeatures } from '@/features/dashboard/properties/api/property-feature';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { removeNonNumeric } from '@/shared/lib/masks';
import { PropertyFeatureType } from '@/shared/types';

import { Input } from '@/shared/components/ui/input';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { Badge } from '@/shared/components/ui/badge';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function FeaturesInternalCard({ form }: DataCardProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: propertyFeatures = [] } = useQuery({
    queryKey: ['property-features', pagination, PropertyFeatureType.INTERNAL],
    queryFn: () => getPropertyFeatures(pagination, '', PropertyFeatureType.INTERNAL),
  });

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="feature.rooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quartos *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feature.suites"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suítes *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feature.bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banheiros *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="feature.livingRooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salas *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feature.balconies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Varandas *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feature.floorFinish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Piso/Acabamento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feature.propertyPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posição do Imóvel</FormLabel>
              <FormControl>
                <Input {...field} />
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
