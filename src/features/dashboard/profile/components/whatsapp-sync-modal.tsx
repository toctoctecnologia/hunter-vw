'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, QrCode, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { newWhatsAppHistorySession } from '@/features/dashboard/profile/api/whatsapp';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';

interface WhatsAppSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SessionResponse {
  status: boolean;
  session: {
    id: string;
    description: string;
  };
  qr: {
    dataUrl: string;
    imageBase64: string;
  };
}

interface SessionStatusResponse {
  status: boolean;
  state: 'CONNECTED' | null;
  qrAvailable: boolean;
  lastQrUpdatedAt: number; // timestamp
}

export function WhatsAppSyncModal({ open, onOpenChange }: WhatsAppSyncModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: newHistoryToken } = useMutation({
    mutationFn: (token: string) => newWhatsAppHistorySession(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-session-status'] });
      toast.success('WhatsApp conectado com sucesso!');
    },
  });

  const handleClose = () => {
    setQrCode(null);
    setSessionId(null);
    setIsConnected(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (sessionId && !isConnected) {
      const checkStatus = async () => {
        const { data } = await axios.get<SessionStatusResponse>(
          `https://whatezzapi.huntercrm.com.br/api/${sessionId}/status-session`,
        );

        if (data.state === 'CONNECTED') {
          setIsConnected(true);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          newHistoryToken(sessionId);

          // Fecha o modal após 2 segundos
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      };
      checkStatus();
      pollingIntervalRef.current = setInterval(checkStatus, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, isConnected]);

  const { mutate: createSession, isPending } = useMutation({
    mutationFn: async () => {
      const sessionId = `${user?.userInfo.name}-${user?.userInfo.uuid}`;
      const { data } = await axios.post<SessionResponse>(
        `https://whatezzapi.huntercrm.com.br/api/${sessionId}/start-session`,
        { description: `Conta Hunter - ${sessionId}` },
        { params: { waitQr: true, qrTimeout: 30000 } },
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.status && data.qr?.imageBase64) {
        setQrCode(data.qr.imageBase64);
        setSessionId(data.session.id);
        toast.success('QR Code gerado com sucesso!');
      } else {
        toast.error('Erro ao gerar QR Code');
      }
    },
  });

  const handleOpenModal = () => {
    if (!qrCode && !isPending) {
      createSession();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onOpenAutoFocus={handleOpenModal}>
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            Conectar WhatsApp
          </DialogTitle>
          <DialogDescription className="text-sm">Escaneie o QR Code para conectar sua conta</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {isPending && !qrCode && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
              </CardContent>
            </Card>
          )}

          {qrCode && (
            <>
              {!isConnected && (
                <>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-4">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${qrCode}`}
                          alt="QR Code WhatsApp"
                          className="h-48 w-48 rounded-lg border-2 border-border"
                        />
                        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] shadow-lg">
                          <QrCode className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed bg-muted/50">
                    <CardContent className="py-3">
                      <div className="flex items-start gap-2">
                        <Smartphone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium">Como conectar:</p>
                          <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal list-inside">
                            <li>Abra o WhatsApp no celular</li>
                            <li>Toque em Configurações → Aparelhos conectados</li>
                            <li>Toque em Conectar um aparelho</li>
                            <li>Escaneie o QR Code acima</li>
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {isConnected && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="flex items-center gap-2 py-3">
                    {isConnected && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-green-700">Conectado com sucesso!</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={handleClose} size="sm">
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
            {qrCode && (
              <Button onClick={() => createSession()} disabled={isPending} size="sm">
                <QrCode className="h-3 w-3 mr-1" />
                Novo QR Code
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
