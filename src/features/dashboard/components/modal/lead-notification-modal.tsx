'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import { LeadDetail, LeadIntensityType, LeadNegotiationType } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';

import { LeadWithQueueType } from '../../hooks/use-lead-notification';

export interface LeadNotificationDetail extends LeadDetail {
  expiresIn: number;
}

interface LeadNotificationModalProps {
  lead: LeadWithQueueType | null;
  open: boolean;
  onClose: () => void;
  onAccept: (offerId: number) => Promise<void>;
}

const intensityColors: Record<LeadIntensityType, string> = {
  QUENTE: 'bg-red-500 text-white',
  MORNO: 'bg-orange-500 text-white',
  FRIO: 'bg-blue-500 text-white',
  MUITO_FRIO: 'bg-slate-500 text-white',
};

const intensityLabels: Record<LeadIntensityType, string> = {
  QUENTE: 'Quente',
  MORNO: 'Morno',
  FRIO: 'Frio',
  MUITO_FRIO: 'Muito Frio',
};

const negotiationLabels: Record<LeadNegotiationType, string> = {
  COMPRA: 'Compra',
  ALUGUEL: 'Aluguel',
  LANCAMENTO: 'Lançamento',
  CAPTACAO: 'Captação',
  INDEFINIDO: 'Indefinido',
};

export function LeadNotificationModal({ lead, open, onClose, onAccept }: LeadNotificationModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!lead || !open) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(lead.expiresIn);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lead, open, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!lead) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept(lead.offerId);
      onClose();
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">Novo Lead Recebido!</DialogTitle>
              <DialogDescription className="mt-1">Um novo lead está disponível para atendimento</DialogDescription>
            </div>
            {timeLeft > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium text-orange-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg font-semibold">{lead.name}</p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{lead.phone1}</span>
            </div>

            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge className={intensityColors[lead.intensityType]}>{intensityLabels[lead.intensityType]}</Badge>
            <Badge variant="outline">{negotiationLabels[lead.negotiationType]}</Badge>
          </div>

          {/* Message */}
          {lead.messageToCatcher && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Mensagem:</p>
              <p className="text-sm text-muted-foreground">{lead.messageToCatcher}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isAccepting}>
              Ignorar
            </Button>
            <Button className="flex-1" onClick={handleAccept} disabled={isAccepting}>
              {isAccepting ? 'Aceitando...' : 'Aceitar Lead'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
