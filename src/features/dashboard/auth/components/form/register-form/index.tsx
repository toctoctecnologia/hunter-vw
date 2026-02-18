'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/shims/next-navigation';
import { useState } from 'react';

import { getURL } from '@/shared/lib/utils';

import { registerSchema, RegisterFormData } from '@/features/dashboard/auth/components/form/register-form/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { GoogleSignInButton } from '@/shared/components/google-sign-in-button';
import { TypographySmall } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { createClient } from '@/shared/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface RegisterFormProps {
  inviteId?: string;
  inviteEmail?: string;
}

export function RegisterForm({ inviteId, inviteEmail }: RegisterFormProps) {
  const navigate = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: inviteEmail || '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    const supabase = createClient();
    setIsLoading(true);
    try {
      await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: getURL(),
          data: inviteId ? { inviteId } : undefined,
        },
      });
      navigate.push('/auth/sign-up-success');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 mb-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@empresa.com" icon={Mail} {...field} disabled={!!inviteEmail} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Digite sua senha"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    className="pr-11"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
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
              <FormLabel>Confirme a senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Confirme sua senha"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    className="pr-11"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
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

        <Button isLoading={isLoading} type="submit" className="w-full text-sm sm:text-base py-2 sm:py-3">
          Cadastrar
        </Button>
      </form>

      <GoogleSignInButton />

      <Separator className="my-4" />

      <div className="flex gap-1 items-center justify-center">
        <TypographySmall>Já possui uma conta?</TypographySmall>
        <button
          type="button"
          className="text-xs sm:text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => navigate.push('/')}
        >
          Entrar agora
        </button>
      </div>
    </Form>
  );
}
