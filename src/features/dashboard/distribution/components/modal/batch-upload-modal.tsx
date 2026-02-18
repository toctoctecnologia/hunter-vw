'use client';

import { useState, useRef } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Upload, FileText, X, Info, Download } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/shared/lib/api';

import { getUploadUrl, startBatch } from '@/features/dashboard/distribution/api/redistribution';
import { getQueues } from '@/features/dashboard/distribution/api/queue';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { TypographyMuted, TypographyH3 } from '@/shared/components/ui/typography';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface BatchUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchUploadModal({ open, onOpenChange }: BatchUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedQueueUuid, setSelectedQueueUuid] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: queues = [], isLoading: isLoadingQueues } = useQuery({
    queryKey: ['batch-upload-queues'],
    queryFn: () => getQueues({ isActive: '' }, ''),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { uploadUrl, fileName } = await getUploadUrl();

      await api.put(uploadUrl, file, {
        headers: {
          'Content-Type': 'text/csv',
        },
      });

      await startBatch(fileName, !selectedQueueUuid || selectedQueueUuid === 'x' ? undefined : selectedQueueUuid);

      return fileName;
    },
    onSuccess: () => {
      toast.success('Upload realizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['redistribution-batch-jobs'] });
      setSelectedFile(null);
      setSelectedQueueUuid('');
      onOpenChange(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Formato inválido', {
          description: 'Por favor, selecione apenas arquivos CSV.',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      setSelectedFile(null);
      setSelectedQueueUuid('');
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload de lote CSV"
      description="Faça upload de um arquivo CSV contendo nome, telefone, email e origem dos leads para redistribuição em lote."
      className="sm:max-w-md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <TypographyMuted>Fila de destino (opcional)</TypographyMuted>
          <Select
            value={selectedQueueUuid}
            onValueChange={setSelectedQueueUuid}
            disabled={isLoadingQueues || uploadMutation.isPending}
            defaultValue="x"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Distribuição automática (padrão)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">Distribuição automática (padrão)</SelectItem>
              {queues.map((queue) => (
                <SelectItem key={queue.uuid} value={queue.uuid}>
                  {queue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedQueueUuid && selectedQueueUuid !== 'x' && (
          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Os leads serão atribuídos diretamente à fila selecionada, sem passar pelo motor de distribuição.
            </AlertDescription>
          </Alert>
        )}

        <Button variant="outline" className="w-full" asChild>
          <a
            href="https://dbatkwuiwvpoxjjqfdfz.supabase.co/storage/v1/object/public/hunter-storage/redistribution/redistribution_batch_template.csv"
            download="redistribution_batch_template.csv"
          >
            <Download className="size-4" />
            Baixar template CSV
          </a>
        </Button>

        {!selectedFile ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
            <TypographyH3 className="mb-2">Selecione um arquivo CSV</TypographyH3>
            <TypographyMuted>Clique aqui ou arraste o arquivo</TypographyMuted>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="size-8 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <TypographyMuted className="text-xs">{(selectedFile.size / 1024).toFixed(2)} KB</TypographyMuted>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={uploadMutation.isPending}>
              <X className="size-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClose} disabled={uploadMutation.isPending}>
            Cancelar
          </Button>
          <Button className="flex-1" onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Enviando...' : 'Iniciar processamento'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
