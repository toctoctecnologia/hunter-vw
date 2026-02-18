import { PropsWithChildren } from 'react';

import { ModalProps } from '@/shared/types';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export function Modal({
  title,
  description,
  open,
  onClose,
  children,
  className,
}: ModalProps & PropsWithChildren & { className?: string }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
