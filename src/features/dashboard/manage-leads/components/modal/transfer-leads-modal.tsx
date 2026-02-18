'use client';
import { useState } from 'react';
import { User, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ModalProps, LeadDetail } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

import { transferLeads } from '@/features/dashboard/manage-leads/api/leads';

import { CatcherListModal, SelectedItem } from '@/shared/components/modal/catcher-list-modal';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';
import { Label } from '@/shared/components/ui/label';

interface TransferLeadsModalProps extends Omit<ModalProps, 'title'> {
  leads: LeadDetail[];
  onLeadRemove: (leadUuid: string) => void;
  onSuccess?: () => void;
}

export function TransferLeadsModal({ leads, onLeadRemove, onSuccess, onClose, ...rest }: TransferLeadsModalProps) {
  const [selectedCatcher, setSelectedCatcher] = useState<SelectedItem | null>(null);
  const [showCatcherModal, setShowCatcherModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: handleTransfer, isPending: isTransferring } = useMutation({
    mutationFn: () =>
      transferLeads(
        selectedCatcher?.uuid || '',
        leads.map((lead) => lead.uuid),
      ),
    onSuccess: () => {
      toast.success('Leads transferidos com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setSelectedCatcher(null);
      onSuccess?.();
      onClose();
    },
  });

  const canTransfer = selectedCatcher?.uuid && leads.length > 0;

  return (
    <>
      <CatcherListModal
        maxSelection={1}
        open={showCatcherModal}
        onClose={() => setShowCatcherModal(false)}
        onConfirm={(selectedItem) => {
          if (selectedItem.length > 0) {
            setSelectedCatcher(selectedItem[0]);
          } else {
            setSelectedCatcher(null);
          }
          setShowCatcherModal(false);
        }}
      />

      <Modal
        {...rest}
        title="Transferir Leads"
        description="Selecione o corretor para transferir os leads selecionados"
        onClose={onClose}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <TypographyMuted>Selecionar corretor</TypographyMuted>
            <Button
              variant="outline"
              type="button"
              className={cn('w-full justify-start text-left font-normal', !selectedCatcher && 'text-muted-foreground')}
              onClick={() => setShowCatcherModal(true)}
            >
              <User className="mr-2 h-4 w-4" />
              {selectedCatcher ? selectedCatcher.name : 'Selecionar Corretor'}
              {selectedCatcher && (
                <X
                  className="ml-auto h-4 w-4 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCatcher(null);
                  }}
                />
              )}
            </Button>
          </div>

          {leads.length > 0 && (
            <div className="space-y-3">
              <Label>Leads selecionados ({leads.length})</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                {leads.map((lead) => (
                  <div key={lead.uuid} className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-xs text-muted-foreground">{lead.phone1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onLeadRemove(lead.uuid)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={() => handleTransfer()} disabled={!canTransfer} isLoading={isTransferring}>
              Transferir
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
