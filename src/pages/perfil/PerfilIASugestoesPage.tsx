import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function PerfilIASugestoesPage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    toast({ title: 'Atualizando...', description: 'Salvando preferências.' });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetch('/api/ia/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: checked })
      });
      setEnabled(checked);
      toast({
        title: checked ? 'Sugestões ativadas' : 'Sugestões desativadas',
        description: checked
          ? 'Você receberá sugestões automáticas da IA.'
          : 'As sugestões automáticas foram desativadas.'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as sugestões.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPerfil
      icon={<Wand2 className="h-5 w-5 text-white" />}
      title="Sugestões da IA"
      description="Gerencie as sugestões automáticas"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-medium">Sugestões automáticas</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ative para receber recomendações personalizadas.
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={loading}
        />
      </div>
    </LayoutPerfil>
  );
}

