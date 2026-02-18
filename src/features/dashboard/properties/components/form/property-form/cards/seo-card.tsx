import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { Textarea } from '@/shared/components/ui/textarea';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function SeoCard({ form }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Conteúdo & SEO" />

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="info.adTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título para Anúncio</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Apartamento 3 quartos em Copacabana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.adDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição para anúncio</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o imóvel para o anúncio..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="info.metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta descrição para SEO</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição otimizada para SEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
