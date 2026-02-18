import { UseFormReturn } from 'react-hook-form';
import { useCallback } from 'react';

import { normalizeCepNumber, normalizeCpfNumber, normalizePhoneNumber, removeNonNumeric } from '@/shared/lib/masks';

import { useCEP } from '@/shared/hooks/use-cep';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Input } from '@/shared/components/ui/input';

interface DataFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
}

export function DataForm({ form }: DataFormProps) {
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
        <h2 className="text-2xl font-semibold tracking-tight">Dados do corretor</h2>
        <p className="text-sm text-muted-foreground">
          Essas informações serão utilizadas para gerar o contrato, liberar o painel e comunicar novidades relevantes.
        </p>
      </div>

      <Alert className="border-l-4 border-l-emerald-500 not-dark:bg-emerald-50">
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          O CPF e o CRECI serão validados automaticamente. Caso identifiquemos alguma divergência, nosso time entrará em
          contato.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Maria Fernandes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="personalAccountInfo.federalDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} value={normalizeCpfNumber(field.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone com DDD</FormLabel>
                <FormControl>
                  <Input placeholder="(19) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail profissional</FormLabel>
                <FormControl>
                  <Input placeholder="nome@imobiliaria.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="personalAccountInfo.creci"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRECI</FormLabel>
                <FormControl>
                  <Input placeholder="XXXXX-F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="addressInfo.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
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
                <FormLabel>Rua</FormLabel>
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
                <FormLabel>Cidade</FormLabel>
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
                <FormLabel>Estado</FormLabel>
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
                <FormLabel>Número</FormLabel>
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
                <FormLabel>Bairro</FormLabel>
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
