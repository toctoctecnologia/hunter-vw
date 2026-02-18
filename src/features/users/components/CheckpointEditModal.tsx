'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { CalendarClock, PauseCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { CheckPointUpdateInput } from '@/features/users/types';

interface CheckpointEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<CheckPointUpdateInput> | null;
  onSave?: (input: CheckPointUpdateInput) => Promise<void> | void;
  onRunNow?: () => Promise<void> | void;
}

type SuspensionDuration = '1d' | '2d' | '7d' | '30d' | 'custom';

type DatePreset = {
  label: string;
  getValue: () => Date | null;
};

const SUSPENSION_OPTIONS: Array<{ value: SuspensionDuration; label: string }> = [
  { value: '1d', label: '1 dia' },
  { value: '2d', label: '2 dias' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'custom', label: 'Personalizado' },
];

function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value: Date | null): string {
  if (!value) return 'Selecione data e hora';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(value);
  } catch (error) {
    return value.toLocaleString('pt-BR');
  }
}

function formatShortDate(value: Date | null): string {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(value);
  } catch (error) {
    return value.toLocaleString('pt-BR');
  }
}

function combineDateAndTime(base: Date, time: string): Date | null {
  const [hours, minutes] = time.split(':').map(segment => Number.parseInt(segment, 10));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  const result = new Date(base);
  result.setSeconds(0, 0);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function addDays(base: Date, days: number): Date {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result;
}

function getUpcomingWeekday(base: Date, weekday: number): Date {
  const result = new Date(base);
  const current = result.getDay();
  let diff = (weekday + 7 - current) % 7;
  if (diff === 0) {
    diff = 7;
  }
  result.setDate(result.getDate() + diff);
  return result;
}

function computeSuspensionUntil(duration: SuspensionDuration): Date | null {
  if (duration === 'custom') return null;
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMilliseconds(0);
  const days = Number.parseInt(duration.replace('d', ''), 10);
  if (Number.isNaN(days)) return null;
  return addDays(now, days);
}

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  presets?: DatePreset[];
}

