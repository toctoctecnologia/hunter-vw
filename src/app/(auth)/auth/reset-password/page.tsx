'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';

import { createClient } from '@/shared/lib/supabase/client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { TypographyH2, TypographyP } from '@/shared/components/ui/typography';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setIsValidSession(false);
        setError('Link inválido ou expirado. Solicite uma nova redefinição de senha.');
      } else {
        setIsValidSession(true);
      }
    };

    checkSession();
  }, []);

  async function onSubmit(formData: ResetPasswordFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard'), 3000);
      }
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isValidSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <TypographyP className="mt-4 text-muted-foreground">Verificando link...</TypographyP>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isValidSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <TypographyH2>Link inválido</TypographyH2>
              <TypographyP className="text-muted-foreground">
                O link de redefinição de senha expirou ou é inválido
              </TypographyP>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push('/auth/forgot-password')}>
                Solicitar novo link
              </Button>

              <Button variant="outline" className="w-full" onClick={() => router.push('/')}>
                Voltar para o login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <TypographyH2>Senha redefinida!</TypographyH2>
              <TypographyP className="text-muted-foreground">Sua senha foi alterada com sucesso</TypographyP>
            </div>
          </CardHeader>

          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Você será redirecionado para o dashboard em alguns segundos...</AlertDescription>
            </Alert>

            <Button className="w-full mt-4" onClick={() => router.push('/dashboard')}>
              Ir para o dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <TypographyH2>Nova senha</TypographyH2>
          <TypographyP className="text-muted-foreground">Digite sua nova senha</TypographyP>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Digite sua nova senha"
                          icon={Lock}
                          type={showPassword ? 'text' : 'password'}
                          className="pr-11"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirme sua nova senha"
                          icon={Lock}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pr-11"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full">
                Redefinir senha
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
