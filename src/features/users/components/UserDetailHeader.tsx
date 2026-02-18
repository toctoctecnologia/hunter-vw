'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserStatusSwitch from '@/components/users/UserStatusSwitch';
import { useToast } from '@/hooks/use-toast';
import {
  getUserDeactivationStatus,
  reactivateUser,
  type DeactivationStatus,
} from '@/services/users';
import type { KpiDetalhado, UserReportData, UserHealthSnapshot } from '@/features/users/types';
import UserExportButton from './UserExportButton';
import UserDeactivationWizard from './UserDeactivationWizard';

interface Props {
  user: {
    id: string;
    name: string;
    role?: string;
    active: boolean;
    canClaimRoletao?: boolean;
    email?: string;
    phone?: string;
    admissionDate?: string;
    city?: string;
    uf?: string;
    status?: 'active' | 'inactive';
    healthSnapshot?: UserHealthSnapshot | null;
    checkpointReason?: string | null;
  };
  metrics?: KpiDetalhado | null;
}

export default function UserDetailHeader({ user, metrics }: Props) {
  const initials = useMemo(
    () =>
      user.name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2),
    [user.name],
  );
  const [active, setActive] = useState(user.active);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [deactivationStatus, setDeactivationStatus] = useState<DeactivationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const { toast } = useToast();
  const [canClaimRoletao, setCanClaimRoletao] = useState(Boolean(user.canClaimRoletao));
  const [headerStatus, setHeaderStatus] = useState<'active' | 'inactive'>(
    user.status ?? (user.active ? 'active' : 'inactive'),
  );
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    setActive(user.active);
  }, [user.active]);

  useEffect(() => {
    setCanClaimRoletao(Boolean(user.canClaimRoletao));
  }, [user.canClaimRoletao]);

  useEffect(() => {
    if (user.status) {
      setHeaderStatus(user.status);
    } else {
      setHeaderStatus(user.active ? 'active' : 'inactive');
    }
  }, [user.active, user.status]);

  useEffect(() => {
    let mounted = true;
    setStatusLoading(true);
    getUserDeactivationStatus(user.id)
      .then(data => {
        if (!mounted) return;
        setDeactivationStatus(data);
        if (data.state === 'deactivated') {
          setActive(false);
          setHeaderStatus('inactive');
        }
      })
      .catch(() => {
        toast({
          title: 'Não foi possível carregar o status de desativação',
          variant: 'destructive',
        });
      })
      .finally(() => {
        if (mounted) {
          setStatusLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [toast, user.id]);

  const admission = useMemo(() => {
    if (!user.admissionDate) {
      return null;
    }
    try {
      return format(new Date(user.admissionDate), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return null;
    }
  }, [user.admissionDate]);

  const scheduledLabel = useMemo(() => {
    if (!deactivationStatus?.scheduledFor) {
      return null;
    }
    try {
      return format(new Date(deactivationStatus.scheduledFor), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return null;
    }
  }, [deactivationStatus?.scheduledFor]);

  const handleDeactivationUpdate = (status: DeactivationStatus) => {
    setDeactivationStatus(status);
    if (status.state === 'deactivated') {
      setActive(false);
      setHeaderStatus('inactive');
    } else {
      setActive(true);
      setHeaderStatus('active');
    }
  };

  const reportData = useMemo<UserReportData>(() => {
    const resumo = metrics?.resumo ?? null;
    const vacancia = metrics?.vacancia ?? null;
    const followUpRate = resumo?.taxaFollowUp ?? null;

    return {
      personalInfo: {
        id: user.id,
        name: user.name,
        email: user.email ?? null,
        phone: user.phone ?? null,
        role: user.role ?? null,
        city: user.city ?? null,
        uf: user.uf ?? null,
        admissionDate: user.admissionDate ?? null,
      },
      metrics: metrics
        ? {
            resumo,
            vacancia,
          }
        : null,
      indicators: {
        followUpRate,
        vacancia,
      },
      roletaoStatus: {
        state: deactivationStatus?.state ?? (headerStatus === 'inactive' ? 'deactivated' : 'idle'),
        scheduledFor: deactivationStatus?.scheduledFor ?? null,
        lastActionAt: deactivationStatus?.lastActionAt ?? null,
        canClaimRoletao,
      },
      observations: user.healthSnapshot?.checkpointReason ?? user.checkpointReason ?? null,
    };
  }, [
    metrics,
    user.id,
    user.name,
    user.email,
    user.phone,
    user.role,
    user.city,
    user.uf,
    user.admissionDate,
    deactivationStatus?.state,
    deactivationStatus?.scheduledFor,
    deactivationStatus?.lastActionAt,
    headerStatus,
    canClaimRoletao,
    user.healthSnapshot?.checkpointReason,
    user.checkpointReason,
  ]);

  const showScheduledBadge = deactivationStatus?.state === 'scheduled';
  const showDeactivatedBadge =
    deactivationStatus?.state === 'deactivated' && headerStatus !== 'inactive';
  const isInactive = headerStatus === 'inactive';

  const handleReactivate = async () => {
    setReactivating(true);
    try {
      const status = await reactivateUser(user.id);
      setDeactivationStatus(status);
      setActive(true);
      setHeaderStatus('active');
      setCanClaimRoletao(true);
      toast({
        title: 'Corretor reativado com sucesso',
        description: 'As permissões e ferramentas foram reativadas.',
      });
      setReactivateDialogOpen(false);

      try {
        const refreshedStatus = await getUserDeactivationStatus(user.id);
        setDeactivationStatus(refreshedStatus);
      } catch (refreshError) {
        console.error(refreshError);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível reativar o corretor',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setReactivating(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <button
            aria-label="Voltar"
            onClick={() => window.history.back()}
            className="mt-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
              {initials || '?' }
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{user.name}</h1>
              {isInactive && (
                <Badge variant="outline" className="border-muted-foreground/40 bg-muted text-muted-foreground">
                  Inativo
                </Badge>
              )}
              {showDeactivatedBadge && (
                <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                  Corretor desativado
                </Badge>
              )}
              {showScheduledBadge && (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                  Desativação agendada
                </Badge>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {user.role && <span>{user.role}</span>}
              {user.city && user.uf && (
                <span className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">•</span>
                  {user.city}/{user.uf}
                </span>
              )}
              {admission && (
                <span className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">•</span>
                  Desde {admission}
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              {user.email && <p>{user.email}</p>}
              {user.phone && <p>{user.phone}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isInactive && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <UserStatusSwitch
                      userId={user.id}
                      canClaimRoletao={canClaimRoletao}
                      onChange={setCanClaimRoletao}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  Ativa/inativa o roletão para o corretor.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <UserExportButton userId={user.id} userData={reportData} />
          {isInactive ? (
            <Button size="sm" onClick={() => setReactivateDialogOpen(true)} disabled={reactivating}>
              {reactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reativar corretor
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setWizardOpen(true)}
              disabled={!active && deactivationStatus?.state !== 'scheduled'}
            >
              Desativar corretor
            </Button>
          )}
        </div>
      </div>

      {deactivationStatus?.state === 'scheduled' && scheduledLabel && (
        <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-900">
          <CalendarClock className="h-5 w-5" />
          <AlertTitle>Desativação agendada</AlertTitle>
          <AlertDescription>
            Programada para {scheduledLabel}. Você pode ajustar a estratégia ou cancelar o agendamento quando precisar.
          </AlertDescription>
        </Alert>
      )}

      {deactivationStatus?.state === 'deactivated' && deactivationStatus.lastActionAt && (
        <Alert className="mt-4 border-emerald-200 bg-emerald-50 text-emerald-900">
          <CheckCircle2 className="h-5 w-5" />
          <AlertTitle>Corretor desativado</AlertTitle>
          <AlertDescription>
            Desativado em{' '}
            {format(new Date(deactivationStatus.lastActionAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}. Todos os leads
            selecionados foram processados.
          </AlertDescription>
        </Alert>
      )}

      {!deactivationStatus && !statusLoading && (
        <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-900">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Status da carteira indisponível</AlertTitle>
          <AlertDescription>
            Não conseguimos carregar os detalhes da carteira deste corretor. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      )}

      <UserDeactivationWizard
        userId={user.id}
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onStatusChange={handleDeactivationUpdate}
      />

      <AlertDialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reativar corretor</AlertDialogTitle>
            <AlertDialogDescription>
              O corretor voltará a receber leads normalmente. Confirme para concluir a reativação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reactivating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleReactivate} disabled={reactivating}>
                {reactivating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar reativação
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
