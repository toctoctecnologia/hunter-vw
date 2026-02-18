import { UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';

import { getDistricts } from '@/features/dashboard/properties/api/secondary-district';

import { removeNonNumeric } from '@/shared/lib/masks';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Input } from '@/shared/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';

import { PropertyFormData } from '@/features/dashboard/properties/components/form/property-form/schema';

interface DataCardProps {
  form: UseFormReturn<PropertyFormData>;
}

export function LocationCard({ form }: DataCardProps) {
  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });

  const { data: districts = [] } = useQuery({
    queryKey: ['districts', pagination],
    queryFn: () => getDistricts(pagination),
  });

  return (
    <Card>
      <CardHeader title="Localização" />

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Imóvel</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Casa Luxo com Piscina" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição completa</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhadamente o imóvel, suas características, localização, diferenciais..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="location.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado (UF) *</FormLabel>
                <FormControl>
                  <Input placeholder="SP" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Andar</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número do andar"
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
            name="location.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CEP"
                    {...field}
                    onChange={(e) => field.onChange(removeNonNumeric(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location.district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryDistrictUuid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro Secundário</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um bairro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.uuid} value={district.uuid}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location.unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Região</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Zona Sul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.subRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub-região</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Leste" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.usageZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zona de Uso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Comercial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyIdentifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificador Chave</FormLabel>
              <FormControl>
                <Input placeholder="Digite o identificador chave" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
