'use client';

import { useCallback, useMemo, useState } from 'react';
import { CalendarDays, Clock, Info, Pencil, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Pill from '@/components/ui/pill';
import CheckpointEditModal from '@/features/users/components/CheckpointEditModal';
import type { CheckPointUpdateInput } from '@/features/users/types';

interface CheckPointPanelProps {
  nextCheckpointAt?: string | null;
  suspendLeadsUntil?: string | null;
  suspendRoletaoUntil?: string | null;
  checkpointReason?: string | null;
  onSave?: (data: CheckPointUpdateInput) => Promise<void> | void;
  onRunNow?: () => Promise<void> | void;
}

function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value: Date | null): string {
  if (!value) return 'Sem data definida';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(value);
  } catch (error) {
    return value.toLocaleString('pt-BR');
  }
}

function formatRelative(value: Date | null): string | null {
  if (!value) return null;
  const now = Date.now();
  const diff = value.getTime() - now;
  if (diff <= 0) return null;
  const minutes = Math.round(diff / (60 * 1000));
  if (minutes < 60) return `em ${minutes} minuto${minutes === 1 ? '' : 's'}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `em ${hours} hora${hours === 1 ? '' : 's'}`;
  const days = Math.round(hours / 24);
  return `em ${days} dia${days === 1 ? '' : 's'}`;
}

export default function CheckPointPanel({
  nextCheckpointAt,
  suspendLeadsUntil,
  suspendRoletaoUntil,
  checkpointReason,
  onSave,
  onRunNow,
}: CheckPointPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const nextCheckpointDate = useMemo(() => parseIsoDate(nextCheckpointAt ?? null), [nextCheckpointAt]);
  const leadsUntilDate = useMemo(() => parseIsoDate(suspendLeadsUntil ?? null), [suspendLeadsUntil]);
  const roletaoUntilDate = useMemo(
    () => parseIsoDate(suspendRoletaoUntil ?? null),
    [suspendRoletaoUntil],
  );

  const predictedExecution = nextCheckpointDate;

  const activeSuspensions = useMemo(() => {
    const now = Date.now();
    const pills: Array<{ id: string; label: string }> = [];
    if (leadsUntilDate && leadsUntilDate.getTime() > now) {
      pills.push({
        id: 'leads',
        label: `Leads suspensos até ${formatDateTime(leadsUntilDate)}`,
      });
    }
    if (roletaoUntilDate && roletaoUntilDate.getTime() > now) {
      pills.push({
        id: 'roletao',
        label: `Roletão suspenso até ${formatDateTime(roletaoUntilDate)}`,
      });
    }
    return pills;
  }, [leadsUntilDate, roletaoUntilDate]);

  const modalDefaults = useMemo(
    () => ({
      nextCheckpointAt: nextCheckpointAt ?? null,
      suspendLeadsUntil: suspendLeadsUntil ?? null,
      suspendRoletaoUntil: suspendRoletaoUntil ?? null,
      reason: checkpointReason ?? null,
    }),
    [checkpointReason, nextCheckpointAt, suspendLeadsUntil, suspendRoletaoUntil],
  );

  const relativeNext = formatRelative(nextCheckpointDate);
  const relativePredicted = formatRelative(predictedExecution);

  const handleRunNow = useCallback(async () => {
    if (!onRunNow) return;
    setIsRunning(true);
    try {
      await onRunNow();
    } finally {
      setIsRunning(false);
    }
  }, [onRunNow]);

  return (
    <>
      <Card className="h-full rounded-2xl border border-border/60 bg-background">
        <CardHeader className="space-y-4 pb-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                CheckPoints automáticos
              </CardTitle>
              <CardDescription>
                Acompanhe quando recalcular as recomendações e alertas deste corretor.
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full border border-border/60 p-1.5 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label="Saiba como funcionam os CheckPoints"
                  >
                    <Info className="h-4 w-4" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" align="center" className="max-w-xs text-sm">
                  CheckPoints atualizam a saúde operacional com base no comportamento do corretor.
                  Use o agendamento para automatizar esse acompanhamento.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 rounded-xl bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900">Próximo checkpoint agendado</p>
                  <p className="text-muted-foreground">{formatDateTime(nextCheckpointDate)}</p>
                  {relativeNext ? (
                    <p className="text-xs text-muted-foreground">{relativeNext}</p>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                aria-label="Editar próximo checkpoint"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900">Próxima execução prevista</p>
                  <p className="text-muted-foreground">{formatDateTime(predictedExecution)}</p>
                  {relativePredicted ? (
                    <p className="text-xs text-muted-foreground">{relativePredicted}</p>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                aria-label="Editar previsão do checkpoint"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {activeSuspensions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeSuspensions.map(pill => (
                <Pill key={pill.id} variant="warning">
                  {pill.label}
                </Pill>
              ))}
            </div>
          ) : null}

          {checkpointReason ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
              Motivo registrado: {checkpointReason}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar CheckPoint
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleRunNow()}
              disabled={!onRunNow || isRunning}
              className="flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              {isRunning ? 'Executando…' : 'Executar agora'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <CheckpointEditModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultValues={modalDefaults}
        onSave={onSave}
        onRunNow={handleRunNow}
      />
    </>
  );
}
