import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDistribuicaoConfig } from '@/hooks/distribuicao';
import type { DistribuicaoConfig } from '@/types/distribuicao';

export default function ConfiguracoesTab() {
  const { config, load, save } = useDistribuicaoConfig();
  const { toast } = useToast();
  const [form, setForm] = useState<DistribuicaoConfig>(config);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setForm(config);
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await save(form);
      toast({ title: 'Configurações salvas' });
    } catch {
      toast({ title: 'Erro ao salvar configurações' });
    }
  };

  return (
    <Card className="p-4 max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Configurações</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timeoutMin">Timeout (minutos)</Label>
          <Input
            id="timeoutMin"
            type="number"
            value={form.timeoutMin}
            onChange={(e) => setForm({ ...form, timeoutMin: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="redistribuicaoGlobal">Redistribuição global</Label>
          <Switch
            id="redistribuicaoGlobal"
            checked={form.redistribuicaoGlobal}
            onCheckedChange={(v) => setForm({ ...form, redistribuicaoGlobal: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inicio">Horário início</Label>
            <Input
              id="inicio"
              type="time"
              value={form.horarioInicio}
              onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fim">Horário fim</Label>
            <Input
              id="fim"
              type="time"
              value={form.horarioFim}
              onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
            />
          </div>
        </div>
        <Button type="submit">Salvar</Button>
      </form>
    </Card>
  );
}
