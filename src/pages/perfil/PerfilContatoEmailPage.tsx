import { useState } from 'react';
import { Mail, Save, Loader2 } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useToast } from '@/hooks/use-toast';

export default function PerfilContatoEmailPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('contato@toctoc.com.br');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'E-mail atualizado',
        description: 'Seu e-mail foi atualizado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o e-mail.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPerfil
      icon={<Mail className="h-5 w-5 text-white" />}
      title="E-mail Principal"
      description="Atualize seu e-mail principal"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            aria-invalid={!!error}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Este e-mail será usado para notificações e comunicações importantes.
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
              Salvar E-mail
            </>
          )}
        </PrimaryButton>
      </form>
    </LayoutPerfil>
  );
}

