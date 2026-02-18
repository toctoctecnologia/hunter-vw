'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { downloadCnmIntegrationData, updateCnmIntegrationToken } from '@/features/dashboard/manage-api/api/cnm';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Modal } from '@/shared/components/ui/modal';

interface CnmConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
}

export function CnmConfigModal({ open, onOpenChange, token }: CnmConfigModalProps) {
  const queryClient = useQueryClient();
  const [isDownloading, setIsDownloading] = useState(false);

  const apiUrl = token
    ? `https://api.huntercrm.com.br/api/webhook/cnm/download?token=${token}`
    : 'https://api.huntercrm.com.br/api/webhook/cnm/download?token={seu_token}';

  const { mutate: updateToken, isPending: isUpdatingToken } = useMutation({
    mutationFn: updateCnmIntegrationToken,
    onSuccess: () => {
      toast.success('Token atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cnm-integration'] });
    },
  });

  async function handleTestDownload() {
    if (!token) {
      toast.error('Token não disponível');
      return;
    }

    try {
      setIsDownloading(true);
      const data = await downloadCnmIntegrationData(token);

      // Criar um blob e fazer download do arquivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cnm-integration-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Download realizado com sucesso!');
    } finally {
      setIsDownloading(false);
    }
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(apiUrl);
    toast.success('URL copiada para área de transferência!');
  }

  return (
    <Modal
      title="Integração Chaves na Mão (CNM)"
      description="Configure e teste a integração com a API externa do Chaves na Mão."
      open={open}
      onClose={() => onOpenChange(false)}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Token de Integração</Label>
            <Button size="sm" variant="outline" onClick={() => updateToken()} isLoading={isUpdatingToken}>
              <RefreshCw className="h-4 w-4" />
              Gerar Novo Token
            </Button>
          </div>
          <Input value={token || 'Carregando...'} readOnly className="font-mono text-sm" />
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <h4 className="font-semibold text-sm">Como usar a API</h4>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Para integrar com o sistema Chaves na Mão, ela deve fazer uma requisição GET para o endpoint abaixo:</p>

            <div className="space-y-2 mt-3">
              <Label className="text-xs">Endpoint:</Label>
              <div className="flex gap-2">
                <div className="w-full">
                  <Input value={apiUrl} readOnly className="font-mono text-xs" />
                </div>
                <Button variant="outline" onClick={handleCopyUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-medium text-foreground">Passos:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Copie o token de integração acima</li>
                <li>Configure a API do Chaves na Mão para fazer requisições GET</li>
                <li>
                  Adicione o token como parâmetro na URL:{' '}
                  <code className="text-xs bg-background px-1 py-0.5 rounded">?token=&#123;seu_token&#125;</code>
                </li>
                <li>A resposta será um arquivo JSON com os dados da integração</li>
              </ol>
            </div>

            <div className="mt-4 p-3 bg-background rounded border">
              <p className="font-medium text-foreground text-xs mb-2">Exemplo de requisição:</p>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {`GET https://api.huntercrm.com.br/api/webhook/cnm/download?token=${token || '{seu_token}'}`}
              </pre>
            </div>
          </div>
        </div>

        {token && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>

            <Button onClick={handleTestDownload} disabled={isDownloading}>
              <Download className={`h-4 w-4 ${isDownloading ? 'animate-pulse' : ''}`} />
              {isDownloading ? 'Baixando...' : 'Testar Download'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