function DateTimePicker({ value, onChange, placeholder = 'Selecionar data e hora', presets = [] }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const timeInputId = useId();
  const [timeValue, setTimeValue] = useState(() => {
    if (!value) return '09:00';
    const hours = value.getHours().toString().padStart(2, '0');
    const minutes = value.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  useEffect(() => {
    if (!value) {
      setTimeValue('09:00');
      return;
    }
    const hours = value.getHours().toString().padStart(2, '0');
    const minutes = value.getMinutes().toString().padStart(2, '0');
    setTimeValue(`${hours}:${minutes}`);
  }, [value]);

  function handleDaySelect(day: Date | undefined) {
    if (!day) return;
    const combined = combineDateAndTime(day, timeValue);
    if (combined) {
      onChange(combined);
    }
  }

  function handleTimeChange(newTime: string) {
    setTimeValue(newTime);
    const base = value ?? new Date();
    const combined = combineDateAndTime(base, newTime);
    if (combined) {
      onChange(combined);
    }
  }

  function applyPreset(preset: DatePreset) {
    const presetValue = preset.getValue();
    if (!presetValue) return;
    const hours = presetValue.getHours().toString().padStart(2, '0');
    const minutes = presetValue.getMinutes().toString().padStart(2, '0');
    setTimeValue(`${hours}:${minutes}`);
    onChange(presetValue);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          {value ? formatDateTime(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] space-y-4 p-4" align="start">
        {presets.length ? (
          <div className="flex flex-wrap gap-2">
            {presets.map(preset => (
              <Button
                key={preset.label}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        ) : null}
        <Calendar mode="single" selected={value ?? undefined} onSelect={handleDaySelect} initialFocus />
        <div className="flex items-center gap-2">
          <Label htmlFor={timeInputId} className="text-xs text-muted-foreground">
            Horário
          </Label>
          <Input
            id={timeInputId}
            type="time"
            value={timeValue}
            onChange={event => handleTimeChange(event.target.value)}
            step={60}
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            Limpar
          </Button>
          <Button type="button" size="sm" onClick={() => setOpen(false)}>
            Concluir
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CheckpointEditModal({
  open,
  onOpenChange,
  defaultValues,
  onSave,
  onRunNow,
}: CheckpointEditModalProps) {
  const [nextCheckpoint, setNextCheckpoint] = useState<Date | null>(null);
  const [suspendLeads, setSuspendLeads] = useState(false);
  const [leadsDuration, setLeadsDuration] = useState<SuspensionDuration>('1d');
  const [leadsUntil, setLeadsUntil] = useState<Date | null>(null);
  const [suspendRoletao, setSuspendRoletao] = useState(false);
  const [roletaoDuration, setRoletaoDuration] = useState<SuspensionDuration>('1d');
  const [roletaoUntil, setRoletaoUntil] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!open) return;
    const parsedNext = parseIsoDate(defaultValues?.nextCheckpointAt ?? null);
    setNextCheckpoint(parsedNext);

    const now = new Date();

    const parsedLeads = parseIsoDate(defaultValues?.suspendLeadsUntil ?? null);
    if (parsedLeads && parsedLeads.getTime() > now.getTime()) {
      setSuspendLeads(true);
      setLeadsDuration('custom');
      setLeadsUntil(parsedLeads);
    } else {
      setSuspendLeads(false);
      setLeadsDuration('1d');
      setLeadsUntil(null);
    }

    const parsedRoletao = parseIsoDate(defaultValues?.suspendRoletaoUntil ?? null);
    if (parsedRoletao && parsedRoletao.getTime() > now.getTime()) {
      setSuspendRoletao(true);
      setRoletaoDuration('custom');
      setRoletaoUntil(parsedRoletao);
    } else {
      setSuspendRoletao(false);
      setRoletaoDuration('1d');
      setRoletaoUntil(null);
    }

    setReason(defaultValues?.reason ?? '');
  }, [defaultValues, open]);

  useEffect(() => {
    if (!open) {
      setIsSaving(false);
      setIsRunning(false);
    }
  }, [open]);

  useEffect(() => {
    if (!suspendLeads) {
      setLeadsUntil(null);
    } else if (leadsDuration !== 'custom') {
      setLeadsUntil(computeSuspensionUntil(leadsDuration));
    }
  }, [suspendLeads, leadsDuration]);

  useEffect(() => {
    if (!suspendRoletao) {
      setRoletaoUntil(null);
    } else if (roletaoDuration !== 'custom') {
      setRoletaoUntil(computeSuspensionUntil(roletaoDuration));
    }
  }, [suspendRoletao, roletaoDuration]);

  const nextCheckpointPresets: DatePreset[] = useMemo(
    () => [
      {
        label: '+1 hora',
        getValue: () => {
          const candidate = new Date();
          candidate.setMinutes(0, 0, 0);
          candidate.setHours(candidate.getHours() + 1);
          return candidate;
        },
      },
      {
        label: 'Amanhã',
        getValue: () => {
          const tomorrow = addDays(new Date(), 1);
          return combineDateAndTime(tomorrow, '09:00');
        },
      },
      {
        label: 'Próxima segunda',
        getValue: () => {
          const monday = getUpcomingWeekday(new Date(), 1);
          return combineDateAndTime(monday, '09:00');
        },
      },
    ],
    [],
  );

  const isSaveDisabled =
    !nextCheckpoint ||
    (suspendLeads && !leadsUntil) ||
    (suspendRoletao && !roletaoUntil) ||
    isSaving;

  async function handleSave() {
    if (!onSave || isSaveDisabled) {
      onOpenChange(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        nextCheckpointAt: nextCheckpoint ? nextCheckpoint.toISOString() : null,
        suspendLeadsUntil: suspendLeads && leadsUntil ? leadsUntil.toISOString() : null,
        suspendRoletaoUntil: suspendRoletao && roletaoUntil ? roletaoUntil.toISOString() : null,
        reason: reason.trim() ? reason.trim() : null,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar CheckPoint', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRunNow() {
    if (!onRunNow || isRunning) return;
    setIsRunning(true);
    try {
      await onRunNow();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao executar checkpoint imediatamente', error);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar próximo CheckPoint</DialogTitle>
          <DialogDescription>
            Escolha quando recalcular os indicadores e, se necessário, suspenda automações por um período específico.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Próxima execução agendada</Label>
            <DateTimePicker
              value={nextCheckpoint}
              onChange={setNextCheckpoint}
              presets={nextCheckpointPresets}
              placeholder="Defina uma data para o próximo CheckPoint"
            />
            <p className="text-xs text-muted-foreground">
              Utilize os atalhos ou escolha manualmente data e horário para o próximo cálculo.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-border/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <PauseCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  Suspender recebimento de novos leads
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pausa temporariamente a distribuição automática de leads para este corretor.
                </p>
              </div>
              <Checkbox checked={suspendLeads} onCheckedChange={value => setSuspendLeads(value === true)} />
            </div>

            {suspendLeads ? (
              <div className="space-y-3">
                <RadioGroup
                  value={leadsDuration}
                  onValueChange={value => setLeadsDuration(value as SuspensionDuration)}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                  {SUSPENSION_OPTIONS.map(option => (
                    <label
                      key={option.value}
                      htmlFor={`leads-duration-${option.value}`}
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm font-medium transition-colors',
                        leadsDuration === option.value && 'border-primary bg-primary/10 text-primary',
                      )}
                    >
                      <RadioGroupItem
                        id={`leads-duration-${option.value}`}
                        value={option.value}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
                {leadsDuration === 'custom' ? (
                  <DateTimePicker
                    value={leadsUntil}
                    onChange={setLeadsUntil}
                    placeholder="Defina o término da suspensão"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Suspensão ativa até {formatShortDate(leadsUntil)}.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-4 rounded-xl border border-border/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <PauseCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  Suspender participação no roletão
                </Label>
                <p className="text-xs text-muted-foreground">
                  Impede que o corretor dispute leads no roletão durante o período selecionado.
                </p>
              </div>
              <Checkbox checked={suspendRoletao} onCheckedChange={value => setSuspendRoletao(value === true)} />
            </div>

            {suspendRoletao ? (
              <div className="space-y-3">
                <RadioGroup
                  value={roletaoDuration}
                  onValueChange={value => setRoletaoDuration(value as SuspensionDuration)}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                  {SUSPENSION_OPTIONS.map(option => (
                    <label
                      key={option.value}
                      htmlFor={`roletao-duration-${option.value}`}
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm font-medium transition-colors',
                        roletaoDuration === option.value && 'border-primary bg-primary/10 text-primary',
                      )}
                    >
                      <RadioGroupItem
                        id={`roletao-duration-${option.value}`}
                        value={option.value}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
                {roletaoDuration === 'custom' ? (
                  <DateTimePicker
                    value={roletaoUntil}
                    onChange={setRoletaoUntil}
                    placeholder="Defina o término da suspensão"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Suspensão ativa até {formatShortDate(roletaoUntil)}.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkpoint-reason" className="text-sm font-medium text-gray-900">
              Motivo (opcional)
            </Label>
            <Textarea
              id="checkpoint-reason"
              value={reason}
              onChange={event => setReason(event.target.value)}
              placeholder="Descreva o motivo da alteração para manter o histórico compartilhado com o time."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            {nextCheckpoint ? (
              <span>Próximo checkpoint agendado para {formatShortDate(nextCheckpoint)}.</span>
            ) : (
              <span>Defina uma data para habilitar o salvamento.</span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRunNow}
              disabled={!onRunNow || isRunning}
            >
              {isRunning ? 'Executando…' : (
                <span className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  Executar agora
                </span>
              )}
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
              {isSaving ? 'Salvando…' : 'Salvar CheckPoint'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
