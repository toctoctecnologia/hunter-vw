import { UseFormReturn } from 'react-hook-form';

import { normalizePhoneNumber } from '@/shared/lib/masks';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';

interface AdminFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
}

export function AdminForm({ form }: AdminFormProps) {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Responsável pela conta</h2>
        <p className="text-sm text-muted-foreground">
          Esses dados serão utilizados para o primeiro acesso e para comunicações importantes do Hunter.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <FormField
          control={form.control}
          name="userInformation.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Ana Ribeiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="userInformation.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input placeholder="(19) 99999-9999" {...field} value={normalizePhoneNumber(field.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userInformation.ocupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo *</FormLabel>
                <FormControl>
                  <Input placeholder="Diretora comercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="userInformation.complianceTermsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-secondary p-4">
              <FormControl>
                <Checkbox checked={field.value as boolean} onCheckedChange={(checked) => field.onChange(checked)} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-sm font-normal">Aceito os termos de uso e política de privacidade</FormLabel>
                <TypographyMuted>
                  Concordo em seguir as diretrizes do Hunter e estou ciente da utilização dos meus dados para fins
                  contratuais.{' '}
                  <a
                    href="https://huntercrm.com.br/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    Visualizar termos.
                  </a>
                </TypographyMuted>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userInformation.marketingTermsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-lg border bg-secondary p-4">
              <FormControl>
                <Checkbox checked={field.value as boolean} onCheckedChange={(checked) => field.onChange(checked)} />
              </FormControl>
              <div className="space-y-1">
                <FormLabel className="text-sm font-normal">Quero receber novidades e materiais exclusivos</FormLabel>
                <TypographyMuted>
                  Conteúdos sobre marketing imobiliário, performance e melhores práticas enviados quinzenalmente.
                </TypographyMuted>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
