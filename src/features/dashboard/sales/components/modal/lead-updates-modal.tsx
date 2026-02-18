'use client';

import { History, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LeadUpdateItem, ModalProps } from '@/shared/types';
import { formatLongDateHour } from '@/shared/lib/utils';

import { deleteLeadUpdate } from '@/features/dashboard/sales/api/lead-updates';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface LeadUpdatesModalProps extends Omit<ModalProps, 'title'> {
  leadUpdates: LeadUpdateItem[];
  leadUuid: string;
}

export function LeadUpdatesModal({ open, onClose, leadUpdates, leadUuid }: LeadUpdatesModalProps) {
  const queryClient = useQueryClient();

  const leadUpdatesCount = leadUpdates.length;
  const leadUpdatesDescription = `${leadUpdatesCount} ${
    leadUpdatesCount === 1 ? 'atualização' : 'atualizações'
  } registrada${leadUpdatesCount === 1 ? '' : 's'}`;

  const { mutate: deleteUpdate, isPending } = useMutation({
    mutationFn: (updateUuid: string) => deleteLeadUpdate(leadUuid, updateUuid),
    onSuccess: () => {
      toast.success('Atualização do lead removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lead-updates-list', leadUuid] });
    },
  });

  return (
    <Modal title="Atualizações do Lead" description={leadUpdatesDescription} open={open} onClose={onClose}>
      <div className="max-h-[60vh] overflow-y-auto">
        {leadUpdatesCount > 0 ? (
          <div className="space-y-3 pt-4">
            {leadUpdates.map((update) => (
              <div key={update.uuid} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <div className="flex flex-col justify-start gap-1">
                      <span className="text-sm">{`Criado por ${update.createdBy}`}</span>
                      <span className="text-xs text-muted-foreground">{formatLongDateHour(update.createdAt)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUpdate(update.uuid)}
                    disabled={isPending}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-base leading-6">{update.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-3">
              <History className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-center text-muted-foreground">Nenhuma atualização registrada</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
