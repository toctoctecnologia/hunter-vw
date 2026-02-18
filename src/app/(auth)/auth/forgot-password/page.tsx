'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { z } from 'zod';

import { createClient } from '@/shared/lib/supabase/client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { TypographyH2, TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { getURL } from '@/shared/lib/utils';

const forgotPasswordSchema = z.object({
  email: z.email('Digite um e-mail válido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(formData: ForgotPasswordFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: getURL('auth/reset-password'),
      });

      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <TypographyH2>E-mail enviado!</TypographyH2>
              <TypographyMuted className="text-muted-foreground mt-4">Verifique sua caixa de entrada</TypographyMuted>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <TypographyMuted>
                  Enviamos um link para redefinir sua senha para {form.getValues('email')}. Verifique sua caixa de
                  entrada e spam.
                </TypographyMuted>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false);
                  form.reset();
                }}
              >
                Enviar para outro e-mail
              </Button>

              <Button variant="ghost" className="w-full" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <TypographyH2>Esqueci minha senha</TypographyH2>
          <TypographyMuted className="mt-4">
            Digite seu e-mail e enviaremos um link para redefinir sua senha
          </TypographyMuted>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@empresa.com" icon={Mail} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full">
                Enviar link de redefinição
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-1 inline" />
              Voltar
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
