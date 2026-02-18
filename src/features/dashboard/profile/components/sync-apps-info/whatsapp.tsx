import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import { useAuth } from '@/shared/hooks/use-auth';

import { getWhatsAppSessionStatus, deleteWhatsAppHistorySession } from '@/features/dashboard/profile/api/whatsapp';

import { WhatsAppSyncModal } from '@/features/dashboard/profile/components/whatsapp-sync-modal';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { hasFeature } from '@/shared/lib/permissions';

export function Whatsapp() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  const { data: whatsappSessionStatus } = useQuery({
    queryKey: ['whatsapp-session-status'],
    queryFn: () => getWhatsAppSessionStatus(),
  });

  const { mutate: removeHistoryToken, isPending: isRemovingHistoryToken } = useMutation({
    mutationFn: deleteWhatsAppHistorySession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-session-status'] });
      toast.success('Sessão do WhatsApp encerrada com sucesso');
    },
  });

  const { mutate: closeSession, isPending: isClosingSession } = useMutation({
    mutationFn: async () => {
      const token = whatsappSessionStatus?.historySessionToken;
      await axios.post(`https://whatezzapi.huntercrm.com.br/api/${token}/close-session`);
    },
    onSuccess: () => {
      removeHistoryToken();
    },
  });

  const handleSyncWhatsApp = () => {
    setWhatsappModalOpen(true);
  };

  const isConnected = Boolean(whatsappSessionStatus?.historySessionToken);

  return (
    <>
      <WhatsAppSyncModal open={whatsappModalOpen} onOpenChange={setWhatsappModalOpen} />

      <Card>
        <CardContent className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex w-12 h-12 bg-[#25D366] rounded-xl items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>

            <div className="text-left">
              <p className="font-semibold text-lg">WhatsApp</p>
              <TypographyMuted>Sincronizar com WhatsApp</TypographyMuted>
              {isConnected && <span className="text-green-600 text-xs font-semibold block mt-1">Conectado</span>}
            </div>
          </div>

          {isConnected ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => closeSession()}
              disabled={isClosingSession || isRemovingHistoryToken}
            >
              {isClosingSession || isRemovingHistoryToken ? 'Desconectando...' : 'Desconectar'}
            </Button>
          ) : (
            <>
              {hasFeature(user?.userInfo.profile.permissions, '1108') && (
                <Button size="sm" onClick={() => handleSyncWhatsApp()}>
                  Configurar
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
