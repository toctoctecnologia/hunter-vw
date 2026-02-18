'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { STOMP_DESTINATIONS, StompFrame } from '@/shared/types/websocket';
import { LeadDetail, LeadIntensityType, LeadNegotiationType } from '@/shared/types';

import { useStompWebSocket } from '@/shared/hooks/use-stomp-websocket';
import { useAuth } from '@/shared/hooks/use-auth';

type QueueType = 'ROULETTE' | 'DISTRIBUTION';

interface WebSocketLeadPayload {
  token: string | null;
  type: string;
  content: string; // JSON stringificado com os dados do lead
  sender: string | null;
  queueType: QueueType;
}

interface LeadContentData {
  leadUuid: string;
  leadName: string;
  phone1: string;
  email: string;
  offerId: number;
  intensityType: string;
  negotiationType: string;
  messageToCatcher: string | null;
  expiresIn: number;
}

interface OfferResponseData {
  message: string;
}

export interface LeadWithQueueType extends LeadDetail {
  queueType: QueueType;
  expiresIn: number;
  offerId: number;
}

export function useLeadNotification() {
  const { user } = useAuth();

  const [currentLead, setCurrentLead] = useState<LeadWithQueueType | null>(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { isConnected, subscribe, send } = useStompWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL!,
    enabled: !!user?.userInfo.showRoulettePopup,
    onConnected: () => {
      toast.success('Conectado ao sistema de notificações em tempo real');
    },
    onDisconnected: () => {
      toast.info('Desconectado do sistema de notificações');
    },
    reconnectDelay: 5000,
    maxReconnectAttempts: 10,
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCurrentLead(null);
  }, []);

  const handleLeadMessage = useCallback(
    (frame: StompFrame) => {
      try {
        const payload: WebSocketLeadPayload = JSON.parse(frame.body);
        if (frame.headers.destination === '/user/offer/response' && payload.content) {
          const responseContent: OfferResponseData = JSON.parse(payload.content);
          setIsWaitingResponse(false);
          if (responseContent.message === 'Offer accepted successfully') {
            toast.success('Lead aceito com sucesso!');
            handleClose();
          } else if (responseContent.message === 'Offer expired or already accepted by another user') {
            toast.error('Oferta expirada ou já aceita por outro corretor');
            handleClose();
          } else {
            toast.error(responseContent.message || 'Erro ao aceitar lead');
            handleClose();
          }

          return;
        }

        if (payload.queueType === 'ROULETTE' && payload.content) {
          const leadContent: LeadContentData = JSON.parse(payload.content);
          const lead: Partial<LeadWithQueueType> = {
            uuid: leadContent.leadUuid,
            name: leadContent.leadName,
            phone1: leadContent.phone1,
            offerId: leadContent.offerId,
            email: leadContent.email,
            intensityType: leadContent.intensityType as LeadIntensityType,
            negotiationType: leadContent.negotiationType as LeadNegotiationType,
            queueType: payload.queueType,
            expiresIn: leadContent.expiresIn,
          };

          setCurrentLead(lead as LeadWithQueueType);
          setIsOpen(true);

          if (typeof window !== 'undefined' && 'Audio' in window) {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play();
          }
          toast.success(`Novo lead disponível: ${leadContent.leadName}`);
        }
      } catch (error) {
        console.error('[Lead Notification] Erro ao processar mensagem:', error);
      }
    },
    [handleClose],
  );

  // Inscreve nos tópicos de lead quando conectado
  useEffect(() => {
    if (!isConnected) return;
    const unsubscribeOffer = subscribe(STOMP_DESTINATIONS.USER_OFFER, handleLeadMessage);
    const unsubscribeResponse = subscribe(STOMP_DESTINATIONS.USER_OFFER_RESPONSE, handleLeadMessage);

    return () => {
      unsubscribeOffer();
      unsubscribeResponse();
    };
  }, [isConnected, subscribe, handleLeadMessage]);

  const handleAccept = useCallback(
    async (offerId: number) => {
      try {
        if (!currentLead) {
          toast.error('Lead não encontrado');
          return;
        }

        // Monta a mensagem WebSocket
        const message = { type: 'CHAT', content: offerId };

        // Envia a mensagem via WebSocket
        send('/hunter/roulette/accept', JSON.stringify(message));

        // Define estado de aguardando resposta
        setIsWaitingResponse(true);
        toast.info('Processando solicitação...');
      } catch (error) {
        console.error('[Lead Notification] Erro ao aceitar lead:', error);
        toast.error('Erro ao aceitar lead. Tente novamente.');
        setIsWaitingResponse(false);
        throw error;
      }
    },
    [currentLead, send],
  );

  return {
    lead: currentLead,
    isOpen,
    isConnected,
    isWaitingResponse,
    onClose: handleClose,
    onAccept: handleAccept,
  };
}
