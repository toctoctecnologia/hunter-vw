import { useState } from 'react';
import { Bell } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PerfilIALembretesPage() {
  const [schedule, setSchedule] = useState('daily');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    toast({ title: 'Salvando...', description: 'Atualizando lembretes.' });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetch('/api/ia/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule })
      });
      toast({
        title: 'Lembretes atualizados',
        description: 'Suas preferências de lembretes foram salvas.'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os lembretes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPerfil
      icon={<Bell className="h-5 w-5 text-white" />}
      title="Lembretes da IA"
      description="Defina a frequência dos lembretes"
    >
      <div className="space-y-6">
        <RadioGroup value={schedule} onValueChange={setSchedule} className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Diário</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Semanal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="off" id="off" />
            <Label htmlFor="off">Desligado</Label>
          </div>
        </RadioGroup>
        <PrimaryButton onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Salvar...
            </>
          ) : (
            'Salvar preferências'
          )}
        </PrimaryButton>
      </div>
    </LayoutPerfil>
  );
}

