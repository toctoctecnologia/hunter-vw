'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import { CheckinItem, DistributionCheckinEventType } from '@/shared/types';
import { createClient } from '@/shared/lib/supabase/client';
import { getURL } from '@/shared/lib/utils';

import { newCheckin } from '@/features/dashboard/distribution/api/checkin';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ErrorModal } from '@/shared/components/modal/error-modal';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface CheckinHighlightCardProps {
  checkin: CheckinItem;
}

export function CheckinHighlightCard({ checkin }: CheckinHighlightCardProps) {
  const queryClient = useQueryClient();

  const [errorModal, setErrorModal] = useState<{ title: string; messages: string[] } | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);

  const checkinMutation = useMutation({
    mutationFn: () => newCheckin(checkin.queueUuid, DistributionCheckinEventType.CHECKIN),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
      toast.success('Check-in realizado com sucesso!');
    },
  });

  const showCheckinButton = checkin.hasActiveExecution && !checkin.checkedIn;

  async function handleOpenQrModal() {
    setLoadingQr(true);
    setQrModalOpen(true);

    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        toast.error('Não foi possível obter o token de autenticação.');
        setQrModalOpen(false);
        setLoadingQr(false);
        return;
      }

      const params = new URLSearchParams({
        queueUuid: checkin.queueUuid,
        eventType: DistributionCheckinEventType.CHECKIN,
        token,
      });

      const url = getURL(`public/check-in?${params.toString()}`);

      console.log(url);

      setQrUrl(url);
    } catch {
      toast.error('Erro ao gerar QR Code.');
      setQrModalOpen(false);
    } finally {
      setLoadingQr(false);
    }
  }

  useEffect(() => {
    if (!qrModalOpen) {
      setQrUrl(null);
    }
  }, [qrModalOpen]);

  return (
    <>
      {errorModal && (
        <ErrorModal
          open={true}
          title={errorModal.title}
          messages={errorModal.messages}
          onClose={() => setErrorModal(null)}
        />
      )}

      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code para Check-in</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code abaixo com seu celular para realizar o check-in na fila{' '}
              <strong>{checkin.queueName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-4">
            {loadingQr ? (
              <div className="flex items-center justify-center size-64">
                <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
              </div>
            ) : qrUrl ? (
              <div className="rounded-xl border bg-white p-4">
                <QRCodeSVG value={qrUrl} size={240} level="M" />
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Aponte a câmera do celular para o QR Code. O check-in será realizado automaticamente ao acessar o link.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div
        className="rounded-2xl p-4 border-l-4 border bg-card shadow-sm transition-all hover:shadow-md"
        style={{ borderLeftColor: checkin.queueColor }}
      >
        <div className="flex items-center justify-between mb-3 gap-4">
          <div className="px-2 rounded-full" style={{ backgroundColor: `${checkin.queueColor}20` }}>
            <span className="text-xs font-semibold" style={{ color: checkin.queueColor }}>
              Fila de Distribuição
            </span>
          </div>

          {checkin.checkedIn && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="size-4" />
              <span className="text-xs font-medium">Check-in feito</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold text-card-foreground line-clamp-1">{checkin.queueName}</h3>
        </div>

        {checkin.queueDescription && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{checkin.queueDescription}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <Badge>{checkin.queueIsActive ? 'Ativa' : 'Inativa'}</Badge>
          {checkin.hasActiveExecution && <Badge variant="outline">Execução em andamento</Badge>}
        </div>

        {showCheckinButton && (
          <div className="flex gap-2">
            <Button onClick={() => checkinMutation.mutate()} isLoading={checkinMutation.isPending} className="flex-1">
              Fazer check-in
            </Button>
            <Button variant="outline" size="icon" onClick={handleOpenQrModal} title="Check-in via QR Code">
              <QrCode className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
