import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { maskSecret } from '@/api/webhooks';
import type {
  WebhookConfig,
  WebhookEvent,
  WebhookPreset,
  WebhookTestResult,
} from '@/types/webhooks';

const steps = [
  {
    title: 'Eventos e presets',
    description: 'Escolha um preset ou selecione manualmente os eventos a disparar.',
  },
  {
    title: 'Endpoint e segurança',
    description: 'Informe a URL de destino e configure o secret do webhook.',
  },
  {
    title: 'Revisão e teste',
    description: 'Valide as escolhas e, se quiser, realize um disparo de teste.',
  },
];

interface WebhookWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: WebhookConfig | null;
  presets: WebhookPreset[];
  events: WebhookEvent[];
  canManage: boolean;
  onSubmit: (config: WebhookConfig) => Promise<void>;
  onTest: () => Promise<WebhookTestResult>;
}

type StepErrors = {
  events?: string;
  targetUrl?: string;
  secret?: string;
};

function generateLocalSecret(): string {
  const array = new Uint8Array(12);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return `whsec_${Array.from(array, value => value.toString(16).padStart(2, '0')).join('')}`;
}

export function WebhookWizard({
  open,
  onOpenChange,
  config,
  presets,
  events,
  canManage,
  onSubmit,
  onTest,
}: WebhookWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [errors, setErrors] = useState<StepErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const readOnly = !canManage;

  const eventsByCategory = useMemo(() => {
    return events.reduce<Record<string, WebhookEvent[]>>((acc, event) => {
      acc[event.category] = acc[event.category] ?? [];
      acc[event.category].push(event);
      return acc;
    }, {});
  }, [events]);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setSelectedEvents(config?.events ?? []);
    setSelectedPreset(config?.presetId ?? null);
    setTargetUrl(config?.targetUrl ?? '');
    setSecret(config?.secret ?? '');
    setErrors({});
    setTestResult(null);
    setTestError(null);
  }, [open, config]);

  const validateStep = (currentStep: number): boolean => {
    const nextErrors: StepErrors = {};
    if (currentStep === 0) {
      if (selectedEvents.length === 0) {
        nextErrors.events = 'Selecione ao menos um evento para prosseguir.';
      }
    }
    if (currentStep === 1 || currentStep === 2) {
      if (!/^https?:\/\//.test(targetUrl)) {
        nextErrors.targetUrl = 'Informe uma URL iniciando com http:// ou https://';
      }
      if (secret.length < 12) {
        nextErrors.secret = 'O secret deve possuir ao menos 12 caracteres.';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handlePresetSelect = (preset: WebhookPreset) => {
    setSelectedPreset(preset.id);
    setSelectedEvents(preset.eventIds);
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId],
    );
  };

  const handleSubmit = async () => {
    if (readOnly) {
      onOpenChange(false);
      return;
    }
    if (!validateStep(step)) return;

    const payload: WebhookConfig = {
      enabled: config?.enabled ?? true,
      targetUrl,
      secret,
      events: selectedEvents,
      presetId: selectedPreset,
      lastDelivery: config?.lastDelivery ?? null,
      lastRotation: config?.lastRotation ?? null,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      toast({
        title: 'Webhook atualizado',
        description: 'As configurações foram salvas com sucesso.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Não foi possível salvar',
        description:
          error instanceof Error
            ? error.message
            : 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      const result = await onTest();
      setTestResult(result);
      toast({
        title: 'Envio de teste concluído',
        description: result.message,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'O disparo de teste falhou.';
      setTestError(message);
      toast({
        title: 'Falha no envio de teste',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configuração de webhook genérico</DialogTitle>
          <DialogDescription>
            Etapa {step + 1} de {steps.length}: {steps[step].title}
          </DialogDescription>
        </DialogHeader>

        {readOnly && (
          <Alert className="mt-2 border-warning/60 bg-warning/10">
            <AlertTitle>Modo somente leitura</AlertTitle>
            <AlertDescription>
              Você possui apenas a permissão <code>integrations:view</code>. Para
              alterar as configurações, solicite acesso com
              <code>integrations:manage</code>.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          {steps[step].description}
        </p>

        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {presets.map(preset => {
                const isActive = selectedPreset === preset.id;
                return (
                  <Button
                    key={preset.id}
                    type="button"
                    variant={isActive ? 'secondary' : 'outline'}
                    className={cn(
                      'flex flex-col items-start gap-1 h-full text-left',
                      !canManage && 'pointer-events-none opacity-75',
                    )}
                    onClick={() => handlePresetSelect(preset)}
                    disabled={readOnly}
                  >
                    <div className="flex items-center gap-2">
                      {preset.name}
                      {preset.recommended && (
                        <Badge variant="success">Recomendado</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {preset.description}
                    </span>
                  </Button>
                );
              })}
            </div>

            <Separator />

            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                {Object.entries(eventsByCategory).map(([category, list]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-semibold">{category}</h4>
                    <div className="space-y-2">
                      {list.map(event => (
                        <Label
                          key={event.id}
                          className={cn(
                            'flex items-start gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50',
                            selectedEvents.includes(event.id)
                              ? 'border-primary'
                              : 'border-border',
                            readOnly && 'pointer-events-none opacity-70',
                          )}
                        >
                          <Checkbox
                            checked={selectedEvents.includes(event.id)}
                            onCheckedChange={() => toggleEvent(event.id)}
                            disabled={readOnly}
                          />
                          <span>
                            <span className="font-medium block">{event.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {event.description}
                            </span>
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {errors.events && (
              <p className="text-sm text-destructive">{errors.events}</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">URL de destino</Label>
              <Input
                id="targetUrl"
                placeholder="https://sua-plataforma.com/webhooks"
                value={targetUrl}
                onChange={event => setTargetUrl(event.target.value)}
                disabled={readOnly}
              />
              {errors.targetUrl && (
                <p className="text-sm text-destructive">{errors.targetUrl}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret">Secret</Label>
              <div className="flex gap-2">
                <Input
                  id="secret"
                  type="password"
                  value={secret}
                  onChange={event => setSecret(event.target.value)}
                  disabled={readOnly}
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSecret(generateLocalSecret())}
                  disabled={readOnly}
                >
                  Gerar secret
                </Button>
              </div>
              {errors.secret && (
                <p className="text-sm text-destructive">{errors.secret}</p>
              )}
            </div>
            <Alert className="border-border bg-muted/40">
              <AlertTitle>Boas práticas</AlertTitle>
              <AlertDescription>
                Utilize HTTPS com TLS moderno, valide a assinatura HMAC e
                rotacione o secret periodicamente. Recomendamos armazenar o
                secret em um cofre de segredos dedicado.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold">Eventos selecionados</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedEvents.map(eventId => {
                  const event = events.find(item => item.id === eventId);
                  return (
                    <Badge key={eventId} variant="outline">
                      {event?.name ?? eventId}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Endpoint configurado</h4>
              <p className="text-sm text-muted-foreground break-all">
                {targetUrl}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Secret</h4>
              <p className="text-sm font-mono">{maskSecret(secret)}</p>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={readOnly || isTesting}
              >
                {isTesting ? 'Enviando teste...' : 'Enviar teste agora'}
              </Button>
              {testResult && (
                <Alert className="border-green-500/70 bg-green-500/10 text-green-900 dark:text-green-200">
                  <AlertTitle>Teste bem sucedido</AlertTitle>
                  <AlertDescription>
                    {testResult.message} (ID: {testResult.requestId})
                  </AlertDescription>
                </Alert>
              )}
              {testError && (
                <Alert variant="destructive">
                  <AlertTitle>Falha no teste</AlertTitle>
                  <AlertDescription>{testError}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="text-xs text-muted-foreground">
            Etapa {step + 1} de {steps.length}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={handlePrevious} disabled={step === 0}>
              Voltar
            </Button>
            {step < steps.length - 1 && (
              <Button type="button" onClick={handleNext} disabled={readOnly}>
                Avançar
              </Button>
            )}
            {step === steps.length - 1 && (
              <Button
                type="button"
                variant="orange"
                onClick={handleSubmit}
                disabled={isSubmitting || readOnly}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar configurações'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WebhookWizard;
