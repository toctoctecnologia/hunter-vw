'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/shims/next-navigation';
import { Camera, CheckCircle, ExternalLink, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';

import { toast } from 'sonner';
import { z } from 'zod';

import {
  getMetrics,
  removeUserImage,
  updateContactInfo,
  uploadUserImage,
} from '@/features/dashboard/profile/api/user-profile';

import { createClient } from '@/shared/lib/supabase/client';
import { normalizePhoneNumber } from '@/shared/lib/masks';
import { getURL, getUserNameInitials } from '@/shared/lib/utils';

import { Modal } from '@/shared/components/ui/modal';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

import { useAuth } from '@/shared/hooks/use-auth';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { TwoFactorConfig } from '@/features/dashboard/profile/components/two-factor-config';
import { WatermarkConfig } from '@/features/dashboard/profile/components/watermark-config';
import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { RouletteConfig } from '@/features/dashboard/profile/components/roulette-config';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

const contactFormSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(14, 'Telefone inválido'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ProfileInfo() {
  const queryClient = useQueryClient();
  const { user, refreshUserInformation } = useAuth();
  const router = useRouter();

  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleResetPassword = async () => {
    const email = user?.userInfo.email;
    if (!email) return;

    setIsResettingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getURL('auth/reset-password'),
      });

      if (error) {
        toast.error(error.message);
      } else {
        setShowResetPasswordModal(true);
      }
    } catch {
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.userInfo?.name || '',
      phone: '',
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: mutateUploadImage, isPending: isUploadingImage } = useMutation({
    mutationFn: (file: File) => uploadUserImage(file),
    onSuccess: () => {
      toast.success('Foto de perfil atualizada com sucesso');
      refreshUserInformation();
    },
  });

  const { mutate: mutateRemoveImage, isPending: isRemovingImage } = useMutation({
    mutationFn: () => removeUserImage(),
    onSuccess: () => {
      toast.success('Foto de perfil removida com sucesso');
      refreshUserInformation();
    },
  });

  const { data: userProfileMetrics } = useQuery({
    queryKey: ['user-profile-metrics'],
    queryFn: () => getMetrics(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormValues) => updateContactInfo(data.name, data.phone),
    onSuccess: () => {
      toast.success('Dados de contato atualizados com sucesso');
      queryClient.invalidateQueries({ queryKey: ['user-information'] });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de imagem inválido. Use JPEG, PNG ou WebP');
      return;
    }

    mutateUploadImage(file);
    e.target.value = '';
  };

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
      <div className="flex flex-col items-center justify-center text-center my-6">
        <div className="relative mb-4">
          <Avatar className="size-20">
            {user?.userInfo.profilePictureUrl ? (
              <AvatarImage src={user?.userInfo.profilePictureUrl} alt={user?.userInfo.name} />
            ) : (
              <AvatarFallback className="text-lg">{getUserNameInitials(user?.userInfo.name || '-')}</AvatarFallback>
            )}
          </Avatar>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            type="button"
            disabled={isUploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-50"
          >
            <Camera className="size-3.5" />
          </button>
        </div>

        <h2 className="text-xl font-semibold">{user?.userInfo.name || '-'}</h2>
        <TypographyMuted>{user?.userInfo.profile.name}</TypographyMuted>

        {user?.userInfo.profilePictureUrl && (
          <button
            type="button"
            disabled={isRemovingImage}
            onClick={() => mutateRemoveImage()}
            className="my-2 flex items-center gap-1 text-xs text-destructive transition hover:text-destructive/80 disabled:opacity-50"
          >
            <Trash2 className="size-3" />
            Remover foto
          </button>
        )}

        <TypographyMuted>Versão 1.0.0</TypographyMuted>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProfileMetrics?.activeLeads}</div>
                  <TypographyMuted>Leads ativos</TypographyMuted>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProfileMetrics?.soldPropertiesAmount}</div>
                  <TypographyMuted>Imóveis vendidos</TypographyMuted>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  disabled={isResettingPassword}
                  className="text-xs sm:text-sm font-medium text-primary transition hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                  onClick={handleResetPassword}
                >
                  {isResettingPassword ? 'Enviando...' : 'Redefinir minha senha'}
                </button>

                <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
                  Atualizar Dados
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <WatermarkConfig />

        <RouletteConfig />

        <TwoFactorConfig />

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

      <Modal title="" open={showResetPasswordModal} onClose={() => setShowResetPasswordModal(false)}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">E-mail enviado!</h3>
            <p className="text-sm text-muted-foreground mt-1">Verifique sua caixa de entrada</p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm text-muted-foreground">
                Enviamos um link para redefinir sua senha para <strong>{user?.userInfo.email}</strong>. Verifique sua
                caixa de entrada e spam.
              </p>
            </AlertDescription>
          </Alert>

          <Button className="w-full" onClick={() => setShowResetPasswordModal(false)}>
            Entendi
          </Button>
        </div>
      </Modal>
    </>
  );
}
