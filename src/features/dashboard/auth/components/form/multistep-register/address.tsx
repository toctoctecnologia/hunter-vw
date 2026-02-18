import { UseFormReturn } from 'react-hook-form';
import { useCallback } from 'react';

import { normalizeCepNumber, removeNonNumeric } from '@/shared/lib/masks';

import { useCEP } from '@/shared/hooks/use-cep';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

interface AddressFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
}

export function AddressForm({ form }: AddressFormProps) {
  const { handleGetCEPData } = useCEP();

  const handleSearchCEP = useCallback(
    async (cepValue: string) => {
      const response = await handleGetCEPData(removeNonNumeric(cepValue));

      if (response.error === false) {
        form.setValue('addressInfo.city', response.localidade ?? '');
        form.setValue('addressInfo.street', response.logradouro ?? '');
        form.setValue('addressInfo.state', response.uf ?? '');
        form.setValue('addressInfo.zipCode', response.cep ?? '');
        form.setValue('addressInfo.neighborhood', response.bairro ?? '');
      }
    },
    [form, handleGetCEPData],
  );

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Endereço</h2>
        <p className="text-sm text-muted-foreground">
          Informe seu endereço residencial ou da sua empresa, conforme aplicável.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addressInfo.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o CEP"
                    {...field}
                    onChange={(e) => {
                      field.onChange(normalizeCepNumber(e.target.value));
                      if (e.target.value.length === 8) handleSearchCEP(e.target.value);
                    }}
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
                <FormLabel>Rua *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a rua" {...field} />
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
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a cidade" {...field} />
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
                <FormLabel>Estado *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o estado" {...field} />
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
                <FormLabel>Número *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o número" {...field} />
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
                <FormLabel>Bairro *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do bairro" {...field} />
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
                  <Input placeholder="Digite o complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
