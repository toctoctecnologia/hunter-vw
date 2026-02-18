'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { connect } from '@/features/dashboard/profile/api/apple-calendar';

import { ModalProps } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Modal } from '@/shared/components/ui/modal';

export function AppleCalendarModal({ open, onClose }: Omit<ModalProps, 'title'>) {
  const queryClient = useQueryClient();

  const [appPassword, setAppPassword] = useState('');
  const [appleId, setAppleId] = useState('');

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: () => connect(appleId, appPassword),
    onSuccess: () => {
      toast.success('Apple Calendar conectado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['apple-calendar-status'] });
      onClose();
    },
  });

  function handleSubmit() {
    if (!appleId.trim()) {
      toast.error('Por favor, insira seu Apple ID (email)');
      return;
    }

    if (!appPassword.trim()) {
      toast.error('Por favor, insira a senha específica do app');
      return;
    }

    saveSettings();
  }

  return (
    <Modal
      title="Conectar Apple Calendar"
      description="Conecte seu calendário Apple para sincronizar seus eventos e compromissos."
      open={open}
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apple-id">Apple ID (email)</Label>
            <Input
              id="apple-id"
              type="email"
              value={appleId}
              onChange={(e) => setAppleId(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="app-password">Senha Específica do App</Label>
            <Input
              id="app-password"
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <h4 className="font-semibold text-sm">Como gerar uma senha específica de app</h4>

          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>
              Acesse
              <a
                href="https://appleid.apple.com/account/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mx-1 font-medium hover:underline"
              >
                appleid.apple.com
              </a>
              e faça login
            </li>
            <li>Procure por &quot;Senhas específicas de apps&quot;</li>
            <li>Clique em &quot;Gerar uma senha específica de app&quot;</li>
            <li>Dê um nome (ex: &quot;Hunter CRM&quot;) e copie a senha gerada</li>
            <li>Cole a senha no campo acima</li>
          </ol>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} isLoading={isPending}>
            <Save className="h-4 w-4" />
            Conectar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
