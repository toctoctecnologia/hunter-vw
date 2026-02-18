'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/ui/modal';

export interface AlertModalData {
  title: string;
  description: string;
}

interface AlertModalProps {
  title?: string;
  description?: string;
  isDestructive?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title = 'Você tem certeza?',
  description = 'Essa ação não poderá ser desfeita.',
  isDestructive = true,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title={title} description={description} open={isOpen} onClose={onClose}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancelar
        </Button>

        <Button isLoading={loading} variant={isDestructive ? 'destructive' : 'default'} onClick={onConfirm}>
          Continuar
        </Button>
      </div>
    </Modal>
  );
};
