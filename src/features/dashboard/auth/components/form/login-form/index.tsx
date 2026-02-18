'use client';

import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { createClient } from '@/shared/lib/supabase/client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { loginSchema, LoginFormData } from '@/features/dashboard/auth/components/form/login-form/schema';
import { GoogleSignInButton } from '@/shared/components/google-sign-in-button';
import { TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface MfaState {
  factorId: string;
}

export function LoginForm() {
  const navigate = useRouter();
  const [mfaState, setMfaState] = useState<MfaState | null>(null);
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(formData: LoginFormData) {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { email, password } = formData;
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error('Credenciais inválidas');
        return;
      }

      // Check if MFA is required
      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (mfaData?.nextLevel === 'aal2' && mfaData?.currentLevel === 'aal1') {
        // MFA is required, get the TOTP factor
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const totpFactor = factorsData?.totp?.find((f) => f.status === 'verified');

        if (totpFactor) {
          setMfaState({ factorId: totpFactor.id });
          return;
        }
      }

      // No MFA required, proceed to dashboard
      navigate.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMfaVerify() {
    if (otp.length !== 6 || !mfaState) return;

    setIsVerifyingMfa(true);
    try {
      const supabase = createClient();

      // Create challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaState.factorId,
      });

      if (challengeError) {
        toast.error('Erro ao criar desafio de verificação');
        console.error('MFA challenge error:', challengeError);
        setIsVerifyingMfa(false);
        return;
      }

      // Verify the code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaState.factorId,
        challengeId: challengeData.id,
        code: otp,
      });

      if (verifyError) {
        toast.error('Código inválido. Tente novamente.');
        setOtp('');
        setIsVerifyingMfa(false);
        return;
      }

      // MFA verified, proceed to dashboard
      navigate.push('/dashboard');
    } catch (err) {
      console.error('MFA verification error:', err);
      toast.error('Erro ao verificar código');
    } finally {
      setIsVerifyingMfa(false);
    }
  }

  const handleBackToLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMfaState(null);
    setOtp('');
  };

  // MFA Verification View
  if (mfaState) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Verificação em Duas Etapas</h2>
            <TypographyMuted className="text-sm mt-1">
              Digite o código de 6 dígitos do seu aplicativo autenticador
            </TypographyMuted>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSeparator />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <TypographyMuted className="text-xs">O código é atualizado a cada 30 segundos</TypographyMuted>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleMfaVerify}
            disabled={otp.length !== 6 || isVerifyingMfa}
            isLoading={isVerifyingMfa}
            className="w-full"
          >
            Verificar
          </Button>

          <Button variant="ghost" onClick={handleBackToLogin} className="w-full" disabled={isVerifyingMfa}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Button>
        </div>
      </div>
    );
  }

  // Normal Login View
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
                <Input placeholder="john.doe@empresa.com" icon={Mail} {...field} />
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
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <button
                  type="button"
                  className="text-xs sm:text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => navigate.push('/auth/forgot-password')}
                >
                  Esqueci minha senha
                </button>
              </div>
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

        <Button type="submit" isLoading={isLoading} className="w-full text-sm sm:text-base py-2 sm:py-3">
          Entrar
        </Button>
      </form>

      <GoogleSignInButton />

      <Separator className="my-4" />

      <div className="flex gap-1 items-center justify-center">
        <TypographySmall>Ainda não possui uma conta?</TypographySmall>
        <button
          type="button"
          className="text-xs sm:text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => navigate.push('/auth/register')}
        >
          Comece aqui
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-xs text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          onClick={() => navigate.push('/privacy-policy')}
        >
          Política de Privacidade
        </button>
      </div>
    </Form>
  );
}
