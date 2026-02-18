'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CreditAnalyseItem, LeadCreditApprovalStatus, ModalProps } from '@/shared/types';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

import {
  createCreditAnalyse,
  updateCreditAnalyse,
  saveCreditAnalyseDocuments,
} from '@/features/dashboard/sales/api/credit-analyse';

interface NewCreditSituationModalProps extends Omit<ModalProps, 'title'> {
  leadName: string;
  leadUuid: string;
  creditAnalyse?: CreditAnalyseItem | null;
}

export function NewCreditSituationModal({
  open,
  onClose,
  leadName,
  leadUuid,
  creditAnalyse,
}: NewCreditSituationModalProps) {
  const [creditApprovalStatus, setCreditApprovalStatus] = useState<LeadCreditApprovalStatus>(
    creditAnalyse?.creditApprovalStatus || LeadCreditApprovalStatus.NOT_SENT,
  );
  const [declaredInvoice, setDeclaredInvoice] = useState<string>(creditAnalyse?.declaredInvoice?.toString() || '');
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && creditAnalyse) {
      setCreditApprovalStatus(creditAnalyse.creditApprovalStatus);
      setDeclaredInvoice(creditAnalyse.declaredInvoice?.toString() || '');
      setAttachedDocuments([]);
    } else if (open && !creditAnalyse) {
      setCreditApprovalStatus(LeadCreditApprovalStatus.NOT_SENT);
      setDeclaredInvoice('');
      setAttachedDocuments([]);
    } else if (!open) {
      // Limpa os documentos ao fechar a modal
      setAttachedDocuments([]);
    }
  }, [open, creditAnalyse]);

  const createMutation = useMutation({
    mutationFn: async (data: Partial<CreditAnalyseItem>) => {
      const result = await createCreditAnalyse(leadUuid, data as CreditAnalyseItem);

      if (attachedDocuments.length > 0) {
        await saveCreditAnalyseDocuments(leadUuid, result.uuid, attachedDocuments);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Análise de crédito criada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['lead-credit-analyse-list', leadUuid] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<CreditAnalyseItem>) => {
      if (!creditAnalyse?.uuid) throw new Error('UUID da análise não encontrado');

      const result = await updateCreditAnalyse(leadUuid, creditAnalyse.uuid, data);

      return result;
    },
    onSuccess: () => {
      toast.success('Análise de crédito atualizada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['lead-credit-analyse-list', leadUuid] });
      queryClient.invalidateQueries({ queryKey: ['credit-analyse-documents', leadUuid, creditAnalyse?.uuid] });
      onClose();
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedDocuments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      setAttachedDocuments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      setDeclaredInvoice('');
      return;
    }

    const numberValue = parseInt(value) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue);

    setDeclaredInvoice(formatted);
  };

  const handleSubmit = () => {
    const invoiceValue = parseFloat(declaredInvoice.replace(/[^\d,]/g, '').replace(',', '.'));

    if (!invoiceValue || isNaN(invoiceValue)) {
      toast.error('Informe uma renda declarada válida');
      return;
    }

    const data: Partial<CreditAnalyseItem> = {
      creditApprovalStatus,
      declaredInvoice: invoiceValue,
    };

    if (creditAnalyse?.uuid) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={creditAnalyse ? 'Editar Análise de Crédito' : 'Cadastrar Análise de Crédito'}
      description={
        creditAnalyse ? 'Atualize as informações de crédito do lead' : 'Cadastre a análise de crédito do lead'
      }
      open={open}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="space-x-1 flex justify-between p-4 rounded-lg bg-muted">
          <span className="text-sm font-medium">Lead:</span>
          <span className="text-sm font-semibold">{leadName}</span>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-base text-primary">Situação de Crédito</h3>

          <div className="space-y-2">
            <Label htmlFor="creditApprovalStatus">Aprovação de crédito</Label>
            <Select
              value={creditApprovalStatus}
              onValueChange={(value) => setCreditApprovalStatus(value as LeadCreditApprovalStatus)}
            >
              <SelectTrigger id="creditApprovalStatus" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LeadCreditApprovalStatus.NOT_SENT}>Não enviado</SelectItem>
                <SelectItem value={LeadCreditApprovalStatus.IN_ANALYSIS}>Em análise</SelectItem>
                <SelectItem value={LeadCreditApprovalStatus.APPROVED}>Aprovado</SelectItem>
                <SelectItem value={LeadCreditApprovalStatus.REJECTED}>Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="declaredIncome">Renda declarada</Label>
            <Input
              id="declaredIncome"
              type="text"
              placeholder="R$ 0,00"
              value={declaredInvoice}
              onChange={handleInvoiceChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachedDocuments">Comprovantes anexados</Label>
            {creditAnalyse && (
              <p className="text-xs text-muted-foreground">
                Os documentos são gerenciados separadamente. Use a visualização da análise para remover documentos.
              </p>
            )}
            {!creditAnalyse && (
              <div className="space-y-3">
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    id="attachedDocuments"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Arraste os arquivos aqui ou{' '}
                        <button
                          type="button"
                          onClick={handleClickUpload}
                          className="text-primary hover:underline focus:outline-none"
                        >
                          clique para selecionar
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG, DOC ou DOCX até 10MB cada</p>
                    </div>
                  </div>
                </div>

                {attachedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {attachedDocuments.length} arquivo(s) selecionado(s)
                    </p>
                    <ul className="space-y-2">
                      {attachedDocuments.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border group hover:border-muted-foreground/30 transition-colors"
                        >
                          <div className="flex-shrink-0 rounded bg-primary/10 p-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="flex-shrink-0 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} isLoading={isLoading}>
          {creditAnalyse ? 'Atualizar' : 'Criar'} análise de crédito
        </Button>
      </div>
    </Modal>
  );
}
