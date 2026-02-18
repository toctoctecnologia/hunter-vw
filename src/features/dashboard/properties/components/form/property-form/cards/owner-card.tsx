import { UseFormReturn } from 'react-hook-form';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function OwnerCard({ form }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Proprietário" />

      <CardContent className="grid sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="info.ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do proprietário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.ownerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone *</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
