'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import HealthDonut from '@/features/users/components/HealthDonut';
import RoletaoKpis from '@/features/users/components/RoletaoKpis';
import AutomationToggleCard from '@/features/users/components/AutomationToggleCard';
import CheckPointPanel from '@/features/users/components/CheckPointPanel';
import type {
  CheckPointUpdateInput,
  Period,
  UserCheckpointSettings,
  UserHealthSnapshot,
} from '@/features/users/types';
import { useToast } from '@/hooks/use-toast';
import { saveAutoFlags } from '@/services/healthService';

interface UserUpdatesContentProps {
  data: UserHealthSnapshot | null;
  userId?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSaveCheckpoint?: (
    data: CheckPointUpdateInput,
  ) => Promise<UserCheckpointSettings | null | void> | UserCheckpointSettings | null | void;
  onRunCheckpoint?: () =>
    | Promise<UserCheckpointSettings | null | void>
    | UserCheckpointSettings
    | null
    | void;
}

function normalizeCheckpoint(snapshot: UserHealthSnapshot | null | undefined): UserCheckpointSettings {
  if (!snapshot) {
    return {
      nextCheckpointAt: null,
      suspendLeadsUntil: null,
      suspendRoletaoUntil: null,
      reason: null,
    };
  }

  const nextCheckpointAt = snapshot.checkpoint?.nextCheckpointAt ?? snapshot.nextCheckpointAt ?? null;
  const suspendLeadsUntil =
    snapshot.checkpoint?.suspendLeadsUntil ?? snapshot.suspendLeadsUntil ?? null;
  const suspendRoletaoUntil =
    snapshot.checkpoint?.suspendRoletaoUntil ?? snapshot.suspendRoletaoUntil ?? null;
  const reason = snapshot.checkpoint?.reason ?? snapshot.checkpointReason ?? null;

  return {
    nextCheckpointAt,
    suspendLeadsUntil,
    suspendRoletaoUntil,
    reason,
  };
}

function fromUpdateInput(input: CheckPointUpdateInput): UserCheckpointSettings {
  return {
    nextCheckpointAt: input.nextCheckpointAt ?? null,
    suspendLeadsUntil: input.suspendLeadsUntil ?? null,
    suspendRoletaoUntil: input.suspendRoletaoUntil ?? null,
    reason: input.reason ?? null,
  };
}

function coerceCheckpointSettings(
  value: UserCheckpointSettings | null | void,
  fallback: UserCheckpointSettings,
): UserCheckpointSettings {
  if (value && typeof value === 'object') {
    return {
      nextCheckpointAt: value.nextCheckpointAt ?? null,
      suspendLeadsUntil: value.suspendLeadsUntil ?? null,
      suspendRoletaoUntil: value.suspendRoletaoUntil ?? null,
      reason: value.reason ?? null,
    };
  }
  return fallback;
}

