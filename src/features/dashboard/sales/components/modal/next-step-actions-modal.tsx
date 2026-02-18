'use client';

import { FileText, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { ModalProps } from '@/shared/types';

import { getLeadProposal } from '@/features/dashboard/sales/api/lead-proposal';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

interface NextStepActionsModalProps extends Omit<ModalProps, 'title'> {
  onMakeProposal: () => void;
  onCloseDeal: () => void;
  leadUuid: string;
}

export function NextStepActionsModal({
  open,
  onClose,
  onMakeProposal,
  onCloseDeal,
  leadUuid,
}: NextStepActionsModalProps) {
  const { data: proposal } = useQuery({
    queryKey: ['lead-proposal', leadUuid],
    queryFn: () => getLeadProposal(leadUuid),
    enabled: !!leadUuid,
  });

  const hasAcceptedProposal = proposal?.status === 'ACCEPTED';

  const handleAction = (callback: () => void) => {
    onClose();
    callback();
  };

  return (
    <Modal
      title="Definir Próximo Passo"
      description="Escolha uma ação para avançar com este lead"
      open={open}
      onClose={onClose}
    >
      <div className="space-y-3 pt-4">
        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4 text-left"
          onClick={() => handleAction(onMakeProposal)}
          disabled={hasAcceptedProposal}
        >
          <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-semibold">Fazer Proposta</p>
            <p className="text-xs text-muted-foreground">
              {hasAcceptedProposal
                ? 'Já existe uma proposta aceita para este lead'
                : 'Enviar proposta comercial para o lead'}
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start h-auto py-4 text-left"
          onClick={() => handleAction(onCloseDeal)}
        >
          <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-semibold">Negócio Fechado</p>
            <p className="text-xs text-muted-foreground">Marcar negócio como concluído com sucesso</p>
          </div>
        </Button>
      </div>
    </Modal>
  );
}
