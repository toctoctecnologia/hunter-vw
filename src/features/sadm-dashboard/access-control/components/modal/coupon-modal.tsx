import { Modal } from '@/shared/components/ui/modal';
import { ModalProps } from '@/shared/types';

import { CouponForm } from '@/features/sadm-dashboard/access-control/components/form/coupon-form';

type CouponModalProps = Omit<ModalProps, 'title' | 'description'>;

export function CouponModal({ open, onClose }: CouponModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Novo Cupom" description="Preencha os dados para criar um novo cupom">
      <CouponForm onSuccess={onClose} />
    </Modal>
  );
}
