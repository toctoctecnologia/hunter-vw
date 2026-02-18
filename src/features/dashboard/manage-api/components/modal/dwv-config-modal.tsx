'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { updateDwvIntegrationToken } from '../../api/dwv';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Modal } from '@/shared/components/ui/modal';

interface DwvConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
}

export function DwvConfigModal({ open, onOpenChange, token }: DwvConfigModalProps) {
  const queryClient = useQueryClient();
  const [inputToken, setInputToken] = useState(token || '');

  useEffect(() => {
    if (open) {
      setInputToken(token || '');
    }
  }, [open, token]);

  const { mutate: saveToken, isPending: isSavingToken } = useMutation({
    mutationFn: () => updateDwvIntegrationToken(true, inputToken),
    onSuccess: () => {
      toast.success('Token DWV salvo com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['dwv-integration'] });
      onOpenChange(false);
    },
  });

  function handleCopyToken() {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success('Token copiado para área de transferência!');
    }
  }

  function handleSaveToken() {
    if (!inputToken.trim()) {
      toast.error('Por favor, insira um token válido');
      return;
    }
    saveToken();
  }

  return (
    <Modal
      title="Integração DWV"
      description="Configure a integração com a plataforma DWV inserindo o token de acesso."
      open={open}
      onClose={() => onOpenChange(false)}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Token de Integração DWV</Label>
            {token && (
              <Button size="sm" variant="outline" onClick={handleCopyToken}>
                <Copy className="h-4 w-4" />
                Copiar Token
              </Button>
            )}
          </div>
          <Input
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            placeholder="Cole aqui o token DWV"
            className="font-mono text-sm"
          />
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <h4 className="font-semibold text-sm">Como obter o token DWV</h4>

          <div className="space-y-2 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Acesse sua conta na plataforma DWV</li>
              <li>Navegue até as configurações de integrações</li>
              <li>Gere ou copie o token de API</li>
              <li>Cole o token no campo acima</li>
            </ol>

            <div className="mt-4 p-3 bg-background rounded border">
              <p className="font-medium text-foreground text-xs mb-2">Importante:</p>
              <p className="text-xs">
                O token é necessário para sincronizar seus imóveis e leads entre o Hunter CRM e a plataforma DWV.
                Mantenha seu token em segurança e não o compartilhe.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={handleSaveToken} isLoading={isSavingToken}>
            <Save className="h-4 w-4" />
            Salvar Token
          </Button>
        </div>
      </div>
    </Modal>
  );
}
