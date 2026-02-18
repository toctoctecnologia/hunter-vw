import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { Card, CardContent } from '@/shared/components/ui/card';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function ValuesCard({ form }: DataCardProps) {
  return (
    <Card>
      <CardHeader title="Valores" />

      <CardContent className="gap-4">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$) *</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="R$ 500.000,00"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="previousPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço anterior (R$) *</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="R$ 600.000,00"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iptuValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do IPTU (R$) *</FormLabel>
                <FormControl>
                  <CurrencyInput
                    placeholder="R$ 7.000,00"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment.paymentMethods"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formas de Pagamento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: À vista, parcelado, financiamento..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="payment.directWithOwner"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox id="directWithOwner" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="directWithOwner">Direto com Proprietário</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment.acceptsFinancing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox id="acceptsFinancing" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel htmlFor="acceptsFinancing">Aceita Financiamento</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
