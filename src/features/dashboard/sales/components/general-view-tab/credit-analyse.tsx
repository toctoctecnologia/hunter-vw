'use client';

import { FileText, Plus, Pencil, Trash2, Download, Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

import { NewCreditSituationModal } from '@/features/dashboard/sales/components/modal/new-credit-situation-modal';

import {
  getCreditAnalyse,
  deleteCreditAnalyse,
  getCreditAnalyseDocuments,
  downloadCreditAnalyseDocument,
  deleteCreditAnalyseDocument,
} from '@/features/dashboard/sales/api/credit-analyse';

import { CreditAnalyseItem, LeadCreditApprovalStatus } from '@/shared/types';
import { formatValue } from '@/shared/lib/utils';
import { AlertModal } from '@/shared/components/modal/alert-modal';
import { Loading } from '@/shared/components/loading';

const creditApprovalColors: Record<LeadCreditApprovalStatus, string> = {
  [LeadCreditApprovalStatus.NOT_SENT]: '#9ca3af',
  [LeadCreditApprovalStatus.IN_ANALYSIS]: '#f59e0b',
  [LeadCreditApprovalStatus.APPROVED]: '#10b981',
  [LeadCreditApprovalStatus.REJECTED]: '#ef4444',
};

const creditApprovalLabels: Record<LeadCreditApprovalStatus, string> = {
  [LeadCreditApprovalStatus.NOT_SENT]: 'Não enviado',
  [LeadCreditApprovalStatus.IN_ANALYSIS]: 'Em análise',
  [LeadCreditApprovalStatus.APPROVED]: 'Aprovado',
  [LeadCreditApprovalStatus.REJECTED]: 'Reprovado',
};

interface CreditAnalyseProps {
  leadUuid: string;
  leadName: string;
}

export function CreditAnalyse({ leadUuid, leadName }: CreditAnalyseProps) {
  const [isCreditSituationModalOpen, setIsCreditSituationModalOpen] = useState(false);
  const [selectedCreditAnalyse, setSelectedCreditAnalyse] = useState<CreditAnalyseItem | null>(null);
  const [analyseToDelete, setAnalyseToDelete] = useState<string | null>(null);
  const [viewingDocuments, setViewingDocuments] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{ analyseUuid: string; fileName: string } | null>(null);

  const queryClient = useQueryClient();

  const { data: creditAnalyseList = [], isLoading: isLoadingCreditAnalyse } = useQuery({
    queryKey: ['lead-credit-analyse-list', leadUuid],
    queryFn: () => getCreditAnalyse(leadUuid),
    enabled: !!leadUuid,
  });

  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['credit-analyse-documents', leadUuid, viewingDocuments],
    queryFn: () => getCreditAnalyseDocuments(leadUuid, viewingDocuments!),
    enabled: !!viewingDocuments,
  });

  const deleteMutation = useMutation({
    mutationFn: (analyseUuid: string) => deleteCreditAnalyse(leadUuid, analyseUuid),
    onSuccess: () => {
      toast.success('Análise de crédito removida com sucesso');
      queryClient.invalidateQueries({ queryKey: ['lead-credit-analyse-list', leadUuid] });
      setAnalyseToDelete(null);
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: ({ analyseUuid, fileName }: { analyseUuid: string; fileName: string }) =>
      deleteCreditAnalyseDocument(leadUuid, analyseUuid, fileName),
    onSuccess: () => {
      toast.success('Documento removido com sucesso');
      queryClient.invalidateQueries({ queryKey: ['credit-analyse-documents', leadUuid, viewingDocuments] });
      setDocumentToDelete(null);
    },
  });

  const handleEdit = (analyse: CreditAnalyseItem) => {
    setSelectedCreditAnalyse(analyse);
    setIsCreditSituationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreditSituationModalOpen(false);
    setSelectedCreditAnalyse(null);
  };

  const handleDownloadDocument = async (analyseUuid: string, fileName: string) => {
    try {
      const { url } = await downloadCreditAnalyseDocument(leadUuid, analyseUuid, fileName);
      window.open(url, '_blank');
    } catch {
      toast.error('Erro ao fazer download do documento');
    }
  };

  if (isLoadingCreditAnalyse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise de Crédito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <NewCreditSituationModal
        open={isCreditSituationModalOpen}
        onClose={handleCloseModal}
        leadName={leadName}
        leadUuid={leadUuid}
        creditAnalyse={selectedCreditAnalyse}
      />

      <AlertModal
        isOpen={!!analyseToDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja remover esta análise de crédito? Esta ação não pode ser desfeita."
        onClose={() => setAnalyseToDelete(null)}
        onConfirm={() => analyseToDelete && deleteMutation.mutate(analyseToDelete)}
        loading={deleteMutation.isPending}
      />

      <AlertModal
        isOpen={!!documentToDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja remover este documento? Esta ação não pode ser desfeita."
        onClose={() => setDocumentToDelete(null)}
        onConfirm={() => documentToDelete && deleteDocumentMutation.mutate(documentToDelete)}
        loading={deleteDocumentMutation.isPending}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Análise de Crédito</CardTitle>
            <Button size="sm" onClick={() => setIsCreditSituationModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Análise
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {creditAnalyseList.length === 0 ? (
            <div className="text-center py-6">
              <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Nenhuma análise de crédito cadastrada</p>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastre a análise de crédito do lead para melhor acompanhamento
              </p>
              <Button onClick={() => setIsCreditSituationModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Análise de Crédito
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {creditAnalyseList.map((analyse) => (
                <div key={analyse.uuid} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: creditApprovalColors[analyse.creditApprovalStatus] }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {creditApprovalLabels[analyse.creditApprovalStatus]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Renda declarada:</span>
                          <span className="font-semibold text-primary">{formatValue(analyse.declaredInvoice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingDocuments(analyse.uuid)}
                        title="Ver documentos"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(analyse)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAnalyseToDelete(analyse.uuid)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {viewingDocuments === analyse.uuid && (
                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-muted-foreground">Documentos anexados</p>
                        <Button variant="ghost" size="sm" onClick={() => setViewingDocuments(null)} className="text-xs">
                          Ocultar
                        </Button>
                      </div>

                      {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : documents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum documento anexado</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {documents.map((doc) => (
                            <div
                              key={doc.fileName}
                              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm group hover:bg-muted/80 transition-colors"
                            >
                              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="font-medium truncate flex-1">{doc.fileName}</span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleDownloadDocument(analyse.uuid, doc.fileName)}
                                  className="hover:scale-110 active:scale-95 p-1"
                                  title="Baixar documento"
                                >
                                  <Download className="h-4 w-4 text-primary" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDocumentToDelete({ analyseUuid: analyse.uuid, fileName: doc.fileName })
                                  }
                                  className="hover:scale-110 active:scale-95 p-1"
                                  title="Remover documento"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
