'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DistributionStep } from './DistributionStep';
import type { DistributionStrategy, DistributionScope } from '../types/distribution';
import {
  cancelUserDeactivation,
  deactivateUserNow,
  getRedistributionPreview,
  getUserDeactivationStatus,
  scheduleUserDeactivation,
  type DeactivationStatus,
  type DeactivationStrategy,
  type RedistributionFilters,
  type RedistributionPreview,
} from '@/services/users';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  ShieldOff,
} from 'lucide-react';

type WizardStep = 0 | 1 | 2 | 3;

interface UserDeactivationWizardProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (status: DeactivationStatus) => void;
}

const steps = [
  {
    title: 'Estratégia',
    description: 'Estratégia e filtros',
  },
  {
    title: 'Agendamento',
    description: 'Quando executar',
  },
  {
    title: 'Pesquisa & Distribuição',
    description: 'Destinos e regras',
  },
  {
    title: 'Revisão final',
    description: 'Ajustes e confirmação',
  },
];

const defaultFilters: RedistributionFilters = {
  includeHot: true,
  includeWarm: true,
  includeCold: true,
};

function formatDateToDatetimeLocal(date: Date) {
  const timezoneOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - timezoneOffsetInMs);

  return localDate.toISOString().slice(0, 16);
}

export function UserDeactivationWizard({
  userId,
  open,
  onOpenChange,
  onStatusChange,
}: UserDeactivationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [status, setStatus] = useState<DeactivationStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [filters, setFilters] = useState<RedistributionFilters>(defaultFilters);
  const [strategy, setStrategy] = useState<DeactivationStrategy>('redistribute');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');
  const [scheduleAt, setScheduleAt] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [notes, setNotes] = useState('');
  const [preview, setPreview] = useState<RedistributionPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [distributionStrategy, setDistributionStrategy] = useState<DistributionStrategy | null>(null);
  const [distributionScope, setDistributionScope] = useState<DistributionScope | null>(null);
  const { toast } = useToast();

  const walletSummary = status?.summary;

  const scheduleLabel = useMemo(() => {
    if (scheduleMode === 'now' || !scheduleAt) {
      return 'Imediata';
    }

    try {
      const parsed = new Date(scheduleAt);
      if (Number.isNaN(parsed.getTime())) {
        return 'Agendada';
      }
      return format(parsed, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return 'Agendada';
    }
  }, [scheduleAt, scheduleMode]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let mounted = true;
    setStatusLoading(true);
    getUserDeactivationStatus(userId)
      .then(data => {
        if (!mounted) return;
        setStatus(data);
        if (data.strategy) {
          setStrategy(data.strategy);
        }
        setFilters({ ...defaultFilters });
        setScheduleMode(data.state === 'scheduled' ? 'schedule' : 'now');
        setScheduleAt(
          data.scheduledFor ? formatDateToDatetimeLocal(new Date(data.scheduledFor)) : '',
        );
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
  }, [open, toast, userId]);

  useEffect(() => {
    if (!open || currentStep !== 1) {
      return;
    }

    setPreviewLoading(true);
    getRedistributionPreview(userId, strategy, filters)
      .then(data => {
        setPreview(data);
      })
      .catch(() => {
        toast({
          title: 'Erro ao simular redistribuição',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setPreviewLoading(false);
      });
  }, [currentStep, filters, open, strategy, toast, userId]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setScheduleMode('now');
      setScheduleAt('');
      setAcknowledged(false);
      setNotes('');
      setPreview(null);
    }
  }, [open]);

  const handleCancelSchedule = async () => {
    if (!status || status.state !== 'scheduled') return;

    try {
      setCancelLoading(true);
      const data = await cancelUserDeactivation(userId);
      setStatus(data);
      setScheduleMode('now');
      setScheduleAt('');
      toast({
        title: 'Agendamento cancelado',
        description: 'A desativação foi removida e o corretor permanece ativo.',
        variant: 'success',
      });
      onStatusChange?.(data);
    } catch (error) {
      toast({
        title: 'Não foi possível cancelar o agendamento',
        variant: 'destructive',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(3, prev + 1) as WizardStep);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1) as WizardStep);
  };

  const handleSubmit = async () => {
    if (!preview) return;

    setActionLoading(true);

    const payload = {
      strategy,
      filters,
      notes: notes.trim() || undefined,
      scheduleFor:
        scheduleMode === 'schedule' && scheduleAt
          ? new Date(scheduleAt).toISOString()
          : undefined,
    };

    try {
      const data =
        scheduleMode === 'schedule'
          ? await scheduleUserDeactivation(userId, payload)
          : await deactivateUserNow(userId, payload);

      toast({
        title: scheduleMode === 'schedule' ? 'Desativação agendada' : 'Corretor desativado',
        description:
          scheduleMode === 'schedule'
            ? 'Vamos avisar quando chegar a hora da desativação.'
            : 'Carteira redistribuída com sucesso.',
        variant: 'success',
      });

      setStatus(data);
      onStatusChange?.(data);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Não foi possível concluir a desativação',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const stepTitle = steps[currentStep]?.title;
  const stepDescription = steps[currentStep]?.description;

  const canAdvanceFromStep1 = useMemo(() => {
    if (!preview) return false;
    if (scheduleMode === 'schedule' && !scheduleAt) {
      return false;
    }
    return preview.selectedTotal > 0;
  }, [preview, scheduleAt, scheduleMode]);

  const canAdvanceFromStep2 = useMemo(() => {
    // Always allow advancing from step 2 to step 3 (final step)
    // The actual validation will happen in the final step
    return true;
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col space-y-6 overflow-y-auto p-6">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-semibold">Desativar corretor</DialogTitle>
              <p className="text-sm text-muted-foreground">{stepTitle}</p>
            </div>
            <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
              Passo {currentStep + 1} de {steps.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.title} className="flex w-full items-center gap-2">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium',
                    index === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : index < currentStep
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-muted-foreground/20 text-muted-foreground',
                  )}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-[2px] flex-1 rounded-full bg-muted',
                      index < currentStep ? 'bg-primary' : 'bg-muted',
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          {stepDescription && (
            <p className="text-sm text-muted-foreground">{stepDescription}</p>
          )}
        </DialogHeader>

        <div className="flex-1 space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Impacto na carteira do corretor</AlertTitle>
                <AlertDescription>
                  Ao desativar o corretor, todos os leads selecionados serão removidos da carteira atual.
                  Você poderá redistribuir ou arquivar a carteira nos próximos passos.
                </AlertDescription>
              </Alert>

              {walletSummary && (
                <div className="grid gap-4 sm:grid-cols-4">
                  {[{ label: 'Total na carteira', value: walletSummary.total }, { label: 'Leads quentes', value: walletSummary.hot }, { label: 'Leads mornos', value: walletSummary.warm }, { label: 'Leads frios', value: walletSummary.cold }].map(item => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-border bg-muted/20 p-4 text-center shadow-sm"
                    >
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {status?.state === 'scheduled' && status.scheduledFor && (
                <Alert className="border-primary/40 bg-primary/5">
                  <CalendarClock className="h-5 w-5" />
                  <AlertTitle>Existe uma desativação agendada</AlertTitle>
                  <AlertDescription>
                    Prevista para {format(new Date(status.scheduledFor), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.
                    Caso precise fazer ajustes você pode cancelar o agendamento atual.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Estratégia para a carteira
                </h3>
                <RadioGroup
                  value={strategy}
                  onValueChange={value => setStrategy(value as DeactivationStrategy)}
                  className="mt-3 grid gap-3 sm:grid-cols-2"
                >
                  <label
                    htmlFor="strategy-redistribute"
                    className={cn(
                      'relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 shadow-sm transition-colors',
                      strategy === 'redistribute'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem id="strategy-redistribute" value="redistribute" />
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <RefreshCcw className="h-4 w-4 text-primary" /> Redistribuir carteira
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Os leads selecionados serão distribuídos entre os corretores ativos de forma proporcional.
                        </p>
                      </div>
                    </div>
                  </label>
                  <label
                    htmlFor="strategy-archive"
                    className={cn(
                      'relative flex cursor-pointer flex-col gap-2 rounded-lg border p-4 shadow-sm transition-colors',
                      strategy === 'archive'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <RadioGroupItem id="strategy-archive" value="archive" />
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <ShieldOff className="h-4 w-4 text-primary" /> Arquivar leads
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Os leads selecionados serão arquivados e permanecerão disponíveis no histórico da equipe.
                        </p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Filtrar carteira a ser removida
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[{
                    key: 'includeHot',
                    label: 'Leads quentes',
                    description: 'Com atividade nos últimos 7 dias',
                  }, {
                    key: 'includeWarm',
                    label: 'Leads mornos',
                    description: 'Engajamento moderado',
                  }, {
                    key: 'includeCold',
                    label: 'Leads frios',
                    description: 'Sem contato recente',
                  }].map(option => (
                    <label
                      key={option.key}
                      className={cn(
                        'flex cursor-pointer flex-col gap-2 rounded-lg border p-4 shadow-sm transition-colors',
                        filters[option.key as keyof RedistributionFilters]
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40',
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={filters[option.key as keyof RedistributionFilters]}
                          onCheckedChange={value =>
                            setFilters(prev => ({
                              ...prev,
                              [option.key]: Boolean(value),
                            }))
                          }
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 rounded-lg border border-dashed border-border bg-muted/10 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Resumo da seleção</span>
                  {previewLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Selecionados</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.selectedTotal ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Redistribuir</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.toRedistribute ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Arquivar</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.toArchive ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Carteira restante</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.remaining ?? '-'}</p>
                  </div>
                </div>

                {preview && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {preview.breakdown.hot > 0 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-600">
                        {preview.breakdown.hot} quentes
                      </Badge>
                    )}
                    {preview.breakdown.warm > 0 && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-600">
                        {preview.breakdown.warm} mornos
                      </Badge>
                    )}
                    {preview.breakdown.cold > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                        {preview.breakdown.cold} frios
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Quando devemos desativar?
                </h3>
                <RadioGroup
                  value={scheduleMode}
                  onValueChange={value => setScheduleMode(value as 'now' | 'schedule')}
                  className="mt-3 space-y-3"
                >
                  <label
                    htmlFor="schedule-now"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4',
                      scheduleMode === 'now'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40',
                    )}
                  >
                    <RadioGroupItem id="schedule-now" value="now" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Agora mesmo</p>
                      <p className="text-sm text-muted-foreground">
                        A desativação será aplicada e comunicada imediatamente após a confirmação.
                      </p>
                    </div>
                  </label>
                  <label
                    htmlFor="schedule-later"
                    className={cn(
                      'flex cursor-pointer flex-col gap-3 rounded-lg border p-4',
                      scheduleMode === 'schedule'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem id="schedule-later" value="schedule" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Agendar para depois</p>
                        <p className="text-sm text-muted-foreground">
                          Escolha data e horário para aplicar a desativação.
                        </p>
                      </div>
                    </div>
                    {scheduleMode === 'schedule' && (
                      <div className="grid gap-2 sm:grid-cols-[200px]">
                        <Label htmlFor="scheduleAt" className="text-xs font-medium text-muted-foreground">
                          Data e horário
                        </Label>
                        <Input
                          id="scheduleAt"
                          type="datetime-local"
                          value={scheduleAt}
                          onChange={event => setScheduleAt(event.target.value)}
                          min={formatDateToDatetimeLocal(new Date())}
                        />
                      </div>
                    )}
                  </label>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-lg border border-dashed border-border bg-muted/10 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Resumo da seleção</span>
                  {previewLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Selecionados</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.selectedTotal ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Redistribuir</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.toRedistribute ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Arquivar</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.toArchive ?? '-'}</p>
                  </div>
                  <div className="rounded-md bg-background p-3 text-center shadow">
                    <p className="text-xs uppercase text-muted-foreground">Carteira restante</p>
                    <p className="mt-1 text-xl font-semibold">{preview?.remaining ?? '-'}</p>
                  </div>
                </div>

                {preview && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {preview.breakdown.hot > 0 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-600">
                        {preview.breakdown.hot} quentes
                      </Badge>
                    )}
                    {preview.breakdown.warm > 0 && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-600">
                        {preview.breakdown.warm} mornos
                      </Badge>
                    )}
                    {preview.breakdown.cold > 0 && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                        {preview.breakdown.cold} frios
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Quando devemos desativar?
                </h3>
                <RadioGroup
                  value={scheduleMode}
                  onValueChange={value => setScheduleMode(value as 'now' | 'schedule')}
                  className="mt-3 space-y-3"
                >
                  <label
                    htmlFor="schedule-now"
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4',
                      scheduleMode === 'now'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40',
                    )}
                  >
                    <RadioGroupItem id="schedule-now" value="now" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Agora mesmo</p>
                      <p className="text-sm text-muted-foreground">
                        A desativação será aplicada e comunicada imediatamente após a confirmação.
                      </p>
                    </div>
                  </label>
                  <label
                    htmlFor="schedule-later"
                    className={cn(
                      'flex cursor-pointer flex-col gap-3 rounded-lg border p-4',
                      scheduleMode === 'schedule'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem id="schedule-later" value="schedule" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Agendar para depois</p>
                        <p className="text-sm text-muted-foreground">
                          Escolha data e horário para aplicar a desativação.
                        </p>
                      </div>
                    </div>
                    {scheduleMode === 'schedule' && (
                      <div className="grid gap-2 sm:grid-cols-[200px]">
                        <Label htmlFor="scheduleAt" className="text-xs font-medium text-muted-foreground">
                          Data e horário
                        </Label>
                        <Input
                          id="scheduleAt"
                          type="datetime-local"
                          value={scheduleAt}
                          onChange={event => setScheduleAt(event.target.value)}
                          min={formatDateToDatetimeLocal(new Date())}
                        />
                      </div>
                    )}
                  </label>
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === 2 && walletSummary && (
            <DistributionStep
              walletSummary={walletSummary}
              selectedFilters={filters}
              onStrategyChange={setDistributionStrategy}
              onScopeChange={setDistributionScope}
            />
          )}

          {currentStep === 3 && preview && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-muted/10 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Resumo antes de confirmar
                </h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Estratégia</p>
                    <p className="text-sm font-semibold text-foreground">
                      {strategy === 'redistribute' ? 'Redistribuir carteira' : 'Arquivar leads'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Execução</p>
                    <p className="text-sm font-semibold text-foreground">{scheduleLabel}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Leads impactados</p>
                    <p className="text-sm font-semibold text-foreground">{preview.selectedTotal}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Carteira restante</p>
                    <p className="text-sm font-semibold text-foreground">{preview.remaining}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {filters.includeHot && <Badge variant="secondary">Inclui leads quentes</Badge>}
                  {filters.includeWarm && <Badge variant="secondary">Inclui leads mornos</Badge>}
                  {filters.includeCold && <Badge variant="secondary">Inclui leads frios</Badge>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Observações para o time
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                  placeholder="Adicione orientações ou o motivo da desativação para consulta futura."
                  rows={4}
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                <Checkbox
                  id="acknowledge"
                  checked={acknowledged}
                  onCheckedChange={value => setAcknowledged(Boolean(value))}
                />
                <Label htmlFor="acknowledge" className="text-sm text-muted-foreground">
                  Estou ciente de que a desativação é irreversível e que os leads selecionados serão
                  {strategy === 'redistribute' ? ' redistribuídos para outros corretores.' : ' arquivados e sairão das filas ativas.'}
                </Label>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 mt-6 border-t border-border bg-background px-6 py-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={goToPreviousStep} className="w-full sm:w-auto">
                Voltar
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => {
                  if (currentStep === 1 && strategy === 'archive') {
                    setCurrentStep(3); // Skip distribution step for archive
                  } else {
                    goToNextStep();
                  }
                }}
                disabled={
                  statusLoading ||
                  (currentStep === 1 && !canAdvanceFromStep1) ||
                  (currentStep === 2 && !canAdvanceFromStep2)
                }
                className="w-full sm:w-auto sm:ml-auto"
              >
                {currentStep === 0 ? 'Continuar' : currentStep === 1 ? 'Continuar' : 'Continuar'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!acknowledged || actionLoading}
                className="w-full sm:w-auto sm:ml-auto"
              >
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {scheduleMode === 'schedule' ? 'Agendar desativação' : 'Confirmar desativação'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UserDeactivationWizard;
