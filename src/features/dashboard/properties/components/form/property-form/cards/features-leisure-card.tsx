import { X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getPropertyFeatures } from '@/features/dashboard/properties/api/property-feature';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

import { FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

import { PropertyFeatureType } from '@/shared/types';

import { Badge } from '@/shared/components/ui/badge';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function FeaturesLeisureCard({ form }: DataCardProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: propertyFeatures = [] } = useQuery({
    queryKey: ['property-features', pagination, PropertyFeatureType.LEISURE],
    queryFn: () => getPropertyFeatures(pagination, '', PropertyFeatureType.LEISURE),
  });

  return (
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
  );
}
