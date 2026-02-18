import { UseFormReturn } from 'react-hook-form';

import { normalizeCnpjNumber } from '@/shared/lib/masks';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

interface CompanyFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
}

export function CompanyForm({ form }: CompanyFormProps) {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Dados da empresa</h2>
        <p className="text-sm text-muted-foreground">
          Precisamos de algumas informações para preparar o contrato e liberar os acessos da sua equipe.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="companyAccountInfo.socialReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão social *</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Imobiliária LTDA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome fantasia</FormLabel>
                <FormControl>
                  <Input placeholder="Imobiliária Exemplo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyAccountInfo.federalDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ *</FormLabel>
                <FormControl>
                  <Input placeholder="00.000.000/0000-00" {...field} value={normalizeCnpjNumber(field.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyAccountInfo.stateRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição estadual</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000.000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyAccountInfo.municipalRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inscrição municipal</FormLabel>
                <FormControl>
                  <Input placeholder="000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyAccountInfo.unitAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de unidades</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyAccountInfo.website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site institucional</FormLabel>
                <FormControl>
                  <Input placeholder="https://suaimobiliaria.com.br" {...field} />
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
