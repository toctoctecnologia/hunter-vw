import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

import { checkCnpjUnique, lookupCnpj } from '@/api/onboarding';
import { digitsOnly, isValidCNPJ } from '@/lib/validators/doc';

import type { OnboardingPessoaJuridica } from './types';

const stepEmpresaPJSchema = z
  .object({
    companyName: z.string().min(3, 'Informe a razão social.'),
    tradeName: z.string().min(2, 'Informe o nome fantasia.'),
    cnpj: z
      .string()
      .min(1, 'Informe o CNPJ.')
      .transform(digitsOnly)
      .refine(isValidCNPJ, {
        message: 'Informe um CNPJ válido.'
      }),
    stateRegistration: z.string().min(3, 'Informe a inscrição estadual ou isento.'),
    municipalRegistration: z.string().min(2, 'Informe a inscrição municipal.'),
    branchType: z.enum(['matriz', 'filial']),
    parentCompanyName: z.string().optional(),
    parentCompanyDocument: z.string().optional(),
    numberOfUnits: z.string().min(1, 'Informe quantas unidades sua rede possui.'),
    website: z
      .string()
      .optional()
      .refine((value) => !value || /^https?:\/\//i.test(value), {
        message: 'Informe uma URL válida iniciando com http:// ou https://.'
      })
  })
  .refine(
    (values) => {
      if (values.branchType === 'filial') {
        return Boolean(values.parentCompanyName && values.parentCompanyDocument);
      }
      return true;
    },
    {
      message: 'Informe os dados da matriz responsável.',
      path: ['parentCompanyName']
    }
  );

export type StepEmpresaPJValues = z.infer<typeof stepEmpresaPJSchema>;

interface StepEmpresaPJProps {
  defaultValues: OnboardingPessoaJuridica;
  onBack: () => void;
  onSubmit: (values: StepEmpresaPJValues) => void;
}

export function StepEmpresaPJ({ defaultValues, onBack, onSubmit }: StepEmpresaPJProps) {
  const form = useForm<StepEmpresaPJValues>({
    resolver: zodResolver(stepEmpresaPJSchema),
    defaultValues
  });

  const [isCheckingCnpj, setIsCheckingCnpj] = useState(false);
  const [cnpjHelper, setCnpjHelper] = useState<string | null>(null);

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const branchType = form.watch('branchType');
  const cnpjValue = form.watch('cnpj');

  useEffect(() => {
    const numericCnpj = digitsOnly(cnpjValue ?? '');
    if (numericCnpj.length < 14) {
      setCnpjHelper(null);
      form.clearErrors('cnpj');
    }
  }, [cnpjValue, form]);

  const handleCnpjBlur = useCallback(
    async (rawValue: string) => {
      const numericCnpj = digitsOnly(rawValue);
      if (numericCnpj.length !== 14 || !isValidCNPJ(numericCnpj)) {
        return;
      }

      setIsCheckingCnpj(true);
      try {
        const [{ isUnique, reason }, lookup] = await Promise.all([
          checkCnpjUnique(numericCnpj),
          lookupCnpj(numericCnpj)
        ]);

        if (!isUnique) {
          form.setError('cnpj', {
            type: 'manual',
            message: 'Este CNPJ já está cadastrado em nossa base.'
          });
          setCnpjHelper(reason ?? 'Entre em contato com o suporte para liberar um novo acesso.');
          return;
        }

        form.clearErrors('cnpj');

        if (lookup) {
          form.setValue('companyName', lookup.companyName, { shouldDirty: true });
          form.setValue('tradeName', lookup.tradeName, { shouldDirty: true });
          form.setValue('stateRegistration', lookup.stateRegistration, { shouldDirty: true });
          form.setValue('municipalRegistration', lookup.municipalRegistration, { shouldDirty: true });
          form.setValue('branchType', lookup.branchType, { shouldDirty: true });
          form.setValue('numberOfUnits', lookup.numberOfUnits, { shouldDirty: true });

          if (lookup.parentCompanyName) {
            form.setValue('parentCompanyName', lookup.parentCompanyName, { shouldDirty: true });
          }
          if (lookup.parentCompanyDocument) {
            form.setValue('parentCompanyDocument', lookup.parentCompanyDocument, { shouldDirty: true });
          }
          if (lookup.website) {
            form.setValue('website', lookup.website, { shouldDirty: true });
          }

          setCnpjHelper('Preenchemos os dados automaticamente com base na consulta pública.');
        } else {
          setCnpjHelper('Não encontramos dados públicos para este CNPJ.');
        }
      } catch (error) {
        console.error('Erro ao consultar CNPJ', error);
        setCnpjHelper('Não foi possível consultar o CNPJ agora. Tente novamente mais tarde.');
      } finally {
        setIsCheckingCnpj(false);
      }
    },
    [form]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Dados da empresa</h2>
        <p className="text-sm text-muted-foreground">
          Precisamos de algumas informações para preparar o contrato e liberar os acessos da sua equipe.
        </p>
      </div>

      <Alert className="border-l-4 border-l-slate-500 bg-slate-50 text-slate-900">
        <AlertTitle>Filiais têm atenção especial</AlertTitle>
        <AlertDescription>
          Caso seja uma filial, preencha os dados da matriz para que possamos conectar as operações e habilitar o painel consolidado.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razão social</FormLabel>
                <Input placeholder="Nome da Imobiliária LTDA" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tradeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome fantasia</FormLabel>
                  <Input placeholder="Imobiliária Exemplo" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <Input
                    inputMode="numeric"
                    placeholder="00000000000000"
                    {...field}
                    onBlur={async (event) => {
                      field.onBlur();
                      await handleCnpjBlur(event.target.value);
                    }}
                  />
                  {isCheckingCnpj ? (
                    <FormDescription>Consultando dados do CNPJ...</FormDescription>
                  ) : cnpjHelper ? (
                    <FormDescription>{cnpjHelper}</FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="stateRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição estadual</FormLabel>
                  <Input placeholder="000.000.000.000" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="municipalRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição municipal</FormLabel>
                  <Input placeholder="000000" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="branchType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de operação</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="mt-2 grid gap-4 md:grid-cols-2"
                >
                  {[
                    { value: 'matriz', label: 'Matriz', description: 'Centraliza dados e acompanha todas as filiais.' },
                    { value: 'filial', label: 'Filial', description: 'Opera conectada a uma matriz já cadastrada.' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`branch-${option.value}`}
                      className={cn(
                        'cursor-pointer rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-orange-300 hover:shadow-md',
                        field.value === option.value ? 'border-orange-500 ring-2 ring-orange-100' : 'border-border'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        <RadioGroupItem id={`branch-${option.value}`} value={option.value} className="border-orange-500" />
                      </div>
                    </label>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />

          {branchType === 'filial' ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="parentCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da matriz</FormLabel>
                    <Input placeholder="Nome da Imobiliária Matriz" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentCompanyDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ da matriz</FormLabel>
                    <Input inputMode="numeric" placeholder="00000000000000" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="numberOfUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de unidades</FormLabel>
                  <Input placeholder="Ex: 4" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site institucional (opcional)</FormLabel>
                  <Input placeholder="https://suaimobiliaria.com.br" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit" size="lg" className="px-8">
              Continuar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default StepEmpresaPJ;