export default function UserUpdatesContent({
  data,
  userId,
  loading = false,
  error,
  onRetry,
  onSaveCheckpoint,
  onRunCheckpoint,
}: UserUpdatesContentProps) {
  const [roletaoPeriod, setRoletaoPeriod] = useState<Period>({ type: '7d' });
  const [currentSnapshot, setCurrentSnapshot] = useState<UserHealthSnapshot | null>(data);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<UserCheckpointSettings>(
    normalizeCheckpoint(data),
  );
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentSnapshot(data);
  }, [data]);

  useEffect(() => {
    if (currentSnapshot?.roletao) {
      setRoletaoPeriod({ type: currentSnapshot.roletao.defaultPeriod });
    }
  }, [currentSnapshot?.roletao?.defaultPeriod]);

  useEffect(() => {
    setCurrentCheckpoint(normalizeCheckpoint(currentSnapshot));
  }, [currentSnapshot]);

  const handleAutomationToggle = useCallback(
    async (toggleId: string, nextValue: boolean) => {
      if (!userId || pendingToggleId) return;

      const payload: Parameters<typeof saveAutoFlags>[1] = {};

      if (toggleId === 'auto-receive-leads') {
        payload.canReceiveNewLeads = nextValue;
      } else if (toggleId === 'roletao-auto-claim') {
        payload.canClaimRoletao = nextValue;
      } else {
        return;
      }

      try {
        setPendingToggleId(toggleId);
        const snapshot = await saveAutoFlags(userId, payload);
        setCurrentSnapshot(snapshot);
        setCurrentCheckpoint(normalizeCheckpoint(snapshot));
        toast({
          title: 'Automação atualizada',
          description: 'Novo estado salvo e snapshot recalculado.',
          variant: 'success',
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Erro ao atualizar automação',
          description: 'Tente novamente em instantes.',
          variant: 'destructive',
        });
      } finally {
        setPendingToggleId(null);
      }
    },
    [pendingToggleId, toast, userId],
  );

  const handleSaveCheckpoint = useCallback(
    async (payload: CheckPointUpdateInput) => {
      if (!onSaveCheckpoint) return;
      try {
        const fallback = fromUpdateInput(payload);
        const result = await onSaveCheckpoint(payload);
        const nextValue = coerceCheckpointSettings(result, fallback);
        setCurrentCheckpoint(nextValue);
        toast({
          title: 'CheckPoint salvo',
          description: 'Agendamento atualizado com sucesso.',
          variant: 'success',
        });
      } catch (error) {
        toast({
          title: 'Erro ao salvar CheckPoint',
          description: 'Tente novamente em instantes.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [onSaveCheckpoint, toast],
  );

  const handleRunCheckpoint = useCallback(async () => {
    if (!onRunCheckpoint) return;
    try {
      const result = await onRunCheckpoint();
      if (result !== undefined) {
        const nextValue = coerceCheckpointSettings(result, currentCheckpoint);
        setCurrentCheckpoint(nextValue);
      }
      toast({
        title: 'CheckPoint executado',
        description: 'Snapshot recalculado com sucesso.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Erro ao executar CheckPoint',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [currentCheckpoint, onRunCheckpoint, toast]);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1, 2, 3].map(key => (
          <Skeleton key={key} className="h-[360px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-12 text-center">
        <p className="text-base font-medium text-destructive">Não foi possível carregar as atualizações</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            Tentar novamente
          </Button>
        ) : null}
      </div>
    );
  }

  if (!currentSnapshot) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
        <p className="text-base font-medium text-gray-900">Nenhum insight disponível por enquanto</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Assim que coletarmos informações suficientes sobre leads, imóveis e o roletão, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  const automations = currentSnapshot.automations;
  const hasAutomationToggles = Array.isArray(automations?.toggles)
    ? automations.toggles.length > 0
    : false;

  return (
    <Fragment>
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-muted/40 via-background to-muted/40 p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Saúde operacional</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">
          Onde concentrar o acompanhamento deste corretor
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Um resumo das últimas semanas para priorizar follow-ups com clientes, ajustes no portfólio de imóveis e o ritmo do roletão.
        </p>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <HealthDonut
          title="Gestão de Clientes"
          description="Como estão os leads deste corretor e quais precisam de contato."
          segments={currentSnapshot.leads}
          updatedAt={currentSnapshot.updatedAt}
        />
        <HealthDonut
          title="Gestão de Imóveis"
          description="Status do portfólio e imóveis que exigem ajustes imediatos."
          segments={currentSnapshot.imoveis}
          updatedAt={currentSnapshot.updatedAt}
        />
        <HealthDonut
          title="Gestão de Tarefas"
          description="Fluxo de tarefas que libera ou bloqueia o recebimento de leads."
          segments={currentSnapshot.tarefas}
          updatedAt={currentSnapshot.updatedAt}
        />
        <RoletaoKpis
          data={currentSnapshot.roletao}
          period={roletaoPeriod}
          updatedAt={currentSnapshot.updatedAt}
          onChangePeriod={setRoletaoPeriod}
        />
        <CheckPointPanel
          nextCheckpointAt={currentCheckpoint.nextCheckpointAt}
          suspendLeadsUntil={currentCheckpoint.suspendLeadsUntil}
          suspendRoletaoUntil={currentCheckpoint.suspendRoletaoUntil}
          checkpointReason={currentCheckpoint.reason}
          onSave={onSaveCheckpoint ? handleSaveCheckpoint : undefined}
          onRunNow={onRunCheckpoint ? handleRunCheckpoint : undefined}
        />
        {hasAutomationToggles ? (
          <AutomationToggleCard
            automations={automations}
            onToggle={handleAutomationToggle}
            busyToggleId={pendingToggleId}
          />
        ) : null}
      </div>
    </Fragment>
  );
}
