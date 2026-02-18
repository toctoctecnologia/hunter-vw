'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/shims/next-navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateContactInfo } from '@/features/dashboard/profile/api/user-profile';

import { createClient } from '@/shared/lib/supabase/client';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { getUserNameInitials } from '@/shared/lib/utils';

import { useAuth } from '@/shared/hooks/use-auth';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import { TwoFactorDisableModal } from '@/shared/components/modal/two-factor-disable-modal';
import { TwoFactorSetupModal } from '@/shared/components/modal/two-factor-setup-modal';

import { ExternalLink } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(14, 'Telefone inválido'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ProfileInfo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.userInfo?.name || '',
      phone: '',
    },
  });

  // 2FA State
  const [showSetup2FAModal, setShowSetup2FAModal] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);

  // 2FA Query - fetch MFA factors
  const { data: mfaFactors, refetch: refetchMfaFactors } = useQuery({
    queryKey: ['mfa-factors'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        console.error('Error fetching MFA factors:', error);
        return null;
      }
      return data;
    },
  });

  const verifiedTotpFactor = mfaFactors?.totp?.find((f) => f.status === 'verified');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormValues) => updateContactInfo(data.name, data.phone),
    onSuccess: () => {
      toast.success('Dados de contato atualizados com sucesso');
      queryClient.invalidateQueries({ queryKey: ['user-information'] });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutate(data);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <TwoFactorSetupModal
        isOpen={showSetup2FAModal}
        onClose={() => setShowSetup2FAModal(false)}
        onSuccess={() => {
          refetchMfaFactors();
          setShowSetup2FAModal(false);
        }}
      />

      {verifiedTotpFactor && (
        <TwoFactorDisableModal
          isOpen={showDisable2FAModal}
          factorId={verifiedTotpFactor.id}
          onClose={() => setShowDisable2FAModal(false)}
          onSuccess={() => {
            refetchMfaFactors();
            setShowDisable2FAModal(false);
          }}
        />
      )}

      <div className="flex flex-col items-center justify-center text-center my-6">
        <div className="relative mb-4">
          <Avatar className="size-16">
            <AvatarFallback>{getUserNameInitials(user?.userInfo.name || '-')}</AvatarFallback>
          </Avatar>
        </div>

        <h2 className="text-xl font-semibold">{user?.userInfo.name || '-'}</h2>
        <TypographyMuted>{user?.userInfo.profile.name}</TypographyMuted>
        <TypographyMuted>Versão 1.0.0</TypographyMuted>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados de Contato</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
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
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => {
                            const formatted = normalizePhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="button"
                  className="text-xs sm:text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => router.push('/auth/forgot-password')}
                >
                  Esqueci minha senha
                </button>

                <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
                  Atualizar Dados
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
            <TypographyMuted>
              Adicione uma camada extra de segurança à sua conta usando um aplicativo autenticador
            </TypographyMuted>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Ativar 2FA</Label>
                <TypographyMuted className="text-xs">
                  {verifiedTotpFactor
                    ? 'Sua conta está protegida com autenticação de dois fatores'
                    : 'Use um aplicativo como Google Authenticator ou Authy para gerar códigos de verificação'}
                </TypographyMuted>
              </div>
              <Switch
                checked={!!verifiedTotpFactor}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setShowSetup2FAModal(true);
                  } else {
                    setShowDisable2FAModal(true);
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Termos e Políticas</CardTitle>
            <TypographyMuted>Consulte os termos de uso e política de privacidade do Hunter</TypographyMuted>
          </CardHeader>

          <CardContent>
            <a
              href="https://huntercrm.com.br/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
            >
              <div className="space-y-0.5">
                <Label>Termos de Uso e Política de Privacidade</Label>
                <TypographyMuted className="text-xs">
                  Clique para visualizar os termos de uso e política de privacidade do Hunter
                </TypographyMuted>
              </div>
              <ExternalLink className="size-5 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>

        <Button onClick={handleLogout} variant="destructive">
          Encerrar Sessão
        </Button>
      </div>
    </>
  );
}
