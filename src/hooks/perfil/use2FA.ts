import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export function use2FA() {
  const [enabled, setEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const startSetup = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/2fa/setup', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start 2FA setup');
      return res.json() as Promise<{ qrCode: string }>;
    },
    onSuccess: data => {
      setQrCode(data.qrCode);
    },
  });

  const verify = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch('/api/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error('Invalid verification code');
    },
    onSuccess: () => {
      setEnabled(true);
      setQrCode('');
    },
  });

  const disable = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/2fa/disable', { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to disable 2FA');
    },
    onSuccess: () => setEnabled(false),
  });

  const downloadCodes = async () => {
    const res = await fetch('/api/2fa/backup-codes');
    if (!res.ok) throw new Error('Failed to download backup codes');
    const data = await res.json();
    const blob = new Blob([(data.codes || []).join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    enabled,
    qrCode,
    startSetup: startSetup.mutateAsync,
    verify: verify.mutateAsync,
    disable: disable.mutateAsync,
    downloadCodes,
    loading: startSetup.isPending || verify.isPending || disable.isPending,
    setupStep: qrCode ? 'verify' : 'idle',
  } as const;
}

export type Use2FAReturn = ReturnType<typeof use2FA>;
