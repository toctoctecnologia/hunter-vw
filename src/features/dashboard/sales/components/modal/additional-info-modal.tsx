'use client';

import { FileText } from 'lucide-react';

import { LeadAdditionalInfoItem, ModalProps } from '@/shared/types';
import { formatLongDateHour } from '@/shared/lib/utils';

import { Modal } from '@/shared/components/ui/modal';

interface AdditionalInfoModalProps extends Omit<ModalProps, 'title'> {
  additionalInfoList: LeadAdditionalInfoItem[];
}

export function AdditionalInfoModal({ open, onClose, additionalInfoList }: AdditionalInfoModalProps) {
  const additionalInfoQtd = additionalInfoList.length;
  const additionalInfoDescription = `${additionalInfoQtd} ${
    additionalInfoQtd === 1 ? 'informação' : 'informações'
  } registrada${additionalInfoQtd === 1 ? '' : 's'}`;

  return (
    <Modal title="Informações Adicionais" description={additionalInfoDescription} open={open} onClose={onClose}>
      <div className="max-h-[60vh] overflow-y-auto">
        {additionalInfoQtd > 0 ? (
          <div className="space-y-3 pt-4">
            {additionalInfoList.map((info) => (
              <div key={info.uuid} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex flex-col justify-start gap-1">
                    <span className="text-sm">{`Criado por ${info.createdBy}`}</span>
                    <span className="text-xs text-muted-foreground">{formatLongDateHour(info.createdAt)}</span>
                  </div>
                </div>
                <p className="text-base leading-6">{info.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-3">
              <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-center text-muted-foreground">Nenhuma informação adicional registrada</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
