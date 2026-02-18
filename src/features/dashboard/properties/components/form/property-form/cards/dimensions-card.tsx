import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { removeNonNumeric } from '@/shared/lib/masks';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function DimensionsCard({ form }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Dimensões" />

      <CardContent className="grid sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="dimension.internalArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área Interna (m²) *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimension.externalArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área Externa (m²) *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimension.lotArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área do Lote (m²) *</FormLabel>
              <FormControl>
                <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
