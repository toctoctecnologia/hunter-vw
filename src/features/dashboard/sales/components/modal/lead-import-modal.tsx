'use client';

import { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  FileText,
  X,
  Info,
  Download,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/shared/lib/api';
import { ModalProps, LeadImportJobItem } from '@/shared/types';

import {
  getLeadImportJobs,
  getLeadImportPresignedUrl,
  startLeadImport,
} from '@/features/dashboard/sales/api/lead-import';
import { getCatchers } from '@/features/dashboard/sales/api/lead';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { TypographyMuted, TypographyH3 } from '@/shared/components/ui/typography';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Badge } from '@/shared/components/ui/badge';

const TEMPLATE_CSV_URL =
  'https://dbatkwuiwvpoxjjqfdfz.supabase.co/storage/v1/object/public/hunter-storage/lead/import/lead-import-template.csv';
const TEMPLATE_XLSX_URL =
  'https://dbatkwuiwvpoxjjqfdfz.supabase.co/storage/v1/object/public/hunter-storage/lead/import/lead-import-template.xlsx';

interface LeadImportModalProps extends Omit<ModalProps, 'title'> {
  title?: string;
}

type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

const statusConfig: Record<
  JobStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
  PENDING: { label: 'Aguardando', variant: 'outline', icon: Clock },
  PROCESSING: { label: 'Processando', variant: 'secondary', icon: Loader2 },
  COMPLETED: { label: 'Concluído', variant: 'default', icon: CheckCircle2 },
  FAILED: { label: 'Falhou', variant: 'destructive', icon: XCircle },
  CANCELLED: { label: 'Cancelado', variant: 'outline', icon: XCircle },
};

function getStatusConfig(status: string) {
  return statusConfig[status as JobStatus] || { label: status, variant: 'outline' as const, icon: Clock };
}

function formatDate(dateString: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LeadImportModal({ open, onClose, title }: LeadImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCatcherUuid, setSelectedCatcherUuid] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: catchers = [], isLoading: isLoadingCatchers } = useQuery({
    queryKey: ['lead-catchers'],
    queryFn: () => getCatchers(),
    enabled: open,
  });

  const {
    data: jobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['lead-import-jobs'],
    queryFn: () => getLeadImportJobs({ pageIndex: 0, pageSize: 20 }),
    enabled: open,
    refetchInterval: activeTab === 'jobs' ? 5000 : false,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { uploadUrl, fileName } = await getLeadImportPresignedUrl(file.name);

      const contentType = file.name.endsWith('.xlsx')
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv';

      await api.put(uploadUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      });

      const catcherUuid = !selectedCatcherUuid || selectedCatcherUuid === 'automatic' ? undefined : selectedCatcherUuid;
      await startLeadImport(fileName, catcherUuid);

      return fileName;
    },
    onSuccess: () => {
      toast.success('Upload realizado com sucesso', {
        description: 'O processamento será feito em segundo plano.',
      });
      queryClient.invalidateQueries({ queryKey: ['lead-import-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedFile(null);
      setSelectedCatcherUuid('');
      setActiveTab('jobs');
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValidExtension = file.name.endsWith('.csv') || file.name.endsWith('.xlsx');
      if (!isValidExtension) {
        toast.error('Formato inválido', {
          description: 'Por favor, selecione apenas arquivos CSV ou XLSX.',
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
      setSelectedCatcherUuid('');
      setActiveTab('upload');
      onClose();
    }
  };

  const handleDownloadTemplate = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title || 'Importar Leads'}
      description="Importe leads em massa através de arquivos CSV ou XLSX."
      className="sm:max-w-2xl"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="jobs">
            Histórico de Importações
            {jobs?.content && jobs.content.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {jobs.totalElements}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          {/* Templates Download Section */}
          <div className="space-y-2">
            <TypographyH3 className="text-base">Templates</TypographyH3>
            <TypographyMuted>Baixe o template para preencher os dados corretamente.</TypographyMuted>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadTemplate(TEMPLATE_CSV_URL, 'lead-import-template.csv')}
              >
                <Download className="size-4 mr-2" />
                Baixar CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadTemplate(TEMPLATE_XLSX_URL, 'lead-import-template.xlsx')}
              >
                <FileSpreadsheet className="size-4 mr-2" />
                Baixar XLSX
              </Button>
            </div>
          </div>

          <Separator />

          {/* Catcher Selection */}
          <div className="space-y-2">
            <TypographyMuted>Atribuir ao corretor (opcional)</TypographyMuted>
            <Select
              value={selectedCatcherUuid}
              onValueChange={setSelectedCatcherUuid}
              disabled={isLoadingCatchers || uploadMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Distribuição automática (padrão)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Distribuição automática (padrão)</SelectItem>
                {catchers.map((catcher) => (
                  <SelectItem key={catcher.uuid} value={catcher.uuid}>
                    {catcher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCatcherUuid && selectedCatcherUuid !== 'automatic' && (
            <Alert>
              <Info className="size-4" />
              <AlertDescription>
                Todos os leads importados serão atribuídos diretamente ao corretor selecionado.
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload Area */}
          {!selectedFile ? (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
              <TypographyH3 className="mb-2 text-base">Selecione um arquivo</TypographyH3>
              <TypographyMuted>Clique aqui ou arraste um arquivo CSV ou XLSX</TypographyMuted>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClose} disabled={uploadMutation.isPending}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Enviando...' : 'Iniciar Importação'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <TypographyH3 className="text-base">Importações Recentes</TypographyH3>
            <Button variant="ghost" size="sm" onClick={() => refetchJobs()} disabled={isLoadingJobs}>
              <RefreshCw className={`size-4 mr-2 ${isLoadingJobs ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {isLoadingJobs ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : jobs?.content && jobs.content.length > 0 ? (
              <div className="space-y-3">
                {jobs.content.map((job: LeadImportJobItem) => {
                  const config = getStatusConfig(job.status);
                  const StatusIcon = config.icon;

                  return (
                    <div key={job.jobId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="size-5 text-muted-foreground" />
                          <span className="font-medium text-sm truncate max-w-[200px]" title={job.fileName}>
                            {job.fileName}
                          </span>
                        </div>
                        <Badge variant={config.variant} className="flex items-center gap-1">
                          <StatusIcon className={`size-3 ${job.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                          {config.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <TypographyMuted className="text-xs">Total de registros</TypographyMuted>
                          <p className="font-medium">{job.totalRecords || 0}</p>
                        </div>
                        <div>
                          <TypographyMuted className="text-xs">Processados</TypographyMuted>
                          <p className="font-medium text-green-600">{job.processedRecords || 0}</p>
                        </div>
                        <div>
                          <TypographyMuted className="text-xs">Erros</TypographyMuted>
                          <p className={`font-medium ${job.errorCount > 0 ? 'text-destructive' : ''}`}>
                            {job.errorCount || 0}
                          </p>
                        </div>
                      </div>

                      {job.errorMessage && (
                        <Alert variant="destructive">
                          <XCircle className="size-4" />
                          <AlertDescription className="text-xs">{job.errorMessage}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Criado em: {formatDate(job.createdAt)}</span>
                        {job.finishedAt && <span>Finalizado em: {formatDate(job.finishedAt)}</span>}
                      </div>

                      {job.status === 'PROCESSING' && job.totalRecords > 0 && (
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.round((job.processedRecords / job.totalRecords) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="size-12 text-muted-foreground mb-4" />
                <TypographyMuted>Nenhuma importação encontrada</TypographyMuted>
                <TypographyMuted className="text-xs">
                  Faça upload de um arquivo para iniciar uma importação.
                </TypographyMuted>
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
}
