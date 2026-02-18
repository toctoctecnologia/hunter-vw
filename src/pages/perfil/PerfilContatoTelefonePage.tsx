import { useState } from 'react';
import { Phone, Save, Loader2 } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useToast } from '@/hooks/use-toast';

export default function PerfilContatoTelefonePage() {
  const [loading, setLoading] = useState(false);
  const [telefone, setTelefone] = useState('(47) 97367-3966');
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setTelefone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Telefone atualizado',
        description: 'Seu telefone foi atualizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o telefone.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPerfil
      icon={<Phone className="h-5 w-5 text-white" />}
      title="Telefone Principal"
      description="Atualize seu telefone principal"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={telefone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
            required
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Este telefone será usado para contatos importantes e verificações.
          </p>
        </div>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Telefone
            </>
          )}
        </PrimaryButton>
      </form>
    </LayoutPerfil>
  );
}

