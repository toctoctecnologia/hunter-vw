'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { normalizeCnpjNumber, normalizeCepNumber } from '@/shared/lib/masks';

import { updateFiscalData } from '@/features/dashboard/payments/api/payment';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCEP } from '@/shared/hooks/use-cep';
import {
  fiscalDataSchema,
  type FiscalDataFormData,
} from '@/features/dashboard/payments/components/form/fiscal-data-schema';

export function FiscalData() {
  const { handleGetCEPData } = useCEP();

  const form = useForm<FiscalDataFormData>({
    resolver: zodResolver(fiscalDataSchema),
    defaultValues: {
      name: '',
      federalDocument: '',
      addressInfo: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateFiscalData,
    onSuccess: () => {
      toast.success('Dados fiscais atualizados com sucesso!');
    },
  });

  async function handleCepBlur(cepValue: string) {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    const data = await handleGetCEPData(cleanCep);
    if (data && !data.error) {
      form.setValue('addressInfo.street', data.logradouro ?? '', { shouldValidate: true });
      form.setValue('addressInfo.neighborhood', data.bairro ?? '', { shouldValidate: true });
      form.setValue('addressInfo.city', data.localidade ?? '', { shouldValidate: true });
      form.setValue('addressInfo.state', data.uf ?? '', { shouldValidate: true });
      if (data.complemento) {
        form.setValue('addressInfo.complement', data.complemento, { shouldValidate: true });
      }
    }
  }

  function onSubmit(data: FiscalDataFormData) {
    mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados fiscais</CardTitle>
        <CardDescription>Utilizados para emissão de notas fiscais</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão social</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa S.A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="federalDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                        {...field}
                        onChange={(e) => {
                          field.onChange(normalizeCnpjNumber(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        maxLength={9}
                        {...field}
                        onChange={(e) => {
                          field.onChange(normalizeCepNumber(e.target.value));
                        }}
                        onBlur={() => handleCepBlur(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="Número" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="addressInfo.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
