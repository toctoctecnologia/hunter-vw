'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';

import { EMAIL_CONTACT } from '@/shared/constants';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Button } from '@/shared/components/ui/button';

const deletionSchema = z
  .object({
    email: z.string().email('E-mail inválido'),
    confirmEmail: z.string().email('E-mail inválido'),
    confirmDeletion: z.boolean().refine((val) => val === true, {
      message: 'Você precisa confirmar que leu e entendeu as consequências',
    }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Os e-mails não coincidem',
    path: ['confirmEmail'],
  });

type DeletionFormValues = z.infer<typeof deletionSchema>;

export function AccountDeletionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<DeletionFormValues>({
    resolver: zodResolver(deletionSchema),
    defaultValues: {
      email: '',
      confirmEmail: '',
      confirmDeletion: false,
    },
  });

  const onSubmit = async (data: DeletionFormValues) => {
    setIsSubmitting(true);
    try {
      // await api.post('/account/deletion-request', {
      //   email: data.email,
      // });
      setIsSuccess(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar solicitação. Tente novamente.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Solicitação Recebida</CardTitle>
          <CardDescription>Sua solicitação de exclusão de conta foi recebida com sucesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Próximos Passos</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>
                Enviamos um e-mail de confirmação para <strong>{form.getValues('email')}</strong>.
              </p>
              <p>
                Por favor, verifique sua caixa de entrada e clique no link de confirmação para completar o processo de
                exclusão.
              </p>
              <p className="mt-4 font-medium">
                Sua conta será permanentemente excluída em até 30 dias após a confirmação.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trash2 className="h-6 w-6" />
            Exclusão de Conta
          </CardTitle>
          <CardDescription>Solicite a exclusão permanente da sua conta Hunter CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção: Esta ação é permanente</AlertTitle>
            <AlertDescription>
              A exclusão da conta é irreversível. Todos os seus dados serão removidos permanentemente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etapas do Processo de Exclusão</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Preencha o formulário</p>
                <p className="text-sm text-muted-foreground">
                  Informe o e-mail da conta que deseja excluir e confirme sua decisão.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Verifique seu e-mail</p>
                <p className="text-sm text-muted-foreground">
                  Você receberá um e-mail de confirmação. Clique no link para confirmar a exclusão.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Período de retenção</p>
                <p className="text-sm text-muted-foreground">
                  Após a confirmação, sua conta entrará em um período de exclusão de 30 dias, durante o qual você ainda
                  poderá cancelar a solicitação.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                4
              </div>
              <div>
                <p className="font-medium">Exclusão permanente</p>
                <p className="text-sm text-muted-foreground">
                  Após 30 dias, todos os seus dados serão permanentemente excluídos de nossos sistemas.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados que Serão Excluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Informações pessoais</p>
                <p className="text-sm text-muted-foreground">
                  Nome, e-mail, telefone, CPF/CNPJ e outras informações de perfil.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Dados de imóveis</p>
                <p className="text-sm text-muted-foreground">
                  Todos os imóveis cadastrados, fotos, descrições e documentos associados.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Histórico de vendas e negociações</p>
                <p className="text-sm text-muted-foreground">
                  Todos os registros de vendas, propostas e comunicações com clientes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Configurações e preferências</p>
                <p className="text-sm text-muted-foreground">
                  Todas as configurações da conta, integrações e preferências do sistema.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Dados de autenticação</p>
                <p className="text-sm text-muted-foreground">
                  Credenciais de login, incluindo autenticação via Google Sign-In.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados Mantidos (Por Obrigação Legal)</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2 text-sm">
              <p>
                Conforme exigido pela legislação brasileira (Lei 12.965/2014 - Marco Civil da Internet e LGPD), alguns
                dados podem ser mantidos por até <strong>6 meses após a exclusão</strong> para fins de:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Exercício regular de direitos em processos judiciais</li>
                <li>Registros de acesso e logs de segurança</li>
                <li>Dados fiscais e de transações financeiras</li>
              </ul>
              <p className="mt-4">
                Após esse período, todos os dados remanescentes serão permanentemente excluídos de nossos sistemas,
                incluindo backups.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solicitar Exclusão de Conta</CardTitle>
          <CardDescription>Preencha os campos abaixo para iniciar o processo de exclusão</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail da Conta</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme o E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmDeletion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Li e entendi que esta ação é irreversível e todos os meus dados serão permanentemente excluídos
                        após 30 dias.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" variant="destructive" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Processando...' : 'Solicitar Exclusão'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Precisa de Ajuda?</AlertTitle>
            <AlertDescription>
              Se você tiver dúvidas sobre o processo de exclusão de conta ou precisar de assistência, entre em contato
              com nosso suporte através do e-mail{' '}
              <a href={`mailto:${EMAIL_CONTACT}`} className="font-medium underline">
                {EMAIL_CONTACT}
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
