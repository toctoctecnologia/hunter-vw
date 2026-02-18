'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getArchiveReasons } from '@/features/dashboard/manage-leads/api/archive-reason';
import { archiveLead } from '@/features/dashboard/sales/api/lead';

import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';
import { Label } from '@/shared/components/ui/label';

interface ArchiveLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  leadUuid: string;
  leadName: string;
}

export function ArchiveLeadModal({ open, onClose, onSuccess, leadUuid, leadName }: ArchiveLeadModalProps) {
  const queryClient = useQueryClient();
  const [selectedReasonUuid, setSelectedReasonUuid] = useState<string>('');

  const { data: archiveReasons, isLoading: isLoadingReasons } = useQuery({
    queryKey: ['archive-reasons'],
    queryFn: () => getArchiveReasons({ pageIndex: 0, pageSize: 100 }),
    enabled: open,
  });

  const archiveLeadMutation = useMutation({
    mutationFn: () => archiveLead(leadUuid, selectedReasonUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-detail'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead arquivado com sucesso!');
      handleClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    setSelectedReasonUuid('');
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedReasonUuid) {
      toast.error('Por favor, selecione um motivo para arquivar o lead.');
      return;
    }
    archiveLeadMutation.mutate();
  };

  return (
    <Modal
      title="Arquivar Lead"
      description={`Você está prestes a arquivar o lead ${leadName}. Por favor, selecione o motivo do arquivamento.`}
      open={open}
      onClose={handleClose}
    >
      {isLoadingReasons ? (
        <div className="flex items-center justify-center py-8">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4">
          <RadioGroup value={selectedReasonUuid} onValueChange={setSelectedReasonUuid}>
            {archiveReasons?.map((reason) => (
              <div key={reason.uuid} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.uuid} id={reason.uuid} />
                <Label htmlFor={reason.uuid} className="cursor-pointer">
                  {reason.reason}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {archiveReasons && archiveReasons.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum motivo de arquivamento disponível. Entre em contato com o administrador.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleClose} disabled={archiveLeadMutation.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedReasonUuid || archiveLeadMutation.isPending}
          isLoading={archiveLeadMutation.isPending}
        >
          Arquivar Lead
        </Button>
      </div>
    </Modal>
  );
}
