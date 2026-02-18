import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_THRESHOLDS,
  type SLAThresholds,
  validate
} from '@/features/settings/thresholds';

interface ThresholdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thresholds: SLAThresholds;
  onSave: (thresholds: SLAThresholds) => void;
}

type FormValues = {
  greenMax: string;
  yellowMax: string;
};

const ThresholdsDialog: React.FC<ThresholdsDialogProps> = ({
  open,
  onOpenChange,
  thresholds,
  onSave
}) => {
  const [formValues, setFormValues] = useState<FormValues>(() => ({
    greenMax: thresholds.greenMax.toString(),
    yellowMax: thresholds.yellowMax.toString()
  }));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormValues({
        greenMax: thresholds.greenMax.toString(),
        yellowMax: thresholds.yellowMax.toString()
      });
      setError(null);
    }
  }, [open, thresholds]);

  const handleChange = (field: keyof FormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setFormValues((prev) => ({
        ...prev,
        [field]: value
      }));
      setError(null);
    };

  const handleRestoreDefaults = () => {
    setFormValues({
      greenMax: DEFAULT_THRESHOLDS.greenMax.toString(),
      yellowMax: DEFAULT_THRESHOLDS.yellowMax.toString()
    });
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formValues.greenMax.trim() === '' || formValues.yellowMax.trim() === '') {
      setError('Preencha os dois limites.');
      return;
    }

    const parsedGreen = Number(formValues.greenMax);
    const parsedYellow = Number(formValues.yellowMax);

    if (!Number.isFinite(parsedGreen) || !Number.isFinite(parsedYellow)) {
      setError('Os valores informados devem ser números.');
      return;
    }

    const sanitized: SLAThresholds = {
      greenMax: Math.floor(parsedGreen),
      yellowMax: Math.floor(parsedYellow)
    };

    if (!validate(sanitized)) {
      setError('Limites inválidos. Verifique se verde < amarelo e que os valores estão no intervalo permitido.');
      return;
    }

    setError(null);
    onSave(sanitized);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Editar limites de SLA</DialogTitle>
            <DialogDescription>
              Ajuste os intervalos utilizados para categorizar o tempo desde o último contato com o cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold-green">Limite verde (dias)</Label>
              <Input
                id="threshold-green"
                type="number"
                min={1}
                max={365}
                value={formValues.greenMax}
                onChange={handleChange('greenMax')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold-yellow">Limite amarelo (dias)</Label>
              <Input
                id="threshold-yellow"
                type="number"
                min={1}
                max={365}
                value={formValues.yellowMax}
                onChange={handleChange('yellowMax')}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={handleRestoreDefaults}>
              Restaurar padrões
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { ThresholdsDialog };
