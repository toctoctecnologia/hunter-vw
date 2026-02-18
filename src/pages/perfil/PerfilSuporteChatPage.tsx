import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useToast } from '@/hooks/use-toast';

export default function PerfilSuporteChatPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast({ title: 'Enviando...', description: 'Aguarde.' });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      setMessage('');
      toast({ title: 'Mensagem enviada', description: 'Nossa equipe responderá em breve.' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível enviar a mensagem.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutPerfil
      icon={<MessageCircle className="h-5 w-5 text-white" />}
      title="Suporte via Chat"
      description="Fale com o suporte pelo chat"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-dashed p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Widget de chat ao vivo aparecerá aqui
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Como podemos ajudar?"
              required
            />
          </div>
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Enviar Mensagem
              </>
            )}
          </PrimaryButton>
        </form>
      </div>
    </LayoutPerfil>
  );
}

