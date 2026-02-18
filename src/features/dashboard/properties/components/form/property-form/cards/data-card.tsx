import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { removeNonNumeric } from '@/shared/lib/masks';
import { PropertyStatus, PropertyType } from '@/shared/types';

import { propertyTypeLabels } from '@/shared/lib/property-status';
import { propertyStatusToLabel } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
  showStatusSelect?: boolean;
}

export function DataCard({ form, showStatusSelect = false }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Tipo e Comissão" />

      <CardContent className="gap-4 space-y-4">
        {showStatusSelect && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Selecione o status atual</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PropertyStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {propertyStatusToLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="info.propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo do Imóvel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PropertyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {propertyTypeLabels[type]}
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
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comissão (%)</FormLabel>
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
      </CardContent>
    </Card>
  );
}
