import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function TagsCard({ form }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Tags do Imóvel" />

      <CardContent className="grid sm:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="info.isHighlighted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="isHighlighted" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isHighlighted">Destacar Imóvel</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="isAvailable" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isAvailable">Disponível</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.isAvailableForRent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="isAvailableForRent" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="isAvailableForRent">Disponível para Aluguel</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptsPermuta"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="acceptsPermuta" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="acceptsPermuta">Aceita Permuta</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayedOnPortal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="displayedOnPortal" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="displayedOnPortal">Exibir no Portal</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="internetPublication"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox id="internetPublication" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor="internetPublication">Publicação na Internet</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
