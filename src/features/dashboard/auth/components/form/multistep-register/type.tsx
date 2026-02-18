import { UseFormReturn } from 'react-hook-form';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { TypographySmall } from '@/shared/components/ui/typography';

interface TypeFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
}

export function TypeForm({ form }: TypeFormProps) {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Qual é o tipo da sua operação?</h2>
        <p className="text-sm text-muted-foreground">
          Conte para a gente como sua imobiliária está estruturada para que possamos configurar as permissões e os
          recursos corretos.
        </p>
      </div>

      <Alert className="border-l-4 border-l-orange-500 not-dark:bg-orange-50">
        <AlertTitle>Por que perguntamos isso?</AlertTitle>
        <AlertDescription>
          Utilizamos o tipo de operação para liberar recursos exclusivos. Você pode atualizar essa informação depois nas
          configurações da conta.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="accountType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid gap-4 lg:grid-cols-2"
              >
                <FormItem>
                  <FormLabel
                    htmlFor="PF"
                    className="cursor-pointer rounded-xl border bg-card px-4 text-left shadow-sm transition hover:shadow-md border-border max-h-[250px]"
                  >
                    <Card className="border-none shadow-none h-full w-full">
                      <CardHeader className="p-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">Pessoa física</CardTitle>
                          <FormControl>
                            <RadioGroupItem value="PF" id="PF" className="border-primary" />
                          </FormControl>
                        </div>
                        <CardDescription>
                          Para corretores autônomos que precisam centralizar o funil e os clientes.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-col items-start p-0 text-sm text-muted-foreground">
                        <TypographySmall>
                          Ideal para quem está começando ou trabalha de forma independente.
                        </TypographySmall>
                        {field.value === 'PF' && (
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs mt-2 font-semibold text-orange-700">
                            Selecionado
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel
                    htmlFor="MATRIZ"
                    className="cursor-pointer rounded-xl border bg-card px-4 text-left shadow-sm transition hover:shadow-md border-border max-h-[250px]"
                  >
                    <Card className="border-none shadow-none h-full w-full">
                      <CardHeader className="p-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">Pessoa jurídica</CardTitle>
                          <FormControl>
                            <RadioGroupItem value="MATRIZ" id="MATRIZ" className="border-primary" />
                          </FormControl>
                        </div>
                        <CardDescription>
                          Permite cadastrar matriz e filiais, controlar equipe e acessar recursos avançados.
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-col items-start p-0 text-sm text-muted-foreground">
                        <TypographySmall>Ideal para empresas com múltiplas unidades e equipe.</TypographySmall>
                        {field.value === 'MATRIZ' && (
                          <span className="items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs mt-2 font-semibold text-orange-700">
                            Selecionado
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
