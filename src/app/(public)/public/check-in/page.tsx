'use client';

import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react';
import { useEffect, useRef } from 'react';
import axios from 'axios';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

async function performCheckin(queueUuid: string, eventType: string, token: string) {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/distribution/checkin`,
    { queueId: queueUuid, eventType },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);

  const queueUuid = searchParams.get('queueUuid');
  const eventType = searchParams.get('eventType');
  const token = searchParams.get('token');

  const isValid = !!(queueUuid && eventType && token);

  const checkinMutation = useMutation({
    mutationFn: () => performCheckin(queueUuid!, eventType!, token!),
  });

  useEffect(() => {
    if (isValid && !hasTriggered.current) {
      hasTriggered.current = true;
      checkinMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-2">
              <XCircle className="size-8 text-destructive" />
            </div>
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              O link de check-in está incompleto ou é inválido. Solicite um novo QR Code pelo sistema.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (checkinMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 mb-2">
              <Loader2 className="size-8 text-primary animate-spin" />
            </div>
            <CardTitle>Realizando check-in...</CardTitle>
            <CardDescription>Aguarde enquanto processamos seu check-in.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (checkinMutation.isError) {
    const error = checkinMutation.error as unknown as {
      response?: { data?: { messagePtBr?: string; message?: string } };
    };
    const message =
      error?.response?.data?.messagePtBr ||
      error?.response?.data?.message ||
      'Ocorreu um erro ao realizar o check-in. Tente novamente.';

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-center items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 mb-2">
              <XCircle className="size-8 text-destructive " />
            </div>
            <CardTitle>Erro no check-in</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => checkinMutation.mutate()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkinMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10 mb-2">
              <CheckCircle className="size-8 text-green-500" />
            </div>
            <CardTitle>Check-in realizado!</CardTitle>
            <CardDescription>Seu check-in foi registrado com sucesso. Você já pode fechar esta página.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <QrCode className="size-4" />
              <span className="text-sm">Check-in via QR Code</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
