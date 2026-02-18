import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import type { Connector } from '@/lib/mock/connectors';

interface ConnectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connector: Connector;
  onSave: (connector: Connector) => void;
}

export function ConnectorModal({ open, onOpenChange, connector, onSave }: ConnectorModalProps) {
  const credProperties =
    (connector.credentialsSchema as { properties?: Record<string, unknown> })
      .properties ?? {};

  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [mapping, setMapping] = useState<{ remote: string; local: string }[]>([
    { remote: 'nome', local: 'nome' },
    { remote: 'email', local: 'email' },
    { remote: 'telefone', local: 'telefone' },
  ]);
  const [autoSync, setAutoSync] = useState(false);
  const [frequency, setFrequency] = useState('15min');
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [nextRun, setNextRun] = useState<Date | null>(null);
  const [step, setStep] = useState(0);
  const [tested, setTested] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const stepLabels = [
    'Inserir credenciais',
    'Testar conexão',
    'Definir mapeamentos',
    'Configurar sincronização',
  ];

  const frequencyMs: Record<string, number> = {
    '15min': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
  };

  useEffect(() => {
    setCredentials(connector.settings?.credentials ?? {});
    setMapping(
      connector.settings?.mapping ?? [
        { remote: 'nome', local: 'nome' },
        { remote: 'email', local: 'email' },
        { remote: 'telefone', local: 'telefone' },
      ],
    );
    setAutoSync(connector.settings?.autoSync ?? false);
    setFrequency(connector.settings?.frequency ?? '15min');
    setLastRun(
      connector.settings?.lastRun ? new Date(connector.settings.lastRun) : null,
    );
    setNextRun(
      connector.settings?.nextRun ? new Date(connector.settings.nextRun) : null,
    );
    setStep(0);
    setTested(false);
    setTestResult(null);
  }, [connector, open]);

  useEffect(() => {
    if (autoSync) {
      const base = lastRun ?? new Date();
      setNextRun(new Date(base.getTime() + frequencyMs[frequency]));
    } else {
      setNextRun(null);
    }
  }, [autoSync, frequency, lastRun]);

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
  };

  const handleMappingChange = (
    index: number,
    field: 'remote' | 'local',
    value: string,
  ) => {
    setMapping((prev) =>
      prev.map((pair, i) => (i === index ? { ...pair, [field]: value } : pair)),
    );
  };

  const addMappingPair = () => {
    setMapping((prev) => [...prev, { remote: '', local: '' }]);
  };

  const handleTest = () => {
    const success = Math.random() > 0.5;
    toast({
      title: 'Testar conexão',
      description: success
        ? 'Conexão testada com sucesso.'
        : 'Falha na conexão.',
      variant: success ? 'default' : 'destructive',
    });
    setTested(true);
    setTestResult(success ? 'success' : 'error');
  };

  const handleSync = () => {
    const success = Math.random() > 0.5;
    toast({
      title: 'Sincronização',
      description: success
        ? 'Sincronização concluída.'
        : 'Falha na sincronização.',
      variant: success ? 'default' : 'destructive',
    });
    if (success) {
      const now = new Date();
      setLastRun(now);
      if (autoSync) {
        setNextRun(new Date(now.getTime() + frequencyMs[frequency]));
      }
    }
  };

  const handleSave = () => {
    const data = {
      credentials,
      mapping,
      autoSync,
      frequency,
      lastRun: lastRun?.toISOString() ?? null,
      nextRun: nextRun?.toISOString() ?? null,
    };

    try {
      localStorage.setItem(`connector-${connector.id}`, JSON.stringify(data));
      toast({
        title: 'Configurações salvas',
        description: 'As configurações foram salvas localmente.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    }

    onSave({ ...connector, settings: data });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const fieldOptions = ['nome', 'email', 'telefone', 'empresa', 'cargo'];
  const fieldDescriptions: Record<string, string> = {
    nome: 'Nome completo do contato',
    email: 'Endereço de e-mail',
    telefone: 'Número de telefone',
  };

  const progress = (step / (stepLabels.length - 1)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{connector.nome}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Etapa {step + 1} de {stepLabels.length}: {stepLabels[step]}
          </p>
        </DialogHeader>
        <Progress value={progress} className="mt-2" />
        {step === 0 && (
          <div className="mt-4 space-y-2">
            {Object.keys(credProperties).map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  value={credentials[key] ?? ''}
                  onChange={(e) => handleCredentialChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="mt-4 space-y-4">
            <Button variant="secondary" onClick={handleTest}>
              Testar conexão
            </Button>
            {tested && (
              <p className="text-sm text-muted-foreground">
                {testResult === 'success'
                  ? 'Conexão testada com sucesso.'
                  : 'Falha na conexão.'}
              </p>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="mt-4 space-y-2">
            {mapping.map((pair, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    value={pair.remote}
                    placeholder="Campo remoto"
                    onChange={(e) =>
                      handleMappingChange(index, 'remote', e.target.value)
                    }
                  />
                  <span className="text-sm text-muted-foreground">→</span>
                  <Select
                    value={pair.local}
                    onValueChange={(value) =>
                      handleMappingChange(index, 'local', value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Campo local" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldDescriptions[pair.remote] && (
                  <p className="text-xs text-muted-foreground ml-1">
                    {fieldDescriptions[pair.remote]}
                  </p>
                )}
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addMappingPair}>
              Adicionar campo
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-sync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
                <Label htmlFor="auto-sync">Sincronização automática</Label>
              </div>
              <Select
                value={frequency}
                onValueChange={setFrequency}
                disabled={!autoSync}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15min</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="6h">6h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSync}>Sincronizar agora</Button>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Última execução {lastRun ? lastRun.toLocaleString() : '-'}</p>
              <p>Próxima: {nextRun ? nextRun.toLocaleString() : '-'}</p>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={prevStep}>
              Voltar
            </Button>
          )}
          {step < stepLabels.length - 1 ? (
            <Button onClick={nextStep} disabled={step === 1 && !tested}>
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSave}>Salvar</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectorModal;
