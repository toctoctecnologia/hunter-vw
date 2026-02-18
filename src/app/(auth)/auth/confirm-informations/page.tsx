import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CheckCircle2, Clock, Mail, Phone, Shield, User } from 'lucide-react';

import { api } from '@/shared/lib/api';

import { formatDate } from '@/shared/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PublicHeader } from '@/shared/components/layout/public-header';
import { LoadingFull } from '@/shared/components/loading-full';
import { Button } from '@/shared/components/ui/button';

const queryClient = new QueryClient();

interface InviteInformation {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  profileId: number;
  profileName: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
}

function ConfirmInformationsContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get('inviteId');

  const [inviteInfo, setInviteInfo] = useState<InviteInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInviteInfo = async () => {
      try {
        const { data } = await api.get(`user/invite?inviteId=${inviteId}`);
        setInviteInfo(data);
      } catch {
        setError('Convite inválido ou expirado');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInviteInfo();
  }, [inviteId]);

  const handleAcceptInvite = async () => {
    if (!inviteId) return;

    setIsAccepting(true);
    try {
      const supabase = (await import('@/shared/lib/supabase/client')).createClient();

      await api.post(`user/invite/accept?inviteId=${inviteId}`);

      await supabase.auth.updateUser({ data: { inviteId: null } });
      await supabase.auth.refreshSession();

      window.location.href = '/dashboard';
    } catch {
      setError('Erro ao aceitar convite. Tente novamente.');
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return <LoadingFull title="Carregando informações do convite..." />;
  }

  if (error || !inviteInfo) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Erro</CardTitle>
          <CardDescription>{error || 'Não foi possível carregar as informações do convite'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/')} className="w-full">
            Voltar para login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (inviteInfo.isExpired) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Convite Expirado</CardTitle>
          <CardDescription>Este convite expirou e não pode mais ser utilizado.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={async () => {
              const supabase = (await import('@/shared/lib/supabase/client')).createClient();
              await supabase.auth.signOut();
              navigate('/');
            }}
            className="w-full"
          >
            Voltar para login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          Confirme suas informações
        </CardTitle>
        <CardDescription>Revise os dados do convite antes de confirmar seu cadastro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/40">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-base font-semibold">{inviteInfo.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/40">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">E-mail</p>
              <p className="text-base font-semibold">{inviteInfo.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/40">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p className="text-base font-semibold">{inviteInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/40">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Perfil</p>
              <p className="text-base font-semibold">{inviteInfo.profileName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border bg-muted/40">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Validade do convite</p>
              <p className="text-base font-semibold">{formatDate(inviteInfo.expiresAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate('/')} disabled={isAccepting} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleAcceptInvite} disabled={isAccepting} className="flex-1">
            {isAccepting ? 'Processando...' : 'Confirmar e acessar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFull title="Carregando..." />}>
      <PublicHeader title="Validar Convite" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <QueryClientProvider client={queryClient}>
          <ConfirmInformationsContent />
        </QueryClientProvider>
      </div>
    </Suspense>
  );
}
