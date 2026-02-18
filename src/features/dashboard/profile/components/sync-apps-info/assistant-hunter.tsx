import { useQuery } from '@tanstack/react-query';
import { Bot, CheckCircle, Copy, ExternalLink, HelpCircle, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/shared/hooks/use-auth';

import { getWhatsAppSessionStatus } from '@/features/dashboard/profile/api/whatsapp';

import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { hasFeature } from '@/shared/lib/permissions';

export function AssistantHunter() {
  const { user } = useAuth();

  const { data: whatsappSessionStatus } = useQuery({
    queryKey: ['whatsapp-session-status'],
    queryFn: () => getWhatsAppSessionStatus(),
  });

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copiado para a área de transferência!');
  };

  const getHunterAssistantStatus = () => {
    if (!whatsappSessionStatus) {
      return { status: 'NOT_FOUND', message: 'Carregando...' };
    }

    const status = whatsappSessionStatus.status;

    if (status === 'NOT_FOUND' || status === 'EXPIRED') {
      return {
        status: 'disconnected',
        message: 'Para gerar um código, busque algo pelo Assessor Hunter no WhatsApp',
        showAction: false,
      };
    }

    if (status === 'PENDING') {
      return {
        status: 'pending',
        message: 'Copie o código abaixo e envie para o Assessor Hunter no WhatsApp',
        token: whatsappSessionStatus.validationToken,
        showAction: true,
      };
    }

    if (status === 'VERIFIED') {
      return {
        status: 'verified',
        message: 'Conectado com sucesso! Você já pode usar o Assessor para realizar consultas.',
        showAction: false,
      };
    }

    return { status: 'unknown', message: 'Status desconhecido' };
  };

  const hunterStatus = getHunterAssistantStatus();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl items-center justify-center shadow-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>

            <div className="text-left">
              <p className="font-semibold text-lg">Assessor Hunter</p>
              <TypographyMuted>Sincronizar com Assessor no WhatsApp</TypographyMuted>
            </div>
          </div>

          {hunterStatus.status === 'verified' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
        </div>

        {hasFeature(user?.userInfo.profile.permissions, '1112') && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{hunterStatus.message}</p>

            {hunterStatus.status === 'disconnected' && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://wa.me/5547989085276?text=oi', '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chamar no WhatsApp
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href="https://huntercrm.com.br/centraldeajuda/codigodoassessorhunter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Ajuda
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            )}

            {hunterStatus.showAction && hunterStatus.token && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="flex-1 font-mono text-lg font-semibold tracking-wider">{hunterStatus.token}</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyToken(hunterStatus.token?.toString() || '')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
